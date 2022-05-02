import { Button } from '@chakra-ui/react';
import { chatModeState } from '@src/state/recoil';
import { ComponentProps, FC } from 'react';
import { useRecoilState } from 'recoil';
import chatModeCompute from './computeChatMode';

const ChatModeBtn: FC<{ amount: number; buttonProps?: ComponentProps<typeof Button> }> = ({ amount, buttonProps }) => {
  const [chatMode, setChatMode] = useRecoilState(chatModeState);

  return (
    <Button
      colorScheme="facebook"
      width="20"
      onClick={() =>
        setChatMode(prev => {
          if (prev === 'private') return 'public';
          return 'private';
        })
      }
      {...buttonProps}
    >
      {chatModeCompute(amount, chatMode) === 'public' ? '全体へ' : 'ルームへ'}
    </Button>
  );
};

export default ChatModeBtn;
