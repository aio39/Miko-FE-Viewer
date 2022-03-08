import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import Footer from '@src/components/home/Footer';
import MenuBar from '@src/components/home/MenuBar';
import { useRouter } from 'next/router';

const Coin = (params) => {
  return (
    <Box>
      <MenuBar />
      <Box mb={30} pb={20}>
        <Flex pt={50} width="full" justifyContent="center">
          <VStack>
            <Heading fontWeight="700" size="2xl" my="20px">
              Coin
            </Heading>
          </VStack>
        </Flex>
      </Box>
      <Footer />
    </Box>
  );
};

const CoinPage = (second) => {
  const router = useRouter();
  return (
    <Box>
      {router.asPath}
      <Text>코인</Text>
    </Box>
  );
};

export default CoinPage;
