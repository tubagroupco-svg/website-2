import {connect,boot,goto,evalJS,metrics} from './cdp.mjs';
const c = await connect(); await boot(c);
await metrics(c,1440,900); await goto(c,'http://127.0.0.1:8099/');
await new Promise(r=>setTimeout(r,2000));
// settle every entrance so nothing is measured mid-fade
await evalJS(c,`(async()=>{for(const s of document.querySelectorAll('.rise')){s.scrollIntoView({behavior:'instant'});await new Promise(r=>setTimeout(r,320));}scrollTo(0,0);return 1})()`);
await new Promise(r=>setTimeout(r,1400));
console.log(await evalJS(c,`(()=>{
  const lum=([r,g,b])=>{const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)};
  const parse=s=>{const m=s.match(/[\\d.]+/g); return m?m.slice(0,3).map(Number):null};
  const alphaOf=s=>{const m=s.match(/[\\d.]+/g); return m&&m.length>3?parseFloat(m[3]):1};
  function bgOf(el){
    let n=el, stack=[];
    while(n && n.nodeType===1){
      const cs=getComputedStyle(n); const a=alphaOf(cs.backgroundColor);
      if(a>0){ stack.push([parse(cs.backgroundColor),a]); if(a>=1) break; }
      n=n.parentElement;
    }
    let base=[10,9,8];
    for(let i=stack.length-1;i>=0;i--){const [c1,a]=stack[i];
      base=[0,1,2].map(j=>c1[j]*a+base[j]*(1-a));}
    return base;
  }
  const out=[];
  document.querySelectorAll('h1,h2,h3,p,li,a,button,span,summary,div').forEach(el=>{
    const txt=[...el.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
    if(!txt) return;
    const cs=getComputedStyle(el);
    if(cs.display==='none'||cs.visibility==='hidden') return;
    const r=el.getBoundingClientRect(); if(r.width<2||r.height<2) return;
    if(el.closest('.sr')||el.classList.contains('sr')) return;
    const elOp=(()=>{let o=1,n=el;while(n&&n.nodeType===1){o*=parseFloat(getComputedStyle(n).opacity)||1;n=n.parentElement}return o})();
    if(elOp<0.05) return;
    let fg=parse(cs.color); const fa=alphaOf(cs.color)*elOp;
    const bg=bgOf(el);
    fg=[0,1,2].map(j=>fg[j]*fa+bg[j]*(1-fa));
    const L1=lum(fg),L2=lum(bg);
    const ratio=(Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
    const px=parseFloat(cs.fontSize); const bold=parseInt(cs.fontWeight)>=700;
    const large = px>=24 || (px>=18.66 && bold);
    const need = large?3:4.5;
    if(ratio < need) out.push({t:txt.slice(0,42),cls:(el.className&&el.className.toString().slice(0,26))||el.tagName,
      px:Math.round(px), ratio:+ratio.toFixed(2), need});
  });
  return JSON.stringify({failures:out, checked:'all visible text'},null,1)})()`));
c.close(); process.exit(0);
