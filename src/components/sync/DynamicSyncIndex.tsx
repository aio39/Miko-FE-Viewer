import { Box, Flex, Tag } from '@chakra-ui/react';
import { useMyPeer } from '@src/hooks/dynamicHooks';
import { useUser } from '@src/state/swr';
import Peer from 'peerjs';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import CleanUp from '../viewing/prepare/CleanUp';
import PreparePeerConnectToServer from '../viewing/prepare/PreparePeerConnectToServer';
import { ChatInput } from './chat/ChatInput';
import SyncMotion from './motion/SyncMotion';

const ConnectToMyPeer: FC<{ myAccountPeerId: string }> = ({ myAccountPeerId }) => {
  const myPeer = useMyPeer();
  const [myDataConnection, setMyDataConnection] = useState<Peer.DataConnection>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dataConnection = myPeer.connect(myAccountPeerId, { metadata: { type: 'sync' } });
    setMyDataConnection(dataConnection);
    // dataConnection.on('data', (event: DataConnectionEvent) => {
    //   switch (event.type) {
    //     case 'done':
    //       break;
    //     default:
    //       break;
    //   }
    // });
    dataConnection.on('open', () => {
      console.info('open!!!');
      setIsOpen(true);
    });

    return () => {};
  }, []);

  const sendDataToMe = useCallback(
    (data: Object) => {
      myDataConnection?.send(data);
    },
    [myDataConnection],
  );

  return (
    <Box width="full">
      <SyncMotion />
      <Tag colorScheme={isOpen ? 'green' : 'red'}>Sync</Tag>
      <ChatInput sendData={sendDataToMe} />
    </Box>
  );
};

const SyncToMyPeer: FC<{ peerId: string }> = ({ peerId }) => {
  const syncPeerId = peerId + 'sync';
  const isExitedRef = useRef(false);
  const [isReadyPeer, setIsReadyPeer] = useState(false);

  return (
    <>
      {isReadyPeer ? <ConnectToMyPeer myAccountPeerId={peerId} /> : <PreparePeerConnectToServer isExitedRef={isExitedRef} setReady={setIsReadyPeer} peerId={syncPeerId} />}
      <CleanUp isExitedRef={isExitedRef} peerId={syncPeerId} />
    </>
  );
};

export default function SyncPage() {
  const [data, setData] = useState('No result');
  const { data: userData } = useUser();
  const [userPeerId, setUserPeerId] = useState<string>();
  useEffect(() => {
    setUserPeerId(userData!.uuid);
  }, [userData]);

  return (
    <Flex w="full" h="100vh" bg="blackAlpha.800" color="white" justifyContent="center" alignItems="center" flexDirection="column">
      {userPeerId ? (
        <SyncToMyPeer peerId={userPeerId} />
      ) : (
        <Box borderColor="white" border="1px" width="100vh" height="100vh" maxH="400px" maxW="400px">
          <QrReader
            onResult={(result, error) => {
              if (result) {
                setData(result?.text);
              }

              if (error) {
                console.info(error);
              }
            }}
            scanDelay={500}
            containerStyle={{}}
            videoContainerStyle={{}}
            videoStyle={{}}
            constraints={{ facingMode: 'user' }}
          />
        </Box>
      )}
    </Flex>
  );
}
