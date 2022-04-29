import { Alert, AlertIcon, Box, BoxProps, Heading, HStack, Spinner, Tag, VStack } from '@chakra-ui/react';
import { toastLog } from '@src/helper';
import { useBeforeunload } from '@src/hooks';
import { useMyPeer, useSocket } from '@src/hooks/dynamicHooks';
import { ivsErrorState, mediapipeErrorState, myStreamState, peerErrorState, prepareAnimationDurationState, socketErrorState } from '@src/state/recoil';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import LottieVideoPlay from '../../lottie/LottieVideoPlay';
import ViewingCSRPage from '../ViewingCSRPage';
import PrepareIVS from './PrepareIVS';
import PrepareMediaPipeSetup from './PrepareMediaPipeSetup';
import PrepareMediaStream from './PrepareMediaStream';
import PreparePeerConnect from './PreparePeerConncet';

const MotionBox = motion<Omit<BoxProps, 'transition'>>(Box);
const MotionViewingCSRPage = motion(ViewingCSRPage);

// Prepare 단계를 둠으로써 State 상태 관리
const ViewingPrepareCSRPage = () => {
  const [isMediapipeSetup, setIsReadyMediapipeSetup] = useState(false);
  const [mediapipeError, setMediapipeError] = useRecoilState(mediapipeErrorState);
  const [isReadySocket, setIsReadySocket] = useState(false);
  const [socketError, setSocketError] = useRecoilState(socketErrorState);
  const [isReadyStream, setIsReadyStream] = useState(false);
  const [myStream, setMyStream] = useRecoilState(myStreamState);
  const [isReadyPeer, setIsReadyPeer] = useState(false);
  const [peerError, setPeerError] = useRecoilState(peerErrorState);
  const [isReadyIvs, setIsReadyIvs] = useState(!!window.IVSPlayer); // script 로드는 이미 로드된 상태면 fire되지 않음.
  const [ivsError, setIvsError] = useRecoilState(ivsErrorState);
  const prepareAnimationDuration = useRecoilValue(prepareAnimationDurationState);

  const isExitedRef = useRef(false);

  const isAllReady = isReadyPeer && isReadySocket && isReadyStream && isReadyIvs && isMediapipeSetup;
  const [asyncIsAllReady, setAsyncIsAllReady] = useState<boolean>(isAllReady);

  const resetMyStreamRecoil = useResetRecoilState(myStreamState);

  const socket = useSocket();
  const myPeer = useMyPeer();

  useEffect(() => {
    //  isAllReady의 상태가 방영된 상태로 Framer Motion이 exit 애니메이션을 실행하게 하기위해 AllReady가 2종류 임
    if (isAllReady) {
      setTimeout(() => {
        setAsyncIsAllReady(true);
      }, 0);
    }
  }, [isAllReady]);

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
    handleCleanUp();
    console.log('windowBeforeUnloadEvent in Prepare');
  });

  useEffect(() => {
    return () => {
      handleCleanUp();
    };
  }, []);

  useLayoutEffect(() => {
    if (!socket) return;

    let timeoutId: NodeJS.Timeout;
    if (socket.connected) {
      setIsReadySocket(true);
    } else {
      const checkSocketConnected = () => {
        if (socket.connected) {
          setIsReadySocket(true);
        } else {
          timeoutId = setTimeout(checkSocketConnected, 200);
        }
      };
      timeoutId = setTimeout(checkSocketConnected);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [socket]);

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
  }, [myPeer]);

  //  TODO 종종 script 로딩 안됨
  return (
    <>
      <AnimatePresence>
        {asyncIsAllReady ? (
          <MotionViewingCSRPage key="live-ing" />
        ) : (
          <MotionBox
            key="live-prepare"
            exit={{ x: 0, opacity: [1, 1, 1, 0], color: ['#000000', '#FFFFFFFF', '#FFFFFF00', '#FFFFFF00'], backgroundColor: ['#FFFFFF', '#282828FF', '#282828FF', '#28282800'] }}
            transition={{ duration: prepareAnimationDuration, times: [0, 0.6, 0.85, 1], type: 'keyframes' }}
            display="flex"
            position="fixed"
            zIndex="10000"
            justifyContent="center"
            alignItems="center"
            w="full"
            minH="100vh"
            sx={{ '.LottieVideoPlay  path': { stroke: '#39c5bb' } }}
          >
            <VStack>
              <Box position="relative">
                <MotionBox whileTap={{ scale: 1.2 }} position="relative">
                  <LottieVideoPlay />
                </MotionBox>
              </Box>
              <Heading fontSize="6xl">
                L<Spinner size="lg" thickness="7px" />
                ading...
              </Heading>
              <Box opacity={isAllReady ? 0 : 1.0} transition={'opacity 1s'}>
                <HStack py="5">
                  <Tag colorScheme={isReadyStream ? 'green' : 'red'}>カメラ</Tag>
                  <Tag colorScheme={isReadyPeer ? 'green' : 'red'}>P2P</Tag>
                  <Tag colorScheme={isReadySocket ? 'green' : 'red'}>Socket</Tag>
                  <Tag colorScheme={isReadyIvs ? 'green' : 'red'}>Script</Tag>
                  <Tag colorScheme={isMediapipeSetup ? 'green' : 'red'}>motion</Tag>
                </HStack>
                <HStack>
                  {[mediapipeError, socketError, peerError].map(errorText => {
                    if (errorText)
                      return (
                        <Alert status="error">
                          <AlertIcon />
                          {errorText}
                        </Alert>
                      );
                    return <></>;
                  })}
                  <PrepareMediaStream setReady={setIsReadyStream} />
                  <PrepareMediaPipeSetup setReady={setIsReadyMediapipeSetup} />
                  <PrepareIVS setReady={setIsReadyIvs} />
                  <PreparePeerConnect setReady={setIsReadyPeer} />
                </HStack>
              </Box>
            </VStack>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
};

export default ViewingPrepareCSRPage;
