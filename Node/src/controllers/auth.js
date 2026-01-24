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

/* -------------------- EMAIL TEMPLATE -------------------- */
const emailTemplate = (title, code, note) => `
  <div style="background:#f4f6fb;padding:30px;font-family:Arial,sans-serif;">
    <div style="max-width:480px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.08);">
      <div style="display:text-align:center;">
        <img style="width: 100%;" src="https://scontent-cdg4-2.xx.fbcdn.net/v/t39.30808-6/616047822_26069444999330236_4544253881010343361_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=2285d6&_nc_ohc=W4wEqCWE-a8Q7kNvwEhp_E_&_nc_oc=AdkjAAbdlzsdVRTzXAvqfeINF4GCH1xgnwXdaeplBTV6HIRxero5H02ftdKMAQema-zPWz-qiUglhc2A2zMZBoeX&_nc_zt=23&_nc_ht=scontent-cdg4-2.xx&_nc_gid=rxtdg7qgVA6O2-24Y_QwSw&oh=00_Afolys-1ZSA_p7NkNi_fHv65oB2W2HcFLtFzPHJu86OYCg&oe=697A9CC8" alt="La Closet"}/>
      </div>

      <div style="padding:30px;text-align:center;">
        <h1 style="margin:0;font-size:22px;">${title}</h1>
        <p style="font-size:15px;color:#444;margin-bottom:20px;">
          Please use the verification code below:
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
          If you did not request this, please ignore this email.
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
        message: "validation failed",
        errors: messages,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already Exists!" });
    }

    const hashedPassword = await doHashing(password, 12);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Your account has been created successfully",
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
        message: "Validation failed",
        errors: messages,
      });
    }

    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await doHashValidation(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const codeValue = Math.floor(100000 + Math.random() * 900000).toString();

    await transporter.sendMail({
      from: "lacloset74@gmail.com",
      to: existingUser.email,
      subject: "Your verification code",
      html: emailTemplate(
        "Login Verification",
        codeValue,
        "This code will expire in 5 minutes.",
      ),
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
      message: "OTP sent to your email. Please verify to continue.",
      email: existingUser.email,
    });
  } catch (error) {
    console.error("Sign in error:", error);
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
    .json({ message: "Sign out successful" });
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
        message: "Validation failed",
        errors: messages,
      });
    }

    const existingUser = await User.findOne({ email }).select(
      "+verificationCode +verificationCodeValidation",
    );
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    if (
      !existingUser.verificationCode ||
      !existingUser.verificationCodeValidation
    ) {
      return res.status(400).json({
        success: false,
        message: "No verification code found. Please log in again.",
      });
    }

    if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please log in again.",
      });
    }

    const hashedCodeValue = hmacProcess(
      providedCode.toString(),
      process.env.HMAC_VERIFICATION_CODE_SECRET,
    );
    if (hashedCodeValue !== existingUser.verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
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
      message: "Login successful",
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
      subject: "Password Reset Code",
      html: emailTemplate(
        "Password Reset",
        codeValue,
        "Use this code to reset your password. Expires in 5 minutes.",
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
      message: "Password reset code sent to " + email,
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
        message: "validation failed",
        errors: messages,
      });
    }

    const existingUser = await User.findOne({ email }).select(
      "+forgotPasswordCode +forgotPasswordCodeValidation",
    );

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exist" });
    }

    if (
      !existingUser.forgotPasswordCode ||
      !existingUser.forgotPasswordCodeValidation
    ) {
      return res.status(400).json({
        success: false,
        message: "No password reset code found.",
      });
    }

    if (
      Date.now() - existingUser.forgotPasswordCodeValidation >
      5 * 60 * 1000
    ) {
      return res.status(400).json({
        success: false,
        message: "Code has expired.",
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
        message: "Password has been reset successfully",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid password reset code",
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
        message: "User not found",
      });
    }

    const codeValue = Math.floor(100000 + Math.random() * 900000).toString();

    await transporter.sendMail({
      to: existingUser.email,
      subject: "Password Change Code",
      html: emailTemplate(
        "Change Password",
        codeValue,
        "Use this code to confirm your password change.",
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
      message: `Password change code sent to ${email}`,
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
        message: "Password has been changed successfully",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid password change code",
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
