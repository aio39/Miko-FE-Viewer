// import { model } from '@src/state/recoil';
import { Button, VStack } from '@chakra-ui/react';
import { toastLog } from '@src/helper';
import { currentAvatarState } from '@src/state/recoil';
import { sendMotionForFrames } from '@src/state/shareObject/shareMotionObject';
import 'babylonjs-loaders';
import produce from 'immer';
import { FC, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';

const peerId = 'kirari';
const width = 500;
const height = 500;

export const AvatarModel: FC = () => {
  const tagId = 'avatar' + peerId;
  const workerRef = useRef<Worker>();
  const [currentAvatar, setCurrentAvatar] = useRecoilState(currentAvatarState);

  useEffect(() => {
    const worker = new Worker(new URL('@src/worker/TmpAvatarModel.worker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;
    worker.onerror = e => {
      toastLog('error', 'avatar worker error', '', e.error);
    };
    worker.onmessageerror = e => {
      toastLog('error', 'avatar worker mesage error', '');
      console.log('worker message error', e);
    };

    if ('OffscreenCanvas' in window) {
      const aCanvas = document.getElementById(tagId) as HTMLCanvasElement;
      if (!aCanvas.className) {
        aCanvas.className = 'used-canvas-one-more-time';
        const offCanvas = aCanvas.transferControlToOffscreen();

        worker.postMessage({ type: 'init', canvas: offCanvas, width, height, newPeerId: peerId }, [offCanvas]);
      }
    } else {
      toastLog('info', 'OffScreen Canvas 미지원 브라우저');
    }

    const avatarSettingInterval = setInterval(() => {
      const newMotionData = sendMotionForFrames.getMotion;
      if (newMotionData) worker?.postMessage({ type: 'motionChange', thisUserMotion: newMotionData });
      // if (workerRef.current) worker?.postMessage({ type: 'render' });
    }, 60);

    return () => {
      worker.terminate();
      clearInterval(avatarSettingInterval);
    };
  }, []);

  useEffect(() => {
    setCurrentAvatar(
      produce(draft => {
        /* eslint-disable */
        const value = draft['test'];
        delete draft['test'];
        if (!value) return;
        workerRef.current.postMessage({ type: 'avatarChange', avatarType: value });
      }),
    );
  }, [currentAvatar]);

  return (
    <VStack>
      <canvas id={tagId} />;
      <Button
        onClick={() => {
          workerRef.current.postMessage({ type: 'check' });
        }}
      >
        test
      </Button>
      <Button
        onClick={() => {
          workerRef.current.postMessage({ type: 'textureChange' });
        }}
      >
        model change
      </Button>
      <Button
        onClick={() => {
          console.log(currentAvatar);
        }}
      >
        avatar number check
      </Button>
    </VStack>
  );
};
