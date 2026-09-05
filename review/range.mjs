import {connect,boot,goto,evalJS,metrics,shot} from './cdp.mjs';
const c = await connect(); await boot(c);
await metrics(c,1440,900); await goto(c,'http://127.0.0.1:8099/');
await new Promise(r=>setTimeout(r,1800));
console.log('=== RANGE SELECTOR ===');
console.log(await evalJS(c,`(()=>{
  const tabs=[...document.querySelectorAll('.rtab')], pans=[...document.querySelectorAll('.rprod')];
  return JSON.stringify({
    tabCount:tabs.length, panelCount:pans.length,
    labels:tabs.map(t=>t.textContent.trim()),
    initiallyVisible:pans.filter(p=>!p.hidden).length,
    selected:tabs.filter(t=>t.getAttribute('aria-selected')==='true').length,
    ariaWired:tabs.every(t=>document.getElementById(t.getAttribute('aria-controls')))
  },null,1)})()`));
console.log('--- click each tab ---');
for (let i=0;i<5;i++){
  console.log(await evalJS(c,`(()=>{const t=document.querySelectorAll('.rtab')[${i}];t.click();
    const vis=[...document.querySelectorAll('.rprod')].filter(p=>!p.hidden);
    return t.textContent.trim()+' -> shows: '+(vis.length===1?vis[0].querySelector('h3').textContent:'ERROR '+vis.length)
      +' | specs '+vis[0].querySelectorAll('.specs li').length
      +' | selected '+[...document.querySelectorAll('.rtab')].filter(x=>x.getAttribute('aria-selected')==='true').length})()`));
}
console.log('--- keyboard arrows ---');
console.log(await evalJS(c,`(()=>{const tabs=[...document.querySelectorAll('.rtab')];tabs[0].focus();
  tabs[0].dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
  const sel=tabs.findIndex(t=>t.getAttribute('aria-selected')==='true');
  tabs[sel].dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));
  const sel2=tabs.findIndex(t=>t.getAttribute('aria-selected')==='true');
  return 'right->'+sel+'  left->'+sel2})()`));
await evalJS(c,`document.getElementById('panel').scrollIntoView({behavior:'instant'})`);
await new Promise(r=>setTimeout(r,900)); await shot(c,'audit/gold-range.png');
c.close(); process.exit(0);
