import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "lacloset74@gmail.com",
    pass: "kankebtozcrrohyu",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export { transporter };
