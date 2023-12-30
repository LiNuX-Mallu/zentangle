import User from "../../../models/user";

export default async (username: string) => {
  try {
    let currentState: boolean | undefined;
    const user = await User.findOne({ username });
    currentState = user?.banned;
    if (!user) {
      throw new Error("Couldn't find user");
    }
    user.banned = !currentState;
    const saved = await user.save();

    if (saved && user.banned !== currentState) {
      return saved;
    } else {
      throw new Error("Couldn't ban/unban user\n");
    }
  } catch (error) {
    throw new Error("Error at service/admin/manageBan");
  }
};
