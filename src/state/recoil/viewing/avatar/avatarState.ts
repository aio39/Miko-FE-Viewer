import { atom } from 'recoil';

export const currentAvatarState = atom<{ [peerId: string]: number }>({
  key: 'currentAvatar',
  default: { kirari: 150 }, // dummy
});
