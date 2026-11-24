import {mkdir} from "node:fs/promises";
import {spawnSync} from "node:child_process";
import path from "node:path";
const [id,frames] = process.argv.slice(2);
if (!id || !frames || !/^[0-9,\-]+$/.test(frames)) {
  console.error("Usage: npm run still -- <CompositionId> <frame,frame,...>");
  process.exit(1);
}
const round = process.env.REVIEW_ROUND || "latest";
const output = path.join("out","review",id,round);
await mkdir(output,{recursive:true});
const args = ["remotion","render","src/index.ts",id,output,`--frames=${frames}`,"--image-format=png","--sequence"];
if (process.env.CI) args.push("--gl=swangle");
const result = spawnSync("npx",args,{stdio:"inherit"});
process.exit(result.status ?? 1);
