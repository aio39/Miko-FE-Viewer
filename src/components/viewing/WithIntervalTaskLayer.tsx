import sendToAllPeers from "@src/helper/sendToAllPeers";
import { latestScoreState } from "@src/state/recoil/scoreState";
import { peerDataListState } from "@src/state/recoil/viewingState";
import { addedScoreForSeconds, roomMemberScores } from "@src/state/shareObject/shareObject";
import { useUser } from "@src/state/swr/useUser";
import produce from "immer";
import { FC, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

export const WithIntervalTaskLayer: FC = ({ children }) => {
  const { data } = useUser();
  // const userId = "0";
  const peers = useRecoilValue(peerDataListState);

  const setLatestScoreState = useSetRecoilState(latestScoreState);

  useEffect(() => {
    const updateLatestScoreIntervalId = setInterval(() => {
      const addedScore = addedScoreForSeconds.getAndReset();
      setLatestScoreState(
        produce(draft => {
          const updatedScore = (draft?.[data.uuid] ?? 0) + addedScore;
          console.log("send to all peer new score", updatedScore);
          sendToAllPeers(peers, { type: "scoreUpdate", data: updatedScore });
          draft[data.uuid] = updatedScore;
        }),
      );
    }, 1000);

    const updateRoomMemberScoreId = setInterval(() => {
      setLatestScoreState(
        produce(draft => {
          for (const key in roomMemberScores) {
            const newScore = roomMemberScores[key];
            draft[key] = newScore;
            delete roomMemberScores[key];
          }
        }),
      );
    }, 1000);

    return () => {
      clearInterval(updateLatestScoreIntervalId);
      clearInterval(updateRoomMemberScoreId);
    };
  }, []);

  return <>{children}</>;
};