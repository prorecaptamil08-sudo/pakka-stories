import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { BanyanTreeEnvironment, OlderKathirSitting, TamilStorySubtitle } from "../StoryComponents";

export const Scene04_TwentyYearWait: React.FC = () => {
  const f = useCurrentFrame();
  const skyLight = interpolate(f, [0, 54, 108], [0.85, 1.15, 0.85]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", filter: `brightness(${skyLight})` }}>
      <BanyanTreeEnvironment />
      <OlderKathirSitting x={520} y={640} scale={1.15} />
      <TamilStorySubtitle
        text="இருபது வருஷமா அந்த டைரியை நெஞ்சோட வெச்சுக்கிட்டு உக்காந்திருந்தான் கதிர்."
        keyword="இருபது வருஷமா"
      />
    </AbsoluteFill>
  );
};
