import { userModel } from "../../database/user_model.js";

export class SpendingController {
  addSpending = async (res = Response, user, data) => {
    try {
      await userModel.findByIdAndUpdate(user, { $push: { spending: data } });
      res.send({ message: "Data Added Successfully" });
    } catch (err) {
      res.status(502).send({ error: err.message });
    }
  };
}
