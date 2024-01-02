import User from "../../../models/user";
import s3Remove from "./s3Remove";

export default async (media: string, userId: string) => {
  try {
    await s3Remove(media);

    const updated = await User.findByIdAndUpdate(
      userId,
      { $pull: { "profile.medias": media } },
      { new: true }
    );

    if (updated) return updated.profile?.medias;
    else throw new Error("Unknown error");

  } catch (error) {
    throw new Error("Error at service/user/manageDeleteMedia\n" + error);
  }
};
