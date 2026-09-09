#!/usr/bin/env python3
"""
Pack the nexora/ site into self-contained HTML files for previewing as Artifacts.

The deployed site is index.html + about.html + an assets/ folder. An Artifact is
a single page whose CSP blocks external media, so every asset is inlined as a
data URI and the document wrapper is stripped (the Artifact host supplies it).

Three things change for the preview and nothing else:

1. The scrub loader assigns the data URI straight to the video element instead
   of streaming it through fetch() into a blob. A sandboxed page typically
   allows `media-src data:` but not `connect-src data:` or `media-src blob:`,
   so the shipping path silently fails there and falls back to the poster.
2. A lighter 1440-wide encode stands in for the 1080p master, because the whole
   film has to travel inside the HTML as base64. A VP9 copy rides behind the
   H.264 one for browsers with no H.264 decoder.
3. Only the reduced-motion static-hero gate survives. The other four are size,
   orientation and pointer gates that correctly give a real phone a composed
   still instead of a 6 MB film. A preview panel is narrow and portrait, so
   every one of them fires there and the film never loads. The deployed site
   keeps all five.

Because an Artifact is one page, the two pages become two Artifacts. Pass the
other one's URL so the cross-links work:

    python3 build-preview.py                                  # both, links left as files
    python3 build-preview.py --about-url https://...          # index links to the About artifact
    python3 build-preview.py --index-url https://...          # about links to the index artifact
"""
import argparse
import base64
import io
import os
import re

SRC_INDEX = 'nexora/index.html'
SRC_ABOUT = 'nexora/about.html'
ASSETS = 'nexora/assets/'
OUT_INDEX = 'review/nexora-preview.html'
OUT_ABOUT = 'review/nexora-about-preview.html'
PREVIEW_VIDEO = 'review/preview-hero.mp4'      # lighter stand-in, if present
PREVIEW_FALLBACK = 'review/preview-hero.webm'  # VP9, for anything without H.264
MIME = {'.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png'}

HEAD_ONLY = (r'<meta charset="utf-8">\n', r'<meta name="viewport"[^>]*>\n',
             r'<meta name="description"[^>]*>\n', r'<meta name="theme-color"[^>]*>\n',
             r'<link rel="icon"[^>]*>\n', r'<!-- DEPLOY STEP[^>]*-->\n',
             r'<meta property="og:[^>]*>\n', r'<meta name="twitter:card"[^>]*>\n')


def inline_assets(html):
    def repl(match):
        fname = match.group(1)
        ext = os.path.splitext(fname)[1].lower()
        path = ASSETS + fname
        if fname == 'hero-scrub.mp4' and os.path.exists(PREVIEW_VIDEO):
            path = PREVIEW_VIDEO
        with open(path, 'rb') as fh:
            data = fh.read()
        return 'data:%s;base64,%s' % (MIME[ext], base64.b64encode(data).decode())
    return re.sub(r'assets/([A-Za-z0-9._-]+)', repl, html)


def strip_wrapper(html, title):
    html = html.replace('<!DOCTYPE html>\n<html lang="en">\n<head>\n', '')
    html = html.replace('</head>\n<body>\n', '')
    html = html.replace('\n</body>\n</html>\n', '\n')
    for pat in HEAD_ONLY:
        html = re.sub(pat, '', html)
    # the gallery wants a name; the deployed pages keep their descriptive titles
    return re.sub(r'<title>.*?</title>', '<title>%s</title>' % title, html, count=1, flags=re.S)


def preview_loader(html):
    """Hand the data URI straight to the player, with a VP9 fallback."""
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
    assert old_call in html, 'loader call site moved; update build-preview.py'
    html = html.replace(old_call, new_call)

    # hold the failure state back until the fallback has had its turn, so a
    # browser without H.264 never flashes the "no video" scroll cue
    old_err = '''video.addEventListener('error', function(){   /* the deadlock escape */
  seekBusy = false; pendingTime = null; failVideo();
});'''
    new_err = '''var previewFallbackPending = %s;
video.addEventListener('error', function(){   /* the deadlock escape */
  seekBusy = false; pendingTime = null;
  if (previewFallbackPending) { previewFallbackPending = false; return; }
  failVideo();
});''' % ('true' if fallback else 'false')
    assert old_err in html, 'error handler moved; update build-preview.py'
    return html.replace(old_err, new_err)


def relax_gates(html):
    """A preview panel is narrow and portrait, so the phone gates fire and hide
    the film. Keep only reduced motion, which is a real preference."""
    old_css = '''@media (max-width: 720px),
       (orientation: portrait) and (max-width: 1024px),
       (orientation: portrait) and (pointer: coarse),
       (orientation: landscape) and (pointer: coarse) and (max-height: 560px),
       (prefers-reduced-motion: reduce){'''
    assert old_css in html, 'CSS gate block moved; update build-preview.py'
    html = html.replace(old_css, '@media (prefers-reduced-motion: reduce){')

    old_js = '''var GATES = [
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)'
];'''
    assert old_js in html, 'JS GATES array moved; update build-preview.py'
    return html.replace(old_js, '''var GATES = [
  '(prefers-reduced-motion: reduce)'
];''')


def build(src, out, title, is_index, other_url, other_file):
    html = io.open(src, encoding='utf-8').read()
    html = inline_assets(html)
    if is_index:
        html = preview_loader(html)
        html = relax_gates(html)
    if other_url:
        # each page is its own Artifact, so cross-links point at the other URL
        html = html.replace('href="%s#' % other_file, 'href="%s#' % other_url)
        html = html.replace('href="%s"' % other_file, 'href="%s"' % other_url)
    html = strip_wrapper(html, title)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    io.open(out, 'w', encoding='utf-8').write(html)
    print('%s  %.2f MB' % (out, os.path.getsize(out) / 1024 / 1024))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--about-url', default=None, help='Artifact URL of the About page')
    ap.add_argument('--index-url', default=None, help='Artifact URL of the home page')
    a = ap.parse_args()
    build(SRC_ABOUT, OUT_ABOUT, 'Nexora Homes, About',
          is_index=False, other_url=a.index_url, other_file='index.html')
    build(SRC_INDEX, OUT_INDEX, 'Nexora Homes',
          is_index=True, other_url=a.about_url, other_file='about.html')


if __name__ == '__main__':
    main()
