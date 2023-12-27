import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const {RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET} = process.env;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay API keys are missing');
}

export default new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
});