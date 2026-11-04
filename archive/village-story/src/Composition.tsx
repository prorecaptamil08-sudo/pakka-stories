import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { AudioTrack } from "./AudioTrack";
import { C, SCENE_BOUNDARIES } from "./theme";

import { Scene01_CrematoriumSilhouette } from "./scenes/Scene01_CrematoriumSilhouette";
import { Scene02_OlderKathirWait } from "./scenes/Scene02_OlderKathirWait";
import { Scene03_HandsGivingDiary } from "./scenes/Scene03_HandsGivingDiary";
import { Scene04_TwentyYearWait } from "./scenes/Scene04_TwentyYearWait";
import { Scene05_UnopenedLastPage } from "./scenes/Scene05_UnopenedLastPage";
import { Scene06_CarArrives } from "./scenes/Scene06_CarArrives";
import { Scene07_WetEarthFragrance } from "./scenes/Scene07_WetEarthFragrance";
import { Scene08_BanyanRootsEarth } from "./scenes/Scene08_BanyanRootsEarth";
import { Scene09_DriedPurpleFlowerMacro } from "./scenes/Scene09_DriedPurpleFlowerMacro";
import { Scene10_FearOfLastPage } from "./scenes/Scene10_FearOfLastPage";
import { Scene11_VillageFlashbackTransition } from "./scenes/Scene11_VillageFlashbackTransition";
import { Scene12_YoungRuggedKathir } from "./scenes/Scene12_YoungRuggedKathir";
import { Scene13_KathirShySmile } from "./scenes/Scene13_KathirShySmile";
import { Scene14_AnjaliWalkingLotusPond } from "./scenes/Scene14_AnjaliWalkingLotusPond";
import { Scene15_AnjaliPurpleFlowerSmile } from "./scenes/Scene15_AnjaliPurpleFlowerSmile";

const SCENES = [
  Scene01_CrematoriumSilhouette,
  Scene02_OlderKathirWait,
  Scene03_HandsGivingDiary,
  Scene04_TwentyYearWait,
  Scene05_UnopenedLastPage,
  Scene06_CarArrives,
  Scene07_WetEarthFragrance,
  Scene08_BanyanRootsEarth,
  Scene09_DriedPurpleFlowerMacro,
  Scene10_FearOfLastPage,
  Scene11_VillageFlashbackTransition,
  Scene12_YoungRuggedKathir,
  Scene13_KathirShySmile,
  Scene14_AnjaliWalkingLotusPond,
  Scene15_AnjaliPurpleFlowerSmile,
];

export const PakkaStoriesAnjali: React.FC = () => (
  <AbsoluteFill style={{ background: C.duskSky, overflow: "hidden" }}>
    {/* 15 Dynamic Story Beats (Every 3-5 seconds visual cut matching Tamil narration) */}
    {SCENES.map((Scene, i) => (
      <Sequence
        key={i}
        from={SCENE_BOUNDARIES[i]}
        durationInFrames={SCENE_BOUNDARIES[i + 1] - SCENE_BOUNDARIES[i]}
      >
        <Scene />
      </Sequence>
    ))}

    {/* Master Audio Track (Voiceover + Soulful Village Flute BGM + Atmospheric SFX) */}
    <AudioTrack />
  </AbsoluteFill>
);
