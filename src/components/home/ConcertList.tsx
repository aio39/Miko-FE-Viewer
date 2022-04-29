import { Box, Text } from '@chakra-ui/react';
import { IMAGE_DOMAIN } from '@src/const';
import { convertDate } from '@src/helper';
import { Concert } from '@src/types/share';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';

//  width와 height를 지정함으로서 레이아웃 시프트를 최소화
//  외부 파일일 경우 반드시 줘야함. 자동으로 크기 계산을 못 하므로. 그리고 blurDataUrl를 준다.
//  큰 이미지 파일은 priority 로 우선순위 상승, 첫 화면에 보여할때 줌.
// fill을 준경우 부모 사이즈로 자동으로 커짐. 그리고 objectFit을 fill contain cover를 줌.
// fill일 경우 부모는 반드시 relative , responsive일 경우에는 block 모드
// 스타일링은 className

const ConcertCard: FC<{ concert: Concert }> = ({ concert }) => {
  const concertStartDate = convertDate(concert.allConcertStartDate, 'YMDHM');

  // console.log(concert);
  return (
    <Link href={`/concerts/${concert.id}`}>
      <a>
        <Box
          borderRadius="12px"
          transition="all 0.2s linear"
          transitionDuration="0.2s"
          boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 12px"
          _hover={{
            transform: 'scale(1.05)',
            transitionDuration: '0.2s',
          }}
        >
          <Image
            src={IMAGE_DOMAIN + concert.coverImage}
            placeholder="blur"
            blurDataURL="/image/defaultImage.png"
            quality={70}
            objectFit="cover"
            width={300}
            height={300}
            layout="responsive"
            alt={`${concert.title} image`}
            style={{ borderRadius: '12px' }}
          />
        </Box>
        <Box my={2}>
          <Text color="gray.700" fontSize="md">
            {concertStartDate}
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {concert.title}
          </Text>
        </Box>
      </a>
    </Link>
  );
};

const ConcertList: FC<{ data: Concert[] }> = ({ data }) => {
  const concerts = data;
  return (
    <>
      {concerts?.map((concert, index) => (
        <Box key={index} maxW={350}>
          <ConcertCard concert={concert} />
        </Box>
      ))}
    </>
  );
};

export default ConcertList;
