import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { UserModel } from "../model/User.js"
import { SendVerificationCode } from "../middleware/email.js"
import crypto from 'crypto'
import { OtpModel } from "../model/otp.js"

export const getuser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id)
    next()    
  } catch (error) {
    res.status(500).json({
      message: "User not found",
      success: false,
    })
  }
}
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const user = await UserModel.findOne({ email })
    if (user) {
      return res.status(409).json({
        message: "User is already exist, you can login",
        success: false,
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userModel = new UserModel({
      name,
      email,
      password: hashedPassword,
      totalSpending: 0,
      budget: 0,
    })

    await userModel.save();

    const jwttoken = jwt.sign(
      { email: UserModel.email, _id: UserModel._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    )
    res.cookie("Auth_Token", jwttoken, {
      httpOnly: true,
      maxAge: 7200000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      path: '/',
    });

    res.status(201).json({
      message: "singup sucessfully",
      success: true,
      jwttoken,
      email: UserModel.email,
      name: UserModel.name,
    })    
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    })
  }
}
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ message: "Email is required", success: false })
    }
    const user = await UserModel.findOne({ email })
    const existingOtp = await OtpModel.findOne({ email })
    const otp = crypto.randomInt(100000, 999999)
    const otpStr = String(otp)
    if (user) {
      console.log(user)
      return res.status(409).json({
        message: "User is already exist, you can login",
        success: false,
      })
    }
    if (existingOtp) {
      await OtpModel.findByIdAndUpdate(existingOtp._id, { email, otp: otpStr }, { new: true })
    } else {
      await OtpModel.create({ email, otp: otpStr })
    }

    await SendVerificationCode(email, otpStr)
    return res.status(200).json({
      message: "OTP sent successfully",
      success: true,
    })
  } catch (error) {
    console.error("Send OTP error:", error)
    return res.status(500).json({
      message: "failed to send otp",
      success: false,
    })
  }
}



export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }
    const otpRecord = await OtpModel.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }
    const OTP_EXPIRY_TIME = 10 * 60 * 1000;
    const isExpired = Date.now() - otpRecord.createdAt.getTime() < OTP_EXPIRY_TIME;
  
    if (isExpired) {
      return res.status(400).json({
        message: "OTP expired",
        success: false,
      });
    }
  
    return res.status(200).json({
      message: "OTP verified successfully",
      success: true,
    });
  
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email })
    const errormessage = "Password is wrong"
    if (!user) {
      return res.status(409).json({
        message: "User not found",
        success: false,
      });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({
        message: errormessage,
        success: false,
      });
    }
    const jwttoken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.cookie("Auth_Token", jwttoken, {
      httpOnly: true,
      maxAge: 7200000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      path: '/',
    });
    res.status(200).json({
      message: "Login sucessfully",
      success: true,
      jwttoken,
      email,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error function m error aa rha",
      success: false,
    });
  }
};
export const getProfile = async (req, res, next) => {
  const token = req.cookies.Auth_Token
  try {
    if (token) { 
      return res.status(200).json({ message: "Token foumd", token })
    } else if (!token) {
      return res.status(401).json({ message: "Unauthorized, no token found" });
    }
  } catch (error) {
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("Auth_Token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      path: '/',
    })
    res.status(200).json({
      success: true,
      message: 'Logout successFully',
    })
  } catch (error) {
    res.status(200).json({
      success: true,
      message: 'Logout successFully',
    })
  }
};


