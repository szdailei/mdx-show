import { useEffect, useState } from 'react';
import SkeletonLoading from './SkeletonLoading';

function Loading() {
  const [isShortTimeLoading, setIsShortTimeLoading] = useState(true);
  useEffect(() => {
    let isUnMounted = false;
    function delayRun() {
      if (!isUnMounted) setIsShortTimeLoading(false);
    }

    const timer = setTimeout(() => {
      delayRun();
    }, 1000);

    return () => {
      isUnMounted = true;
      clearTimeout(timer);
    };
  }, []);

  if (isShortTimeLoading) return null;

  return <SkeletonLoading />;
}

export default Loading;
