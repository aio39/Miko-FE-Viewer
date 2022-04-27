import { Button } from '@chakra-ui/react';
import * as cam from '@mediapipe/camera_utils';
import { Pose, Results } from '@mediapipe/pose';
import * as Kalidokit from 'kalidokit';
import React, { memo, useCallback, useEffect, useRef } from 'react';

const VIDEO_WIDTH = 320;
const VIDEO_HEIGHT = 240;

const getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices) as typeof navigator.mediaDevices.getUserMedia;

/* eslint-disable */

const MediaPipeSetup = memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream>();
  const poseRef = useRef(null);

  // mediapipe 데이터가 적절하게 나오는 곳
  const onResults = useCallback((results: Results) => {
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
      // 15 20
      //   if (sendMotionForFrames) {
      //     const myMotion = { pose: poseRig, face: faceRig } as MotionInterface;
      //     sendMotionForFrames.setMotionStatus(myMotion);
      //   }
    }
  }, []);

  useEffect(() => {
    getUserMedia({ audio: false, video: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT } }).then(res => {
      mediaStreamRef.current = res;
    });
  }, []);

  useEffect(() => {
    if (!navigator) return;
    const videoCurr = videoRef.current;
    if (!videoCurr) return;
    const video = videoCurr! as HTMLVideoElement;
    if (!video.srcObject) {
      video.srcObject = mediaStreamRef.current;
      setupMediapipe();
    }
    return () => {};
  }, [mediaStreamRef.current]);

  const setupMediapipe = () => {
    const pose = new Pose({
      locateFile: file => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    pose.onResults(onResults);
    const camera = new cam.Camera(videoRef?.current, {
      onFrame: async () => {
        if (videoRef.current) await pose.send({ image: videoRef.current });
      },
      width: 320,
      height: 240,
    });
    camera.start();
  };

  return (
    <>
      <video
        ref={videoRef}
        style={{
          visibility: 'hidden',
          position: 'absolute',
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT,
        }}
      ></video>
      <Button
        onClick={() => {
          console.log('mediapipe: video', videoRef);
          console.log('mediapipe: mediaStream', mediaStreamRef);
        }}
      ></Button>
    </>
  );
});

MediaPipeSetup.displayName = 'MediaPipeSetup';

export default MediaPipeSetup;
