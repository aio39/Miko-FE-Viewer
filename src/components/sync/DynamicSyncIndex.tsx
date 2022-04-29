import { Box, Button, Flex } from '@chakra-ui/react';
import { useMyPeer } from '@src/hooks/dynamicHooks';
import { useUser } from '@src/state/swr';
import { DataConnectionEvent } from '@src/types/dto/DataConnectionEventType';
import Peer from 'peerjs';
import { FC, useEffect, useRef, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import CleanUp from '../viewing/prepare/CleanUp';
import PreparePeerConnectToServer from '../viewing/prepare/PreparePeerConnectToServer';

const ConnectToMyPeer: FC<{ myAccountPeerId: string }> = ({ myAccountPeerId }) => {
  const myPeer = useMyPeer();
  const [myDataConnection, setMyDataConnection] = useState<Peer.DataConnection>();

  useEffect(() => {
    const dataConnection = myPeer.connect(myAccountPeerId, { metadata: { type: 'sync' } });
    setMyDataConnection(dataConnection);
    dataConnection.on('data', (event: DataConnectionEvent) => {
      switch (event.type) {
        case 'done':
          break;
        default:
          break;
      }
    });
    dataConnection.on('open', () => {
      console.info('open!!!');
    });

    return () => {};
  }, []);

  const sendDataTest = () => {
    myDataConnection?.send({ type: 'test', data: 'aaaaa' });
  };

  return (
    <Box>
      ConnectToMyPeer
      {myDataConnection ? 'connect' : 'no'}
      <Button onClick={sendDataTest}>Click</Button>
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
