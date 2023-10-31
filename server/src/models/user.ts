import { Schema, model } from 'mongoose';

var userSchema = new Schema({
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
    }
  },
  phone: {
    phone: {
      type: Number
    },
    verified: {
      type: Boolean,
      default: false,
    }
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  accountVerified: {
    type: Boolean,
    default: false,
  },
  location: {
    latitude: {
      type: String
    },
    longitude: {
      type: String
    }
  },
  preferences: {
    ageRange: {
      min: {
        type: Number
      },
      max: {
        type: Number
      }
    },
    distance: {
      type: Number
    }
  },
  profile: {
    pictures: [{
      type: String
    }],
    bio: {
      type: String
    },
    gender: {
      type: String
    },
    languages: [{
      type: String
    }],
    passions: [{
      type: String
    }],
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
        type: Boolean,
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
      height: {
        type: String,
      }
    },
    relationship: {
      lookingFor: {
        type: String,
      },
      interestedIn: {
        type: String,
      }
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
      }
    },
    job: {
      title: {
        type: String,
      },
      company: {
        type: String,
      }
    },
    school: {
      type: String
    },
    livingIn: {
      type: String
    },
    songs: [{
      type: String
    }]
  },
  privacy: {
    showAge: {
      type: Boolean
    },
    showDistance: {
      type: Boolean
    },
    verifiedMessagesOnly: {
      type: Boolean
    },
    discoverable: {
      type: Boolean
    },
    recentActiveStatus: {
      type: Boolean
    }
  },
  match: {
    matched: [{
      type: Schema.Types.ObjectId
    }],
    liked: [{
      isSuper: {
        type: Boolean
      },
      likedBy: {
        type: Schema.Types.ObjectId
      }
    }],
    disliked: [{
      type: Schema.Types.ObjectId
    }]
  },
  chatHistory: [{
    type: Schema.Types.ObjectId
  }],
  reports: [{
    type: Schema.Types.ObjectId
  }],
  blocked: {
    users: [{
      type: Schema.Types.ObjectId
    }],
    contacts: [{
      type: Number
    }]
  }
});

export default model('User', userSchema);