import { Box, Button, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, VStack } from '@chakra-ui/react';
import { donateState } from '@src/state/recoil/donateState';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useSetRecoilState } from 'recoil';

const DonateModal = forwardRef((_, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setDonate = useSetRecoilState(donateState);
  const nicknameInputRef = useRef(null);
  const coinInputRef = useRef(null);
  const contentInputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      onOpen();
    },
  }));

  const onSubmitHandler = e => {
    e.preventDefault();
    console.log('donation go!');
    setDonate({ nickname: nicknameInputRef.current.value, coin: coinInputRef.current.value, content: contentInputRef.current.value, start: 1 });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="50vw">
        <ModalHeader>donation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <form onSubmit={onSubmitHandler}>
              <VStack>
                <FormLabel>nickname</FormLabel>
                <Input ref={nicknameInputRef} type="text"></Input>
                <FormLabel>zeni</FormLabel>
                <Input ref={coinInputRef} type="number"></Input>
                <FormLabel>content</FormLabel>
                <Input ref={contentInputRef} type="text"></Input>
                <Button type="submit"></Button>
              </VStack>
            </form>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onSubmitHandler}></Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

DonateModal.displayName = 'DonateEffect';

export default DonateModal;
