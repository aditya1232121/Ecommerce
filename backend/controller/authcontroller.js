const User = require("../model/usermodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;

const signToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 90) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: {
        public_id: "this is a sample id",
        url: "profilepicture",
      },
    });
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: "fail", message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: "fail", message: "Incorrect email or password" });
    }
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.control = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ status: "fail", message: "You are not logged in!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ status: "fail", message: "User no longer exists!" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("jwt", "null", { expires: new Date(Date.now()), httpOnly: true });
    res.status(200).json({ status: "success", message: "Logged out successfully" });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};

exports.restrictedto = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ status: "fail", message: "You do not have permission to perform this action" });
  }
  next();
};
exports.forgotpassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // ✅ Send frontend reset URL (React runs on port 3000)
    const resetURL = `http://localhost:3000/password/reset/${resetToken}`;
    console.log("Reset URL:", resetURL);

    const message = `Forgot your password?\nClick the link below to reset your password:\n${resetURL}\n\nThis link will expire in 15 minutes.`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Your Password Reset Token (valid for 15 minutes)",
        message,
      });

      res.status(200).json({ status: "success", message: "Token sent to email" });
    } catch (err) {
      // Cleanup if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ status: "fail", message: "Error sending email: " + err.message });
    }

  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const receivedToken = req.params.token;
    const hashedToken = crypto.createHash("sha256").update(receivedToken).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      console.log("No user found for this token!");
      return res.status(400).json({ status: "fail", message: "Invalid or expired token" });
    }

    const { password, confirmPassword } = req.body;

    // ✅ Check if passwords match
    if (!password || password.length < 8) {
      return res.status(400).json({ status: "fail", message: "Password must be at least 8 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ status: "fail", message: "Passwords do not match" });
    }

    // ✅ Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // ✅ Send login token or success message
    createSendToken(user, 200, res); // or just: res.status(200).json({ success: true, message: "Password updated" });

  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getuserdetail = async (req, res) => {
  try {
      const user = await User.findById(req.user.id);

      if (!user) {
          return res.status(404).json({
              success: false,
              message: "User not found",
          });
      }

      res.status(200).json({
          success: true,
          user,
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: error.message || "Internal Server Error",
      });
  }
};
exports.updatepassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    const { oldpassword, newpassword, confirmpassword } = req.body;

    if (!oldpassword || !newpassword || !confirmpassword) {
      return res.status(400).json({ status: "fail", message: "Please fill all password fields" });
    }

    // Check current password
    const isMatch = await user.correctPassword(oldpassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: "fail", message: "Old password is incorrect" });
    }

    // Check new password length
    if (newpassword.length < 6) {
      return res.status(400).json({ status: "fail", message: "New password must be at least 6 characters long" });
    }

    // Check confirm password
    if (newpassword !== confirmpassword) {
      return res.status(400).json({ status: "fail", message: "Passwords do not match" });
    }

    // Update password
    user.password = newpassword;
    await user.save();

    createSendToken(user, 200, res);
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
exports.updateMe = async (req, res, next) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'This route is not for password updates. Please use /updatePassword',
      });
    }

    const filteredBody = { name: req.body.name, email: req.body.email };
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

//admin
exports.deleteme = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
      status: 'success',
      message: 'User deleted',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// getting all user details as a admin
exports.getalluser = async (req , res) => {
  try {
const user = await User.find() ;
res.status(200).json({
  status: 'success',
  user
    
})
  }
  catch(err){
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

// admin
exports.updateuserrole = async (req , res) => {
  try {
    const newuserdata = {
      name : req.body.name ,
      email : req.body.email ,
      role : req.body.role ,
    }
    const user = await User.findByIdAndUpdate(req.params.id , newuserdata , {new : true ,
      runValidators : true ,
      useFindAndModify : false ,
    } );
    res.status(200).json({
      status: 'success',
      user
      })
      }
      catch(err){
        res.status(400).json({
          status: 'fail',
          message: err.message,
          });
          }
        }

        exports.registerUser = async (req, res) => {
          try {
            if (!req.body.avatar) {
              return res.status(400).json({ status: "fail", message: "Avatar is required" });
            }
        
            const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
              folder: "avatars",
              width: 150,
              crop: "scale",
            });
        
            const { name, email, password } = req.body;
        
            const user = await User.create({
              name,
              email,
              password,
              avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
              },
            });
        
            createSendToken(user, 201, res);
          } catch (err) {
            res.status(500).json({ status: "fail", message: err.message });
          }
        };


        exports.updateProfile = async (req, res, next) => {
          try {
            const user = await User.findById(req.user.id);
        
            const newUserData = {
              name: req.body.name,
              email: req.body.email,
            };
        
            if (req.file) {
              // ✅ Upload image to Cloudinary
              const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "avatars",
                width: 150,
                crop: "scale",
              });
        
              // ✅ Delete old avatar if needed (optional)
        
              newUserData.avatar = {
                public_id: result.public_id,
                url: result.secure_url,
              };
            }
        
            const updatedUser = await User.findByIdAndUpdate(
              req.user.id,
              newUserData,
              { new: true, runValidators: true }
            );
        
            res.status(200).json({
              success: true,
              user: updatedUser,
            });
          

          } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Server Error" });
          }
        };
        