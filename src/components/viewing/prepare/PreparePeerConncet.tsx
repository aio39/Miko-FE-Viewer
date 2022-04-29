import { useMyPeer } from '@src/hooks/dynamicHooks';
import { peerErrorState } from '@src/state/recoil';
import { Dispatch, FC, SetStateAction, useLayoutEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import PrepareErrorAlert from './PrepareErrorAlert';

const PreparePeerConnect: FC<{ setReady: Dispatch<SetStateAction<boolean>> }> = ({ setReady }) => {
  const [peerError, setPeerError] = useRecoilState(peerErrorState);
  const myPeer = useMyPeer();
  const [fireRerender, setFireRerender] = useState(0);

  const handleFireRerender = () => {
    setFireRerender(prev => prev + 1);
  };

  useLayoutEffect(() => {
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

  return <PrepareErrorAlert errorText={undefined} />;
};

export default PreparePeerConnect;
