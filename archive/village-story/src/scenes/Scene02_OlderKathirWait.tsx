import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { BanyanTreeEnvironment, OlderKathirSitting, TamilStorySubtitle } from "../StoryComponents";

export const Scene02_OlderKathirWait: React.FC = () => {
  const f = useCurrentFrame();
  const panX = interpolate(f, [0, 126], [-20, 20]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", transform: `translateX(${panX}px)` }}>
      <BanyanTreeEnvironment />
      <OlderKathirSitting x={520} y={640} scale={1.15} />
      <TamilStorySubtitle
        text="கதிர் காத்துக்கிட்டு இருந்தான். ஊரே செத்துட்டான்னு சொன்ன அஞ்சலி..."
        keyword="காத்துக்கிட்டு இருந்தான்"
      />
    </AbsoluteFill>
  );
};
