import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { BanyanTreeEnvironment, TamilStorySubtitle } from "../StoryComponents";

export const Scene08_BanyanRootsEarth: React.FC = () => {
  const f = useCurrentFrame();
  const panY = interpolate(f, [0, 111], [140, -40]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", transform: `translateY(${panY}px)` }}>
      <BanyanTreeEnvironment />
      <TamilStorySubtitle
        text="அந்த ஆலமரத்து விழுதுகள் இன்னும் கொஞ்சம் கீழ எறங்கி மண்ணைத் தொட்டிருக்கு."
        keyword="ஆலமரத்து விழுதுகள்"
      />
    </AbsoluteFill>
  );
};
