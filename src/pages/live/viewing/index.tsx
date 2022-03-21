import { Center, Text } from '@chakra-ui/react';
import { Container } from '@src/components/Container';
import ViewingLayout from '@src/layout/ViewingLayout';
import { curUserTicketState } from '@src/state/recoil/concertState';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { ReactElement } from 'react';
import { useRecoilValue } from 'recoil';

const DynamicViewingPage = dynamic(() => import('../../../components/viewing/ViewingCSRPage'), {
  loading: () => <div> loading</div>,
  ssr: false,
  suspense: true,
});

const ViewingPage = () => {
  const userTicket = useRecoilValue(curUserTicketState);
  console.log('userTicket- viewing page', userTicket);

  const router = useRouter();
  const handleDenyAccess = () => {
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  if (!userTicket) handleDenyAccess();
  if (!userTicket)
    return (
      <Center height="auto" width="full">
        <Text fontSize="7xl">비정상 접근</Text>
      </Center>
    );

  return (
    <Container height="auto" width="full">
      <Script src="https://player.live-video.net/1.6.1/amazon-ivs-player.min.js" strategy="beforeInteractive" />
      <DynamicViewingPage />
    </Container>
  );
};

ViewingPage.getLayout = function getLayout(page: ReactElement) {
  return <ViewingLayout>{page}</ViewingLayout>;
};

export default ViewingPage;
