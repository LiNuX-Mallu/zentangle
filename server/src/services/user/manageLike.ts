import User from "../../models/user";

export default async (userId: string, profileId: string, isSuper: boolean) => {
    try {
        //removing like if already there (ie: super like)
        await User.findByIdAndUpdate(profileId, {
            $pull: {'match.liked': {likedBy: userId}, 'match.disliked': userId},
        });
        const timestamp = new Date();

        //checking if matched
        const matched = await User.findOne({
            _id: userId,
            'match.liked': {$elemMatch: {likedBy: profileId}}
        });

        if (matched) {
            //updating match on user
            await User.findByIdAndUpdate(userId, {
                $pull: {'match.liked': {likedBy: profileId}},
                $push: {'match.matched': {with: profileId, timestamp}},
                $position: 0,
            }, {new: true});

            //updating match on profiler
            await User.findByIdAndUpdate(profileId, {
                $push: {'match.matched': {with: userId, timestamp}},
                $position: 0,
            }, {new: true});

            return {matched: true};
        }

        //liking
        await User.findByIdAndUpdate(profileId, {
            $push: {'match.liked': {likedBy: userId, isSuper, timestamp}},
            $position: 0,
        }, {new: true});

        return {matched: false}

    } catch(error) {
        throw new Error("Error at service/user/manageLike\n"+error);
    }
}