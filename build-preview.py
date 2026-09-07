#!/usr/bin/env python3
"""
Pack nexora/ into one self-contained HTML file for previewing as an Artifact.

The deployed site is index.html plus an assets/ folder. An Artifact is a single
page whose CSP blocks external media, so every asset is inlined as a data URI
and the document wrapper is stripped (the Artifact host supplies it).

Two things change for the preview and nothing else:

1. The loader assigns the data URI straight to the video element instead of
   streaming it through fetch() into a blob. A sandboxed page typically allows
   `media-src data:` but not `connect-src data:` or `media-src blob:`, so the
   shipping path silently fails there and the page falls back to the poster.
2. A lighter 1440-wide encode stands in for the 1080p master, because the whole
   film has to travel inside the HTML as base64.
3. Only the reduced-motion static-hero gate survives. The other four are size,
   orientation and pointer gates that correctly give a real phone a composed
   still instead of a 6 MB film. A preview panel is narrow and portrait, so
   every one of them fires there and the film never loads, which is exactly
   what "there is no hero film, it is a still image" looks like. The deployed
   site keeps all five.

The deployed site keeps the streamed blob loader, which is what makes seeking
work on hosts without HTTP Range support.

    python3 build-preview.py            # -> review/nexora-preview.html
"""
import base64
import io
import os
import re

SRC = 'nexora/index.html'
ASSETS = 'nexora/assets/'
OUT = 'review/nexora-preview.html'
PREVIEW_VIDEO = 'review/preview-hero.mp4'    # lighter stand-in, if present
PREVIEW_FALLBACK = 'review/preview-hero.webm'  # VP9, for anything without H.264
MIME = {'.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png'}


def main():
    src = io.open(SRC, encoding='utf-8').read()

    def inline(match):
        fname = match.group(1)
        ext = os.path.splitext(fname)[1].lower()
        path = ASSETS + fname
        if fname == 'hero-scrub.mp4' and os.path.exists(PREVIEW_VIDEO):
            path = PREVIEW_VIDEO
        with open(path, 'rb') as fh:
            data = fh.read()
        return 'data:%s;base64,%s' % (MIME[ext], base64.b64encode(data).decode())

    out = re.sub(r'assets/([A-Za-z0-9._-]+)', inline, src)

    # hand the data URI straight to the player: a sandboxed page allows
    # media-src data: but generally not connect-src data: or media-src blob:
    fallback = ''
    if os.path.exists(PREVIEW_FALLBACK):
        with open(PREVIEW_FALLBACK, 'rb') as fh:
            fallback = 'data:video/webm;base64,' + base64.b64encode(fh.read()).decode()

    old_call = '    loadHeroBlob().catch(failVideo);'
    new_call = '''    ring.style.setProperty('--ld', 0);
    var PREVIEW_FALLBACK_SRC = %r;
    var triedFallback = false;
    function armPreview(src){
      video.src = src;
      video.load();
    }
    video.addEventListener('canplay', function(){
      requestSeek(heroProgress() * video.duration);
      stage.classList.add('video-ready');
    }, { once:true });
    video.addEventListener('error', function(){
      // a browser with no H.264 decoder gets the VP9 copy instead
      if (triedFallback || !PREVIEW_FALLBACK_SRC) return;
      triedFallback = true;
      stage.classList.remove('video-failed');
      armPreview(PREVIEW_FALLBACK_SRC);
    });
    armPreview(VIDEO_URL);''' % fallback
    assert old_call in out, 'loader call site moved; update build-preview.py'
    out = out.replace(old_call, new_call)

    # hold the failure state back until the fallback source has had its turn,
    # so a browser without H.264 never flashes the "no video" scroll cue
    old_err = '''video.addEventListener('error', function(){   /* the deadlock escape */
  seekBusy = false; pendingTime = null; failVideo();
});'''
    new_err = '''var previewFallbackPending = %s;
video.addEventListener('error', function(){   /* the deadlock escape */
  seekBusy = false; pendingTime = null;
  if (previewFallbackPending) { previewFallbackPending = false; return; }
  failVideo();
});''' % ('true' if fallback else 'false')
    assert old_err in out, 'error handler moved; update build-preview.py'
    out = out.replace(old_err, new_err)

    # the preview panel is narrow and portrait, so the phone gates fire and
    # hide the film. Keep only reduced motion, which is a real preference.
    old_css_gate = '''@media (max-width: 720px),
       (orientation: portrait) and (max-width: 1024px),
       (orientation: portrait) and (pointer: coarse),
       (orientation: landscape) and (pointer: coarse) and (max-height: 560px),
       (prefers-reduced-motion: reduce){'''
    assert old_css_gate in out, 'CSS gate block moved; update build-preview.py'
    out = out.replace(old_css_gate, '@media (prefers-reduced-motion: reduce){')

    old_js_gate = '''var GATES = [
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)'
];'''
    assert old_js_gate in out, 'JS GATES array moved; update build-preview.py'
    out = out.replace(old_js_gate, '''var GATES = [
  '(prefers-reduced-motion: reduce)'
];''')

    out = out.replace('<!DOCTYPE html>\n<html lang="en">\n<head>\n', '')
    out = out.replace('</head>\n<body>\n', '')
    out = out.replace('\n</body>\n</html>\n', '\n')

    for pat in (r'<meta charset="utf-8">\n',
                r'<meta name="viewport"[^>]*>\n',
                r'<meta name="description"[^>]*>\n',
                r'<meta name="theme-color"[^>]*>\n',
                r'<link rel="icon"[^>]*>\n',
                r'<!-- DEPLOY STEP[^>]*-->\n',
                r'<meta property="og:[^>]*>\n',
                r'<meta name="twitter:card"[^>]*>\n'):
        out = re.sub(pat, '', out)

    # the gallery wants a name; the deployed site keeps its full descriptive title
    out = re.sub(r'<title>.*?</title>', '<title>Nexora Homes</title>', out, count=1, flags=re.S)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    io.open(OUT, 'w', encoding='utf-8').write(out)
    print('%s  %.2f MB' % (OUT, os.path.getsize(OUT) / 1024 / 1024))


if __name__ == '__main__':
    main()
