import { Box, Tag, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const SyncMotion = () => {
  const [error, setError] = useState('');
  const [xyz, setXyz] = useState<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    const func = async () => {
      const { state } = await navigator.permissions.query({
        // @ts-ignore
        name: 'accelerometer',
      });

      if (state !== 'granted') {
        console.warn("You haven't granted permission to use the light sensor");
        return;
      }

      const laSensor = new LinearAccelerationSensor({ frequency: 60 });

      laSensor.addEventListener('reading', e => {
        console.info('Linear acceleration along the X-axis ' + laSensor.x);
        console.info('Linear acceleration along the Y-axis ' + laSensor.y);
        console.info('Linear acceleration along the Z-axis ' + laSensor.z);
        setXyz(() => [laSensor.x as number, laSensor.y as number, laSensor.z as number]);
      });

      laSensor.addEventListener('error', (err: any) => {
        console.error(err);
        setError(err.message);
      });

      laSensor.start();
    };

    func();

    return () => {};
  }, []);

  return (
    <Box>
      <Tag colorScheme={error ? 'green' : 'red'}>Sensor</Tag>
      <Text> x - {xyz[0]} </Text>
      <Text> y - {xyz[1]} </Text>
      <Text> z - {xyz[2]} </Text>
    </Box>
  );
};

export default SyncMotion;
