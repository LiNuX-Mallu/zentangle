import User from "../../../models/user";
import mailOtp from "../otp/mailOtp";

interface UserData {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: number;
  dob: Date;
  password: string;
  countryCode: number;
  gender: string;
}

export default async (data: UserData) => {
  try {
    const email = { email: data.email, verified: false };
    const phone = {
      phone: data.phone,
      verified: false,
      countryCode: data.countryCode,
    };
    const newUser = new User(data);
    newUser.email = email;
    newUser.phone = phone;
    newUser.gender = data.gender;
    const saved = await newUser.save();
    await mailOtp(email.email);
    return saved;
  } catch (error) {
    throw new Error("Error at service/user/addUser\n" + error);
  }
};
