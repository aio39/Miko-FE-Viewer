import { Center, Flex, Tab, Table, TabList, TabPanel, TabPanels, Tabs, Tbody, Text, Th, Thead, Tr } from '@chakra-ui/react';
import PaginationBtn from '@src/components/common/button/PaginationBtn';
import AsyncBoundary from '@src/components/common/wrapper/AsyncBoundary';
import ConcertTicket from '@src/components/ConcertTicket';
import BasicLayout from '@src/layout/BasicLayout';
import { useUser } from '@src/state/swr';
import { usePageLaravel } from '@src/state/swr/useLaravel';
import { UserTicket } from '@src/types/share';
import { CommonFSW } from '@src/types/share/common';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC, ReactElement } from 'react';

const PER_PAGE = 6;
type Data = {
  userTicketData: UserTicket[];
};

const UserTicketList: FC<Data> = ({ userTicketData }) => {
  return (
    <>
      <Table variant="simple" mb={7}>
        <Thead>
          <Tr>
            <Th> </Th>
            <Th>予約日</Th>
            <Th>Title</Th>
            <Th>公演期間</Th>
            <Th>アーカイブ視聴期間</Th>
            <Th>公演時間</Th>
            <Th>現状</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userTicketData?.map(userTicket => (
            <ConcertTicket key={userTicket.id} userTicket={userTicket} />
          ))}
        </Tbody>
      </Table>
    </>
  );
};

const MyListPage = () => {
  const router = useRouter();
  const page = parseInt(router.query.page as string, 10);

  const { data: userData } = useUser();

  const query1: CommonFSW = {
    page,
    perPage: PER_PAGE,
    filter: [
      ['user_id', userData?.id],
      ['is_used', 0],
    ],
    with: ['ticket', 'concert'],
  };
  const query2: CommonFSW = {
    page,
    perPage: PER_PAGE,
    filter: [
      ['user_id', userData?.id],
      ['is_used', 1],
    ],
    with: ['ticket', 'concert'],
  };
  const { data: unUsedUserTickets } = usePageLaravel('/user_tickets', query1);
  const { data: usedUserTickets } = usePageLaravel('/user_tickets', query2);

  if (!usedUserTickets || !unUsedUserTickets) {
    return (
      <Center height="auto" width="full">
        <Text fontSize="7xl">No Data</Text>
      </Center>
    );
  }

  return (
    <>
      <Head>
        <title key="title">Ticket Purchase History | Miko</title>
      </Head>
      <Tabs px={10} w="full" variant="enclosed" defaultIndex={0} isFitted>
        <TabList>
          <Tab color="gray">使用前のチケット</Tab>
          <Tab color="gray">使用したチケット</Tab>
        </TabList>
        <AsyncBoundary>
          <TabPanels>
            <TabPanel>
              <UserTicketList userTicketData={unUsedUserTickets.data} />
              {unUsedUserTickets.data.length === 0 && (
                <Flex minH={'20vh'} align={'center'} justify={'center'}>
                  <Text>チケットがありません。</Text>
                </Flex>
              )}
              <PaginationBtn data={unUsedUserTickets.meta} options={{ shallow: true }} />
            </TabPanel>
            <TabPanel>
              <UserTicketList userTicketData={usedUserTickets.data} />
              {usedUserTickets.data.length === 0 && (
                <Flex minH={'20vh'} align={'center'} justify={'center'}>
                  <Text>チケットがありません。</Text>
                </Flex>
              )}
              <PaginationBtn data={usedUserTickets.meta} options={{ shallow: true }} />
            </TabPanel>
          </TabPanels>
        </AsyncBoundary>
      </Tabs>
    </>
  );
};

MyListPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <BasicLayout>
      <AsyncBoundary>{page}</AsyncBoundary>
    </BasicLayout>
  );
};

export default MyListPage;
