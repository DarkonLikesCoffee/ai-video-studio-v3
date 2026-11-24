import {mkdir} from "node:fs/promises";
import {spawnSync} from "node:child_process";
const [id]=process.argv.slice(2);
if(!id){console.error("Usage: npm run render -- <CompositionId>");process.exit(1);}
await mkdir("out",{recursive:true});
const args=["remotion","render","src/index.ts",id,`out/${id}.mp4`];
if(process.env.CI) args.push("--gl=swangle");
const result=spawnSync("npx",args,{stdio:"inherit"});
process.exit(result.status??1);
