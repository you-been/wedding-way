import type { ReactNode } from 'react';
import styles from './PageHead.module.css';

/** 화면 제목: 36px/700 + 설명 16px, 오른쪽에 버튼 · 검색창 등을 둘 수 있음 */
export default function PageHead({ title, desc, children, kicker }: { title: ReactNode; desc?: ReactNode; children?: ReactNode; kicker?: ReactNode }) {
  return (
    <div className={`${styles.head} ${children ? styles.row : ''}`}>
      <div>
        {kicker && <span className={styles.kicker}>{kicker}</span>}
        <h1>{title}</h1>
        {desc && <p>{desc}</p>}
      </div>
      {children}
    </div>
  );
}
