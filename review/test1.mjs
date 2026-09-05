import {connect,boot,goto,evalJS,metrics,shot,media} from './cdp.mjs';
const URL='http://127.0.0.1:8099/';
const c = await connect(); await boot(c);

const errs=[];
c.events.forEach(()=>{});
setInterval(()=>{},1e9).unref?.();

await metrics(c,1440,900);
await goto(c,URL);

// console errors
const consoleErrs = c.events.filter(e=>e.method==='Log.entryAdded' && e.params.entry.level==='error')
  .map(e=>e.params.entry.text);
const netFails = c.events.filter(e=>e.method==='Network.loadingFailed')
  .map(e=>e.params.errorText+' '+(e.params.type||''));

console.log('--- STRUCTURE ---');
console.log(await evalJS(c,`JSON.stringify({
  h1: [...document.querySelectorAll('h1')].map(h=>h.textContent.trim().slice(0,50)),
  headingOrder: [...document.querySelectorAll('h1,h2,h3')].filter(h=>!h.closest('[aria-hidden="true"]')).map(h=>h.tagName),
  bands: document.querySelectorAll('.band').length,
  landmarks: {nav:!!document.querySelector('nav'), main:!!document.querySelector('main#main'), footer:!!document.querySelector('footer')},
  skip: !!document.querySelector('.skip[href="#main"]'),
  videoAria: (v=>({aria:v.getAttribute('aria-hidden'),tab:v.getAttribute('tabindex'),controls:v.hasAttribute('controls')}))(document.getElementById('hero')),
  heroH: document.getElementById('hero-sec').offsetHeight/window.innerHeight
},null,1)`));

console.log('--- SCRUB STATE (no video file present yet) ---');
console.log(await evalJS(c,`(async()=>{ await new Promise(r=>setTimeout(r,2500));
  return JSON.stringify({
    stageClasses: document.getElementById('stage').className,
    posterBg: getComputedStyle(document.getElementById('poster')).backgroundImage.slice(0,40),
    band1op: getComputedStyle(document.querySelector('.band-1')).opacity,
    band1k: document.querySelector('.band-1').style.getPropertyValue('--k'),
    cue: !!document.querySelector('.cue')
  });})()`));

console.log('--- BAND SWEEP (scroll positions vs opacity) ---');
console.log(await evalJS(c,`(async()=>{
  const out=[]; const H=document.getElementById('hero-sec').offsetHeight-innerHeight;
  for(const f of [0,0.12,0.25,0.37,0.5,0.62,0.75,0.88,1]){
    scrollTo(0, Math.round(H*f));
    await new Promise(r=>setTimeout(r,500));
    out.push(f.toFixed(2)+' -> '+[...document.querySelectorAll('.band')].map(b=>(+getComputedStyle(b).opacity).toFixed(2)).join(' '));
  }
  scrollTo(0,0); return out.join('\\n');})()`));

console.log('--- CONSOLE ERRORS ---'); console.log(consoleErrs.length?consoleErrs.join('\n'):'(none)');
console.log('--- FAILED REQUESTS ---'); console.log(netFails.length?netFails.join('\n'):'(none)');
c.close(); process.exit(0);
