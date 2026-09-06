from PIL import Image, ImageFilter
from collections import deque
import os, json

im = Image.open("uploads/exploded.png").convert("RGBA")
im = im.crop((0,150,im.width,im.height))
W,H = im.size

px = im.load(); seen = bytearray(W*H); q = deque()
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
    x,y=q.popleft()
    for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
        nx,ny=x+dx,y+dy
        if 0<=nx<W and 0<=ny<H and not seen[ny*W+nx] and bg(nx,ny):
            seen[ny*W+nx]=1; q.append((nx,ny))
for y in range(H):
    b0=y*W
    for x in range(W):
        if seen[b0+x]:
            r,g,bb,_=px[x,y]; px[x,y]=(r,g,bb,0)
im.putalpha(im.getchannel("A").filter(ImageFilter.GaussianBlur(0.5)))

CUTS = [(38,336,"glass"),(336,512,"touch"),(512,700,"lcd"),
        (700,895,"pcb"),(895,995,"power"),(995,1206,"housing"),(1206,1372,"bracket")]
NAMES = {"glass":"Tempered glass touch screen","touch":"Capacitive touch panel",
         "lcd":"LCD display","pcb":"Main board","power":"Power supply board",
         "housing":"Back housing","bracket":"Wall mount bracket"}
os.makedirs("cutouts/layers", exist_ok=True)
meta=[]
for x0,x1,key in CUTS:
    part = im.crop((x0,0,x1,H))
    bbx = part.getbbox()
    if not bbx: print("  EMPTY", key); continue
    part = part.crop(bbx)
    part.save(f"cutouts/layers/{key}.png")
    meta.append({"key":key,"label":NAMES[key],
                 "cx":round(((x0+bbx[0])+(x0+bbx[2]))/2/W,5),   # centre as a fraction of canvas
                 "cy":round((bbx[1]+bbx[3])/2/H,5),
                 "w":round(part.width/W,5),"h":round(part.height/H,5)})
    print(f"  {key:<8} {part.width:>4}x{part.height:<4} centre x {meta[-1]['cx']:.3f}")
json.dump({"canvas":[W,H],"parts":meta}, open("cutouts/layers/layout.json","w"), indent=1)

# contact sheet on black to check every cut
CW,CH,P=200,420,10
sheet=Image.new("RGB",(CW*len(meta),CH),(10,9,8))
for i,m in enumerate(meta):
    t=Image.open(f"cutouts/layers/{m['key']}.png").convert("RGBA")
    t.thumbnail((CW-2*P,CH-2*P), Image.LANCZOS)
    sheet.paste(t,(i*CW+(CW-t.width)//2,(CH-t.height)//2),t)
sheet.save("audit/layers-check.png")
