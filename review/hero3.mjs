import {connect,boot,goto,evalJS,metrics,shot} from './cdp.mjs';
const c = await connect(); await boot(c);
await metrics(c,1440,900); c.events.length=0;
await goto(c,'http://127.0.0.1:8099/'); await new Promise(r=>setTimeout(r,2600));
console.log('=== LAYERS ===');
console.log(await evalJS(c,`JSON.stringify({
  count:document.querySelectorAll('.lyr').length,
  allLoaded:[...document.querySelectorAll('.lyr img')].every(i=>i.complete&&i.naturalWidth>0),
  sizes:[...document.querySelectorAll('.lyr img')].map(i=>i.naturalWidth+'x'+i.naturalHeight),
  zOrderFrontMost:getComputedStyle(document.querySelector('.lyr:last-child')).zIndex
},null,1)`));
console.log('=== EXPLODE SWEEP: layer spread vs scroll ===');
console.log(await evalJS(c,`(async()=>{
  const out=[]; const H=document.getElementById('hero-sec').offsetHeight-innerHeight;
  for(const f of [0,0.25,0.5,0.75,1]){
    scrollTo({top:Math.round(H*f),behavior:'instant'});
    await new Promise(r=>setTimeout(r,620));
    const boxes=[...document.querySelectorAll('.lyr img')].map(i=>Math.round(i.getBoundingClientRect().x));
    const spread=Math.max(...boxes)-Math.min(...boxes);
    out.push('scroll '+f.toFixed(2)+'  p='+(document.getElementById('prodstage').style.getPropertyValue('--p')||'0').slice(0,5)
      +'  layer spread='+spread+'px'
      +'  bands='+[...document.querySelectorAll('.band')].map(b=>(+getComputedStyle(b).opacity).toFixed(2)).join(' '));
  }
  scrollTo(0,0); return out.join('\\n')})()`));
const exc=c.events.filter(e=>e.method==='Runtime.exceptionThrown').map(e=>e.params.exceptionDetails.text);
const errs=c.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error').map(e=>e.params.entry.text);
console.log('\n=== exceptions ===', exc.length?exc:'(none)');
console.log('=== resource errors ===', errs.length?errs:'(none)');
c.close(); process.exit(0);
