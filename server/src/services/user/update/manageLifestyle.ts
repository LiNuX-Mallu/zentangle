import User from "../../../models/user";

interface lifestyleSelected {
  pets: string | undefined;
  drink: string | undefined;
  smoke: string | undefined;
  workout: string | undefined;
  diet: string | undefined;
  socialMedia: string | undefined;
  sleep: string | undefined;
}

export default async (selected: lifestyleSelected, userId: string) => {
  try {
    const user = await User.findById(userId);
    if (user?.profile) {
      user.profile.lifestyle = selected;
      const saved = await user.save();
      return saved.profile?.lifestyle;
    } else throw new Error("Unknown error");
  } catch (error) {
    throw new Error("Error at service/user/manageLifestyle\n" + error);
  }
};
