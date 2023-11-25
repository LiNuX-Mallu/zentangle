export interface ProfileInterface {
    _id: string;
    username: string;
    firstname: string;
    lastname: string;
    dob: string;
    gender: string;
    password: string;
    accountVerified: boolean;
    email: {
        email: string;
        verified: boolean
    };
    phone: {
        phone: number;
        verified: string;
        countryCode: number;
    }
    banned: boolean;
    blocked: {
        users: string[];
        contacts: string[];
    };
    preferences: {
        distance: number;
        ageRange: {min: number, max: number};
        onlyFromAgeRange: boolean;
        global: boolean;
    };
    privacy: {
        showAge: boolean;
        showDistance: boolean;
        discoverbale: boolean;
        incognitoMode: boolean;
        verifiedMessagesOnly: boolean;
        recentActiveStatus: boolean;
        readReceipt: boolean;
    };
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