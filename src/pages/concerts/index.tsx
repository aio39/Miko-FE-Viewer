import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, HStack, Icon, Input, InputGroup, InputLeftElement, InputRightElement, SimpleGrid, Text } from '@chakra-ui/react';
import { FiFilter } from '@react-icons/all-files/fi/FiFilter';
import PaginationBtn from '@src/components/common/button/PaginationBtn';
import CategoryFilter from '@src/components/concert/CategoryFilter';
import ConcertList from '@src/components/home/ConcertList';
import { getPageLaravelData } from '@src/helper';
import BasicLayout from '@src/layout/BasicLayout';
import { usePageLaravel } from '@src/state/swr/useLaravel';
import { Concert } from '@src/types/share';
import { CommonFSW, Pagination } from '@src/types/share/common';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, KeyboardEventHandler, ReactElement, useEffect, useState } from 'react';

const PER_PAGE = 12;

type Data = {
  iniData: Pagination<Concert>;
  initialParam: {
    categoryId?: number;
    page?: number;
    search?: string;
  };
};

const SearchBox = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const onClickSearch = () => {
    setSearchQuery('');
    router.query.search = searchQuery;
    router.push(router, undefined, { shallow: true });
  };

  const enterKey: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter') {
      onClickSearch();
    }
  };
  return (
    <InputGroup size="md">
      <InputLeftElement>
        <SearchIcon pointerEvents="none" color="gray.300" />
      </InputLeftElement>
      <Input pr="4.5rem" type="text" placeholder="Enter title" value={searchQuery} onKeyUp={enterKey} required onChange={onChangeSearch} />
      <InputRightElement width="4.5rem" mr={2}>
        <Button h="1.75rem" size="sm" onClick={onClickSearch} type="submit">
          Search
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export const getServerSideProps: GetServerSideProps<Data> = async context => {
  const categoryId = parseInt(context.query.category_id as string, 10);
  const page = parseInt(context.query.page as string, 10);
  const search = context.query.search as string;
  // context.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate'=59);

  const concerts = await getPageLaravelData('/concerts', {
    filter: categoryId ? [['category_id', categoryId]] : [],
    perPage: PER_PAGE,
    page,
    search,
  }).catch(err => {
    console.error(err);
    return null;
  });

  if (!concerts)
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    };

  return {
    props: {
      iniData: concerts,
      initialParam: {
        ...(categoryId ? { categoryId } : {}),
        ...(page ? { page } : {}),
        ...(search ? { search } : {}),
      },
    },
  };
};

const ConcertListView: FC<{ query: CommonFSW; iniData: Pagination<Concert> }> = ({ query, iniData }) => {
  const { data: pageConcert } = usePageLaravel('/concerts', query, { fallbackData: iniData });

  if (!pageConcert?.data[0]) {
    return (
      <Center height="auto" width="full" minH={'30vh'} minW={{ xl: '120vh' }}>
        <Text fontSize="4xl">コンサートがありません。</Text>
      </Center>
    );
  }

  return (
    <Box>
      <SimpleGrid columns={[2, null, 4]} spacing="35px" pt={4} pb={20}>
        <ConcertList data={pageConcert.data} />
      </SimpleGrid>
      <PaginationBtn data={pageConcert.meta} options={{ shallow: true }} />
    </Box>
  );
};

export default function ConcertPage({ iniData, initialParam }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const [isShowCategoryFilter, setIsShowCategoryFilter] = useState(false);
  const [categoryId, setCategoryId] = useState(initialParam.categoryId);
  const [page, setPage] = useState(initialParam.page);
  const [search, setSearch] = useState(initialParam.search);
  const query: CommonFSW = { page, perPage: PER_PAGE, filter: [['category_id', categoryId]], search: search ? '*' + search + '*' : undefined };

  useEffect(() => {
    const param = parseInt(router.query.page as string, 10);
    if (Number.isNaN(param)) return setPage(undefined);
    setPage(param);
  }, [router.query.page]);

  useEffect(() => {
    const param = parseInt(router.query.category_id as string, 10);
    if (Number.isNaN(param)) return setCategoryId(undefined);
    setCategoryId(param);
  }, [router.query.category_id]);

  useEffect(() => {
    const param = router.query.search as string;
    if (!param) return setSearch(undefined);
    setSearch(param);
  }, [router.query.search]);

  const handleShowCategoryFilter = () => {
    setIsShowCategoryFilter(!isShowCategoryFilter);
  };

  return (
    <>
      <Head>
        <title key="title">Miko - ConcertList</title>
      </Head>
      <Flex justifyContent="center" p={3}>
        <Box w="full" maxW={{ xl: '120vh' }}>
          <SearchBox />
          <HStack py={4}>
            <Icon boxSize={5} onClick={handleShowCategoryFilter} cursor="pointer" as={FiFilter} />
            <Box visibility={isShowCategoryFilter ? 'visible' : 'hidden'}>
              <CategoryFilter />
            </Box>
          </HStack>
          <ConcertListView iniData={iniData} query={query} />
        </Box>
      </Flex>
    </>
  );
}

ConcertPage.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>;
};
