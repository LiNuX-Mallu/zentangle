import lifestyleData from "./lifestyleData";
import axios from "../../../../../instances/axios";
import styles from './Lifestyle.module.css';
import { useEffect, useState } from "react";

interface Props {
    lifestyleSelected: {
        pets: string | undefined;
        drink: string | undefined;
        smoke: string | undefined;
        workout: string | undefined;
        diet: string | undefined;
        socialMedia: string | undefined;
        sleep: string | undefined;
    } | undefined;
    where: string;
}

interface Temp {
    pets: string | undefined;
    drink: string | undefined;
    smoke: string | undefined;
    workout: string | undefined;
    diet: string | undefined;
    socialMedia: string | undefined;
    sleep: string | undefined;
}

export default function Lifestyle({lifestyleSelected, where}: Props) {
    const [selected, setSelected] = useState(lifestyleSelected);

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
        axios.put('/user/update-lifestyle', {data: temp}, {
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
            <h2>Lifestyle</h2>
            <p>Bring your best self forward by adding your lifestyle.</p>
            <hr />
            <div id="pets" className={styles.lifestyle}>
                <h5>Do you have any pets?</h5>
                <div>
                    {lifestyleData.pets.map(pet => {
                        if (selected && selected?.pets === pet) {
                            return <span key={pet} onClick={() => handleSelect('pets', undefined)} className={styles.selected}>{pet}</span>
                        } else {
                            return <span key={pet} onClick={() => handleSelect('pets', pet)}>{pet}</span>
                        }
                    })}
                </div>
            </div>
            <hr />
            <div id="drink" className={styles.lifestyle}>
                <h5>How often do you drink?</h5>
                <div>
                    {lifestyleData.drink.map(prefer => {
                        if (selected && selected?.drink === prefer) {
                            return <span key={prefer} onClick={() => handleSelect('drink', undefined)} className={styles.selected}>{prefer}</span>
                        } else {
                            return <span key={prefer} onClick={() => handleSelect('drink', prefer)} >{prefer}</span>
                        }
                    })}
                </div>
            </div>
            <hr />
            <div id="smoke" className={styles.lifestyle}>
                <h5>How often do you smoke?</h5>
                <div>
                    {lifestyleData.smoke.map(prefer => {
                        if (selected && selected?.smoke === prefer) {
                            return <span key={prefer} onClick={() => handleSelect('smoke', undefined)} className={styles.selected}>{prefer}</span>
                        } else {
                            return <span key={prefer} onClick={() => handleSelect('smoke', prefer)} >{prefer}</span>
                        }
                    })}
                </div>
            </div>
            <hr />
            <div id="workout" className={styles.lifestyle}>
                <h5>Do you workout?</h5>
                <div>
                    {lifestyleData.workout.map(prefer => {
                        if (selected && selected?.workout === prefer) {
                            return <span key={prefer} onClick={() => handleSelect("workout", undefined)} className={styles.selected}>{prefer}</span>
                        } else {
                            return <span key={prefer} onClick={() => handleSelect('workout', prefer)} >{prefer}</span>
                        }
                    })}
                </div>
            </div>
            <hr />
            <div id="diet" className={styles.lifestyle}>
                <h5>What are your dietary preferences?</h5>
                <div>
                    {lifestyleData.diet.map(type => {
                        if (selected && selected?.diet === type) {
                            return <span key={type} onClick={() => handleSelect("diet", undefined)} className={styles.selected}>{type}</span>
                        } else {
                            return <span key={type} onClick={() => handleSelect("diet", type)} >{type}</span>
                        }
                    })}
                </div>
            </div>
            <hr />
            <div id="socialMedia" className={styles.lifestyle}>
                <h5>How active are you on social media?</h5>
                <div>
                    {lifestyleData.socialMedia.map(habit => {
                        if (selected && selected?.socialMedia === habit) {
                            return <span key={habit} onClick={() => handleSelect("socialMedia", undefined)} className={styles.selected}>{habit}</span>
                        } else {
                            return <span key={habit} onClick={() => handleSelect("socialMedia", habit)} >{habit}</span>
                        }
                    })}
                </div>
            </div>
            <hr />
            <div id="sleep" className={styles.lifestyle}>
                <h5>What are your sleeping habits?</h5>
                <div>
                    {lifestyleData.sleep.map(habit => {
                        if (selected && selected?.sleep === habit) {
                            return <span key={habit} onClick={() => handleSelect("sleep", undefined)} className={styles.selected}>{habit}</span>
                        } else {
                            return <span key={habit} onClick={() => handleSelect("sleep", habit)} >{habit}</span>
                        }
                    })}
                </div>
            </div>
        </div>
    )
}