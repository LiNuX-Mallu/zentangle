import { UserInterface } from "../../../interfaces/userInterface";
import User from "../../../models/user";
import { calculateDistance } from "./calculateDistance";

interface Profile extends UserInterface {
  distance: number | undefined;
  matched: boolean;
  liked: boolean;
}

export default async (userId: string, username: string) => {
  try {
    const user = await User.findById(userId);
    const profile = (await User.findOne(
      {
        username,
        "blocked.users": { $nin: [user?.username] },
        "blocked.contacts": { $nin: [user?.phone?.phone] },
      },
      {
        match: 0,
        blocked: 0,
        reports: 0,
        chatHistory: 0,
        email: 0,
        phone: 0,
        password: 0,
      }
    ).lean()) as Profile;

    if (!profile || !user) throw new Error("Could not find profile or user");
    if (!profile.privacy?.showAge) {
      profile.dob = null!;
    }
    if (profile.privacy?.showDistance) {
      const distance = calculateDistance(
        user.location?.coordinates,
        profile.location?.coordinates
      );
      profile.distance = distance ? Math.round(distance) : undefined;
    }
    if (
      await User.findOne({
        _id: userId,
        "match.matched.with": { $in: [profile._id] },
      })
    ) {
      profile.matched = true;
    } else if (
      await User.findOne({
        _id: userId,
        "match.liked.likedBy": { $in: [profile._id] },
      })
    ) {
      profile.liked = true;
    }

    profile.location = null!;
    profile.privacy = null!;
    profile.preferences = null!;

    return profile;
  } catch (error) {
    throw new Error("Error at service/user/getProfile\n" + error);
  }
};
