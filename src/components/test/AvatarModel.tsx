// import { model } from '@src/state/recoil';
import { Button } from '@chakra-ui/react';
import { NEXT_URL } from '@src/const';
import { toastLog } from '@src/helper';
import { sendMotionForFrames } from '@src/state/shareObject/shareMotionObject';
import 'babylonjs-loaders';
import { FC, useEffect, useRef } from 'react';

const peerId = 'kirari';
const path = `${NEXT_URL}/resources/babylonjs/models/`;
const width = 500;
const height = 500;

export const AvatarModel: FC = () => {
  const tagId = 'avatar' + peerId;
  const workerRef = useRef<Worker>();

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

        worker.postMessage({ type: 'init', canvas: offCanvas, path, width, height, newPeerId: peerId }, [offCanvas]);
      }
    } else {
      toastLog('info', 'OffScreen Canvas 미지원 브라우저');
    }

    const avatarSettingInterval = setInterval(() => {
      const newMotionData = sendMotionForFrames.getMotion;
      if (newMotionData) worker?.postMessage({ type: 'motionChange', thisUserMotion: newMotionData });
    }, 60);

    return () => {
      worker.terminate();
      clearInterval(avatarSettingInterval);
    };
  }, []);

  return (
    <>
      <canvas id={tagId} />;
      <Button
        onClick={() => {
          workerRef.current.postMessage({ type: 'test' });
        }}
      >
        test
      </Button>
    </>
  );
};
