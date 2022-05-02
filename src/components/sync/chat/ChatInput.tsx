import { Box, Button, Center, HStack, Textarea } from '@chakra-ui/react';
import ChatModeBtn from '@src/components/viewing/chat/ChatModeBtn';
import { SuperChatOption } from '@src/components/viewing/chat/SuperChatOption';
import { useUser } from '@src/state/swr';
import { ChatMessageInterface } from '@src/types/dto/ChatMessageType';
import { FC, FormEvent, KeyboardEventHandler, useRef, useState } from 'react';
import ResizeTextarea from 'react-textarea-autosize';

export const ChatInput: FC<{ sendData: (data: Object) => void }> = ({ sendData: sendChat }) => {
  const { data: userData } = useUser();

  const [amount, setAmount] = useState<number>(0);
  const [newMessage, setNewMessage] = useState<string>('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = (data: ChatMessageInterface) => {
    sendChat({ data, type: 'chat' });
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

  const onKeyDownHandler: KeyboardEventHandler<HTMLTextAreaElement> = e => {
    e.stopPropagation();
    if (!newMessage) return;
    if (e.key === 'Enter') {
      sendMessage(getData());
    }
  };

  return (
    <Box>
      <Center>
        <ChatModeBtn amount={amount} />
        <SuperChatOption amount={amount} setAmount={setAmount} />
      </Center>
      <HStack position="fixed" bottom="0" width="full" px="2" py="2">
        <Textarea
          id="chat-input"
          as={ResizeTextarea}
          autoComplete="off"
          zIndex={10}
          ref={inputRef}
          width="full"
          autoFocus
          name="message"
          resize="vertical"
          color="white"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Message"
          onKeyUp={onKeyDownHandler}
        />
        <Button type="submit" onClick={onSubmitHandler} colorScheme={amount === 0 ? 'cyan' : 'messenger'}>
          送る
        </Button>
      </HStack>
    </Box>
  );
};
