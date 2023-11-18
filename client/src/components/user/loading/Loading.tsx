import styles from './Loading.module.css';

export default function Loading() {
    return (
        <div className={styles.loading}>
            <i className="fa-solid fa-cat fa-beat text-white pe-1"></i>
        </div>
    )
}