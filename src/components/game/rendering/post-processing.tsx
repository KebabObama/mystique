"use client";

import { AdaptiveEvents } from "@react-three/drei";
import { EffectComposer, Pixelation } from "@react-three/postprocessing";

type PostProcessingProps = {};

/** Renders the post processing component. */
export const PostProcessing = ({}: PostProcessingProps) => {
  return (
    <>
      <directionalLight position={[0, 10, 0]} intensity={0.9} />
      <directionalLight position={[12, 6, 0]} intensity={0.45} />
      <directionalLight position={[-12, 6, 0]} intensity={0.45} />
      <ambientLight position={[0, 10, 0]} intensity={0.25} />
      <AdaptiveEvents />
      <EffectComposer autoClear={false}>
        <Pixelation granularity={3} />
      </EffectComposer>
    </>
  );
};
