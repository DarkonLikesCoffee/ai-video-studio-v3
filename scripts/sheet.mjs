import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
import {selectComposition, renderStill} from "@remotion/renderer";
import {bundle} from "@remotion/bundler";

const [id]=process.argv.slice(2);
if(!id){console.error("Usage: npm run sheet -- <CompositionId>");process.exit(1);}
const serveUrl=await bundle({entryPoint:"src/index.ts"});
const composition=await selectComposition({serveUrl,id});
const fps=composition.fps;
const totalFrames=composition.durationInFrames;
const frames=Array.from({length:Math.ceil(totalFrames/fps)},(_,i)=>i*fps).filter(f=>f<totalFrames);
const output=path.join("out","review",id,"contact-sheet");
await mkdir(output,{recursive:true});
for(const frame of frames){
 const filename=path.join(output,`frame-${String(frame).padStart(5,"0")}.jpeg`);
 await renderStill({serveUrl,composition,output:filename,frame,imageFormat:"jpeg",chromiumOptions:process.env.CI ? {gl:"swangle"} : {}});
}
const images=frames.map(f=>`frame-${String(f).padStart(5,"0")}.jpeg`);
const html=`<!doctype html><meta charset="utf-8"><title>${id} contact sheet</title><style>body{margin:20px;background:#10141a;color:#eee;font:13px system-ui;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}figure{margin:0}img{display:block;width:100%;height:auto;background:#252a33}figcaption{padding:6px}</style>${images.map(f=>`<figure><img src="${f}"><figcaption>${f}</figcaption></figure>`).join("")}`;
await writeFile(path.join(output,"index.html"),html);
console.log(path.join(output,"index.html"));
