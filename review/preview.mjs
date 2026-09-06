import {connect,boot,goto,evalJS,metrics,shot} from './cdp.mjs';
const c = await connect(); await boot(c);
await metrics(c,1440,900); c.events.length=0;
await goto(c,'http://127.0.0.1:8099/__preview.html'); await new Promise(r=>setTimeout(r,2800));
console.log(await evalJS(c,`JSON.stringify({
  layers:document.querySelectorAll('.lyr img').length,
  layersLoaded:[...document.querySelectorAll('.lyr img')].every(i=>i.complete&&i.naturalWidth>0),
  mark:(m=>m&&m.complete&&m.naturalWidth>0)(document.querySelector('.brand .mark')),
  rangeImgs:[...document.querySelectorAll('.rprod img')].every(i=>i.complete&&i.naturalWidth>0),
  bandsWork:+getComputedStyle(document.querySelector('.band-1')).opacity,
  externalRequests:performance.getEntriesByType('resource').filter(r=>!r.name.startsWith('data:')).map(r=>r.name.split('/')[2]).filter((v,i,a)=>a.indexOf(v)===i)
},null,1)`));
await shot(c,'audit/preview-top.png');
const exc=c.events.filter(e=>e.method==='Runtime.exceptionThrown').map(e=>e.params.exceptionDetails.text);
console.log('exceptions:', exc.length?exc:'(none)');
c.close(); process.exit(0);
