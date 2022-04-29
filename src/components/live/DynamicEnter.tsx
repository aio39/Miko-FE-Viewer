import { Box, Button, createIcon, Flex, Grid, GridItem, Heading, HStack, Icon, IconButton, Input, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { FcLock } from '@react-icons/all-files/fc/FcLock';
import { MdPublic } from '@react-icons/all-files/md/MdPublic';
import { IMAGE_DOMAIN, USER_TICKET_COOKIE } from '@src/const';
import { convertDate, setCookie } from '@src/helper';
import { curUserTicketState, enterRoomIdState, enterTicketDataState } from '@src/state/recoil';
import { useUser } from '@src/state/swr';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

const PlayIcon = createIcon({
  displayName: 'PlayIcon',
  viewBox: '0 0 58 58',
  d: 'M28.9999 0.562988C13.3196 0.562988 0.562378 13.3202 0.562378 29.0005C0.562378 44.6808 13.3196 57.438 28.9999 57.438C44.6801 57.438 57.4374 44.6808 57.4374 29.0005C57.4374 13.3202 44.6801 0.562988 28.9999 0.562988ZM39.2223 30.272L23.5749 39.7247C23.3506 39.8591 23.0946 39.9314 22.8332 39.9342C22.5717 39.9369 22.3142 39.8701 22.0871 39.7406C21.86 39.611 21.6715 39.4234 21.5408 39.1969C21.4102 38.9705 21.3421 38.7133 21.3436 38.4519V19.5491C21.3421 19.2877 21.4102 19.0305 21.5408 18.8041C21.6715 18.5776 21.86 18.3899 22.0871 18.2604C22.3142 18.1308 22.5717 18.064 22.8332 18.0668C23.0946 18.0696 23.3506 18.1419 23.5749 18.2763L39.2223 27.729C39.4404 27.8619 39.6207 28.0486 39.7458 28.2713C39.8709 28.494 39.9366 28.7451 39.9366 29.0005C39.9366 29.2559 39.8709 29.507 39.7458 29.7297C39.6207 29.9523 39.4404 30.1391 39.2223 30.272Z',
});

const EnterRoomBtn = () => {
  const router = useRouter();
  const curUserTicket = useRecoilValue(curUserTicketState);
  console.log('enter room btn', curUserTicket);
  const enterHandler = () => {
    setCookie(USER_TICKET_COOKIE, curUserTicket.id + '', 6);
    router.push('/live/viewing', '', { shallow: false });
  };

  return (
    <IconButton
      onClick={enterHandler}
      zIndex={1}
      aria-label={'Play Button'}
      variant={'ghost'}
      _hover={{
        bg: 'transparent',
      }}
      icon={<PlayIcon w={12} h={12} />}
      size={'lg'}
      color={'red.400'}
      position={'absolute'}
      left={'50%'}
      top={'50%'}
      transform={'translateX(-50%) translateY(-50%)'}
    />
  );
};

const PrivateRoomIdInput = () => {
  const [roomId, setRoomId] = useRecoilState(enterRoomIdState);
  const router = useRouter();
  useEffect(() => {
    const queryRoomId = router.query?.roomId;
    if (queryRoomId) {
      setRoomId(queryRoomId as string);
    }
  }, [router.query.roomId as string]);

  const createRoomIdHandler = () => {
    setRoomId(nanoid());
  };

  return (
    <HStack>
      <Input value={roomId} isInvalid={roomId?.length !== 21} contentEditable="false" onChange={e => setRoomId(e.target.value)} />
      <Button colorScheme="green" onClick={createRoomIdHandler}>
        ID 生成
      </Button>
    </HStack>
  );
};

const RoomSelect = () => {
  const [radioValue, setRadioValue] = useState('private');
  const setEnterRoomId = useSetRecoilState(enterRoomIdState);
  const isPublicRoom = useMemo(() => radioValue === 'public', [radioValue]);

  const radioChangeHandler = (value: string) => {
    if (value === 'public') {
      setEnterRoomId(undefined);
    }
    setRadioValue(value);
  };

  return (
    <Box>
      <RadioGroup value={radioValue} onChange={radioChangeHandler}>
        <Stack spacing={5} direction="row">
          <Radio colorScheme="green" value="private">
            <HStack spacing={1}>
              <Text>プライベート</Text>
              {radioValue == 'private' && <Icon boxSize={5} as={FcLock} />}
            </HStack>
          </Radio>
          <Radio colorScheme="blue" value="public">
            <HStack spacing={1}>
              <Text>ランダム</Text>
              {radioValue == 'public' && <Icon boxSize={5} as={MdPublic} color="blue.500" />}
            </HStack>
          </Radio>
        </Stack>
      </RadioGroup>
      <Flex h="60px" w="full" alignItems="center">
        {isPublicRoom ? (
          <Box>
            <Text fontSize="lg" fontWeight="510" color="blue.500">
              ランダムのルームに入場します。
            </Text>
          </Box>
        ) : (
          <PrivateRoomIdInput />
        )}
      </Flex>
    </Box>
  );
};

const CurEnterInfo: FC = () => {
  const router = useRouter();
  useUser();
  const { concert } = useRecoilValue(curUserTicketState);
  const curTicket = useRecoilValue(enterTicketDataState);

  useEffect(() => {
    if (router.isReady) {
      if (!curTicket) {
        router.push('/my/lists/1');
      }
    }
    return () => {};
  }, [router.isReady]);

  if (!curTicket || !concert) return <Box>no ticket</Box>;

  // const { ticket, concert } = curUserTicket;

  const startDate = convertDate(curTicket.concertStartDate, 'YMDHM'); // 티켓 시작날
  const endDate = convertDate(curTicket.concertEndDate, 'YMDHM'); // 티켓 끝나는 날
  const archiveEndTime = convertDate(curTicket.archiveEndTime, 'YMDHM'); // 티켓 끝나는 날

  const [transHover, setTransHover] = useState(false);
  return (
    <Box w="full" px={20}>
      <Stack align={'center'} spacing={{ base: 8, md: 10 }} py={{ base: 4, md: 6 }} direction={{ base: 'column', md: 'row' }}>
        <Stack flex={1} spacing={{ base: 5, md: 5 }}>
          <Box>
            <Heading fontWeight={600} fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}>
              {concert.title}
            </Heading>
            <Heading color={'red.400'} fontSize={{ base: 'lg', sm: 'xl', lg: '2xl' }} my={3}>
              {concert.artist}
            </Heading>
          </Box>
          <Grid templateRows="repeat(1, 1fr)" templateColumns="repeat(6, 1fr)">
            <GridItem rowSpan={1} colSpan={2}>
              <Heading as="h5" size="sm" my={2}>
                公演期間
              </Heading>
              <Heading as="h5" size="sm" my={2}>
                公演時間
              </Heading>
              <Heading as="h5" size="sm" my={2}>
                アーカイブ視聴期間
              </Heading>
            </GridItem>
            <GridItem rowSpan={1} colSpan={4}>
              <Heading as="h5" size="sm" my={2}>
                {startDate} ~ {endDate}時
              </Heading>
              <Heading as="h5" size="sm" my={2}>
                {curTicket.runningTime}分
              </Heading>
              <Heading as="h5" size="sm" my={2}>
                {archiveEndTime}まで
              </Heading>
            </GridItem>
          </Grid>
          <Text color={'gray.500'} className="word" maxW="65vh">
            {concert.content}
          </Text>
          <Stack spacing={{ base: 4, sm: 6 }} direction={{ base: 'column', sm: 'row' }}>
            <RoomSelect />
            {/* <Button rounded={'full'} size={'lg'} fontWeight={'normal'} px={6} colorScheme={'red'} bg={'red.400'} _hover={{ bg: 'red.500' }}>
              Get started
            </Button> */}
          </Stack>
        </Stack>
        <Flex direction="column" flex={1} justify={'center'} align={'start'} position={'relative'} w={'full'}>
          <Box
            position={'relative'}
            height={'450px'}
            rounded={'2xl'}
            boxShadow={'2xl'}
            width={'full'}
            overflow={'hidden'}
            _hover={{
              bg: 'tomato',
              boxShadow: 'xl',
              transition: 'all .2s ease',
              transform: 'scale(1.04)',
            }}
          >
            <EnterRoomBtn />
            <Image
              src={IMAGE_DOMAIN + concert.coverImage}
              placeholder="blur"
              blurDataURL="/image/defaultImage.png"
              quality={70}
              layout="fill"
              objectFit="cover"
              alt={`${concert.title} image`}
              style={{ borderRadius: '12px' }}
            />
          </Box>
        </Flex>
      </Stack>
      <style>
        {`
        .word {
        display: block;
        overflow: hidden;
        white-space: normal;
        word-wrap: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 3 ;
        -webkit-box-orient: vertical;
        }
        `}
      </style>
    </Box>
  );
};

const DynamicEnterPage = () => {
  return <CurEnterInfo />;
};

export default DynamicEnterPage;
