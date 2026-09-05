import {connect,boot,goto,evalJS,metrics,shot} from './cdp.mjs';
const c = await connect(); await boot(c);
const URL='http://127.0.0.1:8099/';
await metrics(c,1440,900); await goto(c,URL); await new Promise(r=>setTimeout(r,1800));

console.log('=== PRESS AND HOLD (real mouse down, wait, up) ===');
const box = await evalJS(c,`(()=>{document.getElementById('why').scrollIntoView();const r=document.getElementById('padwrap').getBoundingClientRect();return JSON.stringify({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)})})()`);
await new Promise(r=>setTimeout(r,800));
const b = JSON.parse(await evalJS(c,`(()=>{const r=document.getElementById('padwrap').getBoundingClientRect();return JSON.stringify({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)})})()`));
const before = await evalJS(c,`JSON.stringify({h:document.getElementById('padwrap').style.getPropertyValue('--h'),lit:[...document.querySelectorAll('#whylist li')].filter(l=>l.classList.contains('lit')).length,label:document.getElementById('holdlabel').textContent})`);
console.log('before  :', before);

await c.send('Input.dispatchMouseEvent',{type:'mousePressed',x:b.x,y:b.y,button:'left',clickCount:1});
await new Promise(r=>setTimeout(r,450));
console.log('mid-hold:', await evalJS(c,`JSON.stringify({h:+document.getElementById('padwrap').style.getPropertyValue('--h'),lit:[...document.querySelectorAll('#whylist li')].filter(l=>l.classList.contains('lit')).length})`));
await c.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:b.x,y:b.y,button:'left',clickCount:1});
await new Promise(r=>setTimeout(r,700));
console.log('released early (should ease back, not snap):', await evalJS(c,`JSON.stringify({h:+document.getElementById('padwrap').style.getPropertyValue('--h')})`));

await c.send('Input.dispatchMouseEvent',{type:'mousePressed',x:b.x,y:b.y,button:'left',clickCount:1});
await new Promise(r=>setTimeout(r,1500));
await c.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:b.x,y:b.y,button:'left',clickCount:1});
await new Promise(r=>setTimeout(r,300));
console.log('completed:', await evalJS(c,`JSON.stringify({h:+document.getElementById('padwrap').style.getPropertyValue('--h'),lit:[...document.querySelectorAll('#whylist li')].filter(l=>l.classList.contains('lit')).length,label:document.getElementById('holdlabel').textContent,done:document.getElementById('holder').classList.contains('done')})`));
await shot(c,'audit/hold-complete.png');

console.log('\n=== WHATSAPP LINK ===');
console.log(await evalJS(c,`(()=>{
  document.getElementById('talk').scrollIntoView();
  const opts=[...document.querySelectorAll('.pick[data-pick="size"] .opt')];
  opts[2].click();
  const w=[...document.querySelectorAll('.pick[data-pick="want"] .opt')];
  w[0].click();
  return JSON.stringify({href:document.getElementById('wa-main').getAttribute('href'),
    pressed:[...document.querySelectorAll('.opt[aria-pressed="true"]')].map(o=>o.textContent.trim())},null,1)})()`));

console.log('\n=== FAQ + BUTTONS ===');
console.log(await evalJS(c,`(()=>{
  const d=document.querySelectorAll('.faq details');
  d[0].open=true;
  const links=[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href'));
  const dead=links.filter(h=>h!=='#'&&!document.querySelector(h));
  return JSON.stringify({faqCount:d.length,firstOpens:d[0].open,anchorTargetsMissing:dead},null,1)})()`));

console.log('\n=== LETTER TAILS in masked/clipped text ===');
console.log(await evalJS(c,`(()=>{const bad=[];
 document.querySelectorAll('*').forEach(el=>{const cs=getComputedStyle(el);
  if((cs.overflow==='hidden'||cs.overflowY==='hidden')&&el.textContent.trim()&&/[gyps]/.test(el.textContent)){
    const lh=parseFloat(cs.lineHeight)||0, h=el.getBoundingClientRect().height;
    if(h>0&&lh>0&&h<lh*0.98&&!el.classList.contains('sr')) bad.push((el.className||el.tagName)+' h='+Math.round(h)+' lh='+Math.round(lh));}});
 return JSON.stringify(bad.slice(0,10))})()`));
c.close(); process.exit(0);
