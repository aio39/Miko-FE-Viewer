import { Box, Button, CSSObject, Heading, HStack, SimpleGrid, Spacer, Text, VStack } from '@chakra-ui/react';
import ConcertList from '@src/components/home/ConcertList';
import MainRanking from '@src/components/home/MainRanking';
import { getPageLaravelData } from '@src/helper/getDataFromLaravel';
import BasicLayout from '@src/layout/BasicLayout';
import { useCheckLogin } from '@src/state/swr';
import { Concert } from '@src/types/share';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FC, ReactElement } from 'react';

type Data = {
  newData: Concert[];
  topData: Concert[];
  jpopData: Concert[];
  kpopData: Concert[];
};

interface SortItemProps {
  title: string;
  subtitle: string;
  url: string;
}

const SortItems: Array<SortItemProps> = [
  { title: 'New', subtitle: '新着', url: '/concerts' },
  { title: 'J-POP', subtitle: '', url: '/concerts?category_id=1&page=1' },
  { title: 'K-POP', subtitle: '', url: '/concerts?category_id=2&page=1' },
];

const SortList: FC<{ data: Concert[]; sortData: SortItemProps }> = ({ data, sortData }) => {
  return (
    <Box w="full">
      <HStack py={6} mt={3}>
        <Heading as="h2" size="2xl">
          {sortData.title}
        </Heading>
        <Text pl={3} pt={5} fontSize="xl" fontWeight="bold">
          {sortData.subtitle}
        </Text>
        <Spacer />
        <Link href={sortData.url}>
          <a>
            <Button mt={3}>더보기</Button>
          </a>
        </Link>
      </HStack>
      <SimpleGrid columns={[2, null, 4]} spacing="25px">
        <ConcertList data={data} />
      </SimpleGrid>
    </Box>
  );
};

const TopList: FC<{ data: Concert[] }> = ({ data: concerts }) => {
  return (
    <Box w="full" maxW={{ xl: '170vh' }}>
      <HStack pl={20}>
        <Heading as="h2" size="2xl" mb={3} pl={20} ml={20}>
          PICK UP
        </Heading>
        <Text pl={3} pt={5} fontSize="xl" fontWeight="bold">
          おすすめ
        </Text>
      </HStack>
      <MainRanking data={concerts} />
    </Box>
  );
};

// TIP 무조건 서버에서 실행됨, Dev모드에서는 매번 실행
export const getStaticProps: GetStaticProps<Data> = async () => {
  // NOTE  undefined를 구조부해 할당할려고 해서 에러 났었음.
  //  getStaticProps에 대해서는 서버 에러일때를 생각하고 에러 핸들링

  const topResultPromise = getPageLaravelData('/concerts', {
    sort: ['-sales_volume'],
    perPage: 12,
  });

  const newResultPromise = getPageLaravelData('/concerts', {
    perPage: 4,
  });

  const jpopResultPromise = getPageLaravelData('/concerts', {
    filter: [['category_id', 1]],
    perPage: 4,
  });

  const kpopResultPromise = getPageLaravelData('/concerts', {
    filter: [['category_id', 2]],
    perPage: 4,
  });

  const [newResult, topResult, jpopResult, kpopResult] = await Promise.allSettled([newResultPromise, topResultPromise, jpopResultPromise, kpopResultPromise]);

  return {
    props: {
      newData: newResult.status === 'fulfilled' ? newResult.value.data : [],
      topData: topResult.status === 'fulfilled' ? topResult.value.data : [],
      jpopData: jpopResult.status === 'fulfilled' ? jpopResult.value.data : [],
      kpopData: kpopResult.status === 'fulfilled' ? kpopResult.value.data : [],
    },
    revalidate: 60 * 10, // 10분 마다 재생성
  };
};

const outerBoxStyles: CSSObject = {
  boxSize: 'full',
  h: '400px',
  p: '10',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: '/logo/mainPageImage.jpg',
  backgroundColor: 'black',
  bgPosition: 'bottom',
  objectFit: 'fill',
  bgRepeat: 'no-repeat',
};

const innerBoxStyles: CSSObject = {
  textAlign: 'center',
  width: 'full',
  color: 'white',
  bg: '#00000000',
  borderColor: '#FFA500',
  textShadow: '0 0 20px gray',
  fontWeight: 'bold',
  fontSize: '18px',
};

const LoginLeadBox = () => {
  const isLogin = useCheckLogin();
  if (isLogin) return <></>;

  return (
    <VStack sx={outerBoxStyles} mb={10} spacing={5} backdropFilter="auto" backdropBlur="8px">
      <Heading color="white">Connect on Miko</Heading>
      <Text color="white"> Discover, stream, and share a constantly expanding mix of concert from emerging and major artists around the world.</Text>
      <Link href="/login">
        <a>
          <Button sx={innerBoxStyles} _hover={{ color: 'black', borderColor: 'orange' }} _active={{ bg: 'orange' }}>
            Sign up for free
          </Button>
        </a>
      </Link>
    </VStack>
  );
};

export default function HomePage({ newData, topData, jpopData, kpopData }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title key="title">Miko - Homepage</title>
        <meta property="og:title" content="Miko" key="og:title" />
        <meta name="description" content="miko homepage, concert list" />
      </Head>
      <LoginLeadBox />
      {/* <TopList data={topData} /> */}
      <VStack>
        <SortList data={newData} sortData={SortItems[0]} />
        <SortList data={jpopData} sortData={SortItems[1]} />
        <SortList data={kpopData} sortData={SortItems[2]} />
      </VStack>
    </>
  );
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>;
};
