import User from "../../../models/user";

export default async (userId: string) => {
  try {
    return await User.findByIdAndUpdate(
      userId,
      {
        $set: { accountVerified: "notverified" },
      },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error at service/admin/manageUnverify\n" + error);
  }
};
