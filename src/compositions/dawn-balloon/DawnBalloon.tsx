import React from "react";
import {AbsoluteFill, staticFile} from "remotion";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {AudioSystem} from "../../shared/audio/AudioSystem";
import {narrationWords, speechIntervals} from "../../generated/narration-alignment";
import {dawnBalloonSfx} from "../../generated/dawn-balloon-sfx";
import {ValleyLiftOff, SideDrift, CloudRise} from "./Scenes";

export const DawnBalloon:React.FC=()=>{
  const hasNarration=narrationWords.length>0;
  return <AbsoluteFill style={{background:"#8296ac"}}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={210}><ValleyLiftOff/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:18})}/>
      <TransitionSeries.Sequence durationInFrames={210}><SideDrift/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:18})}/>
      <TransitionSeries.Sequence durationInFrames={216}><CloudRise/></TransitionSeries.Sequence>
    </TransitionSeries>
    <AudioSystem
      {...(hasNarration?{narration:{src:staticFile("audio/narration.wav"),volume:1,fadeInFrames:6,fadeOutFrames:15}}:{})}
      music={{src:staticFile("audio/ambient.wav"),volume:1,fadeInFrames:30,fadeOutFrames:60}}
      sfx={dawnBalloonSfx.map(cue=>({...cue,src:staticFile(cue.src.replace(/^\//,""))}))}
      sfxVolume={1}
      speechIntervals={speechIntervals}
      musicDucking={{enabled:hasNarration,targetVolume:0.25,fadeFrames:9}}
    />
  </AbsoluteFill>;
};
