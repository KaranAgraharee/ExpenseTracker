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
    const user = UserModel.findOne({email})
    const otp = crypto.randomInt(100000, 999999)
    const sendotp = OtpModel.findOne({email})
    if (user) {
      return res.status(409).json({
        message: "User is already exist, you can login",
        success: false,
      })
    }else if(sendOtp){
      const VerificationCode = OtpModel.findByIdAndUpdate(sendOtp._id, { email, otp }, { new: true })
    }else{
      const VerificationCode = OtpModel.create({ email, otp })  
      await SendVerificationCode(email, VerificationCode.otp)
      res.status(200).json({
        message: "OTP sent successfully",
        success: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "failed to send otp",
      success: false,
    })
  }
}



export const verifyOTP = async (req, res) => {
  try {
    const { userEmail=email, code=otp, timeOut } = req.body
    const user = await UserModel.findOne({ userEmail });
    if (user) {
      return res.status(404).json({
        message: "User already found.",
        sucess: false,
      })
    }
    const {email, otp, createdAt} = OtpModel.findOne({ userEmail, code })
    if (otp !== code || createdAt < timeOut - 10 * 60 * 1000) {
      return res.status(400).json({
        message: "Invalid or expired otp",
        sucess: false,
      })
    }
    res.status(200).json({
      message: "OTP verified successfully",
      success: true,
    })
  } catch (error) {
    console.error("OTP Verification Error:", error)
    res.status(500).json({
      message: "Internal server error",
      success: false,
    })
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


