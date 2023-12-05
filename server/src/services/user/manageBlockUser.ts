import User from "../../models/user"

export default async (userId: string, username: string) => {
    try {
        console.log(username)
        const blocked = await User.findOneAndUpdate({_id: userId}, {
            $push: {'blocked.users': username},
        }, {new: true});
        if (!blocked) throw new Error("Cannot block User problem");

        const profile = await User.findOneAndUpdate({username}, {
            $pull: {
                'match.matched': {with: blocked._id},
                'match.liked': {likedBy: blocked._id},
                'match.disliked': blocked._id,
                'chatHistory': {with: blocked.username},
            }
        }, {new: true});
        if (!profile) throw new Error("Cannot block - Profiler problem");

        const user = await User.findOneAndUpdate({_id: userId}, {
            $pull: {
                'match.matched': {with: profile._id},
                'match.liked': {likedBy: profile._id},
                'match.disliked': profile._id,
                'chatHistory': {with: profile.username},
            }
        }, {new: true});
        if (!user) throw new Error("Cannot block User problem");

        return true;
    } catch(error) {
        throw new Error("Error at service/user/manageBlockUser\n"+error);
    }
}