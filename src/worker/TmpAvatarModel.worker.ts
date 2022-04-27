/* eslint-disable no-case-declarations */
import { NEXT_URL } from '@src/const';
import { setBone } from '@src/helper/dynamic/setBoneAvatar';
import { AvatarBones, AvatarOriginalBones } from '@src/types/avatar/ModelType';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

// 공유 객체 사용가능 할 것

const avatarSkin: [
  BABYLON.AbstractMesh[],
  BABYLON.IParticleSystem[],
  BABYLON.Skeleton[],
  BABYLON.AnimationGroup[],
  BABYLON.TransformNode[],
  BABYLON.Geometry[],
  BABYLON.Light[],
][] = [];
const avatarSkinOriginalBones: BABYLON.Quaternion[][] = [];

let scene: BABYLON.Scene;

const COLOR = {
  light: 0,
};

const AVATAR_PATH = `${NEXT_URL}/resources/babylonjs/models/`;
const AVATAR_FILE_NAME = ['proseka/proseka_tmp.glb', 'miku/MineCraftMikuNoSword.glb', 'steve/steve.glb', 'light/penlight.glb'];
let currentAvatar = 0;
/**
 * proseka = leftShoulder 22, Elbow 21, Wrist 20
 *           rightShoulder 17, 16, 15
 *           head 12
 * miku = leftShoulder 56 or 55, Elbow 53, Wrist 52
 *        rightShoulder 36 or 35, 33, 32
 *        head 14 or 15
 * zombie = leftShoulder 7 or 6, Elbow 5, Wrist 4
 *          rightShoulder 11 or 10, 9, 8
 *          head 2
 */
const currentBones: AvatarBones = {};
const currentOriginalBones: AvatarOriginalBones = {};

const createLights = (functionBones: BABYLON.TransformNode[], index: number, r: number, g: number, b: number, d: number, functionScene: BABYLON.Scene) => {
  const bone = functionBones[index]; // 15

  const light = new BABYLON.PointLight(`${index}_point_light`, new BABYLON.Vector3(0, 0, 0.5), functionScene);
  light.parent = bone;
  light.intensity = 0.3;
  light.range = 5;
  light.shadowMinZ = 0.2;
  light.shadowMaxZ = 5;
  light.diffuse = new BABYLON.Color3(r / d, g / d, b / d);
  light.specular = new BABYLON.Color3(r / d, g / d, b / d);
};

const getJointNumber = (index: number): { [key in string]: number } => {
  let ls = 22;
  let le = 21;
  let lw = 20;
  let rs = 17;
  let re = 16;
  let rw = 15;
  let h = 12;

  switch (index) {
    // case 0: // proseka
    //   ls = 22;
    //   le = 21;
    //   lw = 20;
    //   rs = 17;
    //   re = 16;
    //   rw = 15;
    //   h = 12;
    //   break;
    case 1: // 미쿠
      ls = 22;
      le = 21;
      lw = 20;
      rs = 17;
      re = 16;
      rw = 15;
      h = 12;
      break;
    case 2: // 좀비
      ls = 22;
      le = 21;
      lw = 20;
      rs = 17;
      re = 16;
      rw = 15;
      h = 12;
      break;
    default:
      break;
  }
  return { ls, le, lw, rs, re, rw, h };
};

// 아바타의 움직여야 하는 관절 설정
const avatarResetPosition = (index: number) => {
  const { ls, le, lw, rs, re, rw, h } = getJointNumber(index);

  currentBones.leftShoulder = avatarSkin[index][4][ls];
  currentBones.leftElbow = avatarSkin[index][4][le];
  currentBones.leftWrist = avatarSkin[index][4][lw];
  currentBones.rightShoulder = avatarSkin[index][4][rs];
  currentBones.rightElbow = avatarSkin[index][4][re];
  currentBones.rightWrist = avatarSkin[index][4][rw];
  currentBones.head = avatarSkin[index][4][h];

  currentBones.leftShoulder.rotate(new BABYLON.Vector3(0, 0, 1), (Math.PI * 7) / 36, 2);
  currentBones.rightShoulder.rotate(new BABYLON.Vector3(0, 0, 1), -(Math.PI * 7) / 36, 2);

  currentOriginalBones.leftShoulder = avatarSkinOriginalBones[index][ls];
  currentOriginalBones.leftElbow = avatarSkinOriginalBones[index][le];
  currentOriginalBones.leftWrist = avatarSkinOriginalBones[index][lw];
  currentOriginalBones.rightShoulder = avatarSkinOriginalBones[index][rs];
  currentOriginalBones.rightElbow = avatarSkinOriginalBones[index][re];
  currentOriginalBones.rightWrist = avatarSkinOriginalBones[index][rw];
  currentOriginalBones.head = avatarSkinOriginalBones[index][h];

  avatarSkin[currentAvatar][0][0].setAbsolutePosition(new BABYLON.Vector3(100, 0, 0));
  avatarSkin[index][0][0].setAbsolutePosition(new BABYLON.Vector3(0, 0, 0));
  currentAvatar = index;
};

