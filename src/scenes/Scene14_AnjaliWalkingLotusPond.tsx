import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { VillageLandscapeFlashback, AnjaliCharacterDetailed, TamilStorySubtitle } from "../StoryComponents";

export const Scene14_AnjaliWalkingLotusPond: React.FC = () => {
  const f = useCurrentFrame();
  const walkX = interpolate(f, [0, 90], [1300, 960]);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <VillageLandscapeFlashback />
      <AnjaliCharacterDetailed x={walkX} y={620} scale={1.15} pose="walk" />
      <TamilStorySubtitle
        text="அவ ஊர் பெரிய பண்ணையாரோட ஒரே பொண்ணு. எப்பவும் துறுதுறுன்னு இருப்பா."
        keyword="பண்ணையாரோட ஒரே பொண்ணு"
      />
    </AbsoluteFill>
  );
};
