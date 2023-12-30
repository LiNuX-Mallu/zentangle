import User from "../../../models/user";
import Verification from "../../../models/verification";

export default async (userId: string, file: string) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: { accountVerified: "pending" },
      },
      { new: true }
    );
    if (!user) throw new Error("Cannot get user");

    const verification = new Verification({
      requestedBy: userId,
      doc: file,
      requestedOn: Date.now(),
    });
    return verification.save();
  } catch (error) {
    throw new Error(
      "Error at service/user/manageRequestVerification\n" + error
    );
  }
};
