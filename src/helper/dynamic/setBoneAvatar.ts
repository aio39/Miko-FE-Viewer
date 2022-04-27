import { FaceDirection } from '@src/types/avatar/FaceDirectionType';
import { AvatarBones, AvatarOriginalBones, BodyParts, Model } from '@src/types/avatar/ModelType';
import * as BABYLON from 'babylonjs';
import * as Kalidokit from 'kalidokit';

const boneReset = (bones: AvatarBones, originalBones: AvatarOriginalBones) => {
  // eslint-disable-next-line
  for (const keyString in bones) {
    const key = keyString as BodyParts;
    if (bones[key] && originalBones[key]) bones[key].rotationQuaternion = originalBones[key].clone();
  }
};

/**
 *
 * 회전하는데 있어서, '구면좌표계'검색해서 회전하는 방식?을 염두해야함
 *
 * @param transBone 회전하는 모델링
 * @param kalidoRig 관절 회전 값의 오브젝트, xyz키를 가진 배열...?
 * @param direction 팔 좌우 방향, 0=== 사람기준 왼손
 */
const boneTurn = (transBone: AvatarBones, kalidoRig: Kalidokit.TPose, direction: number) => {
  const boneX: number[] = [];
  const boneY: number[] = [];
  const boneZ: number[] = [];
  if (direction === 0) {
    boneX[0] = kalidoRig.RightUpperArm.x;
    boneY[0] = kalidoRig.RightUpperArm.y;
    boneZ[0] = kalidoRig.RightUpperArm.z;
    boneX[1] = kalidoRig.RightLowerArm.x;
    boneY[1] = kalidoRig.RightLowerArm.y;
    boneZ[1] = kalidoRig.RightLowerArm.z;
    boneX[2] = kalidoRig.RightHand.x;
    boneY[2] = kalidoRig.RightHand.y;
    boneZ[2] = kalidoRig.RightHand.z;
  } else {
    boneX[0] = kalidoRig.LeftUpperArm.x;
    boneY[0] = kalidoRig.LeftUpperArm.y;
    boneZ[0] = kalidoRig.LeftUpperArm.z;
    boneX[1] = kalidoRig.LeftLowerArm.x;
    boneY[1] = kalidoRig.LeftLowerArm.y;
    boneZ[1] = kalidoRig.LeftLowerArm.z;
    boneX[2] = kalidoRig.LeftHand.x;
    boneY[2] = kalidoRig.LeftHand.y;
    boneZ[2] = kalidoRig.LeftHand.z;
  }
  if (boneX[0] && boneY[0] && boneZ[0]) {
    // leftShoulder: BABYLON.TransformNode;
    // leftElbow: BABYLON.TransformNode;
    // leftWrist: BABYLON.TransformNode;
    // rightShoulder: BABYLON.TransformNode;
    // rightElbow: BABYLON.TransformNode;
    // rightWrist: BABYLON.TransformNode;
    // head: BABYLON.TransformNode;
    if (direction === 0) {
      transBone.leftShoulder.rotate(new BABYLON.Vector3(1, 0, 0), boneZ[0] + (Math.PI - 0.5) / 2, 2);
      transBone.leftShoulder.rotate(new BABYLON.Vector3(0, 1, 0), -boneY[0] + (Math.PI - 0.5) / 2, 2);
      transBone.leftShoulder.rotate(new BABYLON.Vector3(0, 0, 1), boneX[0], 2);
    } else {
      transBone.rightShoulder.rotate(new BABYLON.Vector3(1, 0, 0), -boneZ[0] + (Math.PI - 0.5) / 2, 2);
      transBone.rightShoulder.rotate(new BABYLON.Vector3(0, 1, 0), -boneY[0] - (Math.PI - 0.5) / 2, 2);
      transBone.rightShoulder.rotate(new BABYLON.Vector3(0, 0, 1), -boneX[0], 2);
    }
  }
  if (boneX[1] && boneY[1] && boneZ[1]) {
    if (direction === 0) {
      transBone.leftElbow.rotate(new BABYLON.Vector3(1, 0, 0), boneZ[1] * 2, 2);
    } else {
      transBone.rightElbow.rotate(new BABYLON.Vector3(1, 0, 0), -boneZ[1] * 2, 2);
    }
  }
  if (boneX[2] && boneY[2] && boneZ[2]) {
    if (direction === 0) {
      transBone.leftWrist.rotate(new BABYLON.Vector3(1, 0, 0), (boneZ[2] - Math.PI / 4) / 3, 2);
    } else {
      transBone.rightWrist.rotate(new BABYLON.Vector3(1, 0, 0), -(boneZ[2] + Math.PI / 4) / 3, 2);
    }
  }
};

const faceTurn = (transBone: AvatarBones, faceFront: number, faceLeft: number, faceRight: number) => {
  const avg = (faceLeft + faceRight) / 2;
  transBone.head.rotate(new BABYLON.Vector3(0, 1, 0), -(Math.atan2(avg, faceFront) - Math.PI / 4) * 10, 2);
};

export const setBone = (userBones: Model, poseRig: Kalidokit.TPose, faceRig: FaceDirection<'left' | 'center' | 'right', number>) => {
  // const userBones = model[peerId];
  // AVATAR 적절하게 가공하는 곳
  boneReset(userBones.bones, userBones.originalBones);
  boneTurn(userBones.bones, poseRig, 0);
  boneTurn(userBones.bones, poseRig, 1);
  faceTurn(userBones.bones, faceRig.center, faceRig.left, faceRig.right);
  userBones.scene.render();
};
