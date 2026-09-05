import {connect,boot,goto,evalJS,metrics,shot,media} from './cdp.mjs';
const URL='http://127.0.0.1:8099/';
const c = await connect(); await boot(c);
const line=(t)=>console.log('\n=== '+t+' ===');

/* ---------- 1. fonts + desktop screenshots ---------- */
await metrics(c,1440,900);
c.events.length=0;
await goto(c,URL);
await new Promise(r=>setTimeout(r,3000));
line('FONTS');
console.log(await evalJS(c,`(async()=>{await document.fonts.ready;return JSON.stringify({
  archivo:document.fonts.check('700 40px Archivo'),
  publicSans:document.fonts.check('400 16px "Public Sans"'),
  mono:document.fonts.check('500 12px "JetBrains Mono"'),
  faces:[...document.fonts].length})})()`));

line('SCREENSHOTS');
for (const [w,h,name] of [[1440,900,'desktop-1440'],[1280,800,'desktop-1280']]){
  await metrics(c,w,h); await goto(c,URL); await new Promise(r=>setTimeout(r,2200));
  await shot(c,`audit/${name}-top.png`);
  await evalJS(c,`scrollTo(0,document.getElementById('hero-sec').offsetHeight)`);
  await new Promise(r=>setTimeout(r,900)); await shot(c,`audit/${name}-panel.png`);
  await evalJS(c,`document.getElementById('why').scrollIntoView()`);
  await new Promise(r=>setTimeout(r,900)); await shot(c,`audit/${name}-why.png`);
  await evalJS(c,`document.getElementById('talk').scrollIntoView()`);
  await new Promise(r=>setTimeout(r,900)); await shot(c,`audit/${name}-close.png`);
  console.log(name+' captured');
}

/* ---------- 2. horizontal overflow ---------- */
line('SIDEWAYS');
await metrics(c,1440,900); await goto(c,URL); await new Promise(r=>setTimeout(r,1500));
console.log(await evalJS(c,`(()=>{const bad=[];
 document.querySelectorAll('*').forEach(el=>{const r=el.getBoundingClientRect();
   if(r.right>innerWidth+2||r.left<-2) bad.push(el.tagName+'.'+(typeof el.className==='string'?el.className.split(' ')[0]:'')+' '+Math.round(r.left)+'..'+Math.round(r.right));});
 scrollTo(9999,0);
 return JSON.stringify({scrollXAfterForce:scrollX, docWiderThanWindow:document.documentElement.scrollWidth>innerWidth,
   offenders:bad.slice(0,8)},null,1)})()`));

/* ---------- 3. entrances actually play ---------- */
line('ENTRANCES');
await goto(c,URL);
console.log(await evalJS(c,`(async()=>{
 const secs=[...document.querySelectorAll('.rise')];
 for(const s of secs){ s.scrollIntoView(); await new Promise(r=>setTimeout(r,700)); }
 await new Promise(r=>setTimeout(r,1600));
 const dead=secs.filter(s=>!s.classList.contains('in')).map(s=>s.id||s.className);
 const parts=[...document.querySelectorAll('.rise.in .part')];
 const invisible=parts.filter(p=>+getComputedStyle(p).opacity<0.9).length;
 const notDone=secs.filter(s=>!s.classList.contains('done')).map(s=>s.id);
 return JSON.stringify({sections:secs.length,neverIn:dead,partsStillInvisible:invisible,staggerNotRetired:notDone},null,1)})()`));

/* ---------- 4. flick test ---------- */
line('FLICK TEST');
for (const step of [120,240,360]){
  await goto(c,URL); await new Promise(r=>setTimeout(r,1200));
  const res = await evalJS(c,`(async()=>{
    const out=[]; const n=Math.ceil(${'${'}0${'}'});
    return ''})()`.replace(/.*/s,'1')); // placeholder replaced below
}
console.log(await evalJS(c,`(async()=>{
  const report={};
  for (const step of [120,240,360]){
    scrollTo(0,0); await new Promise(r=>setTimeout(r,600));
    const H=document.getElementById('hero-sec').offsetHeight-innerHeight;
    const counts=[0,0,0,0]; const peaks=[0,0,0,0]; let n=0;
    while (scrollY < H && n < 400){
      scrollBy(0,step); await new Promise(r=>setTimeout(r,120)); n++;
      [...document.querySelectorAll('.band')].forEach((b,i)=>{
        const o=+getComputedStyle(b).opacity;
        if(o>0.92) counts[i]++; if(o>peaks[i]) peaks[i]=o;
      });
    }
    report['step'+step]={fullyVisibleSteps:counts,peakOpacity:peaks.map(p=>+p.toFixed(2)),totalSteps:n};
  }
  scrollTo(0,0);
  return JSON.stringify(report,null,1)})()`));

