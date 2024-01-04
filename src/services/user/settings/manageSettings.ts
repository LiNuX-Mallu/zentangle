import User from "../../../models/user";

export default async (
  where: string,
  what: string | boolean | object | [number, number],
  userId: string
) => {
  try {
    let field: null | string = null;
    switch (where) {
      case "distance":
        field = "preferences.distance";
        break;
      case "onlyFromAgeRange":
        field = "preferences.onlyFromAgeRange";
        break;
      case "ageRange":
        field = "preferences.ageRange";
        break;
      case "global":
        field = "preferences.global";
        break;
      case "discovery":
        field = "privacy.discoverable";
        break;
      case "showAge":
        field = "privacy.showAge";
        break;
      case "showDistance":
        field = "privacy.showDistance";
        break;
      case "recentActiveStatus":
        field = "privacy.recentActiveStatus";
        break;
      case "incognitoMode":
        field = "privacy.incognitoMode";
        break;
      case "verifiedMessagesOnly":
        field = "privacy.verifiedMessagesOnly";
        break;
      case "readReceipt":
        field = "privacy.readReceipt";
        break;
      case "email":
        field = "email.email";
        break;
      case "phone":
        field = "phone.phone";
        break;
      case "location":
        field = "location.coordinates";
        break;
      case "password":
        field = "password";
        break;
      default:
        field = null;
    }
    const query = { [field as string]: what };
    const updated = await User.findByIdAndUpdate(userId, query, { new: true });
    if (updated) return true;
    else throw new Error("Unknown error\n");
  } catch (error) {
    throw new Error("Error at service/user/updateSettigns\n" + error);
  }
};
