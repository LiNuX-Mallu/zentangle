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
    }
}

export default async (data: Data, userId: string) => {
    const profile = data.profile;
    console.log(profile);
    try {
        const updated = await User.findByIdAndUpdate(userId, {$set: {
            "profile.name": profile.name,
            "profile.bio": profile.bio,
            "profile.job.title": profile.job.title,
            "profile.job.company": profile.job.company,
            "profile.school": profile.school,
            "profile.height": profile.height,
            "profile.livingIn": profile.livingIn,
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