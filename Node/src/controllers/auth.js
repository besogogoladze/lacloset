import User from "../models/user.js";
import {
  signUpSchema,
  signInSchema,
  acceptCodeSchema,
  acceptFPSchema,
} from "../middlewares/auth/validators.js";
import { doHashing, doHashValidation, hmacProcess } from "../utils/hashing.js";
import jwt from "jsonwebtoken";
import { transporter } from "../middlewares/auth/sendMail.js";
import path from "path";
import { fileURLToPath } from "url";

// get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------- EMAIL TEMPLATE -------------------- */
const emailTemplate = (title, code, note) => `
  <div style="background:#f4f6fb;padding:30px;font-family:Arial,sans-serif;">
    <div style="max-width:480px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.08);">
      <div style="display:block;text-align:center;">
        <img style="width: 100%;" src="cid:logoImage" alt="La Closet"/>
      </div>

      <div style="padding:30px;text-align:center;">
        <h1 style="margin:0;font-size:22px;">${title}</h1>
        <p style="font-size:15px;color:#444;margin-bottom:20px;">
          გთხოვთ, გამოიყენოთ ქვემოთ მოცემული ვერიფიკაციის კოდი:
        </p>

        <div style="
          font-size:32px;
          letter-spacing:6px;
          font-weight:bold;
          color:#4f46e5;
          background:#f0f2ff;
          padding:15px;
          border-radius:8px;
          display:inline-block;
          margin-bottom:20px;
        ">
          ${code}
        </div>

        <p style="font-size:13px;color:#666;margin-top:20px;">
          ${note}
        </p>

        <p style="font-size:12px;color:#999;margin-top:30px;">
          თუ თქვენ არ მოითხოვეთ ეს, გთხოვთ დააიგნოროთ ეს წერილი.
        </p>
      </div>
    </div>

    <p style="text-align:center;font-size:11px;color:#aaa;margin-top:20px;">
      © ${new Date().getFullYear()} La Closet. All rights reserved.
    </p>
  </div>
`;

