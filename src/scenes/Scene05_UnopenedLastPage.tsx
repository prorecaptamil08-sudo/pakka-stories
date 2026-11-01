import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { DiaryMacroLastPage, TamilStorySubtitle } from "../StoryComponents";

export const Scene05_UnopenedLastPage: React.FC = () => {
  const f = useCurrentFrame();
  const pushIn = interpolate(f, [0, 96], [1, 1.06]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", transform: `scale(${pushIn})` }}>
      <DiaryMacroLastPage hesitating={false} />
      <TamilStorySubtitle
        text="அதோட கடைசி பக்கத்தை அவன் திறக்கவே இல்ல."
        keyword="திறக்கவே இல்ல"
      />
    </AbsoluteFill>
  );
};
