#!/usr/bin/env python3
"""
Pack nexora/ into one self-contained HTML file for previewing as an Artifact.

The deployed site is index.html plus an assets/ folder. An Artifact is a single
page whose CSP blocks external media, so every asset is inlined as a data URI
and the document wrapper is stripped (the Artifact host supplies it).

The scrub loader is left untouched: fetch() streams from a data URI, the blob
and seek path works unchanged, and the hardcoded VIDEO_BYTES covers the missing
Content-Length that a data URI has no way to send.

    python3 build-preview.py            # -> review/nexora-preview.html
"""
import base64
import io
import os
import re

SRC = 'nexora/index.html'
ASSETS = 'nexora/assets/'
OUT = 'review/nexora-preview.html'
MIME = {'.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png'}


def main():
    src = io.open(SRC, encoding='utf-8').read()

    def inline(match):
        fname = match.group(1)
        ext = os.path.splitext(fname)[1].lower()
        with open(ASSETS + fname, 'rb') as fh:
            data = fh.read()
        return 'data:%s;base64,%s' % (MIME[ext], base64.b64encode(data).decode())

    out = re.sub(r'assets/([A-Za-z0-9._-]+)', inline, src)

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
