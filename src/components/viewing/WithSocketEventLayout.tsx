import { showChatToRoom, toastLog, updateUserScore } from '@src/helper';
import { setMotionToAvatar } from '@src/helper/dynamic/setMotionToAvatar';
import { useBeforeunload } from '@src/hooks';
import { useMyPeer, useSocket } from '@src/hooks/dynamicHooks';
import { curUserTicketState, enterRoomIdAsyncState, latestScoreState, myStreamState, PeerDataInterface, peerDataListState, PickUserData } from '@src/state/recoil';
import { useUser } from '@src/state/swr';
import { DataConnectionEvent } from '@src/types/dto/DataConnectionEventType';
import produce from 'immer';
import { useRouter } from 'next/router';
import { DataConnection, MediaConnection } from 'peerjs';
import { FC, ReactElement, useCallback, useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

type PeerFatalErrorType = 'browser-incompatible' | 'invalid-id' | 'invalid-key' | 'ssl-unavailable' | 'server-error' | 'socket-error' | 'socket-closed';

type PeerNotFatalType = 'disconnected' | 'network' | 'peer-unavailable' | 'unavailable-id' | 'webrtc';

type PeerErrorType = PeerFatalErrorType | PeerNotFatalType;

const WithSocketEventLayout: FC<{ children: ReactElement }> = ({ children }) => {
  const socket = useSocket();
  const myPeer = useMyPeer();

  const syncDataConnectionRef = useRef<DataConnection>();

  const { data: userData } = useUser();
  const myPeerUniqueID = userData?.uuid;

  const myStream = useRecoilValue(myStreamState);
  const roomId = useRecoilValue(enterRoomIdAsyncState);
  const userTicket = useRecoilValue(curUserTicketState);
  const { concertId, ticketId, id: userTicketId } = userTicket;

  const setLatestScoreState = useSetRecoilState(latestScoreState);
  const setPeerDataList = useSetRecoilState(peerDataListState);

  const router = useRouter();

  const handleLeavePage = () => {
    console.log('withSocketPeerLayer - handleLeavePage');
    setPeerDataList([]);
  };

  useBeforeunload(() => {
    console.log('windowBeforeUnloadEvent in WithSocketPeerLayer');
    handleLeavePage();
  });

  const addDataConnectionToPeersDataList = useCallback((dataConnection: DataConnection) => {
    setPeerDataList(
      produce(draft => {
        const idx = draft.findIndex(peer => peer.id === dataConnection.peer);
        if (idx >= 0) draft[idx].dataConnection = dataConnection;
      }),
    );
  }, []);

  const addMediaStreamToPeersDataList = useCallback((mediaStream: MediaStream, id: string) => {
    setPeerDataList(
      produce(draft => {
        const idx = draft.findIndex(peer => peer.id === id);
        if (idx >= 0) draft[idx].mediaStream = mediaStream;
      }),
    );
  }, []);

  const addMediaConnectionToPeersDataList = useCallback((mediaConnection: MediaConnection, id: string) => {
    setPeerDataList(
      produce(draft => {
        const idx = draft.findIndex(peer => peer.id === id);
        if (idx >= 0) draft[idx].mediaConnection = mediaConnection;
      }),
    );
  }, []);

  const removePeerById = useCallback((id: string) => {
    setPeerDataList(
      produce(draft => {
        const idx = draft.findIndex(peer => peer.id === id);
        if (idx !== -1) {
          toastLog('info', `${draft[idx].data.name}がルームを出ました。`);
          draft.splice(idx, 1);
        }
      }),
    );
  }, []);

  useEffect(() => {
    if (!socket || !userData || !myPeer) {
      toastLog('error', 'socket, userData, myPeer 중 하나가 없습니다');
      console.log('socket || user 없음', socket, myPeer, userData);
      return;
    }
    console.log('WithSocketPeerLayer  UseEffect');
    socket.emit('fe-new-user-request-join', myPeerUniqueID, roomId, userData, concertId, ticketId, userTicketId);
    socket.on('connect', () => {
      // NOTE 서버 재실행시에 다시 소켓 데이터를 전송, 처음 랜더링 될떄에는 이미 connect 이벤트 이후여서 동작하지 않음.
      if (socket.connected) {
        socket.emit('fe-new-user-request-join', myPeerUniqueID, roomId, userData, concertId, ticketId, userTicketId);
      }
    });

    const addEventToSyncDataConnection = (dataConnection: DataConnection) => {
      dataConnection.on('data', (event: DataConnectionEvent) => {});
    };

    const addEventToDataConnection = (dataConnection: DataConnection) => {
      const id = dataConnection.peer;
      dataConnection.on('data', (event: DataConnectionEvent) => {
        switch (event.type) {
          case 'chat':
            showChatToRoom(id, event.data.text, 5);
            break;
          case 'motion':
            setMotionToAvatar(id, event.data);
            break;
          case 'scoreUpdate':
            updateUserScore(id, event.data);
            break;
          default:
            break;
        }
      });
      // Firefox와 호환 안됨.
      dataConnection.on('close', () => {
        // mediaConnection.close() 나 or 상대가 할 경우 ,
        toastLog('info', `${(dataConnection.metadata as PickUserData).name}とデータコネクションが切断されました。`, 'dataConnection on close');
        removePeerById(id);
      });

      dataConnection.on('error', err => {
        console.error('dataConnection error', err);
        // switch (err.type) {
        //   case '':
        //     break;

        //   default:
        //     break;
        // }

        // toastLog('error', `${(dataConnection.metadata as PickUserData).name}とデータコネクションが切断されました。`, 'dataConnection on error', err);
        // removePeerById(id);
      });
    };

    const addEventToMediaConnection = (mediaConnection: MediaConnection) => {
      mediaConnection.on('stream', remoteStream => {
        addMediaStreamToPeersDataList(remoteStream, mediaConnection.peer);
      });
    };

    const peerOnDataConnection = (dataConnection: DataConnection): void => {
      if (dataConnection.metadata?.type === 'sync') {
        syncDataConnectionRef.current = dataConnection;
        addEventToSyncDataConnection(dataConnection);
      } else {
        addDataConnectionToPeersDataList(dataConnection);
        addEventToDataConnection(dataConnection);
      }
    };
    myPeer.on('connection', peerOnDataConnection);

    //  TODO 소리만 보내기
    const peerOnCall = (mediaConnection: MediaConnection): void => {
      addMediaConnectionToPeersDataList(mediaConnection, mediaConnection.peer);
      addEventToMediaConnection(mediaConnection);
      mediaConnection.answer(myStream);

      mediaConnection.on('close', () => {
        // 나나 상대가 close 했을때
        console.log('mediaConnection close');
      });

      mediaConnection.on('error', err => {
        console.error('mediaConnection error', err);
      });
    };
    myPeer.on('call', peerOnCall);

    myPeer.on('error', err => {
      console.log('myPeer error', err);
    });

    const newUserCome = (otherPeerId: string, roomID: string, otherUserData: PeerDataInterface['data'], otherSocketId: string) => {
      toastLog('info', `${otherUserData.name}がルームに入場しました。`);
      const peerIdDuplicateWithMe = otherPeerId === myPeerUniqueID;
      if (peerIdDuplicateWithMe) {
        toastLog('warning', `${otherUserData.name}のPeerId、${otherPeerId}が被りました。`);
        return;
      }

      setPeerDataList(
        produce(prevPeers => {
          const notFound = !prevPeers.some(peer => peer.id === otherPeerId);
          if (notFound) prevPeers.push({ id: otherPeerId, data: otherUserData });
          return prevPeers;
        }),
      );

      socket.emit('fe-answer-send-peer-id', otherSocketId);
      const mediaConnection = myPeer.call(otherPeerId, myStream);
      addMediaConnectionToPeersDataList(mediaConnection, mediaConnection.peer);
      addEventToMediaConnection(mediaConnection);

      const dataConnection = myPeer.connect(otherPeerId, { metadata: otherUserData });
      dataConnection.on('open', () => {
        addDataConnectionToPeersDataList(dataConnection);
        addEventToDataConnection(dataConnection);
      });
    };

    // TODO 이거 이벤트명, 변수명 수정
    const getAnswerFromRoomBroadcast = (peerId: string, otherUserData: PeerDataInterface['data']) => {
      setPeerDataList(
        produce(prevPeers => {
          const notFound = !prevPeers.some(peer => peer.id === peerId);
          if (notFound && peerId !== myPeerUniqueID)
            prevPeers.push({
              id: peerId,
              data: otherUserData,
            });
          return prevPeers;
        }),
      );
    };

    const failEnterRoom = () => {
      // TODO 새로운 방 번호를 얻고 입장.
      toastLog('info', 'ルームが満員であらたま、他のルームに再接続しています。');
    };

    const userLeft = (peerId: string) => {
      removePeerById(peerId);
    };

    const getMyScore = (score: number) => {
      setLatestScoreState(
        produce(draft => {
          draft[userData.uuid] = score;
        }),
      );
    };

    const shouldOutFromRoom = () => {
      toastLog('info', 'concert ended', '방에서 나가야함.');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    };

    socket.on('be-new-user-come', newUserCome);
    socket.on('be-broadcast-peer-id', getAnswerFromRoomBroadcast);
    socket.on('be-fail-enter-room', failEnterRoom);
    socket.on('be-user-left', userLeft);
    socket.on('be-send-user-score', getMyScore);
    socket.on('be-go-out-room', shouldOutFromRoom);

    return () => {
      console.log('withSocketPeerLayer - useEffect 작동함');
      if (userData) {
        socket.off('be-new-user-come', newUserCome);
        socket.off('be-broadcast-peer-id', getAnswerFromRoomBroadcast);
        socket.off('be-user-left', userLeft);
        socket.off('be-send-user-score', getMyScore);
        socket.off('be-go-out-room', shouldOutFromRoom);

        myPeer.off('connection', peerOnDataConnection);
        myPeer.off('call', peerOnCall);
        handleLeavePage();
      }
    };
    //  무조건 처음 접속 userData만 사용함. userData가 변경되는 경우가 있다면 재접속 해야만 하는 경우
  }, [socket, myPeer]);

  return <> {children}</>;
};

export default WithSocketEventLayout;
