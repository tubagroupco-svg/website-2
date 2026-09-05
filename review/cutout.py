from PIL import Image
from collections import deque
import sys, os

def cutout(src, dst, thresh=232, sat_max=26, feather=True):
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    px = im.load()
    seen = bytearray(w*h)
    q = deque()

    def bgish(x, y):
        r, g, b, a = px[x, y]
        return max(r,g,b) >= thresh and (max(r,g,b) - min(r,g,b)) <= sat_max

    for x in range(w):
        for y in (0, h-1):
            i = y*w+x
            if not seen[i] and bgish(x, y): seen[i]=1; q.append((x,y))
    for y in range(h):
        for x in (0, w-1):
            i = y*w+x
            if not seen[i] and bgish(x, y): seen[i]=1; q.append((x,y))

    while q:
        x, y = q.popleft()
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
            nx, ny = x+dx, y+dy
            if 0 <= nx < w and 0 <= ny < h:
                i = ny*w+nx
                if not seen[i] and bgish(nx, ny):
                    seen[i] = 1; q.append((nx, ny))

    for y in range(h):
        base = y*w
        for x in range(w):
            if seen[base+x]:
                r,g,b,_ = px[x,y]; px[x,y] = (r,g,b,0)

    # soften the alpha edge so it does not look cut with scissors
    if feather:
        a = im.getchannel("A")
        from PIL import ImageFilter
        a = a.filter(ImageFilter.GaussianBlur(0.6))
        im.putalpha(a)

    bbox = im.getbbox()
    if bbox: im = im.crop(bbox)
    im.save(dst)
    kept = sum(1 for i in range(w*h) if not seen[i])
    return im.size, round(100*kept/(w*h), 1)

if __name__ == "__main__":
    os.makedirs("cutouts", exist_ok=True)
    jobs = [
        ("uploads/04-4inch-panel-alexa.png", "cutouts/panel-alexa.png", 232, 26),
        ("uploads/02-door-smart-lock.png",   "cutouts/lock.png",        232, 26),
        ("uploads/09-8gang-touch.png",       "cutouts/switch-8.png",    240, 14),
        ("uploads/05-4gang-soft-touch.png",  "cutouts/switch-4.png",    242, 12),
        ("uploads/01-control-panel-big.png", "cutouts/panel-big.png",   232, 26),
        ("uploads/07-wa-344.jpg",            "cutouts/fan-dial.png",    236, 20),
    ]
    for src, dst, t, s in jobs:
        try:
            size, kept = cutout(src, dst, t, s)
            print(f"  {os.path.basename(dst):<18} {size[0]}x{size[1]}  subject kept {kept}%")
        except Exception as e:
            print(f"  FAILED {src}: {e}")
