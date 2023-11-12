import { useState } from 'react';
import axios from '../../../../../instances/axios';
import styles from './Passion.module.css';
import { passions } from './passionData';


interface Props {
    passionSelected: string[] | undefined;
}

export default function Passion({passionSelected}: Props) {
    const [selected, setSelected] = useState(passionSelected)

    const handleSelect = (data: string) => {
        let temp = (selected) ? selected : [];
        

        temp = temp.filter(passion => passion !== data);
        if (temp && temp.length >= 5) {
            return;
        }
        if (selected?.length === temp.length) {
            temp.push(data);
        }
        axios.put('/user/update-passions', {data: temp}, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            if (response.status === 200) {
                setSelected([...response.data]);
            }
        }).catch(() => {
            alert('Internal server error');
        })
    }
    return (
        <div className={styles.container}>
            {passions.map(passion => {
                if (selected && selected.includes(passion)) {
                    return <span key={passion} onClick={() => handleSelect(passion)} className={styles.selected}>{passion}</span>
                } else {
                    return <span key={passion} onClick={() => handleSelect(passion)} className={styles.passion}>{passion}</span>
                }
            })}
        </div>
    )
}