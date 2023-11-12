import { useState } from 'react';
import axios from '../../../../../instances/axios';
import styles from './Language.module.css';
import { languages } from './languageData';


interface Props {
    languageSelected: string[] | undefined;
}

export default function Language({languageSelected}: Props) {
    const [selected, setSelected] = useState(languageSelected)

    const handleSelect = (data: string) => {
        let temp = (selected) ? selected : [];
        

        temp = temp.filter(language => language !== data);
        if (selected?.length === temp.length) {
            temp.push(data);
        }
        axios.put('/user/update-languages', {data: temp}, {
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
            {languages.map(language => {
                if (selected && selected.includes(language)) {
                    return <span key={language} onClick={() => handleSelect(language)} className={styles.selected}>{language}</span>
                } else {
                    return <span key={language} onClick={() => handleSelect(language)} className={styles.language}>{language}</span>
                }
            })}
        </div>
    )
}