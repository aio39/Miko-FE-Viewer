import { Button, Center, Input, VStack } from '@chakra-ui/react';
import { AvatarModel } from '@src/components/test/AvatarModel';
import { currentAvatarState } from '@src/state/recoil';
import produce from 'immer';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { useSetRecoilState } from 'recoil';

const MediaPipeSetup = dynamic(() => import('@src/components/test/Mediapipe'), { ssr: false });

const Avatar = () => {
  const inputRef = useRef(null);
  const setCurrentAvatar = useSetRecoilState(currentAvatarState);
  return (
    <Center w="full" h="100vh">
      <VStack>
        <MediaPipeSetup></MediaPipeSetup>
        <AvatarModel></AvatarModel>
        <Input type="number" ref={inputRef} defaultValue={1}></Input>
        <Button
          onClick={() => {
            setCurrentAvatar(
              produce(draft => {
                // eslint-disable-next-line
                draft['test'] = inputRef.current.value;
                return draft;
              }),
            );
          }}
        >
          change avatar
        </Button>
      </VStack>
    </Center>
  );
};

export default Avatar;
