import {connect,boot,goto,evalJS,metrics,shot} from './cdp.mjs';
const c = await connect(); await boot(c);
await metrics(c,1440,900); c.events.length=0;
await goto(c,'http://127.0.0.1:8099/'); await new Promise(r=>setTimeout(r,2500));
console.log('=== HERO DRIVER ===');
console.log(await evalJS(c,`JSON.stringify({
  prodLoaded:(i=>i&&i.complete&&i.naturalWidth>0)(document.getElementById('prod')),
  prodSize:(i=>i?i.naturalWidth+'x'+i.naturalHeight:'')(document.getElementById('prod')),
  pAtTop:document.getElementById('prodstage').style.getPropertyValue('--p'),
  band1op:+getComputedStyle(document.querySelector('.band-1')).opacity
},null,1)`));
console.log('=== SCROLL SWEEP: --p and band opacities ===');
console.log(await evalJS(c,`(async()=>{
  const out=[]; const H=document.getElementById('hero-sec').offsetHeight-innerHeight;
  for(const f of [0,0.15,0.35,0.55,0.75,0.9,1]){
    scrollTo(0,Math.round(H*f)); await new Promise(r=>setTimeout(r,520));
    const st=getComputedStyle(document.getElementById('prod'));
    out.push(f.toFixed(2)+'  p='+(document.getElementById('prodstage').style.getPropertyValue('--p')||'0').slice(0,5)
      +'  bands='+[...document.querySelectorAll('.band')].map(b=>(+getComputedStyle(b).opacity).toFixed(2)).join(' ')
      +'  scale~'+st.transform.split(',')[0].slice(0,18));
  }
  scrollTo(0,0); return out.join('\\n')})()`));
const errs=c.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error').map(e=>e.params.entry.text);
const exc=c.events.filter(e=>e.method==='Runtime.exceptionThrown').map(e=>e.params.exceptionDetails.text);
console.log('\n=== JS exceptions ===', exc.length?exc:'(none)');
console.log('=== resource errors ==='); errs.forEach(e=>console.log('  '+e)); if(!errs.length) console.log('  (none)');
c.close(); process.exit(0);
