import { Box, Circle, Flex, HStack, Spacer, Text } from '@chakra-ui/react';
import { convertDate } from '@src/helper';
import { Coin } from '@src/types/share';
import { FC } from 'react';

const history = ['コイン 充電', 'チケット 購入', 'スーパーチャット 購入', 'アイテム 使用', 'グッズ 購入', 'チケット 販売', 'グッズ 販売', 'スーパーチャット 受け', 'アイテム 受け'];

const CoinHistory: FC<{ data: Coin }> = ({ data }) => {
  //   console.log(data);
  const historyDate = convertDate(data.createdAt, 'YMD');
  return (
    <Flex p="2">
      <Box>
        <HStack>
          {data.type == (0 || 5 || 6 || 7 || 8) ? (
            <Circle size="53px" fontWeight="510" bg="teal" color="white">
              <Text>充電</Text>
            </Circle>
          ) : (
            <Circle size="53px" fontWeight="510" bg="tomato" color="white">
              <Text>使用</Text>
            </Circle>
          )}
          <Box>
            <Text fontSize="sm">{historyDate}</Text>
            <Text>{data.type != (0 || 5 || 6 || 7 || 8) ? `コイン使用 (${history[data.type]})` : history[data.type]} </Text>
          </Box>
        </HStack>
      </Box>
      <Spacer />
      <Text fontSize="lg" fontWeight="520" mt={5}>
        {data.type != (0 || 5 || 6 || 7 || 8) ? '-' : '+'} {data.variation} C
      </Text>
    </Flex>
  );
};

export default CoinHistory;
