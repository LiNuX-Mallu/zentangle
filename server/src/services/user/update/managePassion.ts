import User from "../../../models/user";

export default async (selected: string[], userId: string) => {
  try {
    const user = await User.findById(userId);
    if (user?.profile && selected.length <= 5) {
      user.profile.passions = selected;
      const saved = await user.save();
      return saved.profile?.passions;
    } else throw new Error("Unknown error");
  } catch (error) {
    throw new Error("Error at service/user/managePassion\n" + error);
  }
};
