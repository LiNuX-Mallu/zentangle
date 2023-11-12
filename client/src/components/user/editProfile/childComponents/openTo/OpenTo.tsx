import { useState } from 'react';
import axios from '../../../../../instances/axios';
import styles from './OpenTo.module.css';
import { openToData } from './openToData';


interface Props {
    openToSelected: string[] | undefined;
}

export default function OpenTo({openToSelected}: Props) {
    const [selected, setSelected] = useState(openToSelected)

    const handleSelect = (data: string) => {
        let temp = (selected) ? selected : [];

        temp = temp.filter(passion => passion !== data);
        if (temp && temp.length >= 3) {
            return;
        }
        if (selected?.length === temp.length) {
            temp.push(data);
        }
        axios.put('/user/update-opento', {data: temp}, {
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
            <h2>Relationship Type</h2>
            <p>What type of relationship are you open to?</p>
            <hr />
            {openToData.map(openTo => {
                if (selected && selected.includes(openTo)) {
                    return <span key={openTo} onClick={() => handleSelect(openTo)} className={styles.selected}>{openTo}</span>
                } else {
                    return <span key={openTo} onClick={() => handleSelect(openTo)} className={styles.opento}>{openTo}</span>
                }
            })}
        </div>
    )
}