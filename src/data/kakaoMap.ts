// 카카오맵 JavaScript SDK 불러오기 (한 번만). 키가 없거나 등록 안 된 도메인이면 실패 → 지도 컴포넌트가 다른 지도로 대신함

/* 쓰는 기능만 최소한으로 적은 타입 */
export interface KakaoLatLng { readonly __brand: 'LatLng' }
export interface KakaoMap { setZoomable(on: boolean): void; addControl(control: unknown, position: number): void; relayout(): void; setCenter(latlng: KakaoLatLng): void }
export interface KakaoMaps {
  load(cb: () => void): void;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (el: HTMLElement, opts: { center: KakaoLatLng; level: number }) => KakaoMap;
  Marker: new (opts: { position: KakaoLatLng; map: KakaoMap; title?: string }) => unknown;
  ZoomControl: new () => unknown;
  ControlPosition: { RIGHT: number };
}
declare global {
  interface Window { kakao?: { maps: KakaoMaps } }
}

const KEY = import.meta.env.VITE_KAKAO_JS_KEY as string | undefined;
let loading: Promise<KakaoMaps> | null = null;

export function loadKakaoMaps(): Promise<KakaoMaps> {
  if (!KEY) return Promise.reject(new Error('카카오맵 키가 없어요'));
  if (loading) return loading;
  loading = new Promise<KakaoMaps>((resolve, reject) => {
    const done = () => window.kakao!.maps.load(() => resolve(window.kakao!.maps));
    if (window.kakao?.maps) { done(); return; }
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY}&autoload=false`;
    script.async = true;
    script.onload = () => (window.kakao?.maps ? done() : reject(new Error('카카오맵을 불러오지 못했어요')));
    script.onerror = () => reject(new Error('카카오맵을 불러오지 못했어요'));
    document.head.appendChild(script);
  }).catch((e) => { loading = null; throw e; }); // 실패하면 다음에 다시 시도
  return loading;
}
