import User from "../../../models/user";

export default async (data: string[], userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Could not find user\n");
    }
    return await User.findByIdAndUpdate(
      userId,
      { $set: { "profile.relationship.openTo": data } },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error at service/user/manageOpenTo\n" + error);
  }
};
