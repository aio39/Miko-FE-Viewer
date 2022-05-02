import { Center, Text } from '@chakra-ui/react';
import SyncMotion from '@src/components/sync/motion/SyncMotion';

const TextTestPage = () => {
  return (
    <Center flexDir="column">
      <Text fontSize="6xl">Sensor Test</Text>
      <SyncMotion />
    </Center>
  );
};

export default TextTestPage;
