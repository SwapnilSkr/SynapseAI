import formData from "form-data";
import Mailgun from "mailgun.js";
import "dotenv/config";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "key-yourkeyhere",
});

export default mg;
