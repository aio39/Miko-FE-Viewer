import { Box, Center, Heading } from '@chakra-ui/react';
import { AiOutlineSound } from '@react-icons/all-files/ai/AiOutlineSound';
import { AiOutlineUserAdd } from '@react-icons/all-files/ai/AiOutlineUserAdd';
import { BiVolumeMute } from '@react-icons/all-files/bi/BiVolumeMute';
import { FiMoreHorizontal } from '@react-icons/all-files/fi/FiMoreHorizontal';
import { AvatarModel } from '@src/components/viewing/avatar/AvatarModel';
import { NEXT_URL } from '@src/const';
import { isOnAvatarState, isOnPeerSoundState } from '@src/state/recoil';
import { PeerDataInterface } from '@src/types/local/PeerData';
import { createRef, memo, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { AvatarConnectionStatus } from './AvatarConnectionStatus';
import StatusItem from './AvatarConnectionStatus/StatusItem';
import { AvatarEnterEffect } from './AvatarEnterEffect';
import { AvatarMenu } from './AvatarMenu';
import { AvatarScore } from './AvatarScore';
import RoomChatBox from './RoomChatBox';

const AVATAR_SIZE = 200;

type Props = {
  peer: PeerDataInterface;
};

export const Peer3DAvatar = memo<Props>(({ peer }) => {
  const { id: uuid, data, dataConnection, mediaStream } = peer;

  const audioRef = createRef<HTMLAudioElement>();
  const isOnPeerSound = useRecoilValue(isOnPeerSoundState);

  const [muted, setMuted] = useState(false);
  const isOnModel = useRecoilValue(isOnAvatarState);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && mediaStream) {
      mediaStream.getAudioTracks()[0].enabled = true;
      audio.srcObject = mediaStream;
    }
  }, [mediaStream]);
  // useEffect interval/ worker interval return에서 죽이기

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isOnPeerSound;
    }
  }, [isOnPeerSound]);

  const handleMute = () => {
    setMuted(prev => !prev);
  };

  return (
    <AvatarEnterEffect key={peer.id} layoutId={'peerAvatar' + peer.id}>
      <Box
        position="relative"
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        {...(isOnModel ? {} : { backgroundImage: "url('/image/temp/avatar.png')" })}
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
      >
        <AvatarMenu>
          <Center onClick={handleMute} cursor="pointer" zIndex="3" borderRadius="full" border="2px" padding="1">
            {muted ? <BiVolumeMute size="20px" /> : <AiOutlineSound size="20px" />}
            <audio autoPlay muted={muted} ref={audioRef}>
              audio
            </audio>
          </Center>
          <AiOutlineSound size="20px" />
          <AiOutlineUserAdd size="20px" />
          <FiMoreHorizontal size="20px" />
        </AvatarMenu>
        {isOnModel && (
          <Box overflow="hidden" position="relative" pointerEvents="none">
            <AvatarModel
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              isMyAvatar={false}
              peerId={uuid}
              onAntialias
              path={`${NEXT_URL}/resources/babylonjs/models/proseka/proseka_tmp.glb`}
            />
          </Box>
        )}
        <Box width="full" position="absolute" top="0" h="2rem" color="white">
          <RoomChatBox peerId={uuid} />
        </Box>
        <Heading position="absolute" top="2" left="1" fontSize="1.2rem">
          {data.name}
        </Heading>
        <AvatarConnectionStatus>
          <StatusItem name="Data" status={dataConnection?.open} />
          <StatusItem name="Media" status={mediaStream?.active} />
        </AvatarConnectionStatus>
        <AvatarScore uuid={uuid} />
      </Box>
    </AvatarEnterEffect>
  );
});

Peer3DAvatar.displayName = 'Peer3DAvatar';
// 친구 추가
// 상세보기
