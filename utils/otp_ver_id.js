import jwt from "jsonwebtoken";

const secret = process.env.VERIFICATION_SECRET;

export class OtpVerId {
  generateVerId = (data) => jwt.sign({ data }, secret, { expiresIn: "300s" });

  decodeVerId = (data) => jwt.verify(data, secret);

  verifyVerId = (data) => {
    try {
      jwt.verify(data, secret);
      return true;
    } catch {
      return false;
    }
  };
}
