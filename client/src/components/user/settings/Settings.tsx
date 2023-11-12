import styles from './Settings.module.css';
import homeIcon from '../../../assets/images/home-icon.png';

interface Props {
    setSpace: React.Dispatch<React.SetStateAction<string>>;
}

export default function Settings({setSpace}: Props) {
    return(
        <div className={styles.settings}>
            <div className={styles.topbar}>
                <img onClick={() => setSpace('home')} src={homeIcon} />
            </div>
        </div>
    )
}