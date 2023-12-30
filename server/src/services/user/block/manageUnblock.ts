import User from "../../../models/user";

export default async (userId: string, who: string | number, where: string) => {
  try {
    if (where === "users") {
      const unblocked = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { "blocked.users": who },
        },
        { new: true }
      );
      if (unblocked) return true;
    } else if (where === "contacts") {
      const unblocked = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { "blocked.contacts": who },
        },
        { new: true }
      );
      if (unblocked) return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error("Error at service/user/manageUnblock\n" + error);
  }
};
