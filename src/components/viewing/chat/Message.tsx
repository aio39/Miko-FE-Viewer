import { Box, Flex, Heading, HStack, Tag, Text, VStack } from '@chakra-ui/react';
import { ChatMessageInterface } from '@src/types/ChatMessageType';
import React, { FC } from 'react';

const COLORS = ['#36C5F0', '#2EB67D', '#E01E5A', '#ECB22E', '#E51670', 'red'];
const DARKEN_COLORS = ['#0a6b88', '#175b3e', '#700f2c', '#815d0b', '#720b38', 'red'];
const MAX_AMOUNT = 10000;

const Message: FC<{ data: ChatMessageInterface }> = ({ data: { sender, text, amount, timestamp } }) => {
  const SuperChat: FC = () => {
    const colorIdx = Math.floor((Math.min(MAX_AMOUNT, amount) / MAX_AMOUNT) * (COLORS.length - 1));

    return (
      <VStack my="1" bgColor={COLORS[colorIdx]} w="full" borderRadius="base">
        <HStack w="full" bgColor={DARKEN_COLORS[colorIdx]} px="2" py="1">
          <VStack w="full" alignItems="start" justifyContent="center">
            <Heading size="md" fontWeight="600" isTruncated>
              {sender}
            </Heading>
            <Heading size="sm">{amount}円</Heading>
          </VStack>
        </HStack>
        <Box w="full" px="2" py="1">
          <Text fontWeight="bold">{text}</Text>
        </Box>
      </VStack>
    );
  };

  const CommonChat: FC = () => {
    return (
      <Flex my="1" pl="2">
        <Text flexGrow="1">
          <Tag as="span" mr="2">
            {sender}
          </Tag>
          {text}
        </Text>
      </Flex>
    );
  };

  if (amount) return <SuperChat />;
  return <CommonChat />;
};

export default Message;
