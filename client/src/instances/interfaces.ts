export interface ProfileInterface {
    firstname: string;
    lastname: string;
    dob: string;
    gender: string;
    profile: {
        name: string;
        livingIn: string;
        job: {title: string; company: string};
        school: string;
        bio: string;
        height: string;
        basics: {
            zodiac: string;
            education: string;
            familyPlan: string;
            vaccinated: string;
            personality: string;
            communication: string;
            loveStyle: string;
        };
        lifestyle: {
            pets: string;
            drink: string;
            smoke: string;
            workout: string;
            diet: string;
            socialMedia: string;
            sleep: string;
        };
        passions: string[];
        medias: string[];
        relationship: {
            lookingFor: string;
            openTo: string[];
        };
        languages: string[];
    }
}