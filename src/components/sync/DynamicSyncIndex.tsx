import { Box, Button, Flex, Input } from '@chakra-ui/react';
import { useMyPeer } from '@src/hooks/dynamicHooks';
import { useUser } from '@src/state/swr';
import { ChatMessageInterface } from '@src/types/dto/ChatMessageType';
import { DataConnectionEvent } from '@src/types/dto/DataConnectionEventType';
import Peer from 'peerjs';
import { FC, FormEvent, KeyboardEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import ChatModeBtn from '../viewing/chat/ChatModeBtn';
import { SuperChatOption } from '../viewing/chat/SuperChatOption';
import CleanUp from '../viewing/prepare/CleanUp';
import PreparePeerConnectToServer from '../viewing/prepare/PreparePeerConnectToServer';

const ChatInput: FC<{ sendChat: (data: ChatMessageInterface) => void }> = ({ sendChat }) => {
  const { data: userData } = useUser();

  const [amount, setAmount] = useState<number>(0);
  const [newMessage, setNewMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = (data: ChatMessageInterface) => {
    sendChat(data);
    setNewMessage('');
    setAmount(0);
    inputRef.current?.focus();
  };

  const getData = (): ChatMessageInterface => ({
    sender: userData!.name,
    text: newMessage,
    amount,
    timestamp: Date.now(),
  });

  const onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage) return;

    sendMessage(getData());
  };

  const onKeyDownHandler: KeyboardEventHandler<HTMLInputElement> = e => {
    e.stopPropagation();
    if (!newMessage) return;
    if (e.key === 'Enter') {
      sendMessage(getData());
    }
  };

  return (
    <Box>
      <ChatModeBtn amount={amount} />
      <Input
        id="chat-input"
        autoComplete="off"
        zIndex={10}
        ref={inputRef}
        width="50vw"
        autoFocus
        type="text"
        name="message"
        color="white"
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
        placeholder="Message"
        onKeyUp={onKeyDownHandler}
      />
      <SuperChatOption amount={amount} setAmount={setAmount} />
      <Button type="submit" onClick={onSubmitHandler} colorScheme={amount === 0 ? 'cyan' : 'messenger'}>
        送る
      </Button>
    </Box>
  );
};

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

  const sendChat = useCallback(
    (data: ChatMessageInterface) => {
      myDataConnection?.send({ type: 'chat', data });
    },
    [myDataConnection],
  );

  return (
    <Box>
      ConnectToMyPeer
      {myDataConnection ? 'connect' : 'no'}
      <ChatInput sendChat={sendChat} />
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
