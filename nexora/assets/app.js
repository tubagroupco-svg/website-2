(function(){
"use strict";

/* ============================================================
   1. Config
   ============================================================ */
var VIDEO_URL   = 'assets/hero-scrub.mp4';
var VIDEO_BYTES = 6200000;              /* real byte size, patched at build */
var POSTER_URL  = 'assets/hero-poster.jpg';
var ENDING_URL  = 'assets/hero-ending.jpg';
var MAILTO      = 'hello@nexora.example';

var video   = document.getElementById('hero');
var stage   = document.getElementById('stage');
var poster  = document.getElementById('poster');
var ringEl  = document.querySelector('.ring circle');
var ringWrap= document.getElementById('ringwrap');
var heroWrap= document.getElementById('hero-wrap');
var navEl   = document.getElementById('nav');

/* ============================================================
   2. Seeded splitting, so "random" is identical on every load
   ============================================================ */
function rng(seed){var s=seed>>>0;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296};}

var bands = [].slice.call(document.querySelectorAll('.band')).map(function(el,i){
  var a=parseFloat(el.dataset.a), b=parseFloat(el.dataset.b);
  return {el:el, a:a, b:b,
          ramp: el.dataset.ramp ? parseFloat(el.dataset.ramp) : Math.min(0.025,(b-a)*0.35),
          spread: el.dataset.spread ? parseFloat(el.dataset.spread) : 0.55,
          op:-1, k:-1};
});

function splitBand(band,i){
  var line = band.el.querySelector('.line');
  if(!line) return;
  var text = line.querySelector('.sr').textContent;
  var vis  = line.querySelector('.vis');
  var mode = band.el.className;
  var r    = rng(9001 + i*7717);
  var words= text.split(' ');
  var total= text.replace(/ /g,'').length, ci=0;
  var frag = document.createDocumentFragment();

  words.forEach(function(word,wi){
    var w=document.createElement('span'); w.className='w';
    if(mode.indexOf('e-drift')>-1 || mode.indexOf('e-rise')>-1){
      w.style.setProperty('--th', (wi/Math.max(1,words.length-1)*0.5).toFixed(3));
    }
    for(var j=0;j<word.length;j++){
      var c=document.createElement('span'); c.className='c'; c.textContent=word[j];
      if(mode.indexOf('e-scatter')>-1){
        c.style.setProperty('--th',(r()*0.55).toFixed(3));
        c.style.setProperty('--jx',((r()-0.5)*120).toFixed(1)+'px');
        c.style.setProperty('--jy',((r()-0.5)*90).toFixed(1)+'px');
        c.style.setProperty('--jr',((r()-0.5)*40).toFixed(1)+'deg');
      } else if(mode.indexOf('e-grid')>-1){
        c.style.setProperty('--th',(ci/total*band.spread + r()*0.06).toFixed(3));
        c.style.setProperty('--jx',((r()<0.5?-1:1)*(24+r()*34)).toFixed(1)+'px');
      }
      ci++; w.appendChild(c);
    }
    frag.appendChild(w);
    if(wi<words.length-1) frag.appendChild(document.createTextNode(' '));
  });

  if(mode.indexOf('e-blur')>-1){
    var sharp=document.createElement('span'); sharp.className='sharp'; sharp.appendChild(frag);
    var soft =document.createElement('span'); soft.className='soft'; soft.textContent=text;
    vis.appendChild(soft); vis.appendChild(sharp);
  } else {
    vis.appendChild(frag);
  }
}
bands.forEach(splitBand);

/* ============================================================
   3. Band maths
   ============================================================ */
function smoothstep(p,e0,e1){var t=Math.min(1,Math.max(0,(p-e0)/(e1-e0)));return t*t*(3-2*t);}
function clamp(v,lo,hi){return Math.min(hi,Math.max(lo,v));}

var loadK = 0, loadStart = 0;

function heroProgress(){
  var r = heroWrap.getBoundingClientRect();
  var range = heroWrap.offsetHeight - window.innerHeight;
  if(range<=0) return 0;
  return clamp(-r.top/range,0,1);
}

/* Delta-gated: the DOM is touched only when a value actually changed. */
function updateCaptions(p){
  for(var i=0;i<bands.length;i++){
    var bd=bands[i], a=bd.a, b=bd.b;
    var f=Math.min(0.02,(b-a)/3);
    var inRamp  = (i===0) ? 1 : smoothstep(p,a,a+f);
    var outRamp = (i===bands.length-1) ? 1 : (1-smoothstep(p,b-f,b));
    var op = inRamp*outRamp;
    var k  = clamp((p-a)/bd.ramp,0,1);
    if(i===0) k = Math.max(k, loadK);
    /* Delta gate, but the terminal value ALWAYS lands. Without the
       (op===0||op===1) escape a band rests at 0.996 forever and a
       blur-to-sharp beat never fully sharpens. */
    if(Math.abs(op-bd.op)>0.004 || ((op===0||op===1) && op!==bd.op)){
      bd.el.style.opacity = op.toFixed(3); bd.op = op;
    }
    if(Math.abs(k-bd.k)>0.008 || ((k===0||k===1) && k!==bd.k)){
      bd.el.style.setProperty('--k',k.toFixed(3)); bd.k = k;
    }
  }
  drivePanel(p);
  updateHud(p);
}

var lastHud='', lastHudAt=0;
function updateHud(p){
  var now=performance.now();
  if(now-lastHudAt<100) return;
  var txt = '10.1 inch panel  ·  ' +
            (p<0.28?'front':p<0.58?'turning':p<0.86?'seating':'flush');
  if(txt===lastHud) return;
  lastHud=txt; lastHudAt=now;
  var el=document.getElementById('hudchip'); if(el) el.textContent=txt;
}

/* ============================================================
   4. Gated seeks, deadlock safe
   ============================================================ */
var seekBusy=false, pendingTime=null;
function requestSeek(t){
  if(!video.duration || isNaN(video.duration)) return;
  if(seekBusy){ pendingTime=t; return; }
  seekBusy=true;
  try{ video.currentTime=t; }catch(e){ seekBusy=false; }
}
video.addEventListener('seeked',function(){
  seekBusy=false;
  if(pendingTime!==null){ var t=pendingTime; pendingTime=null; requestSeek(t); }
});
video.addEventListener('error',function(){ seekBusy=false; pendingTime=null; failVideo(); });

/* ============================================================
   5. The rAF loop that rests, frame-rate independent
   ============================================================ */
var target=0, shown=0, rafId=null, lastTick=0, heroOnScreen=true;

function tick(now){
  var dt=Math.min(100, now-(lastTick||now)); lastTick=now;
  var k=0.16;
  shown += (target-shown)*(1-Math.pow(1-k, dt/16.667));
  var settled = Math.abs(target-shown)<0.0005;
  if(settled){ shown=target; rafId=null; lastTick=0; }
  else rafId=requestAnimationFrame(tick);
  if(video.duration) requestSeek(shown*video.duration);
  updateCaptions(shown);
  if(!settled) drawSeam();
}
function onScroll(){
  target=heroProgress();
  if(rafId===null && heroOnScreen) rafId=requestAnimationFrame(tick);
  else if(rafId===null) updateCaptions(target);
}

if('IntersectionObserver' in window){
  new IntersectionObserver(function(es){ heroOnScreen=es[0].isIntersecting; },{threshold:0})
    .observe(heroWrap);
}

/* ============================================================
   6. The streamed Blob with an honest ring
   ============================================================ */
var USE_VIDEO=false;          /* the hero is the code-built panel, not footage */
var heroInit=false;
function initHeroOnce(){
  if(heroInit) return; heroInit=true;

  /* Band one's one-time assembly ramp. It belongs to the captions, not to the
     video, so it must run in panel mode too or the hero opens wordless. */
  loadStart=performance.now();
  (function ramp(){
    loadK=Math.min(1,(performance.now()-loadStart)/1100);
    updateCaptions(shown);
    if(loadK<1) requestAnimationFrame(ramp);
  })();

  if(!USE_VIDEO){ stage.classList.add('panel-mode'); return; }
  poster.style.backgroundImage = "url('"+POSTER_URL+"')";
  var started=false;
  function startBlobFetch(){
    if(started) return; started=true;
    poster.classList.add('on');
    loadHeroBlob().catch(failVideo);
  }
  var pi=new Image();
  pi.onload=function(){ poster.classList.add('on'); startBlobFetch(); };
  pi.onerror=startBlobFetch;
  pi.src=POSTER_URL;
  setTimeout(startBlobFetch,4000);

}

function loadHeroBlob(){
  var ctrl=new AbortController();
  var watchdog=setTimeout(function(){ctrl.abort();},20000);
  return fetch(VIDEO_URL,{signal:ctrl.signal}).then(function(res){
    if(!res.ok) throw new Error('video '+res.status);
    var total=Number(res.headers.get('Content-Length'))||VIDEO_BYTES;
    if(!res.body || !res.body.getReader){
      clearTimeout(watchdog);
      return res.blob().then(attach);
    }
    var reader=res.body.getReader(), chunks=[], got=0, lastRing=0;
    return (function pump(){
      return reader.read().then(function(r){
        if(r.done){ clearTimeout(watchdog); return attach(new Blob(chunks)); }
        clearTimeout(watchdog);
        watchdog=setTimeout(function(){ctrl.abort();},20000);
        chunks.push(r.value); got+=r.value.length;
        var frac=Math.min(1,got/total), now=performance.now();
        if(now-lastRing>100 || frac===1){
          lastRing=now;
          if(ringEl) ringEl.style.setProperty('--ld', Math.round(126*(1-frac)));
        }
        return pump();
      });
    })();
  });
}
function attach(blob){
  if(ringEl) ringEl.style.setProperty('--ld',0);
  video.src=URL.createObjectURL(blob);
  video.load();
  video.addEventListener('canplay',function(){
    requestSeek(heroProgress()*video.duration);
    stage.classList.add('video-ready');
  },{once:true});
}
function failVideo(){
  if(stage.classList.contains('video-failed')) return;
  stage.classList.add('video-failed');
  if(ringWrap){
    ringWrap.innerHTML='<svg class="chev" viewBox="0 0 24 34" fill="none" aria-hidden="true">'+
      '<path d="M5 12l7 7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  poster.classList.add('on');
}


/* ============================================================
   The panel drive. One eased journey: wake, turn, approach, seat.
   Writes only when a value actually changed, like the bands.
   ============================================================ */
var roomEl = document.getElementById('stage');
var panelState = {ry:null,ps:null,tz:null,wake:null,seat:null,dawn:null};

function ease(t){ return t*t*(3-2*t); }

function drivePanel(p){
  if(!roomEl) return;
  var wake = clamp((p-0.04)/0.16,0,1);
  var out  = ease(clamp((p-0.24)/0.28,0,1));     /* turning away  */
  var back = ease(clamp((p-0.56)/0.24,0,1));     /* turning back  */
  var ry   = -46*(out-back);
  var app  = ease(clamp((p-0.60)/0.30,0,1));     /* toward the wall */
  var ps   = 1-0.28*app;
  var tz   = -150*app;
  var seat = ease(clamp((p-0.84)/0.16,0,1));
  var dawn = ease(clamp((p-0.52)/0.44,0,1));
  set('--ry', ry.toFixed(2)+'deg', 'ry', ry, 0.15);
  set('--ps', ps.toFixed(4), 'ps', ps, 0.002);
  set('--tz', tz.toFixed(1)+'px', 'tz', tz, 0.5);
  set('--wake', wake.toFixed(3), 'wake', wake, 0.008);
  set('--seat', seat.toFixed(3), 'seat', seat, 0.008);
  set('--dawn', dawn.toFixed(3), 'dawn', dawn, 0.008);
  /* the wall is light from here on, so the nav swaps to dark type */
  var lit = dawn > 0.55;
  if(lit !== navLit){ navLit = lit; navEl.classList.toggle('over-lit', lit && navOver); }
}
var navLit=false;
function set(prop, str, key, val, eps){
  var prev = panelState[key];
  var terminal = (val===0 || val===1);
  if(prev===null || Math.abs(val-prev)>eps || (terminal && val!==prev)){
    roomEl.style.setProperty(prop, str);
    panelState[key]=val;
  }
}

/* ============================================================
   The screen is live: real time, real date, on the visitor's clock.
   ============================================================ */
var DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var MONS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var lastClock='';
function tickClock(){
  var d=new Date();
  var hh=String(d.getHours()).padStart(2,'0'), mm=String(d.getMinutes()).padStart(2,'0');
  var t=hh+':'+mm;
  if(t===lastClock) return;
  lastClock=t;
  var h=d.getHours();
  var greet = h<5?'Still asleep' : h<12?'Good morning' : h<18?'Good afternoon' : 'Good evening';
  var date = DAYS[d.getDay()]+' '+d.getDate()+' '+MONS[d.getMonth()];
  [].forEach.call(document.querySelectorAll('.js-time'),function(e){e.textContent=t});
  [].forEach.call(document.querySelectorAll('.js-date'),function(e){e.textContent=date});
  [].forEach.call(document.querySelectorAll('.js-greet'),function(e){e.textContent=greet});
}

/* the static hero shows the same panel, so it can never drift out of sync */
(function cloneForStatic(){
  var src=document.getElementById('panel3d'), host=document.getElementById('shscene');
  if(!src||!host) return;
  var c=src.cloneNode(true); c.removeAttribute('id');
  host.appendChild(c);
})();
tickClock();
setInterval(tickClock, 15000);

/* ============================================================
   7. The five gates, live in BOTH directions
   ============================================================ */
var GATES=[
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)'
];
var scrubOn=false;
function enableScrub(){
  if(scrubOn) return; scrubOn=true;
  initHeroOnce();
  window.addEventListener('scroll',onScroll,{passive:true});
  bands.forEach(function(b){ b.op=-1; b.k=-1; });
  unpinFinalStates();
  updateCaptions(heroProgress());
  onScroll();
}
function disableScrub(){
  if(!scrubOn) return; scrubOn=false;
  window.removeEventListener('scroll',onScroll);
  if(rafId!==null){ cancelAnimationFrame(rafId); rafId=null; }
}
function applyHeroMode(){
  var off=GATES.some(function(q){return matchMedia(q).matches;});
  if(off){ disableScrub(); primeStatic(); }
  else enableScrub();
}
var MQLS=GATES.map(function(q){return matchMedia(q);});
MQLS.forEach(function(m){
  if(m.addEventListener) m.addEventListener('change',applyHeroMode);
  else if(m.addListener) m.addListener(applyHeroMode);
});

var staticPrimed=false;
function primeStatic(){
  if(staticPrimed) return; staticPrimed=true;
  var el=document.getElementById('shimg');
  if(el) el.style.backgroundImage="url('"+ENDING_URL+"')";
}

/* ============================================================
   8. Motes, whisper level
   ============================================================ */
(function(){
  var host=document.getElementById('motes'); if(!host) return;
  var r=rng(4242), html='';
  for(var i=0;i<16;i++){
    var d=(16+r()*22).toFixed(1), delay=(-r()*30).toFixed(1);
    html+='<span class="mote" style="left:'+(r()*100).toFixed(1)+'%;top:'+(r()*100).toFixed(1)+'%;'+
          'opacity:'+(0.18+r()*0.4).toFixed(2)+';animation:moteDrift '+d+'s linear '+delay+'s infinite"></span>';
  }
  host.innerHTML=html;
  var st=document.createElement('style');
  st.textContent='@keyframes moteDrift{0%{transform:translate3d(0,0,0)}50%{transform:translate3d(14px,-26px,0)}100%{transform:translate3d(0,0,0)}}';
  document.head.appendChild(st);
})();

/* ============================================================
   9. The light seam, drawn on scroll
   ============================================================ */
var seamLive=document.getElementById('seamLive');
var seamBloom=document.getElementById('seamBloom');
var seamLen=1000, lastSeam=-1, seamNodes=[];

(function buildNodes(){
  if(window.innerWidth<=1180) return;
  var svg=document.querySelector('.seamwrap svg'); if(!svg) return;
  ['honest','how','goodnight','runs','proof','pricing','faq','start'].forEach(function(id,i){
    var c=document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('class','seam-node'); c.setAttribute('cx','9');
    c.setAttribute('cy',String(60+i*118)); c.setAttribute('r','3');
    svg.appendChild(c); seamNodes.push({el:c,id:id,on:false});
  });
})();

if(seamLive){ seamLive.style.strokeDasharray=seamLen; seamLive.style.strokeDashoffset=seamLen; }

function pageProgress(){
  var h=document.documentElement.scrollHeight-window.innerHeight;
  return h<=0?0:clamp(window.scrollY/h,0,1);
}
function drawSeam(){
  if(!seamLive) return;
  var p=pageProgress();
  if(Math.abs(p-lastSeam)<0.002) return;
  lastSeam=p;
  seamLive.style.strokeDashoffset=(seamLen*(1-p)).toFixed(1);
  if(seamBloom) seamBloom.setAttribute('cy',(p*seamLen).toFixed(1));
  for(var i=0;i<seamNodes.length;i++){
    var want=p*seamLen > (60+i*118);
    if(want!==seamNodes[i].on){ seamNodes[i].on=want; seamNodes[i].el.classList.toggle('on',want); }
  }
}

/* ============================================================
   10. Nav state
   ============================================================ */
var navSolid=false, navOver=true;
function navUpdate(){
  var heroVisible = heroWrap.getBoundingClientRect().bottom > 90 &&
                    getComputedStyle(heroWrap).display!=='none';
  var sh=document.getElementById('statichero');
  var shVisible = sh && getComputedStyle(sh).display!=='none' &&
                  sh.getBoundingClientRect().bottom > 90;
  var over = heroVisible || shVisible;
  /* Solid and over-video are mutually exclusive. Letting both land puts the
     hero's light nav text on the solid light bar, which is unreadable. */
  var solid = window.scrollY>40 && !over;
  if(solid!==navSolid){ navSolid=solid; navEl.classList.toggle('solid',solid); }
  if(over!==navOver){ navOver=over; navEl.classList.toggle('over-video',over); }
  navEl.classList.toggle('over-lit', navOver && navLit);
}

/* ============================================================
   11. Section entrances
   ============================================================ */
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('in');
        e.target.classList.remove('offscreen');
        setTimeout(function(){ e.target.classList.add('settled'); },1400);
        io.unobserve(e.target);
      }
    });
  },{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
  [].forEach.call(document.querySelectorAll('.obs'),function(s){ io.observe(s); });

  var pauseIo=new IntersectionObserver(function(es){
    es.forEach(function(e){ e.target.classList.toggle('offscreen',!e.isIntersecting); });
  },{threshold:0});
  [].forEach.call(document.querySelectorAll('.obs'),function(s){ pauseIo.observe(s); });
} else {
  [].forEach.call(document.querySelectorAll('.obs'),function(s){ s.classList.add('in','settled'); });
}

