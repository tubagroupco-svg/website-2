#!/usr/bin/env python3
"""
Stamp your real domain into the Nexora Homes site.

Four files ship with the placeholder SITE_URL_HERE in them, because a few
things have to be written as a full absolute address and nobody knew the
domain when the site was built:

  index.html    the canonical link and the og: tags, which are what
                WhatsApp, Facebook and X read to build a link preview
  about.html    the same
  sitemap.xml   search engines will not accept relative addresses here
  robots.txt    the line pointing at the sitemap

Run this once, before you upload:

    python3 set-domain.py nexorahomes.com

Other accepted spellings, all of which mean the same thing:

    python3 set-domain.py www.nexorahomes.com
    python3 set-domain.py https://nexorahomes.com
    python3 set-domain.py https://nexorahomes.com/

If you give it a www address it also switches on the "force www" redirect
in .htaccess, and a bare domain switches on "force non-www", so the site
answers on one address instead of two. Pass --no-htaccess to leave that
file alone.

Safe to run more than once. It prints what it changed, and if it finds
nothing to change it says so rather than pretending it worked.

No Python on your machine? You do not need this script. Open those four
files in any text editor and replace every SITE_URL_HERE with your address
written as https://yourdomain.com (no slash on the end).
"""
import argparse
import io
import os
import re
import sys
from datetime import date

PLACEHOLDER = 'SITE_URL_HERE'
TARGETS = ('index.html', 'about.html', 'sitemap.xml', 'robots.txt')


def normalise(raw):
    """Turn whatever the user typed into https://host with no trailing slash."""
    s = raw.strip()
    s = re.sub(r'^[a-zA-Z][a-zA-Z0-9+.-]*://', '', s)   # drop any scheme
    s = s.rstrip('/')
    s = s.split('/')[0]                                  # drop any path
    if not s:
        raise ValueError('that is empty')
    if ' ' in s:
        raise ValueError('a domain cannot contain a space')
    if '.' not in s:
        raise ValueError('that does not look like a domain, there is no dot in it')
    if not re.match(r'^[A-Za-z0-9.-]+$', s):
        raise ValueError('a domain can only hold letters, digits, dots and hyphens')
    return 'https://' + s.lower(), s.lower().startswith('www.')


def set_htaccess(path, want_www):
    """Leave exactly one canonical-host block active and the other commented.

    Both blocks have to be normalised every run, not just the wanted one. If
    this only ever uncommented, then running it once for www and later for
    non-www would leave both rules live, and the two would bounce a visitor
    between the addresses until the browser gave up. That takes the whole
    site down, so the losing block is re-commented on every run.
    """
    if not os.path.exists(path):
        return 'no .htaccess found, skipped'
    text = io.open(path, encoding='utf-8').read()

    NONWWW = ['  RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]',
              '  RewriteRule ^ https://%1%{REQUEST_URI} [L,R=301]']
    WWW = ['  RewriteCond %{HTTP_HOST} !^www\\. [NC]',
           '  RewriteCond %{HTTP_HOST} !^localhost [NC]',
           '  RewriteRule ^ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]']

    def live(block):
        return '\n'.join(block)

    def dead(block):
        return '\n'.join('  # ' + ln[2:] for ln in block)

    wanted, unwanted = (WWW, NONWWW) if want_www else (NONWWW, WWW)

    if live(wanted) not in text and dead(wanted) not in text:
        return 'could not find the redirect block, left alone (set it by hand)'

    already = live(wanted) in text
    # switch the losing block off first, so a flip never leaves both live
    text = text.replace(live(unwanted), dead(unwanted))
    text = text.replace(dead(wanted), live(wanted))

    io.open(path, 'w', encoding='utf-8').write(text)
    which = 'www' if want_www else 'non-www'
    return ('force %s redirect already set' % which) if already else \
           ('force %s redirect switched on' % which)


def main():
    ap = argparse.ArgumentParser(
        description='Stamp your domain into the Nexora Homes site.')
    ap.add_argument('domain', help='e.g. nexorahomes.com')
    ap.add_argument('--dir', default=None,
                    help='the site folder (default: the folder holding this script\'s folder)')
    ap.add_argument('--no-htaccess', action='store_true',
                    help='do not touch the www redirect in .htaccess')
    a = ap.parse_args()

    try:
        url, is_www = normalise(a.domain)
    except ValueError as e:
        sys.exit('Stopping: %s\nTry:  python3 set-domain.py nexorahomes.com' % e)

    root = a.dir or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if not os.path.exists(os.path.join(root, 'index.html')):
        sys.exit('Stopping: no index.html in %s\n'
                 'Run this from inside _deploy-docs, or pass --dir path/to/the/site' % root)

    print('Domain : %s' % url)
    print('Folder : %s\n' % root)

    touched = total = 0
    for name in TARGETS:
        path = os.path.join(root, name)
        if not os.path.exists(path):
            print('  %-14s missing, skipped' % name)
            continue
        text = io.open(path, encoding='utf-8').read()
        n = text.count(PLACEHOLDER)
        if n:
            text = text.replace(PLACEHOLDER, url)
            touched += 1
            total += n
        # keep the sitemap's date honest whenever this is run
        if name == 'sitemap.xml':
            text = re.sub(r'<lastmod>\d{4}-\d{2}-\d{2}</lastmod>',
                          '<lastmod>%s</lastmod>' % date.today().isoformat(), text)
        io.open(path, 'w', encoding='utf-8').write(text)
        print('  %-14s %s' % (name, ('%d address%s written' % (n, '' if n == 1 else 'es'))
                              if n else 'already done, nothing to change'))

    if not a.no_htaccess:
        print('  %-14s %s' % ('.htaccess', set_htaccess(os.path.join(root, '.htaccess'), is_www)))

    print()
    if total:
        print('Done. %d address%s written across %d file%s.'
              % (total, '' if total == 1 else 'es', touched, '' if touched == 1 else 's'))
        print('Upload the folder now. Nothing else needs changing.')
    else:
        print('Nothing to do: no %s was left anywhere.' % PLACEHOLDER)
        print('That usually means this has already been run. That is fine.')


if __name__ == '__main__':
    main()
