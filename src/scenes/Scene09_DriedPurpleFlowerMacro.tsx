import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { DiaryMacroLastPage, TamilStorySubtitle } from "../StoryComponents";

export const Scene09_DriedPurpleFlowerMacro: React.FC = () => {
  const f = useCurrentFrame();
  const pushIn = interpolate(f, [0, 159], [1.05, 1.15]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", transform: `scale(${pushIn})` }}>
      <DiaryMacroLastPage hesitating={false} />
      <TamilStorySubtitle
        text="கதிரோட கடினமான கைகள்ல, காய்ஞ்சு போன ஒரு ஊதாப்பூவும், பழசாகிப் போன அந்த டைரியும் இருக்கு."
        keyword="காய்ஞ்சு போன ஒரு ஊதாப்பூவும்"
      />
    </AbsoluteFill>
  );
};
