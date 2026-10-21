import { Link } from 'react-router';
import { PATHS } from '../routes';
import styles from './PlaceholderPage.module.css';

/** 아직 옮기지 않은 화면 (마이그레이션 중 임시) */
export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="page">
      <div className={`wrap ${styles.box}`}>
        <span className={styles.badge}>옮기는 중</span>
        <h1>{title}</h1>
        <p>이 화면은 리액트로 옮기는 중이에요. 기존 프로토타입(루트 index.html)에서 확인할 수 있어요.</p>
        <Link to={PATHS.flow}>플로우 맵에서 다른 화면 보기</Link>
      </div>
    </div>
  );
}
