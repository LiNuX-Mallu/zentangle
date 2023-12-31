import Alert from "../../../models/alert";

export default async (title: string, content: string) => {
  try {
    const newAlert = new Alert({
      title,
      content,
    });
    return await newAlert.save();
  } catch (error) {
    throw new Error("Error at service/admin/createAlert\n" + error);
  }
};
