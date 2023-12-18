import User from "../../models/user"

export default async (userId: string, username: string) => {
    try {
        const profile = await User.findOneAndUpdate({username}, {
            $pull: {
                'match.matched': {with: userId},
                'match.liked': {likedBy: userId},
                'match.disliked': userId,
                'chatHistory': {with: userId},
            }
        }, {new: true});
        if (!profile) throw new Error("Cannot Unmatch - Profiler problem");

        const user = await User.findOneAndUpdate({_id: userId}, {
            $pull: {
                'match.matched': {with: profile._id},
                'match.liked': {likedBy: profile._id},
                'match.disliked': profile._id,
                'chatHistory': {with: profile.username},
            }
        }, {new: true});
        if (!user) throw new Error("Cannot Unmatch User problem");

        return true;
        
    } catch(error) {
        throw new Error("Error at service/user/manageUnmatch\n"+error);
    }
}