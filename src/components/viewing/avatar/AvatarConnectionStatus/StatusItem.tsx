import { MotionBox } from '@src/components/common/motion/MotionChakra';
import useFireRenderInterval from '@src/hooks/useFireRenderInterval';
import { Variants } from 'framer-motion';
import { FC } from 'react';

const avatarStatusMotion: Variants = {
  initial: {
    width: '20px',
    height: '5px',
  },
  hover: {
    opacity: [1, 1],
    width: '80px',
    height: '30px',
    transition: {
      duration: 0.3,
      type: 'spring',
      when: 'afterChildren',
    },
  },
};

const avatarStatusTextMotion: Variants = {
  initial: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      when: 'beforeChildren',
    },
  },
};

// NOTE Child 재랜더링 되는 경우 잘 생각
const StatusItem: FC<{ status: () => boolean | undefined; name: string }> = ({ status, name }) => {
  const fireRerender = useFireRenderInterval(2500);

  return (
    <MotionBox
      variants={avatarStatusMotion}
      overflow="clip"
      backgroundColor={status() ? 'teal.300' : 'red.500'}
      display="flex"
      justifyContent="center"
      alignItems="center"
      onMouseEnter={fireRerender}
    >
      <MotionBox variants={avatarStatusTextMotion}>
        {name} {status() ? '👌' : '❌'}
      </MotionBox>
    </MotionBox>
  );
};

export default StatusItem;
