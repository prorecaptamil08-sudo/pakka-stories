import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { DiaryMacroLastPage, TamilStorySubtitle } from "../StoryComponents";

export const Scene10_FearOfLastPage: React.FC = () => {
  const f = useCurrentFrame();
  const pushIn = interpolate(f, [0, 171], [1.1, 1.22]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", transform: `scale(${pushIn})` }}>
      <DiaryMacroLastPage hesitating={true} />
      <TamilStorySubtitle
        text="ஏன்னா... அந்த கடைசி பக்கத்தைப் படிச்சா, அவளோட நெனப்பு முழுசா முடிஞ்சுடும்னு அவனுக்கு ஒரு பயம்."
        keyword="ஒரு பயம்"
      />
    </AbsoluteFill>
  );
};
