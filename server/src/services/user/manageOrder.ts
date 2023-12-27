import { Orders } from "razorpay/dist/types/orders";
import razorpay from "../../instances/razorpay";
import Premium from "../../models/premium";

export default async () => {
    try {
        const premium = await Premium.findOne();
        if (!premium) throw new Error("Cannot find premium");

        const options = {
            amount: premium.price * 100,
            currency: premium.currency,
            receipt: Date.now().toString()+'orderid',
        }

        const response: Orders.RazorpayOrder | null = await new Promise((res, rej) => {
            razorpay.orders.create(options, (err, order) => {
                if (err) {
                    rej(err);
                } else {
                    res(order)
                }
            })
        });

        if (!response) throw new Error("Cannot create order");

        return {
            id: response.id,
            currency: response.currency,
            amount: response.amount,
            receipt: response.receipt,
        } ?? null;

    } catch (error) {
        throw new Error("Error at service/user/manageOrder\n"+error);
    }
}