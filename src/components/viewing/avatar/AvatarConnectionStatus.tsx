import { Box } from '@chakra-ui/react';
import { MotionBox } from '@src/components/common/motion/MotionChakra';
import useFireRenderInterval from '@src/hooks/useFireRenderInterval';
import { memo } from 'react';

type Props = {
  children: React.ReactNode[] | React.ReactNode;
};

const CONNECTION_CHECK_INTERVAL = 2500;

export const AvatarConnectionStatus = memo<Props>(({ children }) => {
  const fireRerender = useFireRenderInterval(CONNECTION_CHECK_INTERVAL);

  return (
    <Box onMouseEnter={fireRerender}>
      <MotionBox position="absolute" left="0" top="0" display="flex" whileHover="hover" initial="initial">
        {children}
      </MotionBox>
    </Box>
  );
});
AvatarConnectionStatus.displayName = 'AvatarConnectionStatus';
