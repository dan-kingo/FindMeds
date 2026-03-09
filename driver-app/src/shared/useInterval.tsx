import { useEffect, useRef } from "react";

export default function useInterval(callback: () => void, delay: number, enabled = true) {
  const cb = useRef(callback);
  useEffect(() => { cb.current = callback; }, [callback]);
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => cb.current(), delay);
    return () => clearInterval(id);
  }, [delay, enabled]);
}
