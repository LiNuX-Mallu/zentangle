import razorpay from "../../instances/razorpay";
import payments from "razorpay/dist/types/payments";
import { Orders } from "razorpay/dist/types/orders";

export default async (paymentId: string) => {
    try {
        const response: Orders.RazorpayOrder = await new Promise((res, rej) => {
            razorpay.orders.fetch(paymentId, (err, payment) => {
                if (err) {
                    rej(err);
                } else {
                    res(payment)
                }
            })
        });
        console.log(response)
        return response?.status === 'paid';

    } catch (error) {
        throw new Error("Error at service/user/managePayment\n"+error);
    }
}