/* ============================================================
   12. The one interactive moment: hold to run Good Night
   ============================================================ */
(function(){
  var btn=document.getElementById('hold');
  if(!btn) return;
  var lamps=[].slice.call(document.querySelectorAll('#lamps [data-lamp]'));
  var lockbar=document.getElementById('lockbar');
  var tempval=document.getElementById('tempval');
  var dot=document.getElementById('gndot');
  var success=document.getElementById('gnsuccess');
  var note=document.getElementById('gnnote');
  var HOLD=2000, prog=0, holding=false, raf=null, last=0, done=false;
  var lastTemp='';

  function paint(){
    btn.style.setProperty('--hp',prog.toFixed(3));
    for(var i=0;i<lamps.length;i++){
      var th=i/lamps.length*0.72;
      var lit=1-clamp((prog-th)/0.26,0,1);
      lamps[i].style.setProperty('--lit',lit.toFixed(2));
    }
    if(lockbar) lockbar.style.transform='rotate('+(prog*90).toFixed(1)+'deg)';
    var t=(21-Math.round(prog*2));
    var s=t+'°';
    if(s!==lastTemp && tempval){ tempval.textContent=s; lastTemp=s; }
    if(dot) dot.style.setProperty('--dot',clamp((prog-0.8)/0.2,0,1).toFixed(2));
  }
  function loop(now){
    var dt=Math.min(64,now-(last||now)); last=now;
    if(holding) prog=Math.min(1,prog+dt/HOLD);
    else prog=Math.max(0,prog-dt/(HOLD*0.7));
    paint();
    if(prog>=1 && !done){
      done=true; holding=false;
      btn.classList.add('ran');
      btn.querySelector('span').textContent='Good Night is running';
      if(note) note.textContent='House asleep';
      if(success) success.classList.add('on');
    }
    if((holding || prog>0) && !done) raf=requestAnimationFrame(loop);
    else { raf=null; last=0; }
  }
  function start(e){
    if(done) return;
    if(e && e.cancelable) e.preventDefault();
    holding=true; if(raf===null) raf=requestAnimationFrame(loop);
  }
  function stop(){ holding=false; if(raf===null && prog>0 && !done) raf=requestAnimationFrame(loop); }

  btn.addEventListener('mousedown',start);
  btn.addEventListener('touchstart',start,{passive:false});
  ['mouseup','mouseleave','touchend','touchcancel','blur'].forEach(function(ev){
    btn.addEventListener(ev,stop);
  });
  btn.addEventListener('keydown',function(e){ if(e.key===' '||e.key==='Enter'){ e.preventDefault(); start(); } });
  btn.addEventListener('keyup',function(e){ if(e.key===' '||e.key==='Enter'){ stop(); } });

  window.__gnFinish=function(){
    if(done) return;
    done=true; holding=false; prog=1; paint();
    btn.classList.add('ran');
    btn.querySelector('span').textContent='Good Night is running';
    if(note) note.textContent='House asleep';
    if(success) success.classList.add('on');
  };
  window.__gnReset=function(){ /* nothing to undo: completing is a one-way, earned state */ };
  paint();
})();

