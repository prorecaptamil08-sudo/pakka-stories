import React from "react";
import { AbsoluteFill } from "remotion";
import { VillageLandscapeFlashback, TamilStorySubtitle } from "../StoryComponents";

export const Scene11_VillageFlashbackTransition: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <VillageLandscapeFlashback />
      <TamilStorySubtitle
        text="ஆனா அவன் ஏன் இத்தனை வருஷம் காத்திருந்தான்? அன்னைக்கு என்ன நடந்துச்சுன்னு சொல்றேன் கேளுங்க."
        keyword="அன்னைக்கு என்ன நடந்துச்சுன்னு"
      />
    </AbsoluteFill>
  );
};
