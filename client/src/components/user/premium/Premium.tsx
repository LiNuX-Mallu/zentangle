import { useEffect, useState } from 'react';
import styles from './Premium.module.scss';
import axios from '../../../instances/axios';
import useRazorpay from 'react-razorpay';

interface Props {
    isVisible: boolean;
    close: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Order {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
}

export default function Premium({isVisible, close}: Props) {
    const [show, setShow] = useState(false);
    const [order, setOrder] = useState<Order | null>(null);
    const [Razorpay] = useRazorpay();

    useEffect(() => {
        setTimeout(() => setShow(isVisible), 200);
        return () => setShow(false);
    }, [isVisible]);

    useEffect(() => {
        if (order === null) return;
        const razorpay = new Razorpay({
            key: 'rzp_test_pVGwopBs30cVnX',
            amount: order.amount.toString(),
            currency: order.currency,
            order_id: order.id,
            name: 'Zentangle',
            description: "Zentangle Premium Plan",
            handler: function (response) {
                axios.post('/user/payment-status', {orderId: response.razorpay_order_id}, {
                    headers: {'Content-Type': 'application/json'},
                }).then((response) => {
                    if (response.status === 200) {
                        close(false);
                    }
                })
            },
            theme: {
                color: "violetblue",
            },
        });

        razorpay.open();
    }, [order, Razorpay, close]);

    const handleClose = () => {
        setShow(false);
        setTimeout(() => {
            close(false);
        }, 300)
    };

    const handleOrder = () => {
        axios.post('/user/make-order')
        .then((response) => {
            if (response.status === 200) {
                setOrder(response.data);
            }
        });
    }

    return (
        <div className={`${styles.premium} ${show ? styles.visible : ''}`}>
            <i onClick={handleClose} className={`fa-regular fa-circle-xmark ${styles.close}`}></i>
            <h3>Zentangle Premium <i className="fa-solid fa-crown"></i></h3>
            <div className={styles.benefits}>
                <span>Unlimited Likes <i className="fa-solid fa-check"></i></span>
                <span>Incognito Mode <i className="fa-solid fa-check"></i></span>
                <span>Higher Reach In Your Area <i className="fa-solid fa-check"></i></span>
                <span>Purple Tick - Profile Verification <i className="fa-solid fa-check"></i></span>
                <span>Explore Purple Only Profiles <i className="fa-solid fa-check"></i></span>
                <span>5 Super Likes per day <i className="fa-solid fa-check"></i></span>
            </div>
            <div className={styles.offer}>
                <span>249/Month</span>
                <button onClick={handleOrder}>Get Started</button>
            </div>
        </div>
    )
}