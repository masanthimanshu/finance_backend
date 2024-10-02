import { HttpRequests } from "../../network/requests.js";
import { userModel } from "../../database/user_model.js";
import { otpModel } from "../../database/otp_model.js";
import { OtpVerId } from "../../utils/otp_ver_id.js";
import { Tokens } from "../../utils/tokens.js";

const authKeyID = process.env.AUTH_KEY_ID;
const authKeyUrl = process.env.AUTH_KEY_URL;

export class AuthController {
  #request = new HttpRequests();
  #verID = new OtpVerId();
  #token = new Tokens();

  #manageOTP = async (uid, phone, country) => {
    const num = Math.floor(Math.random() * 1000000);
    const otp = parseInt(num.toString().padStart(6, "2"));
    const url = `${authKeyUrl}authkey=${authKeyID}&sid=14119&company=Finance%20App`;

    const data = await otpModel.findOneAndUpdate(
      { user: uid },
      { value: otp },
      { new: true, upsert: true }
    );

    await this.#request.getRequest(
      `${url}&country_code=${country}&mobile=${phone}&otp=${otp}`
    );

    const res = this.#verID.generateVerId(data._id);
    return res;
  };

  admin = async (res = Response, data) => {
    if (data.user === "admin@finance.com" && data.pass === "admin@1234") {
      const authToken = this.#token.generateAuth("Finance admin");
      const refreshToken = this.#token.generateRefresh("Finance admin");

      res.send({ status: "Success", authToken, refreshToken });
    } else {
      res.status(401).send({ message: "Incorrect Username or Password" });
    }
  };

  phone = async (res = Response, data) => {
    try {
      const userData = await userModel.findOne(data);

      if (!userData) {
        const user = await new userModel(data).save();

        const verId = await this.#manageOTP(
          user._id.toString(),
          user.phone,
          user.code
        );

        res.send({ status: "Success", verId });
      } else {
        const verId = await this.#manageOTP(
          userData._id.toString(),
          userData.phone,
          userData.code
        );

        res.send({ status: "Success", verId });
      }
    } catch (err) {
      res.status(502).send({ error: err.message });
    }
  };

  verifyPhone = async (res = Response, data) => {
    if (this.#verID.verifyVerId(data.verId)) {
      const verData = this.#verID.decodeVerId(data.verId);

      try {
        const otpData = await otpModel.findById(verData.data);

        if (otpData && otpData.value === data.otp) {
          const user = await userModel.findByIdAndUpdate(otpData.user, {
            isVerified: true,
          });

          const authToken = this.#token.generateAuth(user._id.toString());
          const refreshToken = this.#token.generateRefresh(user._id.toString());

          await otpModel.findByIdAndDelete(otpData._id);

          if (user.isVerified) {
            res.send({ type: "Login", authToken, refreshToken });
          } else {
            res.send({ type: "Signup", authToken, refreshToken });
          }
        } else {
          res.status(409).send({ message: "Invalid OTP" });
        }
      } catch (err) {
        res.status(502).send({ error: err.message });
      }
    } else {
      res.status(401).send({ message: "OTP Expired" });
    }
  };
}