// 아바타 init시 avatar로드
const addMesh = (functionScene: BABYLON.Scene, index: number) => {
  if (index === AVATAR_FILE_NAME.length) {
    functionScene.render();
    return;
  }
  BABYLON.SceneLoader.ImportMesh('', AVATAR_PATH + AVATAR_FILE_NAME[index], '', functionScene, (...args) => {
    const { rs, ls } = getJointNumber(index);
    args[4][rs].rotate(new BABYLON.Vector3(0, 0, 1), (Math.PI * 7) / 36, 2);
    args[4][ls].rotate(new BABYLON.Vector3(0, 0, 1), -(Math.PI * 7) / 36, 2);

    avatarSkin.push(args);
    avatarSkinOriginalBones.push([]);
    for (let i = 0; i < args[4].length; i++) {
      const copyBone = args[4][i].rotationQuaternion?.clone();
      if (copyBone) avatarSkinOriginalBones[index].push(copyBone);
    }
    if (index === currentAvatar) {
      avatarResetPosition(index);
    } else args[0][0].setAbsolutePosition(new BABYLON.Vector3(100, 0, 0));
    // args[4][18].rotate(new BABYLON.Vector3(0, 0, 1), (Math.PI * 7) / 36, 2);
    // args[4][23].rotate(new BABYLON.Vector3(0, 0, 1), -(Math.PI * 7) / 36, 2);

    addMesh(functionScene, index + 1);
  });
};

// 아바타 리랜더링
const onSceneReady = async (resultScene: BABYLON.Scene) => {
  if (BABYLON && BABYLON.SceneLoader) {
    const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0), resultScene);

    camera.setTarget(new BABYLON.Vector3(0, 2.5, 0));
    camera.setPosition(new BABYLON.Vector3(0, 1.8, 4.7));

    // 카메라 컨트롤러, 모델뜨는 canvas 드래그로 조절 가능
    camera.attachControl(true);

    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 1), resultScene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.6;

    BABYLON.MeshBuilder.CreateGround('ground', { width: 30, height: 6 }, resultScene);

    addMesh(resultScene, 0);
    // BABYLON.SceneLoader.ImportMesh('', `${AVATAR_PATH}`, '', resultScene, (...proArgs) => {
    //   // 40, 0 ~ 39
    //   avatarSkin.push(proArgs);
    //   BABYLON.SceneLoader.ImportMesh('', `${AVATAR_PATH}`, '', resultScene, (...mikuArgs) => {
    //     // 70, 40 ~ 109
    //     avatarSkin.push(mikuArgs);
    //     BABYLON.SceneLoader.ImportMesh('', `${AVATAR_PATH}`, '', resultScene, (...steveArgs) => {
    //       // 23, 110 ~ 132
    //       avatarSkin.push(steveArgs);
    //       BABYLON.SceneLoader.ImportMesh('', `${AVATAR_PATH}`, '', resultScene, (...penArgs) => {
    //         // 3, 133 ~ 135
    //         avatarSkin.push(penArgs);

    //         resultScene.render();
    //       });
    //     });
    //   });
    // });

    // BABYLON.SceneLoader.ImportMesh('', `${MODEL_PATH}zombie/user.glb`, '', resultScene, (...args) => {
    //   console.log('zombie model', args);
    //   // args[2][0].bones[1].scale(2, 2, 2, true);
    // });
  }
};
// eslint-disable-next-line no-restricted-globals
addEventListener('message', async ({ data }) => {
  switch (data.type) {
    case 'init':
      const { canvas, width, height } = data;

      const engine = new BABYLON.Engine(canvas);

      scene = new BABYLON.Scene(engine);
      // scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

      onSceneReady(scene);

      scene.getEngine().setSize(width, height);

      scene.render();

      let count = 0;
      const firstRenderIntervalId = setInterval(() => {
        if (count <= 20) {
          scene.render();
          count += 1;
        } else {
          clearInterval(firstRenderIntervalId);
        }
      }, 16);

      break;
    case 'motionChange':
      const { thisUserMotion } = data;
      console.log(thisUserMotion);
      setBone({ bones: currentBones, originalBones: currentOriginalBones, scene, color: COLOR }, thisUserMotion.pose, thisUserMotion.face);
      scene.render();
      break;
    case 'bodyColorChange':
      break;
    case 'lightColorChange':
      break;
    case 'avatarChange':
      console.log('this is avatar change');
      const { avatarType } = data;
      if (avatarType < 0 || avatarType > 2 || avatarType === currentAvatar) return;
      avatarResetPosition(avatarType);
      // const mat = scene.materials[1] as BABYLON.StandardMaterial;
      // const dT = new BABYLON.DynamicTexture('skin test', { width: 500, height: 250 }, scene, false);
      // const ctx = dT.getContext();
      // console.log('스킨 데이터', skin);
      // // const img = new Image({ src: `${MODEL_PATH}steve/char.png` });
      // // img.onload = () => {
      // //   console.log(img);
      // //   ctx.drawImage(img, 0, 0);
      // //   dT.update();
      // //   mat.diffuseTexture = dT;
      // // };
      // const img = new Image(skin);
      // console.log(img);
      break;
    case 'check':
      console.log('here is frog', avatarSkin);
      break;
    default:
      if (scene) {
        scene.render();
      }
      break;
  }
});
