import {connect,boot,goto,evalJS,metrics} from './cdp.mjs';
const c = await connect(); await boot(c);
await metrics(c,1440,900); await goto(c,'http://127.0.0.1:8099/');
await new Promise(r=>setTimeout(r,1800));
console.log(await evalJS(c,`(async()=>{
  const report={};
  for (const step of [120,240,360]){
    scrollTo(0,0); await new Promise(r=>setTimeout(r,700));
    const H=document.getElementById('hero-sec').offsetHeight-innerHeight;
    const counts=[0,0,0,0], peaks=[0,0,0,0]; let n=0;
    while (scrollY < H-4 && n < 200){
      scrollBy(0,step); await new Promise(r=>setTimeout(r,260)); n++;
      [...document.querySelectorAll('.band')].forEach((b,i)=>{
        const o=+getComputedStyle(b).opacity;
        if(o>0.92) counts[i]++; if(o>peaks[i]) peaks[i]=o;
      });
    }
    report['step'+step]={readableFor:counts, peak:peaks.map(p=>+p.toFixed(2)), steps:n};
  }
  scrollTo(0,0);
  return JSON.stringify(report,null,1)})()`));
c.close(); process.exit(0);
