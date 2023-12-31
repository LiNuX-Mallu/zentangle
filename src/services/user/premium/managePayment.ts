import razorpay from "../../../instances/razorpay";
import { Orders } from "razorpay/dist/types/orders";
import User from "../../../models/user";

export default async (paymentId: string, userId: string) => {
  try {
    const response: Orders.RazorpayOrder = await new Promise((res, rej) => {
      razorpay.orders.fetch(paymentId, (err, payment) => {
        if (err) {
          rej(err);
        } else {
          res(payment);
        }
      });
    });
    if (response.status === "paid") {
      const duration = 2592000000;
      await User.findByIdAndUpdate(
        userId,
        {
          $set: { "premium.expireDate": Date.now() + duration },
        },
        { new: true }
      );
      return true;
    } else return false;
  } catch (error) {
    throw new Error("Error at service/user/managePayment\n" + error);
  }
};