/* -------------------- SIGN UP -------------------- */
const signUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { error } = signUpSchema.validate(
      { email, password },
      { abortEarly: false },
    );

    if (error) {
      const messages = error.details.map((details) => details.message);
      return res.status(400).json({
        success: false,
        message: "ვალიდაცია ვერ გაიარა",
        errors: messages,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "მომხმარებელი უკვე არსებობს!" });
    }

    const hashedPassword = await doHashing(password, 12);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "თქვენი პროფილი წარმატებით შეიქმნა",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- LOGIN -------------------- */
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { error } = signInSchema.validate({ email });
    if (error) {
      const messages = error.details.map((details) => details.message);
      return res.status(400).json({
        success: false,
        message: "ვალიდაცია ვერ გაიარა",
        errors: messages,
      });
    }

    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "არასწორი ელ.ფოსტა ან პაროლი!",
      });
    }

    const isPasswordValid = await doHashValidation(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "არასწორი ელ.ფოსტა ან პაროლი!",
      });
    }

    const codeValue = Math.floor(100000 + Math.random() * 900000).toString();

    await transporter.sendMail({
      from: "lacloset74@gmail.com",
      to: existingUser.email,
      subject: "თქვენი ვერიფიკაციის კოდი",
      html: emailTemplate(
        "შესვლის კოდი",
        codeValue,
        "კოდი ვალიდურია 5 წუთის განმავლობაში. გთხოვთ, გამოიყენოთ კოდი შესასვლელად.",
      ),
      attachments: [
        {
          filename: "lacloset.png",
          path: path.join(__dirname, "../../public/images/lacloset.png"),
          cid: "logoImage",
        },
      ],
    });

    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECRET,
    );
    existingUser.verificationCode = hashedCodeValue;
    existingUser.verificationCodeValidation = Date.now();
    await existingUser.save();

    return res.status(200).json({
      success: true,
      message:
        "OTP კოდი გაგზავნილია თქვენს ელ.ფოსტაზე. გთხოვთ, დაადასტუროთ შესასვლელად.",
      email: existingUser.email,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -------------------- LOGOUT -------------------- */
const logOut = async (req, res) => {
  res
    .clearCookie("Authorization")
    .status(200)
    .json({ message: "გამოსვლა წარმატებით დასრულდა" });
};

/* -------------------- VERIFY CODE -------------------- */
const verifyCode = async (req, res) => {
  const { email, providedCode } = req.body;

  try {
    const { error } = acceptCodeSchema.validate(
      { email, providedCode },
      { abortEarly: false },
    );
    if (error) {
      const messages = error.details.map((details) => details.message);
      return res.status(400).json({
        success: false,
        message: "ვალიდაცია ვერ გაიარა",
        errors: messages,
      });
    }

    const existingUser = await User.findOne({ email }).select(
      "+verificationCode +verificationCodeValidation",
    );
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "მომხმარებელი არ არსებობს",
      });
    }

    if (
      !existingUser.verificationCode ||
      !existingUser.verificationCodeValidation
    ) {
      return res.status(400).json({
        success: false,
        message:
          "ვერიფიკაციის კოდი ვერ მოიძებნა. გთხოვთ, ისევ შეიყვანოთ თქვენი ელ.ფოსტა და პაროლი.",
      });
    }

    if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message:
          "ვერიფიკაციის კოდის ვადა ამოიწურა. გთხოვთ, ისევ შეიყვანოთ თქვენი ელ.ფოსტა და პაროლი.",
      });
    }

    const hashedCodeValue = hmacProcess(
      providedCode.toString(),
      process.env.HMAC_VERIFICATION_CODE_SECRET,
    );
    if (hashedCodeValue !== existingUser.verificationCode) {
      return res.status(400).json({
        success: false,
        message: "არასწორი კოდი. გთხოვთ, შეიყვანოთ სწორი კოდი.",
      });
    }

    existingUser.verificationCode = undefined;
    existingUser.verificationCodeValidation = undefined;
    await existingUser.save();

    const jwtToken = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.TOKEN_SECRET,
      { expiresIn: "12h" },
    );

    return res.status(200).json({
      success: true,
      message: "შესვლა წარმატებით დასრულდა",
      token: jwtToken,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -------------------- FORGOT PASSWORD -------------------- */
const forgotPassword = async (req, res) => {
  const email = req.body.email;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const codeValue = Math.floor(100000 + Math.random() * 900000).toString();

    await transporter.sendMail({
      to: existingUser.email,
      subject: "პაროლის განახლების კოდი",
      html: emailTemplate(
        "პაროლის განახლება",
        codeValue,
        "გამოიყენეთ ეს კოდი პაროლის განახლებისთვის. ვალიდურია 5 წუთის განმავლობაში.",
      ),
    });

    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECRET,
    );
    existingUser.forgotPasswordCode = hashedCodeValue;
    existingUser.forgotPasswordCodeValidation = Date.now();
    await existingUser.save();

    res.status(200).json({
      success: true,
      message: "პაროლის განახლების კოდი გაგზავნილია " + email + " -ზე",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* -------------------- VERIFY FORGOT PASSWORD -------------------- */
const verifyForgotPassword = async (req, res) => {
  const { email, providedCode, newPassword } = req.body;
  try {
    const { error } = acceptFPSchema.validate({
      email,
      providedCode,
      newPassword,
    });

    if (error) {
      const messages = error.details.map((details) => details.message);
      return res.status(400).json({
        success: false,
        message: "ვალიდაცია ვერ გაიარა",
        errors: messages,
      });
    }

    const existingUser = await User.findOne({ email }).select(
      "+forgotPasswordCode +forgotPasswordCodeValidation",
    );

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "მომხმარებელი არ არსებობს" });
    }

    if (
      !existingUser.forgotPasswordCode ||
      !existingUser.forgotPasswordCodeValidation
    ) {
      return res.status(400).json({
        success: false,
        message: "პაროლის განახლების კოდი ვერ მოიძებნა.",
      });
    }

    if (
      Date.now() - existingUser.forgotPasswordCodeValidation >
      5 * 60 * 1000
    ) {
      return res.status(400).json({
        success: false,
        message: "კოდის ვადა ამოიწურა.",
      });
    }

    const hashedCodeValue = hmacProcess(
      providedCode.toString(),
      process.env.HMAC_VERIFICATION_CODE_SECRET,
    );

    if (hashedCodeValue === existingUser.forgotPasswordCode) {
      existingUser.password = await doHashing(newPassword, 12);
      existingUser.forgotPasswordCode = undefined;
      existingUser.forgotPasswordCodeValidation = undefined;
      await existingUser.save();

      return res.status(200).json({
        success: true,
        message: "პაროლი წარმატებით განახლდა",
      });
    }

    return res.status(400).json({
      success: false,
      message: "არასწორი პაროლის განახლების კოდი",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Unexpected server error" });
  }
};

/* -------------------- CHANGE PASSWORD -------------------- */
const changePassword = async (req, res) => {
  try {
    const email = req.userInfo.email;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "მომხმარებელი არ არსებობს",
      });
    }

    const codeValue = Math.floor(100000 + Math.random() * 900000).toString();

    await transporter.sendMail({
      to: existingUser.email,
      subject: "Password Change Code",
      html: emailTemplate(
        "პაროლის შეცვლა",
        codeValue,
        "გამოიყენეთ ეს კოდი პაროლის შესაცვლელად. ვალიდურია 5 წუთის განმავლობაში.",
      ),
    });

    existingUser.changePasswordCode = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECRET,
    );
    existingUser.changePasswordCodeValidation = Date.now();
    await existingUser.save();

    res.status(200).json({
      success: true,
      message: `პაროლის შეცვლის კოდი გაგზავნილია ${email} -ზე`,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* -------------------- VERIFY CHANGE PASSWORD -------------------- */
const verifyChangePassword = async (req, res) => {
  try {
    const { newPassword, providedCode } = req.body;
    const email = req.userInfo.email;

    const existingUser = await User.findOne({ email }).select(
      "+changePasswordCode +changePasswordCodeValidation",
    );

    const hashedCodeValue = hmacProcess(
      providedCode.toString(),
      process.env.HMAC_VERIFICATION_CODE_SECRET,
    );

    if (hashedCodeValue === existingUser.changePasswordCode) {
      existingUser.password = await doHashing(newPassword, 12);
      existingUser.changePasswordCode = undefined;
      existingUser.changePasswordCodeValidation = undefined;
      await existingUser.save();

      return res.status(200).json({
        success: true,
        message: "პაროლი წარმატებით შეიცვალა",
      });
    }

    return res.status(400).json({
      success: false,
      message: "არასწორი პაროლის შეცვლის კოდი",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  signUp,
  login,
  logOut,
  forgotPassword,
  verifyForgotPassword,
  changePassword,
  verifyChangePassword,
  verifyCode,
};
