from PIL import Image, ImageFilter
from collections import deque
import os, json

SRC = "uploads/exploded.png"
OUT = "cutouts/layers"
os.makedirs(OUT, exist_ok=True)

im = Image.open(SRC).convert("RGBA")
W, H = im.size

# 1. drop the title, the labels and the leader lines that sit above the parts
TOP = 150
im = im.crop((0, TOP, W, H))
W, H = im.size

# 2. remove the white ground by flood fill from the border
px = im.load()
seen = bytearray(W*H); q = deque()
def bg(x,y):
    r,g,b,a = px[x,y]
    return min(r,g,b) >= 226 and (max(r,g,b)-min(r,g,b)) <= 18
for x in range(W):
    for y in (0,H-1):
        if not seen[y*W+x] and bg(x,y): seen[y*W+x]=1; q.append((x,y))
for y in range(H):
    for x in (0,W-1):
        if not seen[y*W+x] and bg(x,y): seen[y*W+x]=1; q.append((x,y))
while q:
    x,y = q.popleft()
    for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
        nx,ny = x+dx, y+dy
        if 0<=nx<W and 0<=ny<H and not seen[ny*W+nx] and bg(nx,ny):
            seen[ny*W+nx]=1; q.append((nx,ny))
for y in range(H):
    base=y*W
    for x in range(W):
        if seen[base+x]:
            r,g,b,_ = px[x,y]; px[x,y]=(r,g,b,0)
a = im.getchannel("A").filter(ImageFilter.GaussianBlur(0.5))
im.putalpha(a)

# 3. find the vertical gaps between parts: columns that are entirely transparent
alpha = im.getchannel("A")
cols = [max(alpha.crop((x,0,x+1,H)).getdata()) for x in range(W)]
runs=[]; s=None
for x,v in enumerate(cols):
    if v < 12:
        if s is None: s=x
    else:
        if s is not None: runs.append((s,x)); s=None
if s is not None: runs.append((s,W))
gaps = [r for r in runs if r[1]-r[0] >= 4]

# 4. the spans between gaps are the parts
spans=[]; prev=0
for g0,g1 in gaps:
    if g0-prev > 24: spans.append((prev,g0))
    prev=g1
if W-prev > 24: spans.append((prev,W))

print(f"cropped to {W}x{H}; found {len(spans)} parts")
meta=[]
for i,(x0,x1) in enumerate(spans):
    part = im.crop((x0,0,x1,H))
    bb = part.getbbox()
    if not bb: continue
    part = part.crop(bb)
    name = f"layer-{i+1}.png"
    part.save(os.path.join(OUT,name))
    meta.append({"file":name,"x0":x0+bb[0],"x1":x0+bb[2],"y0":bb[1],"y1":bb[3],
                 "w":part.width,"h":part.height})
    print(f"  {name}  {part.width}x{part.height}  at x {x0+bb[0]}..{x0+bb[2]}")
json.dump({"canvas":[W,H],"parts":meta}, open(os.path.join(OUT,"layout.json"),"w"), indent=1)
