import User from "../../models/user"

export default async (userId: string, from: string) => {
    try {
        const user = await User.findById(userId, {'blocked': 1});
        if (!user) throw new Error("Cannot find user");

        const list = from === 'users' ?
            await Promise.all((user.blocked?.users ?? []).map(async (username) => {
                const profile = await User.findOne({username}, {'profile.medias': 1});
                return {
                    username,
                    picture: profile?.profile?.medias[0],
                }
            }))
            :
            user.blocked?.contacts
        ?? [];

        return list ?? [];

    } catch(error) {
        throw new Error("Error at service/user/getBlockedList\n"+error)
    }
}