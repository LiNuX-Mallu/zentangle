import User from "../../../models/user";
import Verification from "../../../models/verification";

export default async (currentPage: number) => {
  const perPage = 6;
  try {
    const verifications = await Verification.find()
      .sort({ requestedOn: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    if (!verifications) throw new Error("Cannot find verification requests");

    return await Promise.all(
      verifications.map(async (request) => {
        return {
          id: request._id,
          requestedBy: await User.findById(request.requestedBy),
          doc: request.doc,
          requestedOn: request.requestedOn,
        };
      })
    );
  } catch (error) {
    throw new Error("Error at service/admin/getVerifications");
  }
};
