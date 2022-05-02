import { MotionBox } from '@src/components/common/motion/MotionChakra';
import { memo } from 'react';

type Props = {
  children: React.ReactNode[] | React.ReactNode;
};

export const AvatarConnectionStatus = memo<Props>(({ children }) => {
  return (
    <MotionBox position="absolute" left="0" top="0" display="flex" whileHover="hover" initial="initial">
      {children}
    </MotionBox>
  );
});
AvatarConnectionStatus.displayName = 'AvatarConnectionStatus';
