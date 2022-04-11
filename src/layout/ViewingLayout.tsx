import Loading from '@src/components/common/Loading';
import AsyncBoundary from '@src/components/common/wrapper/AsyncBoundary';
import { FC } from 'react';

const CustomLoading: FC = () => {
  return <Loading></Loading>;
};

const Layout = ({ children }) => {
  return (
    <AsyncBoundary pendingFallback={<CustomLoading />}>
      <main>{children}</main>
    </AsyncBoundary>
  );
};

export default Layout;
