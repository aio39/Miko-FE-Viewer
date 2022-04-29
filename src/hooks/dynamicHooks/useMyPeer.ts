import { useUser } from '@src/state/swr';
import Peer from 'peerjs';
import { useRef } from 'react';

type ExtendPeer = InstanceType<typeof Peer> & { open: boolean };

export const useMyPeer = (customId?: string) => {
  const { data } = useUser();

  const myPeer = useRef<ExtendPeer>(
    (window.myPeer as ExtendPeer) ??
      (new Peer(customId || data!.uuid, {
        debug: 0,
        host: process.env.NEXT_PUBLIC_PEER_HOST ?? '0.peerjs.com', // default 0.peerjs.com
        port: process.env.NEXT_PUBLIC_PEER_PORT ? parseInt(process.env.NEXT_PUBLIC_PEER_PORT, 10) : 443, // default 443
        path: process.env.NEXT_PUBLIC_PEER_PATH ?? '/', // default '/'
        // secure: true,

        config: {
          iceServers: [
            {
              urls: 'stun:openrelay.metered.ca:80',
            },
            // {
            //   urls: 'turn:openrelay.metered.ca:80',
            //   username: 'openrelayproject',
            //   credential: 'openrelayproject',
            // },
            {
              urls: 'turn:openrelay.metered.ca:443',
              username: 'openrelayproject',
              credential: 'openrelayproject',
            },
            // {
            //   urls: 'turn:openrelay.metered.ca:443?transport=tcp',
            //   username: 'openrelayproject',
            //   credential: 'openrelayproject',
            // },
          ],
        },
      }) as ExtendPeer),
  );

  globalThis.myPeer = myPeer.current;

  return myPeer.current;
};
