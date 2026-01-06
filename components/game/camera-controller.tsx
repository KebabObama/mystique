"use client";

import { useCamera } from "@/hooks/use-camera";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const CONSTANTS = {
  MOVE_SPEED: 10,
  ROTATE_SPEED: 1.5,
  ZOOM_SPEED: 100,
  MIN_DISTANCE: 0.2,
  TARGET_Y_MIN: 0,
} as const;

export const CameraController = () => {
  const { camera: threeCamera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const { target, distance, azimuth, elevation } = useCamera((s) => s.camera);
  const setCameraAzimuth = useCamera((s) => s.setCameraAzimuth);
  const setCameraTarget = useCamera((s) => s.setCameraTarget);
  const setCameraDistance = useCamera((s) => s.setCameraDistance);
  const tempVec3 = useRef(new THREE.Vector3());
  const tempSpherical = useRef(new THREE.Spherical());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keys.current[key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keys.current[key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    tempSpherical.current.set(distance, Math.PI / 2 - elevation, azimuth);
    tempVec3.current.setFromSpherical(tempSpherical.current);
    tempVec3.current.add(new THREE.Vector3(...target));

    threeCamera.position.copy(tempVec3.current);
    threeCamera.lookAt(new THREE.Vector3(...target));
  }, [threeCamera, target, distance, azimuth, elevation]);

  useFrame((_, delta) => {
    const moveSpeed = CONSTANTS.MOVE_SPEED * delta;
    const rotateSpeed = CONSTANTS.ROTATE_SPEED * delta;
    const zoomSpeed = CONSTANTS.ZOOM_SPEED * delta;

    let targetChanged = false;
    let newTarget = new THREE.Vector3(...target);
    let azimuthChanged = false;
    let newAzimuth = azimuth;
    let distanceChanged = false;
    let newDistance = distance;

    const hasMovement = keys.current.w || keys.current.s || keys.current.a || keys.current.d;
    if (hasMovement) {
      const forward = keys.current.w ? -moveSpeed : keys.current.s ? moveSpeed : 0;
      const right = keys.current.d ? moveSpeed : keys.current.a ? -moveSpeed : 0;

      if (forward !== 0) {
        tempVec3.current.set(0, 0, forward);
        tempVec3.current.applyQuaternion(threeCamera.quaternion);
        tempVec3.current.y = 0;
        tempVec3.current.normalize();
        newTarget.add(tempVec3.current.multiplyScalar(Math.abs(forward)));
        targetChanged = true;
      }

      if (right !== 0) {
        tempVec3.current.set(right, 0, 0);
        tempVec3.current.applyQuaternion(threeCamera.quaternion);
        tempVec3.current.y = 0;
        tempVec3.current.normalize();
        newTarget.add(tempVec3.current.multiplyScalar(Math.abs(right)));
        targetChanged = true;
      }
    }

    if (keys.current.q) {
      newAzimuth += rotateSpeed;
      azimuthChanged = true;
    }

    if (keys.current.e) {
      newAzimuth -= rotateSpeed;
      azimuthChanged = true;
    }

    if (keys.current["+"] || keys.current["="]) {
      newDistance = Math.max(CONSTANTS.MIN_DISTANCE, distance - zoomSpeed * 0.1);
      distanceChanged = true;
    }

    if (keys.current["-"] || keys.current["_"]) {
      newDistance += zoomSpeed * 0.1;
      distanceChanged = true;
    }

    if (targetChanged) {
      if (newTarget.y < CONSTANTS.TARGET_Y_MIN) newTarget.y = CONSTANTS.TARGET_Y_MIN;
      setCameraTarget([newTarget.x, newTarget.y, newTarget.z]);
    }

    if (azimuthChanged) setCameraAzimuth(newAzimuth);
    if (distanceChanged) setCameraDistance(newDistance);
  });

  return null;
};

