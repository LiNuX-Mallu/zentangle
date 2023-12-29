import User from "../../models/user";

export default async (userId: string, profileId: string, isSuper: boolean) => {
    try {
        //validating plan
        const midnight = new Date();
        midnight.setHours(0, 0, 0, 0);

        const userPlan = await User.findByIdAndUpdate(userId, {
            $pull: {
                ['premium.superLikes']: {$lt: midnight},
                ['premium.likes']: {$lt: midnight},
            }
        }, {new: true});
        if (!userPlan) throw new Error("Cannot find user");

        const dateNow = new Date();

        const premium = userPlan?.premium?.expireDate ? userPlan.premium.expireDate >= dateNow : false;

        let likes, superLikes: Date[] | undefined;

        if (userPlan.premium) {
            likes = (userPlan.premium?.likes ?? []).filter(date => date >= midnight);
            superLikes = (userPlan.premium?.superLikes ?? []).filter(date => date >= midnight);
        }

        let error: string | null = null;

        if (premium === false) {
            if (isSuper) error = 'premium';
            else if (likes && likes.length >= 2) error = 'premium';
        } else if (premium === true) {
            if (isSuper && superLikes && superLikes.length >= 1) error = 'super';
        }

        if (error !== null) return {error};

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
                $pull: {
                    'match.liked': {likedBy: profileId},
                },
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

        //like record
        const field = isSuper ? 'superLikes' : 'likes';
        if (premium === false || (premium === true && isSuper === true)) {
            await User.findByIdAndUpdate(userId, {
                $push: {[`premium.${field}`]: Date.now()},
            });
        }

        return {matched: false}

    } catch(error) {
        throw new Error("Error at service/user/manageLike\n"+error);
    }
}