import * as BABYLON from 'babylonjs';

declare type BodyParts = 'leftShoulder' | 'leftElbow' | 'leftWrist' | 'rightShoulder' | 'rightElbow' | 'rightWrist' | 'head';

declare type AvatarBones = { [BoneBody in BodyParts]: BABYLON.TransformNode };
declare type AvatarOriginalBones = { [BoneBody in BodyParts]: BABYLON.Quaternion };

// export type FaceDirection<K extends keyof any, T> = {
//   [Direction in K]: T;
// };

declare type Model = {
  bones: AvatarBones;
  originalBones: AvatarOriginalBones;
  scene: BABYLON.Scene;
  color: {
    light: number;
  };
};
export type { Model, BodyParts, AvatarBones, AvatarOriginalBones };
