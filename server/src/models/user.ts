import { Schema, model } from 'mongoose';

var userSchema = new Schema({
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
    }
  },
  phone: {
    countryCode: {
      type: Number
    },
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
  gender: {
    type: String
  },
  accountVerified: {
    type: Boolean,
    default: false,
  },
  // location: {
  //   latitude: {
  //     type: String
  //   },
  //   longitude: {
  //     type: String
  //   }
  // },
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
    name: String,
    medias: [{
      type: String
    }],
    bio: {
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
      openTo: [{
        type: String,
      }],
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
  },
  banned: {
    type: Boolean,
    default: false,
  },
});

export default model('User', userSchema);