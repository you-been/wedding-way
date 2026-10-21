// 데이터 접근 함수: 지금은 더미 데이터를 돌려주고, 서버가 생기면 이 안쪽만 API 호출로 바꾼다.
// 화면 컴포넌트는 더미 데이터 파일을 직접 쓰지 않고 이 함수(또는 훅)를 거친다.
import { FEED_IDS, VENDORS, type Vendor } from './vendors';
import { REVIEWS } from './reviews';

export const getVendors = (): Vendor[] => VENDORS;
export const getVendor = (id: number): Vendor | undefined => VENDORS.find((v) => v.id === id);
export const getVendorsByIds = (ids: number[]): Vendor[] => ids.map(getVendor).filter((v): v is Vendor => !!v);
export const getFeedVendors = (): Vendor[] => getVendorsByIds(FEED_IDS);
export const getReviews = () => REVIEWS;
