import {
  Avatar,
  Box,
  BoxProps,
  CloseButton,
  Collapse,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { FiHome } from '@react-icons/all-files/fi/FiHome';
import { FiList } from '@react-icons/all-files/fi/FiList';
import { FiMenu } from '@react-icons/all-files/fi/FiMenu';
import { FiStar } from '@react-icons/all-files/fi/FiStar';
import { IconType } from '@react-icons/all-files/lib';
import { IMAGE_DOMAIN } from '@src/const';
import { useUser } from '@src/state/swr';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactText } from 'react';
import { LoginBtn, LogoutBtn } from '../common/button/LogoutBtn';
import AsyncBoundary from '../common/wrapper/AsyncBoundary';

interface LinkItemProps {
  name: string;
  icon: IconType;
  url: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, url: '/' },
  { name: 'Concert List', icon: FiList, url: '/concerts' },
];

const SubLinkItems: Array<LinkItemProps> = [
  { name: '情報', icon: undefined, url: '/my' },
  { name: '情報修正', icon: undefined, url: '/my/edit' },
  { name: 'チケットリスト', icon: undefined, url: '/my/lists/ticket' },
  { name: 'コイン', icon: undefined, url: '/my/coin' },
  { name: 'カート', icon: undefined, url: '/my/cart' },
  { name: 'ご注文履歴', icon: undefined, url: '/my/order' },
];

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: 'cyan.400',
        color: 'white',
      }}
      userSelect="none"
      {...rest}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: 'white',
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
};

const UserInfoBox = () => {
  const { data } = useUser();

  return (
    <HStack spacing={{ base: '0', md: '6' }}>
      <Flex alignItems={'center'}>
        {data ? (
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar size={'md'} src={IMAGE_DOMAIN + data.avatar} />
                <VStack display={{ base: 'none', md: 'flex' }} alignItems="flex-start" spacing="1px" ml="2">
                  <Text fontSize="md">{data.name}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {data.email}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList borderColor="gray.200">
              <LogoutBtn />
            </MenuList>
          </Menu>
        ) : (
          <LoginBtn />
        )}
      </Flex>
    </HStack>
  );
};

interface TopNavProps extends FlexProps {
  onOpen: () => void;
}

const TopNav = ({ onOpen, ...rest }: TopNavProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton display={{ base: 'flex', md: 'none' }} onClick={onOpen} variant="outline" aria-label="open menu" icon={<FiMenu />} />
      <HStack display={{ base: 'flex', md: 'none' }}>
        <Image boxSize="60px" src="/logo/logo3.png" alt="miko-logo" />
        <Text fontSize="2xl" fontWeight="bold">
          Miko
        </Text>
      </HStack>
      <AsyncBoundary>
        <UserInfoBox />
      </AsyncBoundary>
    </Flex>
  );
};

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SideBarMyPageMenu = () => {
  const router = useRouter();
  const nowPath = router.pathname as string;
  const { data: user } = useUser();
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      {user && (
        <NavItem
          onClick={() => {
            onToggle();
          }}
          icon={FiStar}
        >
          My Page
        </NavItem>
      )}
      <Collapse in={isOpen} animateOpacity>
        {SubLinkItems.map(link => (
          <Link href={link.url} key={link.name}>
            <a>
              <NavItem color={nowPath === link.url && 'cyan.400'} icon={link.icon} pl={12}>
                {link.name}
              </NavItem>
            </a>
          </Link>
        ))}
      </Collapse>
    </>
  );
};

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const router = useRouter();
  const nowPath = router.pathname as string;

  return (
    <Box
      zIndex={100}
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <HStack>
          <Image boxSize="60px" src="/logo/logo3.png" alt="miko-logo" />
          <Text fontSize="2xl" fontWeight="bold">
            Miko
          </Text>
        </HStack>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map(link => (
        <Link href={link.url} key={link.name}>
          <a>
            <NavItem color={nowPath === link.url && 'cyan.400'} icon={link.icon}>
              {link.name}
            </NavItem>
          </a>
        </Link>
      ))}
      <AsyncBoundary>
        <SideBarMyPageMenu />
      </AsyncBoundary>
    </Box>
  );
};

export default function MenuBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer autoFocus={false} isOpen={isOpen} placement="left" onClose={onClose} returnFocusOnClose={false} onOverlayClick={onClose} size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <TopNav onOpen={onOpen} />
    </Box>
  );
}
