import User from "../../../models/user";
import Verification from "../../../models/verification";
import s3Remove from "../../user/media/s3Remove";

export default async (requestId: string, verify: boolean) => {
  try {
    const request = await Verification.findByIdAndDelete(requestId);
    if (!request) throw new Error("Error deleting request");

    const user = await User.findByIdAndUpdate(
      request.requestedBy,
      {
        $set: { accountVerified: verify ? "verified" : "notverified" },
      },
      { new: true }
    );
    if (!user) throw new Error("Error updating verification on user");

    if (request?.doc) {
      await s3Remove(request.doc);
    }
    return user ? true : false;
  } catch (error) {
    throw new Error("Error at service/admin/manageVerification\n" + error);
  }
};
