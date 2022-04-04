import videoPlayJson from '@src/components/lottie/videoPlay.json';
import { LottieOptions, useLottie } from 'lottie-react';
import { FC } from 'react';

const TempLottieVideoPlay: FC = () => {
  const options: LottieOptions = {
    renderer: 'canvas',
    animationData: videoPlayJson,
    loop: true,
    autoplay: true,
    className: 'LottieVideoPlay',
    style: {
      width: '300px',
      height: '300px',
    },
  };

  const { View } = useLottie(options);

  return View;
};

export default TempLottieVideoPlay;
