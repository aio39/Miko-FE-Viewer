import * as cam from '@mediapipe/camera_utils';
import { NormalizedLandmark, Results } from '@mediapipe/pose';
import { sendToAllPeers } from '@src/helper';
import { isOnMediaPipeState, latestMotionState, mediapipeErrorState, myStreamState, peerDataListState } from '@src/state/recoil';
import { addedScoreForSeconds, roomMemberMotions } from '@src/state/shareObject';
import { sendMotionForFrames } from '@src/state/shareObject/shareMotionObject';
import { aPose } from '@src/state/shareObject/sharePose';
import { useUser } from '@src/state/swr';
import { MotionInterface } from '@src/types/avatar/ChatMotionType';
import * as Kalidokit from 'kalidokit';
import React, { Dispatch, memo, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import PrepareErrorAlert from './PrepareErrorAlert';

type Props = {
  setReady: Dispatch<SetStateAction<boolean>>;
};

const VIDEO_WIDTH = 320;
const VIDEO_HEIGHT = 240;

/* eslint-disable */

const PrepareMediaPipeSetup = memo<Props>(({ setReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediapipeError, setMediaPipeError] = useRecoilState(mediapipeErrorState);
  const myStream = useRecoilValue(myStreamState);
  const peers = useRecoilValue(peerDataListState);
  const isOnMediaPipe = useRecoilValue(isOnMediaPipeState);
  const motionState = useRecoilValue(latestMotionState);
  const user = useUser();
  const handRef = useRef<number[][]>([
    [0, 0, 0],
    [0, 0, 0],
  ]); //[[오른손x,y,z],[왼손x,y,z]]
  const scoreRef = useRef<number>(0);
  const myPeerId = user.data!.uuid;
  const [peerChange, setPeerChange] = useState(false);

  const userMotionScore = (before: number[], after: NormalizedLandmark) => {
    if (after.visibility && after.visibility > 0.5) {
      const newScore = Math.sqrt((after.x - before[0]) ** 2 + (after.y - before[1]) ** 2 + (after.z - before[2]) ** 2);
      scoreRef.current += newScore;
      const updateScore = Math.floor(scoreRef.current); // 1
      scoreRef.current -= updateScore;
      addedScoreForSeconds.addScore(updateScore, 'motion');
      before[0] = after.x;
      before[1] = after.y;
      before[2] = after.z;
    }
  };

  useEffect(() => {
    const sendInterval = setInterval(() => {
      const setMotion = sendMotionForFrames.getMotionObject();
      // NOTE 모션 값이 있을 때만 발송
      if (setMotion && setMotion.motion) sendToAllPeers(peers, { type: 'motion', data: setMotion });
    }, 100);
    return () => {
      clearInterval(sendInterval);
    };
  }, [peers]);

  // mediapipe 데이터가 적절하게 나오는 곳
  const onResults = useCallback(
    (results: Results) => {
      if (results && results.poseLandmarks && results.poseWorldLandmarks && results.segmentationMask) {
        const poseRig = Kalidokit.Pose.solve(results.poseWorldLandmarks, results.poseLandmarks, {
          runtime: 'mediapipe',
          video: videoRef?.current,
          enableLegs: false,
        });
        const faceRig = {
          center: results.poseLandmarks[0].x,
          left: results.poseLandmarks[7].x,
          right: results.poseLandmarks[8].x,
        };
        // 적절하게 render 호출하는 메소드 setBone
        // setBone(modelListObject[myPeerId], myPeerId, poseRig, faceRig);
        if (peers && sendMotionForFrames) {
          const myMotion = { pose: poseRig, face: faceRig } as MotionInterface;
          roomMemberMotions[myPeerId] = myMotion;
          sendMotionForFrames.setMotionStatus(myMotion);
        }
        // 15 20
        userMotionScore(handRef.current[0], results.poseLandmarks[15]);
        userMotionScore(handRef.current[1], results.poseLandmarks[16]);
      }
    },
    [motionState, peers, user.data],
  );

  useEffect(() => {
    let camera: cam.Camera;
    let latestPoseEnded = true;
    let latestUpdate = 0;
    const setupMediapipe = () => {
      if (videoRef.current) {
        let isMediaPipeSetup = false;
        camera = new cam.Camera(videoRef?.current, {
          onFrame: async () => {
            if (!isMediaPipeSetup) {
              await aPose
                .initialize()
                .then(() => {
                  isMediaPipeSetup = true;
                  setReady(true);
                })
                .catch(err => {
                  console.error(err);
                  // toastLog('error', 'mediaPipe error');
                  setMediaPipeError(err);
                });
            }
            //  TODO 적당한 시간 조절, 프레임  제한 로직 조절
            if (latestPoseEnded && isOnMediaPipe && videoRef.current && latestUpdate + 40 < Date.now()) {
              latestPoseEnded = false;
              //  TODO  send 2번쨰 인자 at 의미
              aPose
                .send({ image: videoRef.current })
                .then(() => {
                  latestPoseEnded = true;
                  latestUpdate = Date.now();
                })
                .catch(err => {
                  console.error('media pipe error', err);
                });
            } else {
            }
          },
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT,
          // facingMode:'user' // TODO 이 옵션 의미
        });
        camera.start().then(() => {
          console.log('MediaPipe - Camera Start ✅');
        });
        setPeerChange(true);
      }
    };
    if (myStream && videoRef.current) {
      const videoElement = videoRef.current;
      videoElement.srcObject = myStream;
      videoElement.volume = 0;
      if (isOnMediaPipe) {
        setupMediapipe();
      } else {
        setReady(true);
      }
    }

    return () => {
      // camera?.stop();
    };
  }, [myStream, videoRef.current, isOnMediaPipe]);

  useEffect(() => {
    aPose.onResults(onResults);
  }, [peerChange, onResults]);

  return (
    <>
      <PrepareErrorAlert errorText={mediapipeError} />
      <video
        ref={videoRef}
        style={{
          visibility: 'hidden',
          position: 'absolute',
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT,
        }}
      ></video>
    </>
  );
});

PrepareMediaPipeSetup.displayName = 'MediaPipeSetup';

export default PrepareMediaPipeSetup;
