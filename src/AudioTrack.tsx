import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

export const AudioTrack: React.FC = () => {
  return (
    <>
      {/* 1. MASTER TAMIL VOICEOVER (Crisp, clean, no BGM interference) */}
      <Audio src={staticFile("audio/voiceover.wav")} volume={1.0} />

      {/* 2. ATMOSPHERIC STORYTELLING SFX (Subtle nature ambiance) */}
      
      {/* Dusk Wind Breeze at Outskirts (f=0) */}
      <Sequence from={0} durationInFrames={100}>
        <Audio src={staticFile("audio/sfx/nature_breeze.wav")} volume={0.12} />
      </Sequence>

      {/* Village Evening Crickets under Tree (f=114) */}
      <Sequence from={114} durationInFrames={120}>
        <Audio src={staticFile("audio/sfx/crickets_ambient.wav")} volume={0.08} />
      </Sequence>

      {/* Distant Temple Bell Chime on Anjali's Diary Promise (f=240) */}
      <Sequence from={240} durationInFrames={96}>
        <Audio src={staticFile("audio/sfx/temple_bell.wav")} volume={0.14} />
      </Sequence>

      {/* Vintage Ambassador Car Rolling to a Stop with Headlights (f=540) */}
      <Sequence from={540} durationInFrames={108}>
        <Audio src={staticFile("audio/sfx/vintage_car_stop.wav")} volume={0.18} />
      </Sequence>

      {/* Petrichor Rain & Leaves Wind (f=648) */}
      <Sequence from={648} durationInFrames={96}>
        <Audio src={staticFile("audio/sfx/nature_breeze.wav")} volume={0.12} />
      </Sequence>

      {/* Soft Diary Parchment Rustle on Final Page (f=1014) */}
      <Sequence from={1014} durationInFrames={60}>
        <Audio src={staticFile("audio/sfx/page_turn_soft.wav")} volume={0.14} />
      </Sequence>

      {/* Gentle Pond Water Ripple in Village Flashback (f=1374) */}
      <Sequence from={1374} durationInFrames={90}>
        <Audio src={staticFile("audio/sfx/water_ripple.wav")} volume={0.12} />
      </Sequence>

      {/* Sweet Romantic Shimmer as Anjali Smiles with Purple Flower (f=1665) */}
      <Sequence from={1665} durationInFrames={90}>
        <Audio src={staticFile("audio/sfx/flower_shimmer.wav")} volume={0.14} />
      </Sequence>
    </>
  );
};
