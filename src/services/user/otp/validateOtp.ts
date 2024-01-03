import User from "../../../models/user";

export default async (otp: string, email: string) => {
    try {
        const user = await User.findOne({'email.email': email});
        if (!user) throw new Error("Cannot find user");

        if (user.otp?.code && user.otp?.expireAt) {
            if (user.otp?.code === otp && new Date(user.otp?.expireAt) >= new Date()) {
                await User.findOneAndUpdate({'email.email': email}, {
                    $set: {'email.verified': true},
                });
                return {error: null};
            } else if (user.otp?.code !== otp) {
                return {error: "Invalid OTP!"}
            } else if (new Date(user.otp?.expireAt) < new Date()) {
                return {error: "OTP has been expired!"};
            }
        } else return {error: "Something went wrong"};
    } catch (error) {
        throw new Error("Error at services/user/validat eOtp\n"+error);
    }
}