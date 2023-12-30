import path from "path";
import User from "../../../models/user";
import fs from "fs/promises";

export default async (media: string, userId: string) => {
  try {
    const filepath = path.join(__dirname, "../../uploads/", media);
    await fs.unlink(filepath);
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
