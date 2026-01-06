"use client";

import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { EffectComposer, Pixelation } from "@react-three/postprocessing";

type PostProcessingProps = {};

export const PostProcessing = ({}: PostProcessingProps) => {
  return (
    <>
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <EffectComposer autoClear={false}>
        <Pixelation granularity={3} />
      </EffectComposer>
    </>
  );
};