/* ---------- 5. video missing => page still complete ---------- */
line('VIDEO BLOCKED');
await c.send('Network.setBlockedURLs',{urls:['*hero-scrub.mp4']});
await goto(c,URL); await new Promise(r=>setTimeout(r,2600));
console.log(await evalJS(c,`JSON.stringify({
  stage:document.getElementById('stage').className,
  cueShown:!!document.querySelector('.cue'),
  band1Readable:+getComputedStyle(document.querySelector('.band-1')).opacity,
  ctaPresent:!!document.querySelector('.band-4 .btn'),
  pageHeight:document.body.scrollHeight>4000})`));
await shot(c,'audit/no-video.png');
await c.send('Network.setBlockedURLs',{urls:[]});

/* ---------- 6. reduced motion, live, both directions ---------- */
line('REDUCED MOTION (live flip in, then out)');
await goto(c,URL); await new Promise(r=>setTimeout(r,1500));
await media(c,[{name:'prefers-reduced-motion',value:'reduce'}]);
await new Promise(r=>setTimeout(r,1200));
const rmIn = await evalJS(c,`JSON.stringify({
  staticHero:getComputedStyle(document.getElementById('statichero')).display,
  seamsPinned:[...document.querySelectorAll('[data-seam]')].every(s=>s.classList.contains('pin')),
  whyRowsLit:[...document.querySelectorAll('#whylist li')].every(l=>l.classList.contains('lit')),
  holdFilled:document.getElementById('padwrap').style.getPropertyValue('--h')})`);
console.log('flip IN :',rmIn);
await shot(c,'audit/reduced-motion.png');
await media(c,[{name:'prefers-reduced-motion',value:'no-preference'}]);
await new Promise(r=>setTimeout(r,1200));
console.log('flip OUT:',await evalJS(c,`JSON.stringify({
  staticHero:getComputedStyle(document.getElementById('statichero')).display,
  seamsStillPinned:[...document.querySelectorAll('[data-seam]')].some(s=>s.classList.contains('pin')),
  band1op:+getComputedStyle(document.querySelector('.band-1')).opacity})`));
await media(c,[]);

/* ---------- 7. phone: touch emulation makes pointer:coarse real ---------- */
line('PHONE GATES (real touch emulation)');
for (const [w,h,name] of [[375,812,'phone-375x812'],[375,667,'phone-375x667']]){
  await metrics(c,w,h,true,true);
  await goto(c,URL); await new Promise(r=>setTimeout(r,2200));
  console.log(name, await evalJS(c,`JSON.stringify({
    coarse:matchMedia('(pointer: coarse)').matches,
    staticHero:getComputedStyle(document.getElementById('statichero')).display,
    bandsHidden:getComputedStyle(document.getElementById('bands')).display,
    heroIs100vh:Math.abs(document.getElementById('hero-sec').offsetHeight-innerHeight)<2,
    videoRequested:performance.getEntriesByType('resource').some(r=>r.name.includes('hero-scrub')),
    posterRequested:performance.getEntriesByType('resource').some(r=>r.name.includes('hero-poster')),
    btnHeight:Math.round(document.querySelector('.static-hero .btn').getBoundingClientRect().height),
    sideways:document.documentElement.scrollWidth>innerWidth})`));
  await shot(c,`audit/${name}.png`);
}

/* ---------- 8. landscape phone gate ---------- */
line('LANDSCAPE PHONE (667x375)');
await metrics(c,667,375,true,true);
await goto(c,URL); await new Promise(r=>setTimeout(r,1800));
console.log(await evalJS(c,`JSON.stringify({
  gate4:matchMedia('(orientation: landscape) and (pointer: coarse) and (max-height: 560px)').matches,
  staticHero:getComputedStyle(document.getElementById('statichero')).display})`));

c.close(); process.exit(0);
