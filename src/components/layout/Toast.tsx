import { useToastStore } from '../../stores/toastStore';
import styles from './Toast.module.css';

export default function Toast() {
  const { message, visible } = useToastStore();
  return (
    <div className={`${styles.toast} ${visible ? styles.show : ''}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
