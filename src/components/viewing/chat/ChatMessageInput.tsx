import { Box, Button, Center, Input, ScaleFade } from '@chakra-ui/react';
import { sendToAllPeers, showChatToRoom } from '@src/helper';
import { useSocket } from '@src/hooks/dynamicHooks';
import { chatModeState, isShowChatInputState, mySyncDataConnectionState, peerDataListState } from '@src/state/recoil';
import { addedScoreForSeconds } from '@src/state/shareObject/shareAddedScoreForSeconds';
import { useUser } from '@src/state/swr';
import { ChatMessageInterface } from '@src/types/dto/ChatMessageType';
import { SyncDataConnectionEvent } from '@src/types/dto/DataConnectionEventType';
import { FormEvent, KeyboardEventHandler, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DoneOption } from './DoneOption';
import { SuperChatOption } from './SuperChatOption';

const ChatMessageInput = memo(() => {
  const socket = useSocket();
  const { data: userData } = useUser();
  const [isShow, setIsShow] = useRecoilState(isShowChatInputState);
  const [chatMode, setChatMode] = useRecoilState(chatModeState);
  const peers = useRecoilValue(peerDataListState);
  const inputRef = useRef<HTMLInputElement>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [mySyncDataConnection, setMySyncDataConnection] = useRecoilState(mySyncDataConnectionState);

  const chatModeCompute = useCallback(() => {
    if (amount !== 0) return 'public';
    if (chatMode === 'public') return 'public';
    return 'private';
  }, [amount, chatMode]);

  const sendMessage = useCallback(
    (data: ChatMessageInterface) => {
      addedScoreForSeconds.addScore(1, 'chat');

      sendToAllPeers(peers, { type: 'chat', data });
      showChatToRoom(userData!.uuid, newMessage, 5);

      if (chatModeCompute() === 'public') {
        socket.emit('fe-send-message', data);
      }

      setNewMessage('');
      setAmount(0);
      inputRef.current?.focus();
    },
    [peers, socket, newMessage, chatModeCompute, userData],
  );

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
    if (e.key === 'Esc' || e.key === 'Escape') {
      setIsShow(false);
    }
  };

  useEffect(() => {
    if (!mySyncDataConnection) return;
    mySyncDataConnection.on('data', (event: SyncDataConnectionEvent) => {
      if (event.type === 'chat') {
        sendMessage(event.data);
      }

      if (event.type === 'test') {
        console.info('aaaaa', event.data);
      }
    });
  }, [mySyncDataConnection]);

  return (
    <Box bottom="2" position="fixed" zIndex={100}>
      <ScaleFade in={isShow}>
        <Center bgColor="white" p="2" backgroundColor="#000000AA" border="2px" borderRadius="xl" gap="10px" px="4" py="4">
          <Button
            colorScheme="facebook"
            width="20"
            onClick={() =>
              setChatMode(prev => {
                if (prev === 'private') return 'public';
                return 'private';
              })
            }
          >
            {chatModeCompute() === 'public' ? '全体へ' : 'ルームへ'}
          </Button>
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
          <DoneOption />
          <SuperChatOption amount={amount} setAmount={setAmount} />
          <Button type="submit" onClick={onSubmitHandler} colorScheme={amount === 0 ? 'cyan' : 'messenger'}>
            送る
          </Button>
        </Center>
      </ScaleFade>
    </Box>
  );
});

ChatMessageInput.displayName = 'ChatMessageInput';

export default ChatMessageInput;
