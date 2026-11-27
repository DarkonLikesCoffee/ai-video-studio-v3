import React from "react";
import {Audio, interpolate, Sequence, useCurrentFrame, useVideoConfig} from "remotion";

export type AudioInterval = {startSeconds:number; endSeconds:number};
export type AudioTrack = {src:string; volume?:number; fadeInFrames?:number; fadeOutFrames?:number};
export type SoundEffectCue = {id:string; src:string; startSeconds:number; volume?:number};
export type AudioSystemProps = {
  narration?:AudioTrack;
  music?:AudioTrack;
  sfx?:readonly SoundEffectCue[];
  sfxVolume?:number;
  speechIntervals?:readonly AudioInterval[];
  musicDucking?:{enabled?:boolean; targetVolume?:number; fadeFrames?:number};
};
const clampVolume=(value:number)=>Math.max(0,Math.min(1,value));
const trackFade=(frame:number,duration:number,fadeIn:number,fadeOut:number)=>{
  const incoming=fadeIn>0?interpolate(frame,[0,fadeIn],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}):1;
  const outgoing=fadeOut>0?interpolate(frame,[Math.max(0,duration-fadeOut),duration],[1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}):1;
  return Math.min(incoming,outgoing);
};
const duckingEnvelope=(frame:number,fps:number,intervals:readonly AudioInterval[],target:number,fade:number)=>{
  let envelope=1;
  for(const interval of intervals){
    const start=Math.max(0,interval.startSeconds*fps), end=Math.max(start,interval.endSeconds*fps);
    const fadeStart=Math.max(0,start-fade), fadeEnd=end+fade;
    let candidate=1;
    if(frame>=fadeStart&&frame<start&&fade>0) candidate=interpolate(frame,[fadeStart,start],[1,target],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
    else if(frame>=start&&frame<=end) candidate=target;
    else if(frame>end&&frame<=fadeEnd&&fade>0) candidate=interpolate(frame,[end,fadeEnd],[target,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
    envelope=Math.min(envelope,candidate);
  }
  return envelope;
};
/** Shared mixer for narration, ducked music, and independently scheduled SFX. */
export const AudioSystem:React.FC<AudioSystemProps>=({narration,music,sfx=[],sfxVolume=1,speechIntervals=[],musicDucking})=>{
  const frame=useCurrentFrame();
  const {durationInFrames,fps}=useVideoConfig();
  const narrationVolume=narration?clampVolume(narration.volume??1)*trackFade(frame,durationInFrames,narration.fadeInFrames??0,narration.fadeOutFrames??0):0;
  const musicBase=music?clampVolume(music.volume??0.25)*trackFade(frame,durationInFrames,music.fadeInFrames??0,music.fadeOutFrames??0):0;
  const ducking=musicDucking?.enabled===true&&speechIntervals.length>0?duckingEnvelope(frame,fps,speechIntervals,clampVolume(musicDucking.targetVolume??0.3),Math.max(0,musicDucking.fadeFrames??9)):1;
  return <>
    {narration?<Audio src={narration.src} volume={narrationVolume}/>:null}
    {music?<Audio src={music.src} volume={musicBase*ducking}/>:null}
    {sfx.map(cue=><Sequence key={cue.id} from={Math.max(0,Math.round(cue.startSeconds*fps))}><Audio src={cue.src} volume={clampVolume(cue.volume??1)*clampVolume(sfxVolume)}/></Sequence>)}
  </>;
};
