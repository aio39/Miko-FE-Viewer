import { Center } from '@chakra-ui/react';
import { AvatarModel } from '@src/components/test/AvatarModel';
import dynamic from 'next/dynamic';

const MediaPipeSetup = dynamic(() => import('@src/components/test/Mediapipe'), { ssr: false });

const Avatar = () => {
  return (
    <Center w="full" h="100vh">
      {/* <MediaPipeSetup></MediaPipeSetup> */}
      <AvatarModel></AvatarModel>
    </Center>
  );
};

export default Avatar;
