import { useEffect, useRef, useState } from 'react';

/** 요소 폭에 따라 열 개수를 정함 (디렉토리 메이슨리: 1000px 이상 4열, 700px 이상 3열, 그 밖 2열) */
export function useColumns<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [cols, setCols] = useState(4);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      setCols(w >= 1000 ? 4 : w >= 700 ? 3 : 2);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, cols };
}
