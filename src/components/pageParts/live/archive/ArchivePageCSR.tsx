import { Box, Text } from '@chakra-ui/react';
import { toastLog } from '@src/helper';
import Script from 'next/script';
import { useMemo, useState } from 'react';
import ArchiveVideoPlayer from './ArchiveVideoPlayer';

// TODO 오류 표시
const ArchivePageCSR = () => {
  const [isReadyIvs, setIsReadyIvs] = useState(!!window?.IVSPlayer); // script 로드는 이미 로드된 상태면 fire되지 않음.
  const [ivsError, setIvsError] = useState();

  const [isReadyIvsTech, setIsReadyIvsTech] = useState(!!window?.registerIVSTech); // script 로드는 이미 로드된 상태면 fire되지 않음.
  const [ivsTechError, setIvsTechError] = useState();

  const [isReadyIvsPlugin, setIsReadyIvsPlugin] = useState(!!window?.registerIVSQualityPlugin); // script 로드는 이미 로드된 상태면 fire되지 않음.
  const [ivsPluginError, setIvsPluginError] = useState();

  const isAllReady = useMemo(() => isReadyIvs && isReadyIvsTech && isReadyIvsPlugin, [isReadyIvs, isReadyIvsTech, isReadyIvsPlugin]);

  return (
    <Box>
      <Text>Video Player</Text>
      <Script
        src="https://player.live-video.net/1.8.0/amazon-ivs-player.min.js"
        strategy="afterInteractive" // NOTE 왜 before하면 새로고침시 에러?, onLoad도 작동 안함?
        onLoad={e => {
          console.log('ivs script loaded', e);
          setIsReadyIvs(true);
        }}
        onError={err => {
          toastLog('error', 'failed to load ivs script', '', err);
          setIvsError(err);
        }}
      />
      <Script
        src="https://player.live-video.net/1.8.0/amazon-ivs-videojs-tech.min.js"
        strategy="afterInteractive"
        onLoad={e => {
          console.log('ivs script loaded', e);
          setIsReadyIvsTech(true);
        }}
        onError={err => {
          toastLog('error', 'failed to load ivs script tech', '', err);
          setIvsTechError(err);
        }}
      ></Script>
      <Script
        src="https://player.live-video.net/1.8.0/amazon-ivs-quality-plugin.min.js"
        strategy="afterInteractive"
        onLoad={e => {
          console.log('ivs script loaded', e);
          setIsReadyIvsPlugin(true);
        }}
        onError={err => {
          toastLog('error', 'failed to load ivs script plugin', '', err);
          setIvsPluginError(err);
        }}
      ></Script>
      {isAllReady ? <ArchiveVideoPlayer /> : <Text>player loading ..</Text>}
    </Box>
  );
};

export default ArchivePageCSR;
