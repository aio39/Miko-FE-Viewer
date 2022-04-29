import { toastLog } from '@src/helper';
import { useMyPeer } from '@src/hooks/dynamicHooks';
import { peerErrorState } from '@src/state/recoil';
import { Dispatch, FC, MutableRefObject, SetStateAction, useEffect, useLayoutEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import PrepareErrorAlert from './PrepareErrorAlert';

const PreparePeerConnectToServer: FC<{ setReady: Dispatch<SetStateAction<boolean>>; isExitedRef: MutableRefObject<boolean>; peerId?: string }> = ({
  setReady,
  isExitedRef,
  peerId,
}) => {
  const [peerError, setPeerError] = useRecoilState(peerErrorState);
  const myPeer = useMyPeer(peerId);
  const [fireRerender, setFireRerender] = useState(0);

  const handleFireRerender = () => {
    setFireRerender(prev => prev + 1);
  };

  // Peer가 Server와의 연결이 성공되었음을 확인
  useEffect(() => {
    //  on("open")에서 하면 useEffect에서 등록하기 전에 이미 open 되어버림.
    let setTimeoutId: NodeJS.Timeout;
    if (myPeer.open) {
      setReady(true);
    } else {
      if (myPeer.destroyed === false) {
        myPeer.reconnect();
      }
      setTimeoutId = setTimeout(handleFireRerender, 200);
    }
    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [myPeer.open, fireRerender]);

  useLayoutEffect(() => {
    if (!myPeer) return;

    const handleClose = () => {
      if (isExitedRef.current) return;
      toastLog('error', 'myPeer destroyed', 'peer가 파괴되었습니다..');
      myPeer.destroy();
    };

    const handlePeerDisconnected = () => {
      myPeer.reconnect();
      toastLog('error', 'myPeer disconnected', 'peer가 시그널링 서버와 끊겼습니다.');
    };

    const handlePeerError = (e: any) => {
      toastLog('error', 'myPeer error', '심각한 에러발생 로그창 확인.');
      console.error('handlePeerError', e.type, e);
      switch (e.type as string) {
        case 'unavailable-id': // id가 중복되었을 경우
          // myPeer.disconnect(); // reconnect를 위해 한번 disconnect를 할 필요가 있다.
          setPeerError('このIDで既に接続しているユーザーがいます。');
          // setTimeout(() => {
          //   myPeer.disconnect();
          // }, 5000);
          break;
        default:
          setPeerError(e.type as string);
          break;
      }
    };

    myPeer.on('close', handleClose);
    myPeer.on('disconnected', handlePeerDisconnected);
    myPeer.on('error', handlePeerError);

    // NOTE  peer.connect 는  peer open 상태가 아니면 undefined 리턴
    return () => {
      myPeer.off('disconnected', handlePeerDisconnected);
      myPeer.off('error', handlePeerError);
    };
  }, []);

  return <PrepareErrorAlert errorText={undefined} />;
};

export default PreparePeerConnectToServer;
