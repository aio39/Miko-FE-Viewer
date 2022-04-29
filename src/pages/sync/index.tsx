import AsyncBoundary from '@src/components/common/wrapper/AsyncBoundary';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';

const DynamicSyncPage = dynamic(() => import('@src/components/sync/DynamicSyncIndex'), {
  loading: () => <div> loading</div>,
  ssr: false,
  suspense: true,
});

export default function MobileSync() {
  return (
    <AsyncBoundary>
      <DynamicSyncPage />
    </AsyncBoundary>
  );
}

MobileSync.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};
