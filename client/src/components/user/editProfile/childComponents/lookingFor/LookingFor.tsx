import { useState } from 'react';
import styles from './LookingFor.module.css';
import { lookingForData } from './lookingForData';
import heartIcon from '../../../../../assets/images/heart-icon.png';
import axios from '../../../../../instances/axios';

interface Props {
    lookingForSelected: string | undefined;
}

export default function LookingFor({lookingForSelected}: Props) {
    const [selected, setSelected] = useState(lookingForSelected);

    const handleSelected = (data: string) => {
        axios.put('/user/update-lookingfor', {data}, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            if (response.status === 200) {
                setSelected(response.data);
            }
        }).catch(() => alert("Internal server error"));
    }
    return(
        <div className={styles.container}>
            <h2>I'm Looking For</h2>
            <p>Increase compatibility by sharing yours!</p>
            <hr />
            <div className={styles.lookingFor}>
                {lookingForData?.map(lookingFor => {
                    return (
                        <div onClick={() => handleSelected(lookingFor)} key={lookingFor}>
                            <span>{lookingFor}</span>
                            {selected === lookingFor &&
                                <img src={heartIcon} alt="marked" />
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    )
}