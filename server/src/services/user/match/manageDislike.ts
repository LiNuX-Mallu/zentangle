import User from "../../../models/user";

export default async (userId: string, profileId: string) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { "match.liked": { likedBy: profileId } },
    });
    await User.findByIdAndUpdate(profileId, {
      $pull: { "match.liked": { likedBy: userId }, "match.disliked": userId },
    });
    const updatedProfile = await User.findByIdAndUpdate(
      profileId,
      {
        $push: { "match.disliked": userId },
      },
      { new: true }
    );

    if (!updatedProfile) throw new Error("Profile not found");
    else return true;
  } catch (error) {
    throw new Error("Error at service/user/manageDislike\n" + error);
  }
};
