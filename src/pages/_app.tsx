import { ChakraProvider } from '@chakra-ui/react';
import { DevDrawer } from '@src/components/common/dev/DevDrawer';
import PWALifecycle from '@src/components/pageParts/home/PWALifecycle';
import { LARAVEL_URL, NEST_URL } from '@src/const';
import { toastLog } from '@src/helper';
import RootEventCatchLayout from '@src/layout/RootEventCatchLayout';
import '@src/style/css/fonts.css';
import '@src/style/css/global.css';
import theme from '@src/style/theme';
import type * as ivs from 'amazon-ivs-player';
import type { registerIVSQualityPlugin, registerIVSTech } from 'amazon-ivs-player';
import axios from 'axios';
import { NextPage } from 'next';
import { AppProps, NextWebVitalsMetric } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import type Peer from 'peerjs';
import { ReactElement, ReactNode, useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import type { Socket } from 'socket.io-client';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

declare global {
  interface Window {
    socket?: Socket;
    myPeer?: Peer;
    IVSPlayer: typeof ivs;
    registerIVSQualityPlugin: typeof registerIVSQualityPlugin;
    registerIVSTech: typeof registerIVSTech;
    // workbox: typeof Workbox;
  }
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  useEffect(() => {
    // health-check
    axios
      .get('/health-check', { baseURL: LARAVEL_URL })
      .then(value => {
        if (value.status !== 200) return toastLog('error', 'Laravel Server Error');
      })
      .catch((err: any) => {
        toastLog('error', 'Laravel Server Error', '', err);
      });
    axios
      .get('/health-check', { baseURL: NEST_URL })
      .then(value => {
        if (value.status !== 200) return toastLog('error', 'Nest Server Error');
      })
      .catch((err: any) => {
        toastLog('error', 'Nest Server Error', '', err);
      });
  }, []);

  useEffect(() => {
    // PWA
    console.log('MyApp UseEffect');

    const serviceWorkerLoad = () => {
      navigator.serviceWorker.register('/sw/initial.js').then(
        function (registration) {
          console.log('Service Worker registration successful with scope: ', registration.scope);
        },
        function (err) {
          console.log('Service Worker registration failed: ', err);
        },
      );
    };

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', serviceWorkerLoad);
    }

    return () => {
      window.removeEventListener('load', serviceWorkerLoad);
    };
  }, []);

  useEffect(() => {
    // router change events
    router.beforePopState(({ as, options, url }) => {
      console.log('beforePopState');
      console.log(as, options, url);
      return true;
    });

    const handleStart = (url: string) => {
      console.log(`Loading: ${url}`);
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };

    const handleRouterChangeError = (err: any, url: string) => {
      handleStop();
      if (err.cancelled) {
        console.log(`Route to ${url} was cancelled!`);
      } else {
        console.log('handleRouterChangeError', err, url);
      }
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleRouterChangeError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleRouterChangeError);
    };
  }, []);

  useEffect(() => {
    const isChrome = navigator.userAgent.includes('Chrome') && navigator.vendor.includes('Google Inc');
    if (!isChrome) alert('Chrome browser is recommended for best experience.');
  }, []);

  const getLayout = Component?.getLayout || (page => page);
  //  NOTE getLayout을 recoilRoot보다 밖에 두면 Layout이 동일하지 않는 이상 초기화됨.
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1,  maximum-scale=7.0, user-scalable=yes" />
      </Head>
      <PWALifecycle />
      <ChakraProvider resetCSS theme={theme}>
        <RecoilRoot>
          <DevDrawer />
          <RootEventCatchLayout>{getLayout(<Component {...pageProps} />)}</RootEventCatchLayout>
        </RecoilRoot>
      </ChakraProvider>
    </>
  );
}

export default MyApp;

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // console.log({ id, name, label, value });
  console.log(metric);
}
