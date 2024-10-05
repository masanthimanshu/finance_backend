import { profileModel } from "../../database/profile_model.js";

export class ProfileController {
  addProfile = async (res = Response, user, data) => {
    try {
      await new profileModel({ user, ...data }).save();
      res.send({ message: "Data Added Successfully" });
    } catch (err) {
      res.status(502).send({ error: err.message });
    }
  };
}
