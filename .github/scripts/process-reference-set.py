import hashlib,json,os,re,subprocess,sys,tempfile
from pathlib import Path
from PIL import Image,ImageOps

def main():
 incoming,manifest,out=map(Path,sys.argv[1:4]); event=json.loads(Path(sys.argv[4]).read_text()); body=event["issue"].get("body") or ""
 slug=os.environ["REFERENCE_SLUG"]; issue=os.environ["ISSUE_URL"]
 items=json.loads(manifest.read_text())["attachments"]; out.mkdir(parents=True,exist_ok=True)
 fields={"TAKE":"","IGNORE":"","MOTION":"","SOURCE":""}; desc={}
 for line in body.splitlines():
  line=re.sub(r"<[^>]+>","",line).strip()
  m=re.match(r"^(TAKE|IGNORE|MOTION(?:/PACING)?|SOURCE):\s*(.*)$",line,re.I)
  if m: fields["MOTION" if m[1].upper().startswith("MOTION") else m[1].upper()]=m[2].strip()
  m=re.match(r"^FRAME\s*(\d+):\s*(.*)$",line,re.I)
  if m: desc[int(m[1])]=m[2].strip()
 candidates=[]
 with tempfile.TemporaryDirectory() as td:
  td=Path(td)
  for n,item in enumerate(items,1):
   src=Path(sys.argv[1])/item["filename"]
   if item["kind"]=="image": candidates.append((src,f"Image attachment {n}"))
   else:
    d=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1",str(src)],text=True))
    for j in range(6):
     frame=td/f"v{n}-{j}.png"; t=d*(j+1)/7
     subprocess.run(["ffmpeg","-loglevel","error","-ss",str(t),"-i",str(src),"-frames:v","1","-y",str(frame)],check=True)
     if frame.exists(): candidates.append((frame,f"Video {n}, extracted frame {j+1}"))
  if len(candidates)>6:
   candidates=[candidates[round(i*(len(candidates)-1)/5)] for i in range(6)]
  frames=[]
  for i,(src,note) in enumerate(candidates,1):
   with Image.open(src) as im:
    im=ImageOps.exif_transpose(im)
    if im.width>1280: im=im.resize((1280,round(im.height*1280/im.width)),Image.Resampling.LANCZOS)
    if "A" in im.getbands() or "transparency" in im.info:
     im=im.convert("RGBA"); dest=out/f"frame-{i:02}.png"; im.save(dest,optimize=True)
    else:
     im=im.convert("RGB"); dest=out/f"frame-{i:02}.jpg"
     for q in (90,84,78,72,66,60):
      im.save(dest,quality=q,optimize=True,progressive=True)
      if dest.stat().st_size<=800*1024: break
    with Image.open(dest) as check: w,h=check.size
   data=dest.read_bytes()
   frames.append({"name":dest.name,"bytes":len(data),"sha256":hashlib.sha256(data).hexdigest(),"source":note,"description":desc.get(i,"Visual description not supplied; inspect this frame."),"width":w,"height":h})
 lines=[f"# Reference set: {slug}","",f"- Source issue: {issue}",f"- Source attachments: {len(items)}",f"- Prepared frames: {len(frames)}","- Images resized to 1280 px wide max; videos sampled at evenly spaced timestamps; source videos are not retained.","","## What to take",fields["TAKE"] or "Not specified.","","## What to ignore",fields["IGNORE"] or "Not specified.","","## Motion and pacing",fields["MOTION"] or "Not specified.","","## Source",fields["SOURCE"] or f"User-provided media attached to {issue}.","","## Frames"]
 for f in frames:
  lines += [f"### {f['name']}",f"- Visible content: {f['description']}",f"- Source: {f['source']}",f"- Dimensions: {f['width']} × {f['height']}",f"- Size: {f['bytes']} bytes",f"- SHA-256: `{f['sha256']}`",""]
 (out/"notes.md").write_text("\n".join(lines)+"\n")
 (out/"upload-summary.json").write_text(json.dumps({"slug":slug,"frames":frames},indent=2))
if __name__=="__main__": main()
