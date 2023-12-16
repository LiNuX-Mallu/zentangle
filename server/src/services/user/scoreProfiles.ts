import User from "../../models/user";
import moment from 'moment'
import { calculateDistance } from "./calculateDistance";
import { UserInterface } from "../../interfaces/userInterface";

interface Profile extends UserInterface {
    distance: number | undefined;
}

export default async (userId: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("Cannot find user");
        const distancePreference = user.preferences?.distance ?? 12;

        //age query
        const ageRangeQuery = user.preferences?.onlyFromAgeRange && user.preferences.ageRange
        ? {
            'dob': {
                $gte: moment().subtract(user?.preferences?.ageRange.max, 'years').toDate(),
                $lte: moment().subtract(user?.preferences?.ageRange.min, 'years').toDate(),
            },
            }
        : {};

        //distance query
        const distanceQuery = user.preferences?.global
        ? {}
        : {
            'location.coordinates': {
                $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: user.location?.coordinates as [number, number] || [0, 0],
                },
                $maxDistance: distancePreference * 1000,
                },
            },
        };


        let profiles = await User.find({
            _id: {$ne: userId},
            'match.matched.with': {$nin: [userId]},
            'match.liked.likedBy': {$nin : [userId]},
            'match.disliked': {$nin: [userId]},    
            $nor: [
                //user block
                {'blocked.users': {$in: [user?.username]}},
                {'username': {$in: user?.blocked?.users ?? []}},
                
                //contact block
                {'blocked.contacts': {$in : [user?.phone?.phone]}},
                {'phone.phone': {$in: user?.blocked?.contacts ?? []}},
            ],
            ...ageRangeQuery,
            'location.coordinates': {$exists: true, $ne: null},
            ...distanceQuery,
            'privacy.discoverable': true,
            banned: false,
        }, {match: 0,
            blocked: 0,
            reports: 0,
            chatHistory: 0,
            email: 0,
            phone: 0,
            password: 0,
        }).limit(10).lean() as Profile[];

        profiles.forEach((profile) => {
            if (!profile.privacy?.showAge) {
                profile.dob = null!;
            }
            if (profile.privacy?.showDistance) {
                const distance = calculateDistance(user.location?.coordinates, profile.location?.coordinates);
                profile.distance = distance ? Math.round(distance) : undefined;
            }
            profile.location = null!;
            profile.privacy = null!;
            profile.preferences = null!;
        });

        return profiles;
    } catch(error) {
        throw new Error("Error at service/user/fetch\n"+error);
    }
}