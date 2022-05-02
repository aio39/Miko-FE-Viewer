import { Box, Button, Input } from '@chakra-ui/react';
import { useUser } from '@src/state/swr';
import { ChatMessageInterface } from '@src/types/dto/ChatMessageType';
import { FC, FormEvent, KeyboardEventHandler, useRef, useState } from 'react';
import ChatModeBtn from '../../viewing/chat/ChatModeBtn';
import { SuperChatOption } from '../../viewing/chat/SuperChatOption';

export const ChatInput: FC<{ sendChat: (data: ChatMessageInterface) => void }> = ({ sendChat }) => {
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
