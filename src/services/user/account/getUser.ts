import User from "../../../models/user";

export default async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      return user;
    } else {
      throw new Error("Cannot find user error");
    }
  } catch (error) {
    throw new Error("Error at service/user/getUser\n" + error);
  }
};
