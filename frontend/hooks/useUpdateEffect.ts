import { useEffect, useRef } from "react";

type Callback = () => void | (() => void | undefined);

const useUpdateEffect = (callback: Callback, dependencies: any[]) => {
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    return callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export default useUpdateEffect;
