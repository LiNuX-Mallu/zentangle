import Alert from "../../../models/alert";

export default async (
  alertId: string,
  where: string,
  data: string | boolean
) => {
  try {
    const updated = await Alert.findByIdAndUpdate(
      alertId,
      {
        $set: { [where]: data },
      },
      { new: true }
    );

    if (!updated) throw new Error("Cannot update alert");
    else return true;
  } catch (error) {
    throw new Error("Error at service/admin/updateAlert\n" + error);
  }
};
