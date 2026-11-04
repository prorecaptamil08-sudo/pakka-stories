import React from "react";
import { AbsoluteFill } from "remotion";
import { VillageLandscapeFlashback, YoungKathirRugged, TamilStorySubtitle } from "../StoryComponents";

export const Scene13_KathirShySmile: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <VillageLandscapeFlashback />
      <YoungKathirRugged x={960} y={640} scale={1.15} pose="shy" />
      <TamilStorySubtitle
        text="ஆனா அஞ்சலி முன்னாடி மட்டும் அவனுக்குக் கோபமே வராது."
        keyword="கோபமே வராது"
      />
    </AbsoluteFill>
  );
};
