import { PeerDataInterface } from '@src/types/local/PeerData';
import { User } from '@src/types/share';
import { DataConnection } from 'peerjs';
import { atom } from 'recoil';

export type PickUserData = Pick<User, 'id' | 'avatar' | 'email' | 'name'>;

export const peersArrayState = atom<string[]>({
  key: 'peersArray',
  default: [],
});

export const peerDataListState = atom<PeerDataInterface[]>({
  key: 'peerDataList',
  default: [],
});

export const mySyncDataConnectionState = atom<DataConnection>({
  key: 'mySyncDataConnectionState',
  default: undefined,
  dangerouslyAllowMutability: true,
});
