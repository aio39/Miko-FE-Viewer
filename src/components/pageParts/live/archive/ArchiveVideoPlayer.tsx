import { Center } from '@chakra-ui/react';
import { generateIvsM3U8 } from '@src/helper/dynamic/ivsHelper';
import { useIvsPlayer } from '@src/hooks/dynamicHooks';
import type { VideoJSEvents, VideoJSIVSTech, VideoJSQualityPlugin } from 'amazon-ivs-player';
import { FC, useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// // We use the TypeScript compiler (TSC) to check types; it doesn't know what this WASM module is, so let's ignore the error it throws (TS2307).
// // @ts-ignore
// import wasmBinaryPath from 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.wasm';
// import wasmWorkerPath from 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.js';

// const createAbsolutePath = (assetPath: string) => new URL(assetPath, document.URL).toString();

// register the tech with videojs

type IvsVideoJS = videojs.Player & VideoJSIVSTech & VideoJSQualityPlugin;

const prefix = 'ivs/v1/121323684128/NIFlWVmsiHXA/2022/4/19/10/17/8X0n3badH9py';

const VideoJS: FC<{ options: videojs.PlayerOptions; onReady: (player: IvsVideoJS) => void }> = ({ onReady, options }) => {
  const IVSPlayer = useIvsPlayer();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<IvsVideoJS>();

  useEffect(() => {
    if (!IVSPlayer) return;
    if (!videoRef.current) return;

    // @ts-ignore
    window.registerIVSTech(videojs);
    window.registerIVSQualityPlugin(videojs);

    const player = videojs(
      'videojs-player', // NOTE id 이름에 자동 추가되는 문자열
      options,
      () => {
        console.warn('Player is ready to use');
        player.src(generateIvsM3U8(prefix));
      },
    ) as IvsVideoJS;

    player.enableIVSQualityPlugin();

    const events: VideoJSEvents = player.getIVSEvents();
    const ivsPlayer = player.getIVSPlayer();
    ivsPlayer.addEventListener(events.PlayerState.PLAYING, () => {
      console.log('IVS Player is playing');
    });

    playerRef.current = player;

    onReady(player);
  }, []);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose(); // 인스턴스 삭제
        // playerRef.current = null;
      }
    };
  }, [playerRef]);

  const test = () => {
    if (playerRef.current) {
      playerRef.current.duration(); // 지속시간 live는 Infinity
      playerRef.current.currentTime(); //
      // .play()
      // .src()
    }
  };

  return <video ref={videoRef} id="videojs-player" className="video-js vjs-big-play-centered" />;
};

const ArchiveVideoPlayer = () => {
  const playerRef = useRef<IvsVideoJS>();

  const videoJsOptions: videojs.PlayerOptions = {
    techOrder: ['AmazonIVS'],
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    //   sources: [
    //   ], // ivs의 경우 지원안됨 . src() 함수만 사용가능
  };

  const handlePlayerReady = (player: IvsVideoJS) => {
    playerRef.current = player;

    player.on('waiting', () => {
      console.info('player is waiting');
    });

    player.on('dispose', () => {
      console.info('player will dispose');
    });
  };

  return (
    <Center w="640px" h="480px" margin="15px">
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    </Center>
  );
};

export default ArchiveVideoPlayer;
