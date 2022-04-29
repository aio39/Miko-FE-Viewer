import { Box, Drawer, DrawerContent, Flex, useDisclosure } from '@chakra-ui/react';
import Footer from '@src/components/home/Footer';
import { FC, ReactElement } from 'react';
import { SideBar } from './basicLayout/sideNav/Sidebar';
import { TopNav } from './basicLayout/topNav/TopNav';

//  NOTE <Loading/>이 아닌 Loading으로 경고
type Props = {
  children: ReactElement;
};

const Layout: FC<Props> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" display="flex" flexDir="column">
      <SideBar onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer autoFocus={false} isOpen={isOpen} placement="left" onClose={onClose} returnFocusOnClose={false} onOverlayClick={onClose} size="full">
        <DrawerContent>
          <SideBar
            onClose={onClose}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              if ((e.target as Element).classList.contains('SideBarNavItem')) onClose();
            }}
          />
        </DrawerContent>
      </Drawer>
      <TopNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} mt="5" p="14" flexGrow={1} paddingBottom="100px">
        <Flex direction="column" alignItems="center">
          {children}
        </Flex>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
