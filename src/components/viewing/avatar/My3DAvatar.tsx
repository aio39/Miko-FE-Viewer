import { Box } from '@chakra-ui/react';
import { AiOutlineSound } from '@react-icons/all-files/ai/AiOutlineSound';
import { AiOutlineUserAdd } from '@react-icons/all-files/ai/AiOutlineUserAdd';
import { BiVolumeMute } from '@react-icons/all-files/bi/BiVolumeMute';
import { FiMoreHorizontal } from '@react-icons/all-files/fi/FiMoreHorizontal';
import { AvatarModel } from '@src/components/viewing/avatar/AvatarModel';
import { NEXT_URL } from '@src/const';
import { isOnAvatarState, mySyncDataConnectionState } from '@src/state/recoil';
import { useUser } from '@src/state/swr';
import { memo } from 'react';
import { useRecoilValue } from 'recoil';
import { AvatarConnectionStatus } from './AvatarConnectionStatus';
import StatusItem from './AvatarConnectionStatus/StatusItem';
import { AvatarEnterEffect } from './AvatarEnterEffect';
import { AvatarMenu } from './AvatarMenu';
import { AvatarScore } from './AvatarScore';
import RoomChatBox from './RoomChatBox';

const AVATAR_SIZE = 200;

export const My3DAvatar = memo(() => {
  const {
    data: { uuid },
  } = useUser();
  const isOnAvatar = useRecoilValue(isOnAvatarState);
  const mySyncDataConnection = useRecoilValue(mySyncDataConnectionState);
  console.info('abcd', mySyncDataConnection);
  return (
    <AvatarEnterEffect key="me" layoutId="meAvatar">
      <Box
        position="relative"
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        backgroundImage={!isOnAvatar ? "url('/image/temp/avatar.png')" : ''}
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
      >
        <AvatarMenu>
          <BiVolumeMute size="20px" />
          <AiOutlineSound size="20px" />
          <AiOutlineUserAdd size="20px" />
          <FiMoreHorizontal size="20px" />
        </AvatarMenu>
        {isOnAvatar && (
          <Box overflow="hidden" position="relative" pointerEvents="none">
            <AvatarModel
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              isMyAvatar={true}
              peerId={uuid}
              onAntialias
              path={`${NEXT_URL}/resources/babylonjs/models/proseka/proseka_tmp.glb`}
            />
          </Box>
        )}
        <AvatarConnectionStatus>
          <StatusItem name="Sync" status={() => mySyncDataConnection?.open} />
        </AvatarConnectionStatus>
        <AvatarScore uuid={uuid} />
        <Box width="full" position="absolute" top="0" h="2rem" color="white" pointerEvents="none">
          <RoomChatBox peerId={uuid} />
        </Box>
        {/* <TempAddScoreLogic /> */}
      </Box>
    </AvatarEnterEffect>
  );
});

My3DAvatar.displayName = 'My3DAvatar';
