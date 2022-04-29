import { FiHome } from '@react-icons/all-files/fi/FiHome';
import { FiList } from '@react-icons/all-files/fi/FiList';
import { IoQrCode } from '@react-icons/all-files/io5/IoQrCode';
import { LinkItemProps, SideBarNavItem } from './SideBarNavItem';

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, url: '/' },
  { name: 'Concert List', icon: FiList, url: '/concerts' },
  { name: 'Sync', icon: IoQrCode, url: '/sync' },
];

const CommonSideMenu = () => {
  return (
    <>
      {LinkItems.map(link => (
        <SideBarNavItem link={link} key={link.url} />
      ))}
    </>
  );
};

export default CommonSideMenu;
