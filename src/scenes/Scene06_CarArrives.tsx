import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { BanyanTreeEnvironment, OlderKathirSitting, TamilStorySubtitle } from "../StoryComponents";

export const Scene06_CarArrives: React.FC = () => {
  const f = useCurrentFrame();
  const shake = interpolate(f, [30, 60], [0, 2], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", transform: `translateY(${Math.sin(f * 2) * shake}px)` }}>
      <BanyanTreeEnvironment showCar={true} carFrame={10} />
      <OlderKathirSitting x={520} y={640} scale={1.15} />
      <TamilStorySubtitle
        text="ஆனா அன்னைக்கு, அவன் பின்னாடி ஒரு கார் வந்து நின்னுச்சு."
        keyword="ஒரு கார் வந்து நின்னுச்சு"
      />
    </AbsoluteFill>
  );
};
