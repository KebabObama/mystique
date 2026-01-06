import { create } from "zustand";
import { persist } from "zustand/middleware";

type CameraState = {
  camera: {
    target: [number, number, number];
    distance: number;
    azimuth: number;
    elevation: number;
  };
  setCameraTarget: (target: [number, number, number]) => void;
  setCameraDistance: (distance: number) => void;
  setCameraAzimuth: (azimuth: number) => void;
  setCameraElevation: (elevation: number) => void;
  resetCamera: () => void;
  updateCamera: (updates: CameraState["camera"]) => void;
};

const INITIAL_CAMERA_STATE: CameraState["camera"] = {
  target: [0, 0, 0],
  distance: 3,
  azimuth: 0,
  elevation: Math.PI / 4,
};

// prettier-ignore
export const useCamera = create<CameraState>()(
  persist(
    (set) => ({
      camera: INITIAL_CAMERA_STATE,
      setCameraTarget:    (target   ) => set((state) => ({ camera: { ...state.camera, target     } })),
      setCameraDistance:  (distance ) => set((state) => ({ camera: { ...state.camera, distance   } })),
      setCameraAzimuth:   (azimuth  ) => set((state) => ({ camera: { ...state.camera, azimuth    } })),
      setCameraElevation: (elevation) => set((state) => ({ camera: { ...state.camera, elevation  } })),
      updateCamera:       (updates  ) => set((state) => ({ camera: { ...state.camera, ...updates } })),
      resetCamera:        (         ) => set({ camera: INITIAL_CAMERA_STATE }),
    }),
    { name: "game-storage", partialize: (state) => ({ camera: state.camera }) }
  )
);

