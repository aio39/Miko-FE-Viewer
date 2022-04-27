import { Box, Text } from '@chakra-ui/react';
import AsyncBoundary from '@src/components/common/wrapper/AsyncBoundary';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const DynamicArchivePageCSR = dynamic(() => import('@src/components/pageParts/live/archive/ArchivePageCSR'), {
  loading: () => <div> loading</div>,
  ssr: false,
  suspense: true,
});

const ArchivePage = () => {
  const router = useRouter();

  useEffect(() => {
    window.HELP_IMPROVE_VIDEOJS = false; // video.js GA off
  }, []);

  return (
    <Box>
      {router.asPath}
      <Text>코인</Text>
      <AsyncBoundary>
        <DynamicArchivePageCSR />
      </AsyncBoundary>
    </Box>
  );
};

export default ArchivePage;
