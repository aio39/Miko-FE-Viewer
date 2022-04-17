import { Box, Flex, Image, Text } from '@chakra-ui/react';
import Loading from '@src/components/common/Loading';
import { IMAGE_DOMAIN } from '@src/const';
import { getPageLaravelData } from '@src/helper';
import { enterTicketDataState } from '@src/state/recoil';
import { Product } from '@src/types/share';
import { Pagination } from '@src/types/share/common';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Search from './Search';
import SortSelectForm from './SortSelectForm';

const ProductList = () => {
  const URL_PRODUCTS = '/products';
  const enterTicketData = useRecoilValue(enterTicketDataState);
  const [data, setData] = useState({});

  // function data() {
  //   return getDataFromLaravel<Pagination<Product>>(URL_PRODUCTS, {
  //     filter: [['concert_id', enterTicketData.concertId]],
  //   }).then(response => response.data);
  // }
  useEffect(() => {
    getPageLaravelData<Pagination<Product>>(URL_PRODUCTS, {
      filter: [['concert_id', enterTicketData.concertId]],
    }).then(response => setData(response.data));
  }, []);
  return (
    <Flex direction={'column'}>
      <Search></Search>
      <SortSelectForm data={data}></SortSelectForm>
      {data.data !== undefined ? (
        data.data?.map((item, key) => {
          return (
            <Flex key={key} mb={'20%'}>
              <Flex flexDir={'column'}>
                <Box w={'200px'} rounded={'8%'}>
                  <Image src={`${IMAGE_DOMAIN}products/${item.image}`} boxSize={'full'}></Image>
                </Box>
                <Text>{item.name}</Text>
                <Text textAlign={'right'} fontWeight={'bold'}>
                  ¥{item.price}
                </Text>
              </Flex>
            </Flex>
          );
        })
      ) : (
        <Loading></Loading>
      )}
    </Flex>
  );
};
export default ProductList;
