import {mkdir,writeFile} from "node:fs/promises";
import {dirname} from "node:path";

const sampleRate=48000;
const duration=20;
const frames=sampleRate*duration;
const channels=2;
const dataBytes=frames*channels*2;
const buffer=Buffer.alloc(44+dataBytes);
buffer.write("RIFF",0);buffer.writeUInt32LE(36+dataBytes,4);buffer.write("WAVE",8);
buffer.write("fmt ",12);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);
buffer.writeUInt16LE(channels,22);buffer.writeUInt32LE(sampleRate,24);
buffer.writeUInt32LE(sampleRate*channels*2,28);buffer.writeUInt16LE(channels*2,32);
buffer.writeUInt16LE(16,34);buffer.write("data",36);buffer.writeUInt32LE(dataBytes,40);
const clamp=x=>Math.max(-1,Math.min(1,x));
let stateL=0,stateR=0;
for(let i=0;i<frames;i++){
 const t=i/sampleRate;
 const fadeIn=Math.min(1,t/.7);
 const fadeOut=Math.min(1,(duration-t)/1.1);
 const windNoise=(Math.random()*2-1);
 const windCut=(Math.sin(t*2*Math.PI*.17)+Math.sin(t*2*Math.PI*.071))*.5;
 stateL=stateL*.965+windNoise*.035;
 stateR=stateR*.965+(Math.random()*2-1)*.035;
 const wind=(stateL+stateR)*.32*fadeIn*fadeOut*(.62+.18*windCut);
 const drone=(Math.sin(2*Math.PI*55*t)+.46*Math.sin(2*Math.PI*82.4*t)+.22*Math.sin(2*Math.PI*110*t))*0.075;
 const pad=(Math.sin(2*Math.PI*174.6*t)+Math.sin(2*Math.PI*220*t)*.5)*.018;
 const hissEnvelope=Math.exp(-Math.pow((t-3.15)/1.05,2))*.15;
 const hissNoise=(Math.random()*2-1)*hissEnvelope;
 const left=clamp((wind+drone+pad+hissNoise)*fadeIn*fadeOut);
 const right=clamp((wind+drone*.97+pad*.98+hissNoise*.93)*fadeIn*fadeOut);
 buffer.writeInt16LE(Math.round(left*32767),44+i*4);
 buffer.writeInt16LE(Math.round(right*32767),46+i*4);
}
const output="public/audio/ambient.wav";
await mkdir(dirname(output),{recursive:true});
await writeFile(output,buffer);
console.log(`Wrote ${output}: ${duration}s stereo PCM, ${sampleRate} Hz`);
