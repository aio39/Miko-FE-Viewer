import { toastLog } from '@src/helper';
import { ivsErrorState } from '@src/state/recoil';
import Script from 'next/script';
import { Dispatch, FC, SetStateAction } from 'react';
import { useRecoilState } from 'recoil';
import PrepareErrorAlert from './PrepareErrorAlert';

const PrepareIVS: FC<{ setReady: Dispatch<SetStateAction<boolean>> }> = ({ setReady }) => {
  const [ivsError, setIvsError] = useRecoilState(ivsErrorState);

  return (
    <>
      <Script
        src="https://player.live-video.net/1.8.0/amazon-ivs-player.min.js"
        // @ts-ignore
        strategy="afterInteractive" // NOTE 왜 before하면 새로고침시 에러?, onLoad도 작동 안함?
        onLoad={e => {
          console.log('ivs script loaded', e);
          setReady(true);
        }}
        onError={err => {
          toastLog('error', 'failed to load ivs script', '', err);
          setIvsError(err);
        }}
      />
      <PrepareErrorAlert errorText={ivsError} />
    </>
  );
};

export default PrepareIVS;