/* ============================================================
   13. FAQ, height animated so nothing snaps
   ============================================================ */
[].forEach.call(document.querySelectorAll('.fq'),function(fq){
  var btn=fq.querySelector('button'), ans=fq.querySelector('.ans');
  btn.addEventListener('click',function(){
    var open=fq.hasAttribute('open');
    [].forEach.call(document.querySelectorAll('.fq[open]'),function(o){
      if(o!==fq){ o.removeAttribute('open'); o.querySelector('.ans').style.height='0px';
                  o.querySelector('button').setAttribute('aria-expanded','false'); }
    });
    if(open){ ans.style.height='0px'; fq.removeAttribute('open'); btn.setAttribute('aria-expanded','false'); }
    else{ fq.setAttribute('open',''); btn.setAttribute('aria-expanded','true');
          ans.style.height=ans.scrollHeight+'px'; }
  });
});

/* ============================================================
   14. The form: a real mailto, and an honest success state
   ============================================================ */
(function(){
  var form=document.getElementById('form'), done=document.getElementById('done');
  if(!form) return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var nm=form.name.value.trim(), em=form.email.value.trim();
    if(!nm || !em || em.indexOf('@')<1){
      (nm?form.email:form.nm||form.querySelector('#nm')).focus();
      return;
    }
    var body='Name: '+nm+'\nEmail: '+em+'\nHome: '+form.home.value+
             '\n\n'+(form.message.value.trim()||'(nothing added)');
    window.location.href='mailto:'+MAILTO+
      '?subject='+encodeURIComponent('Walkthrough request from '+nm)+
      '&body='+encodeURIComponent(body);
    done.classList.add('on');
  });
})();

