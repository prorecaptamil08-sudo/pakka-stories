import React from "react";
import { Composition } from "remotion";
import { PakkaStoriesAnjali } from "./Composition";
import { TOTAL, FPS } from "./theme";

export const Root: React.FC = () => (
  <>
    <Composition
      id="PakkaStoriesAnjali"
      component={PakkaStoriesAnjali}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);
