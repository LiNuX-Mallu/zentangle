import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    email: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  phone: {
    countryCode: {
      type: Number,
    },
    phone: {
      type: Number,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
  },

  accountVerified: {
    type: String,
    enum: ['verified', 'notverified', 'pending'],
    default: 'notverified',
  },

  location: {
    coordinates: [Number, Number],
  },
  preferences: {
    ageRange: {
      min: {
        type: Number,
        default: 18,
      },
      max: {
        type: Number,
        default: 25,
      },
    },
    onlyFromAgeRange: {
      type: Boolean,
      default: false,
    },
    distance: {
      type: Number,
      default: 15,
    },
    global: {
      type: Boolean,
      default: true,
    },
  },
  profile: {
    name: String,
    medias: [
      {
        type: String,
      },
    ],
    bio: {
      type: String,
    },
    languages: [
      {
        type: String,
      },
    ],
    passions: [
      {
        type: String,
      },
    ],
    basics: {
      zodiac: {
        type: String,
      },
      education: {
        type: String,
      },
      familyPlan: {
        type: String,
      },
      vaccinated: {
        type: String,
      },
      personality: {
        type: String,
      },
      communication: {
        type: String,
      },
      loveStyle: {
        type: String,
      },
    },
    height: {
      type: Number,
    },
    relationship: {
      lookingFor: {
        type: String,
      },
      openTo: [
        {
          type: String,
        },
      ],
    },
    lifestyle: {
      pets: {
        type: String,
      },
      drink: {
        type: String,
      },
      smoke: {
        type: String,
      },
      workout: {
        type: String,
      },
      diet: {
        type: String,
      },
      socialMedia: {
        type: String,
      },
      sleep: {
        type: String,
      },
    },
    job: {
      title: {
        type: String,
      },
      company: {
        type: String,
      },
    },
    school: {
      type: String,
    },
    livingIn: {
      type: String,
    },
    songs: [
      {
        type: String,
      },
    ],
  },
  privacy: {
    showAge: {
      type: Boolean,
      default: true,
    },
    showDistance: {
      type: Boolean,
      default: true,
    },
    verifiedMessagesOnly: {
      type: Boolean,
      default: false,
    },
    discoverable: {
      type: Boolean,
      default: true,
    },
    recentActiveStatus: {
      type: Boolean,
      default: true,
    },
    incognitoMode: {
      type: Boolean,
      default: false,
    },
    readReceipt: {
      type: Boolean,
      default: true,
    },
  },
  match: {
    matched: [
      {
        with: Schema.Types.ObjectId,
        timestamp: Date,
      },
    ],
    liked: [
      {
        isSuper: {
          type: Boolean,
        },
        likedBy: {
          type: Schema.Types.ObjectId,
        },
        timestamp: Date,
      },
    ],
    disliked: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  chatHistory: [
    {
      chat: {
        type: Schema.Types.ObjectId,
        ref: "chat",
      },
      with: {type: String},
    },
  ],
  reports: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  blocked: {
    users: [{type: String}],
    contacts: [{type: Number}],
  },
  banned: {
    type: Boolean,
    default: false,
  },
});

userSchema.index({ "location.coordinates": "2dsphere" });
export default model("User", userSchema);
