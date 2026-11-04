import React from "react";
import { AbsoluteFill } from "remotion";
import { AnjaliHandsGivingDiary, TamilStorySubtitle } from "../StoryComponents";

export const Scene03_HandsGivingDiary: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AnjaliHandsGivingDiary />
      <TamilStorySubtitle
        text="தன் டைரியை அவன்கிட்ட குடுத்து அனுப்புனா: 'இதை பத்திரமா வெச்சுக்கோ, நான் வந்து கேப்பேன்'."
        keyword="பத்திரமா வெச்சுக்கோ"
      />
    </AbsoluteFill>
  );
};
