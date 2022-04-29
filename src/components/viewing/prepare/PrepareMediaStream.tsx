import { toastLog } from '@src/helper';
import { myStreamState, streamErrorState } from '@src/state/recoil';
import { Dispatch, FC, SetStateAction, useLayoutEffect } from 'react';
import { useRecoilState } from 'recoil';
import PrepareErrorAlert from './PrepareErrorAlert';

// NOTE video를 true로 할경우 여러 브라우저에서 카메로 리소스 접근할때 보안상의 이유로 에러가 나올 확률이 높음
// getUserMedia의 callback이 실행되지 않아서 먼저 들어온 사람의 영상이 안 보일 수 있음.
// Bind 해주지 않으면 this 에러남.
const getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

const PrepareMediaStream: FC<{ setReady: Dispatch<SetStateAction<boolean>> }> = ({ setReady }) => {
  const [myStream, setMyStream] = useRecoilState(myStreamState);
  const [streamError, setStreamError] = useRecoilState(streamErrorState);

  useLayoutEffect(() => {
    const streamOptions: MediaStreamConstraints = { audio: true, video: { facingMode: 'user', frameRate: { ideal: 15 } } };

    getUserMedia(streamOptions)
      .then(stream => {
        setMyStream(stream);
        setReady(true);
      })
      .catch((err: DOMException) => {
        toastLog('error', 'get camera stream fail', '', err);
        const { message, name } = err;
        console.error('camera error', name, message);

        switch (name) {
          case 'AbortError':
            setStreamError('このカメラは既に他のプログラムで使用されています。');
            break;
          case 'NotAllowedError':
            setStreamError('カメラ使用が拒否されました。。');
            break;
          case 'NotFoundError':
            setStreamError('条件に合うカメラが見つかりませんでした。');
            break;
          case 'NotReadableError':
            setStreamError('カメラのストリームが読み取りできません。 NotReadableError');
            break;
          case 'OverconstrainedError':
            setStreamError('カメラの設定が不適切です。 OverconstrainedError');
            break;
          case 'SecurityError':
            setStreamError('User media support is disabled on the Document on which getUserMedia() was called.');
            break;
          default:
            setStreamError('カメラの接続に失敗しました。');
            break;
        }
      });
  }, []);

  return <PrepareErrorAlert errorText={streamError} />;
};

export default PrepareMediaStream;
