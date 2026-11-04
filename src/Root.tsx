import React from 'react';
import {Composition} from 'remotion';
import episodeJson from '../episode/episode.json';
import {EpisodeMaster} from './EpisodeMaster';
import type {Episode} from './types';

const episode = episodeJson as unknown as Episode;

export const RemotionRoot: React.FC = () => (
  <Composition
    id="AwakenEpisode"
    component={EpisodeMaster}
    durationInFrames={episode.durationInFrames}
    fps={episode.fps}
    width={episode.width}
    height={episode.height}
    defaultProps={{episode}}
  />
);
