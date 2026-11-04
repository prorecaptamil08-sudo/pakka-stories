import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { PetrichorMistEnvironment, TamilStorySubtitle } from "../StoryComponents";

export const Scene07_WetEarthFragrance: React.FC = () => {
  const f = useCurrentFrame();
  const pushIn = interpolate(f, [0, 96], [1, 1.08]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", transform: `scale(${pushIn})` }}>
      <PetrichorMistEnvironment />
      <TamilStorySubtitle
        text="ஈர மண்ணோட வாசம் அந்த காத்துல கலந்து வீசுச்சு."
        keyword="ஈர மண்ணோட வாசம்"
      />
    </AbsoluteFill>
  );
};
