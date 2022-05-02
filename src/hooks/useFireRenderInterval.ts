import { useEffect, useState } from 'react';

export default function useFireRenderInterval(ms: number = 1000) {
  const setRerender = useState(0)[1];

  const fireRerender = () => {
    setRerender(prev => prev + 1);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fireRerender();
    }, ms);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return fireRerender;
}
