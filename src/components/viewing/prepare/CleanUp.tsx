import { useBeforeunload } from '@src/hooks';
import { useMyPeer, useSocket } from '@src/hooks/dynamicHooks';
import { ivsErrorState, mediapipeErrorState, myStreamState, peerErrorState, socketErrorState } from '@src/state/recoil';
import { FC, MutableRefObject, useEffect } from 'react';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';

const CleanUp: FC<{ isExitedRef: MutableRefObject<boolean>; peerId?: string }> = ({ isExitedRef, peerId }) => {
  const socket = useSocket();
  const myPeer = useMyPeer(peerId);
  const setMediapipeError = useSetRecoilState(mediapipeErrorState);
  const setSocketError = useSetRecoilState(socketErrorState);
  const setPeerError = useSetRecoilState(peerErrorState);
  const setIvsError = useSetRecoilState(ivsErrorState);
  const myStream = useRecoilValue(myStreamState);
  const resetMyStreamRecoil = useResetRecoilState(myStreamState);

  const handleCleanUp = () => {
    console.log('handleCleanUp');
    isExitedRef.current = true;

    if (myStream) {
      myStream.getTracks().forEach(track => {
        track.stop();
        myStream.removeTrack(track);
      });
      resetMyStreamRecoil();
    }

    if (socket) {
      socket.emit('fe-user-left');
      socket.disconnect();
    }

    if (myPeer) {
      myPeer.disconnect();
      myPeer.destroy();
    }

    window.socket = undefined;
    window.myPeer = undefined;

    setMediapipeError(undefined);
    setSocketError(undefined);
    setPeerError(undefined);
    setIvsError(undefined);
  };

  useBeforeunload(() => {
    // 창이 닫힐때
    handleCleanUp();
    console.log('windowBeforeUnloadEvent in Prepare');
  });

  useEffect(() => {
    // 뒤로 갈때
    return () => {
      handleCleanUp();
    };
  }, []);

  return <></>;
};

export default CleanUp;
