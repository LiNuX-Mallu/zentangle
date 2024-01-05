import User from "../../../models/user";
import mailOtp from "../otp/mailOtp";

interface UserData {
  username: string;
  password: string;
}

export default async (data: UserData) => {
  const { username, password } = data;
  try {
    const user = await User.findOne({ username });
    if (user) {
      if (user && user.password === password) {
        if (user.email?.verified === true) {
          return {userId: user._id, code: 200};
        } else {
          await mailOtp(user?.email?.email ?? '');
          return {code: 202, email: user.email?.email};
        }
      } else {
        return false;
      }
    } else return false;
  } catch (error) {
    throw new Error("Error at service/user/checkUser\n" + error);
  }
};
