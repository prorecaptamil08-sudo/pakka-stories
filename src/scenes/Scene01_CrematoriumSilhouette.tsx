import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { CrematoriumDuskBackground, TamilStorySubtitle } from "../StoryComponents";

export const Scene01_CrematoriumSilhouette: React.FC = () => {
  const f = useCurrentFrame();
  const pushIn = interpolate(f, [0, 114], [1, 1.08]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", transform: `scale(${pushIn})` }}>
      <CrematoriumDuskBackground />
      <TamilStorySubtitle
        text="சுடுகாட்டுக்குப் போனவ திரும்பி வருவாளா?"
        keyword="திரும்பி வருவாளா?"
      />
    </AbsoluteFill>
  );
};
