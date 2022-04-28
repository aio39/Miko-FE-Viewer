import { Box, Button } from '@chakra-ui/react';
import { NEST_URL, VapidServerKey } from '@src/const';
import { UserTicket } from '@src/types/share';
import axios from 'axios';
import { FC } from 'react';

const Noti: FC<{ data: UserTicket }> = ({ data: userTicket }) => {
  // const worker = new Worker(new URL('@src/worker/test.worker.ts', import.meta.url), { type: 'module' });
  // worker.postMessage({ chat: '콘서트가 시작' });

  function postSubscription(Subscription: PushSubscription) {
    console.log('data', userTicket);
    console.log('subscription', Subscription);
    const startDate = userTicket.ticket.concertStartDate;
    const concertData = userTicket.concert;

    axios.post(`${NEST_URL}/register`, { Subscription, concertData, startDate }).catch(err => console.log(err));
  }

  async function requestNotification() {
    Notification.requestPermission().then(status => {
      if (status === 'denied') {
        alert('Notification 거부됨');
      } else if (navigator.serviceWorker) {
        navigator.serviceWorker
          .register('/sw/test.worker.js') // serviceworker 등록
          .then(async function (registration) {
            const subscribeOptions = {
              userVisibleOnly: true,
              // push subscription이 유저에게 항상 보이는지 여부. 알림을 숨기는 등 작업이 들어가지는에 대한 여부인데, 크롬에서는 true 밖에 지원안한다.
              applicationServerKey: VapidServerKey, // 발급받은 vapid public key
            };
            registration.pushManager.subscribe(subscribeOptions).then(function (pushSubscription) {
              // subscription 정보를 저장할 서버로 보낸다.
              postSubscription(pushSubscription);
            });
          });
      }
    });
  }

  return (
    <Box>
      <Button onClick={requestNotification}>30분전 알람 받기</Button>
    </Box>
  );
};

export default Noti;
