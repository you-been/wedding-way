import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';
import styles from './Button.module.css';

// DESIGN.md button: 52px(주요) · 36px(작은) / ink · brand · line(잉크 테두리) · outline(회색 테두리 40px) · ghost(회색 테두리)
export type ButtonVariant = 'ink' | 'brand' | 'line' | 'outline' | 'ghost';
export type ButtonSize = 'md' | 'sm';

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  to?: string; // 있으면 링크로 렌더
  className?: string;
  children: ReactNode;
}

export default function Button({ variant = 'ink', size = 'md', block, to, className = '', children, type = 'button', ...rest }: Props) {
  const cls = [styles.btn, styles[variant], size === 'sm' ? styles.sm : '', block ? styles.block : '', className].filter(Boolean).join(' ');
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  return <button type={type} className={cls} {...rest}>{children}</button>;
}
