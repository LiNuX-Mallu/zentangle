import User from "../../../models/user";

export default async (file: string, userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Couldn't find user");
    }
    if (
      (user?.profile && user?.profile?.medias.length < 9) ||
      (user && !user.profile)
    ) {
      const pushed = await User.findByIdAndUpdate(
        userId,
        { $push: { "profile.medias": file } },
        { new: true }
      );
      if (pushed?.isModified) {
        return pushed.profile?.medias;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    throw new Error("Error at service/user/manageMedia\n" + error);
  }
};
