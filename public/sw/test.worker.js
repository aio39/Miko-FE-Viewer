/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-globals */

self.addEventListener('push', event => {
  const { title, body, icon, tag } = JSON.parse(event.data && event.data.text());
  // 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png';

  event.waitUntil(self.registration.showNotification(title || '', { body, tag, icon }));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const urlToOpen = 'http://localhost:3000';

  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        if (clientList.length > 0) {
          // 이미 열려있는 탭이 있는 경우
          return clientList[0].focus().then(client => client.navigate(urlToOpen));
        }
        return self.clients.openWindow(urlToOpen);
      }),
  );
});
