import {connect,boot,goto,evalJS,metrics} from './cdp.mjs';
const c = await connect(); await boot(c);
await metrics(c,1440,900); c.events.length=0;
await goto(c,'http://127.0.0.1:8099/'); await new Promise(r=>setTimeout(r,3000));
const errs=c.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error')
  .map(e=>(e.params.entry.url||'').split('/').pop()+' :: '+e.params.entry.text);
const exc=c.events.filter(e=>e.method==='Runtime.exceptionThrown').map(e=>e.params.exceptionDetails.text);
console.log('JS exceptions:', exc.length?exc:'(none)');
console.log('resource errors:'); errs.forEach(e=>console.log('  '+e));
c.close(); process.exit(0);
