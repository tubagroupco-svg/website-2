import {connect,boot,goto,evalJS,metrics,shot} from './cdp.mjs';
const c = await connect(); await boot(c);
await metrics(c,1440,900); await goto(c,'http://127.0.0.1:8099/');
await new Promise(r=>setTimeout(r,2000));
console.log('=== BRAND ===');
console.log(await evalJS(c,`JSON.stringify({
  title:document.title,
  wordmark:document.querySelector('.brand b').textContent,
  markLoaded:(m=>m&&m.complete&&m.naturalWidth>0)(document.querySelector('.brand .mark')),
  markBlend:getComputedStyle(document.querySelector('.brand .mark')).mixBlendMode,
  waHref:document.getElementById('wa-main').getAttribute('href'),
  tagline:(document.querySelector('footer .tag')||{}).textContent
},null,1)`));
await evalJS(c,`document.getElementById('talk').scrollIntoView({behavior:'instant'})`);
await new Promise(r=>setTimeout(r,700)); await shot(c,'audit/gold-footer.png');
await evalJS(c,`scrollTo(0,0)`); await new Promise(r=>setTimeout(r,600));
await shot(c,'audit/gold-nav.png');
c.close(); process.exit(0);
