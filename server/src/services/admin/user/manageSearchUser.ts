import User from "../../../models/user";

export default async (prefix: string, filter: string) => {
  const keyword = RegExp(prefix, "i");
  try {
    const users = await User.find({
      accountVerified:
        filter === "verified"
          ? "verified"
          : { $in: ["pending", "verified", "notverified"] },
      $or: [
        {
          $expr: {
            $regexMatch: {
              input: {
                $concat: ["$firstname", " ", "$lastname"],
              },
              regex: keyword,
            },
          },
        },
        { firstname: { $regex: keyword } },
        { lastname: { $regex: keyword } },
        { "email.email": { $regex: keyword } },
        { username: { $regex: keyword } },
      ],
    });
    if (users) return users;
    else throw new Error("Cannot search users");
  } catch (error) {
    throw new Error("Error at service/admin/manageSearchUser\n" + error);
  }
};
