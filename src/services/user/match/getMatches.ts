import User from "../../../models/user";

export default async (userId: string) => {
  try {
    const matches = await User.findById(userId, {
      "match.matched": 1,
      "match.liked": 1,
    });

    if (!matches) throw new Error("Cannot find user");

    const matchedArray = await Promise.all(
      (matches?.match?.matched || []).map(async (match) => {
        return {
          type: "match",
          with: await User.findById(match.with, {
            "profile.name": 1,
            "profile.medias": 1,
            username: 1,
          }),
          time: match.timestamp,
        };
      })
    );

    const likedArray = await Promise.all(
      (matches?.match?.liked || []).map(async (like) => {
        return {
          type: like.isSuper ? "superLike" : "like",
          likedBy: await User.findById(like.likedBy, {
            "profile.name": 1,
            "profile.medias": 1,
            username: 1,
          }),
          time: like.timestamp,
        };
      })
    );

    if (likedArray && matchedArray) {
      const mergedArray = [...likedArray, ...matchedArray].sort((a, b) => {
        const timeA = a.time?.getTime();
        const timeB = b.time?.getTime();
        if (timeA && timeB) {
          return timeB - timeA;
        }
        return 0;
      });
      return mergedArray;
    } else throw new Error("Unknown error");
  } catch (error) {
    throw new Error("Error at service/user/getMatches\n" + error);
  }
};
