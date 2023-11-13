import User from "../../models/user";

interface Data {
    profile: {
        name: string | undefined;
        bio: string | undefined;
        school: string | undefined;
        livingIn: string | undefined;
        job: {
            title: string | undefined;
            company: string | undefined;
        };
        height: string | undefined;
    },
    gender: string;
}

export default async (data: Data, userId: string) => {
    const profile = data.profile;
    try {
        const updated = await User.findByIdAndUpdate(userId, {$set: {
            "profile.name": profile.name,
            "profile.bio": profile.bio,
            "profile.job.title": profile.job.title,
            "profile.job.company": profile.job.company,
            "profile.school": profile.school,
            "profile.height": profile.height,
            "profile.livingIn": profile.livingIn,
            gender: data.gender,
        }});
        if (updated) {
            return true;
        } else {
            throw new Error("Unknown error\n");
        }
    } catch(error) {
        throw new Error("Error at service/user/updateDetails\n"+error);
    }

}