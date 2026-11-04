import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { VillageLandscapeFlashback, AnjaliCharacterDetailed, TamilStorySubtitle } from "../StoryComponents";

export const Scene15_AnjaliPurpleFlowerSmile: React.FC = () => {
  const f = useCurrentFrame();
  const pushIn = interpolate(f, [0, 75], [1.1, 1.25]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", transform: `scale(${pushIn})` }}>
      <VillageLandscapeFlashback />
      <AnjaliCharacterDetailed x={960} y={640} scale={1.5} pose="stand" />
      <TamilStorySubtitle
        text="அவ தலையில எப்பவும் ஒரு ஊதாப்பூ இருக்கும். அவ சிரிச்சா அந்த ஊரே வெளிச்சமா மாறும்."
        keyword="ஊரே வெளிச்சமா மாறும்"
      />
    </AbsoluteFill>
  );
};
