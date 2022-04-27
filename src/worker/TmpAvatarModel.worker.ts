/* eslint-disable no-case-declarations */
import { setBone } from '@src/helper/dynamic/setBoneAvatar';
import 'babylonjs-loaders';
// 공유 객체 사용가능 할 것
const bones: BABYLON.TransformNode[] = [];
const originalBones: BABYLON.Quaternion[] = [];
let scene: BABYLON.Scene;

const COLOR = {
  body: 0,
  light: 0,
};

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

const onSceneReady = (resultScene: BABYLON.Scene, modelUrl: string) => {
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
    BABYLON.SceneLoader.ImportMesh('', `${modelUrl}proseka/proseka_tmp.glb`, '', resultScene, (newMeshes, particleSystems, skeletons) => {
      const skeleton = skeletons[0];

      const scale = 2;

      skeleton.bones[3].scale(scale, scale, scale, true);

      BABYLON.SceneLoader.ImportMesh('', `${modelUrl}miku/MineCraftMikuNoSword.glb`, '', resultScene, (...args) => {
        console.log('miku model', args);
        // args[2][0].bones[1].scale(2, 2, 2, true);
      });
      BABYLON.SceneLoader.ImportMesh('', `${modelUrl}light/penlight.glb`, '', resultScene, (...args) => {
        console.log('penlight model', args);
        // args[2][0].bones[0].scale(2, 2, 2, true);
      });
      BABYLON.SceneLoader.ImportMesh('', `${modelUrl}steve/user.glb`, '', resultScene, (...args) => {
        console.log('steve model', args);
        // args[2][0].bones[1].scale(2, 2, 2, true);
      });
      BABYLON.SceneLoader.ImportMesh('', `${modelUrl}zombie/user.glb`, '', resultScene, (...args) => {
        console.log('zombie model', args);
        // args[2][0].bones[1].scale(2, 2, 2, true);
      });
      console.log('scene', scene);

      // console.log(resultScene);

      // args[4][18].rotate(new BABYLON.Vector3(0, 0, 1), (Math.PI * 7) / 36, 2);
      // args[4][23].rotate(new BABYLON.Vector3(0, 0, 1), -(Math.PI * 7) / 36, 2);

      // bones = args[4];

      // for (let j = 0; j < args[4].length; j++) {
      //   originalBones[j] = args[4][j].rotationQuaternion?.clone();
      // }
      // const animations = resultScene.animationGroups;
      // for (let j = 0; j < animations.length; j++) {
      //   animations[j].stop();
      // }

      // const r = 1;
      // const g = 1;
      // const b = 1;
      // const d = 1;

      // for (let j = 1; j < 9; j++) {
      //   new BABYLON.StandardMaterial(`${j}_body`, resultScene);
      // }
      // resultScene.materials[10] = new BABYLON.StandardMaterial('hand_light', resultScene);
      // resultScene.materials[10].emissiveColor = new BABYLON.Color3(r / d, g / d, b / d);
      // resultScene.meshes[11].material = resultScene.materials[10];
      // resultScene.materials[10].name = '0';
      // resultScene.materials[12].name = '0';
      // createLights(bones, 15, r, g, b, d, resultScene);
      // createLights(bones, 20, r, g, b, d, resultScene);

      resultScene.render();
    });
  }
};
// eslint-disable-next-line no-restricted-globals
addEventListener('message', async ({ data }) => {
  switch (data.type) {
    case 'init':
      const { canvas, path, width, height } = data;

      const engine = new BABYLON.Engine(canvas);

      scene = new BABYLON.Scene(engine);
      // scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

      onSceneReady(scene, path);

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
      setBone({ bones, originalBones, scene, color: COLOR }, thisUserMotion.pose, thisUserMotion.face);
      scene.render();
      break;
    case 'bodyColorChange':
      break;
    case 'lightcolorChange':
      break;
    default:
      console.log('here is frog', scene);
      break;
  }
});
