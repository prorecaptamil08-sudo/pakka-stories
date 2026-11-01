import React from "react";
import { AbsoluteFill } from "remotion";
import { VillageLandscapeFlashback, YoungKathirRugged, TamilStorySubtitle } from "../StoryComponents";

export const Scene12_YoungRuggedKathir: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <VillageLandscapeFlashback />
      <YoungKathirRugged x={960} y={640} scale={1.15} pose="mustache" />
      <TamilStorySubtitle
        text="கதிர் எப்பவுமே கொஞ்சம் முரட்டுப் பய. ஊர்ல யாருக்கும் வளைஞ்சு கொடுக்க மாட்டான்."
        keyword="முரட்டுப் பய"
      />
    </AbsoluteFill>
  );
};
