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
   H.264 one for browsers with no H.264 decoder. The page picks between a
   landscape and a portrait cut at runtime; the preview pins the landscape one
   so only a single film is inlined.
3. Nothing is done to the static-hero gates any more. The site is down to one,
   reduced motion, which a preview should honour like any other browser.
4. The landscape/portrait cut is chosen by window shape rather than by the
   page's own media query, because that query needs the viewport meta tag this
   script strips. See portrait_test.

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
PREVIEW_FALLBACK_PORTRAIT = 'review/preview-hero-portrait.webm'
MIME = {'.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
        '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.ico': 'image/x-icon'}

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
    # crosses a slash, because the fonts sit in assets/fonts/
    return re.sub(r'assets/((?:[A-Za-z0-9._-]+/)*[A-Za-z0-9._-]+\.[A-Za-z0-9]+)', repl, html)


def strip_wrapper(html, title):
    html = html.replace('<!DOCTYPE html>\n<html lang="en">\n<head>\n', '')
    html = html.replace('</head>\n<body>\n', '')
    html = html.replace('\n</body>\n</html>\n', '\n')
    for pat in HEAD_ONLY:
        html = re.sub(pat, '', html)
    # the gallery wants a name; the deployed pages keep their descriptive titles
    return re.sub(r'<title>.*?</title>', '<title>%s</title>' % title, html, count=1, flags=re.S)


def portrait_test(html):
    """Pick the cut by window shape, because a preview has no viewport meta.

    The deployed page asks '(orientation: portrait) and (max-width: 900px)'.
    That works because the page carries a viewport meta tag. strip_wrapper
    removes it, since the Artifact host supplies the document, so a narrow
    browser falls back to the default 980px layout viewport, 980 is wider
    than 900, and a phone-shaped window would be handed the landscape cut,
    which is the one thing a preview of this change has to get right.
    Shape survives that: 980x1914 is portrait, 1440x900 is not.
    """
    return html.replace(
        "matchMedia('(orientation: portrait) and (max-width: 900px)').matches",
        "(window.innerHeight > window.innerWidth * 1.2)")


def preview_loader(html):
    """Hand the data URI straight to the player, with a VP9 fallback."""
    def webm(path):
        if not os.path.exists(path):
            return ''
        with open(path, 'rb') as fh:
            return 'data:video/webm;base64,' + base64.b64encode(fh.read()).decode()

    fallback = webm(PREVIEW_FALLBACK)
    fallback_portrait = webm(PREVIEW_FALLBACK_PORTRAIT)

    old_call = '    loadHeroBlob().catch(failVideo);'
    new_call = '''    ring.style.setProperty('--ld', 0);
    var PREVIEW_FALLBACK_SRC = PORTRAIT_CUT ? %r : %r;
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
    armPreview(VIDEO_URL);''' % (fallback_portrait, fallback)
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
});''' % ('true' if (fallback or fallback_portrait) else 'false')
    assert old_err in html, 'error handler moved; update build-preview.py'
    return html.replace(old_err, new_err)


def relax_gates(html):
    """Nothing left to relax.

    This used to strip four device gates that sent any small screen to a
    composed still. Those gates are gone from the site: a portrait screen now
    gets its own cut of the film. The one remaining gate is reduced motion,
    which a preview should honour like anything else, so this is a no-op kept
    only so the call site reads the same.
    """
    return html


def build(src, out, title, is_index, other_url, other_file):
    html = io.open(src, encoding='utf-8').read()
    html = inline_assets(html)
    if is_index:
        html = portrait_test(html)
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
