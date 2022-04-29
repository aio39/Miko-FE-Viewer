import { util } from './util';

// 일부 라이프 사이클은  cache.js 에서 담당

declare let self: ServiceWorkerGlobalScope;

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging
//
// self.__WB_DISABLE_DEV_LOGS = true

util();

// listen to message event from window
self.addEventListener('message', event => {
  // HOW TO TEST THIS?
  // Run this in your browser console:
  //     window.navigator.serviceWorker.controller.postMessage({command: 'log', message: 'hello world'})
  // OR use next-pwa injected workbox object
  //     window.workbox.messageSW({command: 'log', message: 'hello world'})
  console.log(event?.data);
});

// TODO body vs message
self.addEventListener('push', event => {
  const { title, body, message, icon, tag } = JSON.parse(event?.data.text() || '{}');
  event?.waitUntil(
    self.registration.showNotification(title || '', {
      body: message || body || '',
      icon: '/image/icons/android-chrome-192x192.png',
    }),
  );
});

self.addEventListener('notificationclick', event => {
  const pushUrl = '/';

  event?.notification.close();
  event?.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      if (clientList.length > 0) {
        //  탭이 열려 있는 경우
        let client = clientList[0];
        // 기본 0번 탭으로하고 포커스되어있는 탭이 있다면 그 탭으로
        clientList.forEach(aClient => {
          if (aClient.focused) client = aClient;
        });

        return client.focus();
      }
      return self.clients.openWindow(pushUrl);
    }),
  );
});

// // 서비스워커가 설치될 때
// self.addEventListener('install', (event) => {
//   // 캐시 등록 이벤트가 끝날 때까지 기다려
//   event.waitUntil(
//     // '캐시-스토리지1'을 연다.
//     // @return {Promise} 연결된 Cache Database를 반환한다.
//     caches
//       .open(PRE_CACHE_NAME)
//       .then((cache) => {
//         console.log('캐시 디비와 연결됨');
//         // addAll 메소드로 내가 캐싱할 리소스를 다 넣어주자.
//         return cache.addAll(urlsToCache);
//       })
//       .then(() => {
//         // 설치 후에 바로 활성화 단계로 들어갈 수 있게 해준다.
//         return self.skipWaiting();
//       })
//   );
// });
