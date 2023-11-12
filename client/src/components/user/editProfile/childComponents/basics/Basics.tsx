import basicsData from "./basicsData";
import axios from "../../../../../instances/axios";
import styles from './Basics.module.css';
import { useEffect, useState } from "react";

interface Props {
    basicsSelected: {
        zodiac: string | undefined;
        education: string | undefined;
        familyPlan: string | undefined;
        communication: string | undefined;
        personality: string | undefined;
        loveStyle: string | undefined;
        vaccinated: string | undefined;
    } | undefined;
    where: string;
}

interface Temp {
    zodiac: string | undefined;
    education: string | undefined;
    familyPlan: string | undefined;
    communication: string | undefined;
    personality: string | undefined;
    loveStyle: string | undefined;
    vaccinated: string | undefined;
}

export default function Basics({basicsSelected, where}: Props) {
    const [selected, setSelected] = useState(basicsSelected);

    useEffect(() => {
        const element = document.getElementById(where);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [where]);

    const handleSelect = (key: keyof Temp, value: string | undefined) => {
        const temp = {...selected} as Temp;
        temp[key] = value;
        axios.put('/user/update-basics', {data: temp}, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            if (response.status === 200) {
                setSelected(response.data);
            }
        }).catch(() => {
            alert('Internal server error');
        })
    }
    
    return (
        <div className={styles.container}>
            <h2>Basics</h2>
            <p>Bring your best self forward by adding more about you.</p>
            <hr />
            <div id="zodiac" className={styles.basic}>
                <h5>What is your zodiac sign?</h5>
                <div>
                    {basicsData.zodiac.map(sign => {
                        if (selected && selected?.zodiac === sign) {
                            return <span key={sign} onClick={() => handleSelect('zodiac', undefined)} className={styles.selected}>{sign}</span>
                        } else {
                            return <span key={sign} onClick={() => handleSelect('zodiac', sign)}>{sign}</span>
                        }
                    })}
                </div>
            </div>
            <hr />
            <div id="education" className={styles.basic}>
                <h5>What is your education level?</h5>
                <div>
                    {basicsData.education.map(quality => {
                        if (selected && selected?.education === quality) {
                            return <span key={quality} onClick={() => handleSelect('education', undefined)} className={styles.selected}>{quality}</span>
                        } else {
                            return <span key={quality} onClick={() => handleSelect('education', quality)} >{quality}</span>
                        }
                    })}
                </div>
            </div>
            <hr />
            <div id="familyPlan" className={styles.basic}>
                <h5>Do you want children?</h5>
                <div>
                    {basicsData.familyPlan.map(plan => {
                        if (selected && selected?.familyPlan === plan) {
                            return <span key={plan} onClick={() => handleSelect('familyPlan', undefined)} className={styles.selected}>{plan}</span>
                        } else {
                            return <span key={plan} onClick={() => handleSelect('familyPlan', plan)} >{plan}</span>
                        }
                    })}
                </div>
            </div>
            <hr />
            <div id="vaccinated" className={styles.basic}>
                <h5>Are you vaccinated?</h5>
                <div>
                    {basicsData.vaccinated.map(state => {
                        if (selected && selected?.vaccinated === state) {
                            return <span key={state} onClick={() => handleSelect("vaccinated", undefined)} className={styles.selected}>{state}</span>
                        } else {
                            return <span key={state} onClick={() => handleSelect('vaccinated', state)} >{state}</span>
                        }
                    })}
                </div>
            </div>
            <hr />
            <div id="personality" className={styles.basic}>
                <h5>What is your Personality Type?</h5>
                <div>
                    {basicsData.personality.map(type => {
                        if (selected && selected?.personality === type) {
                            return <span key={type} onClick={() => handleSelect("personality", undefined)} className={styles.selected}>{type}</span>
                        } else {
                            return <span key={type} onClick={() => handleSelect("personality", type)} >{type}</span>
                        }
                    })}
                </div>
            </div>
            <hr />
            <div id="communication" className={styles.basic}>
                <h5>What is your communication style?</h5>
                <div>
                    {basicsData.communication.map(style => {
                        if (selected && selected?.communication === style) {
                            return <span key={style} onClick={() => handleSelect("communication", undefined)} className={styles.selected}>{style}</span>
                        } else {
                            return <span key={style} onClick={() => handleSelect("communication", style)} >{style}</span>
                        }
                    })}
                </div>
            </div>
            <hr />
            <div id="loveStyle" className={styles.basic}>
                <h5>How do you receive love?</h5>
                <div>
                    {basicsData.loveStyle.map(style => {
                        if (selected && selected?.loveStyle === style) {
                            return <span key={style} onClick={() => handleSelect("loveStyle", undefined)} className={styles.selected}>{style}</span>
                        } else {
                            return <span key={style} onClick={() => handleSelect("loveStyle", style)} >{style}</span>
                        }
                    })}
                </div>
            </div>
        </div>
    )
}