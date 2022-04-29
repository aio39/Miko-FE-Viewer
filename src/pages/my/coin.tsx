import { Box, Center, Divider, Heading, Spinner, Text, VStack } from '@chakra-ui/react';
import PaginationBtn from '@src/components/common/button/PaginationBtn';
import AsyncBoundary from '@src/components/common/wrapper/AsyncBoundary';
import CoinHeader from '@src/components/my/CoinHeader';
import CoinHistory from '@src/components/my/CoinHistory';
import BasicLayout from '@src/layout/BasicLayout';
import { useUser } from '@src/state/swr';
import { usePageLaravel } from '@src/state/swr/useLaravel';
import { CommonFSW } from '@src/types/share/common';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';

const PER_PAGE = 10;

const CoinHistoryListView = () => {
  const { data: userData } = useUser(); // 현재 로그인 user 정보
  const router = useRouter();
  const page = parseInt(router.query.page as string, 10); // query의 page 번호

  const query: CommonFSW = {
    page,
    perPage: PER_PAGE,
    filter: [['user_id', userData?.id]],
  };
  const { data: coinData } = usePageLaravel('/coin_histories', query);

  if (!coinData) return <Box>no ticket</Box>;

  return (
    <>
      <Box mb={16}>
        {coinData.data?.map((coinInfo, index) => (
          <CoinHistory key={index} data={coinInfo} />
        ))}
      </Box>
      {coinData.data.length === 0 && (
        <Center minH={'20vh'}>
          <Text>チケットがありません。</Text>
        </Center>
      )}
      <PaginationBtn data={coinData.meta} options={{ shallow: true }} />
    </>
  );
};

export default function CoinPage() {
  return (
    <>
      <Head>
        <title key="title">User Coin | Miko</title>
      </Head>
      <VStack w="full" px={20} spacing={10} minH="140vh">
        <Heading fontWeight="700" size="2xl">
          私のコイン
        </Heading>
        <Box p={10} boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 10px" w="100%">
          <AsyncBoundary>
            <CoinHeader />
          </AsyncBoundary>
          <Divider my={6} orientation="horizontal" />
          <AsyncBoundary
            pendingFallback={
              <Center>
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
              </Center>
            }
          >
            <CoinHistoryListView />
          </AsyncBoundary>
        </Box>
      </VStack>
    </>
  );
}

CoinPage.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>;
};