/* ============================================================
   15. Reduced motion, honoured live in BOTH directions
   ============================================================ */
function pinToFinalStates(){
  document.documentElement.classList.add('pinned');
  [].forEach.call(document.querySelectorAll('.obs'),function(s){ s.classList.add('in','settled'); });
  if(seamLive) seamLive.style.strokeDashoffset='0';
  seamNodes.forEach(function(n){ n.on=true; n.el.classList.add('on'); });
  if(window.__gnFinish) window.__gnFinish();
  if(rafId!==null){ cancelAnimationFrame(rafId); rafId=null; }
  primeStatic();
}
function unpinFinalStates(){
  document.documentElement.classList.remove('pinned');
  if(seamLive){ lastSeam=-1; drawSeam(); }
}
matchMedia('(prefers-reduced-motion: reduce)').addEventListener
  ? matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',function(e){
      if(e.matches) pinToFinalStates(); else applyHeroMode();
    })
  : null;

/* ============================================================
   16. Pause everything on a hidden tab
   ============================================================ */
document.addEventListener('visibilitychange',function(){
  document.body.classList.toggle('paused',document.hidden);
});

/* ============================================================
   17. Imagery that has not arrived never looks broken
   ============================================================ */
[].forEach.call(document.querySelectorAll('img'),function(img){
  function drop(){ img.style.display='none'; img.parentNode.classList.add('noimg'); }
  if(img.complete && img.naturalWidth===0) drop();
  img.addEventListener('error',drop);
});

/* ============================================================
   18. Boot
   ============================================================ */
document.getElementById('yr').textContent=new Date().getFullYear();
window.addEventListener('scroll',function(){ navUpdate(); drawSeam(); },{passive:true});
window.addEventListener('resize',function(){ lastSeam=-1; drawSeam(); navUpdate(); },{passive:true});
applyHeroMode();
navUpdate();
drawSeam();
if(!scrubOn) updateCaptions(0);
})();
