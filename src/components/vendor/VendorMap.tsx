import { useEffect, useRef, useState } from 'react';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import { loadKakaoMaps } from '../../data/kakaoMap';
import type { VendorPlace } from '../../data/vendors';
import styles from './VendorMap.module.css';

/** 업체 상세 '찾아오는 길': 카카오맵(못 불러오면 OpenStreetMap) + 카카오맵 길찾기 · 네이버 지도 링크 */
export default function VendorMap({ name, place }: { name: string; place: VendorPlace }) {
  const { lat, lng, area } = place;
  const boxRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    let alive = true;
    const box = boxRef.current;
    loadKakaoMaps().then((maps) => {
      if (!alive || !box) return;
      const center = new maps.LatLng(lat, lng);
      const map = new maps.Map(box, { center, level: 4 });
      map.setZoomable(false); // 휠 · 핀치 확대는 끄고(페이지 스크롤 방해 방지) 버튼으로만
      map.addControl(new maps.ZoomControl(), maps.ControlPosition.RIGHT);
      new maps.Marker({ position: center, map, title: name });
    }).catch(() => { if (alive) setFallback(true); });
    return () => { alive = false; if (box) box.innerHTML = ''; };
  }, [lat, lng, name]);

  const bbox = [lng - 0.006, lat - 0.0035, lng + 0.006, lat + 0.0035].map((n) => n.toFixed(5)).join(',');
  return (
    <section className={styles.map} aria-labelledby="vendor-map-title">
      <div className={styles.head}>
        <h2 id="vendor-map-title">찾아오는 길</h2>
        <p><MapPin aria-hidden="true" /><b>{area}</b><span>대략적인 위치예요 · 정확한 주소는 문의하면 안내받을 수 있어요</span></p>
      </div>
      <div className={styles.frame}>
        {fallback
          ? <iframe title={`${name} 위치 지도`} src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`} loading="lazy" />
          : <div ref={boxRef} className={styles.kakao} role="img" aria-label={`${name} 위치 지도 · ${area}`} />}
      </div>
      <div className={styles.links}>
        <a href={`https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}`} target="_blank" rel="noopener noreferrer">
          <Navigation aria-hidden="true" />카카오맵 길찾기
        </a>
        <a href={`https://map.naver.com/p/search/${encodeURIComponent(area)}`} target="_blank" rel="noopener noreferrer">
          <ExternalLink aria-hidden="true" />네이버 지도에서 보기
        </a>
      </div>
    </section>
  );
}
