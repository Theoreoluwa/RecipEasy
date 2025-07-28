//
const userDB = require('../../models/users/userModel');
const bcrypt = require('bcryptjs');
const cloudinary = require('../../Cloudinary/cloudinary');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const { transporter } = require('../../helper');

// User Registration
exports.register = async (req, res) => {
  try {
    const file = req.file ? req.file.path : '';
    const { username, email, password, confirmpassword } = req.body;

    // Validate required fields
    if (!username || !password || !email || !confirmpassword || !file) {
      return res.status(400).json({ errorMessage: 'All fields are required.' });
    }

    // Ensure passwords match
    if (password !== confirmpassword) {
      return res.status(400).json({ errorMessage: 'Passwords do not match!' });
    }

    // Check if user already exists
    const existingUser = await userDB.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errorMessage: 'User already exists!' });
    }

    // Upload user profile image to Cloudinary (wrapped inside try-catch)
    let upload;
    try {
      upload = await cloudinary.uploader.upload(file);
    } catch (uploadError) {
      console.error('Cloudinary Upload Error:', uploadError);
      return res.status(500).json({ errorMessage: 'Failed to upload image.' });
    }

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (hashError) {
      console.error('Password Hashing Error:', hashError);
      return res.status(500).json({ errorMessage: 'Failed to hash password.' });
    }

    // Create and save new user
    const newUser = new userDB({
      username,
      email,
      password: hashedPassword,
      userprofile: upload.secure_url,
    });

    await newUser.save();
    return res.status(200).json({ message: 'User registered successfully!', user: newUser });
  } catch (error) {
    console.error('Unexpected Server Error:', error);
    return res.status(500).json({ errorMessage: 'Internal Server Error', error });
  }
};

//User login

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ errorMessage: 'Please fill in your email and password' });
    }

    //verify if user is existing in db
    const existingUser = await userDB.findOne({ email });
    if (existingUser) {
      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (!isMatch) {
        res.status(404).json({
          errorMessage: 'User not found, update your details and try again',
        });
      } else {
        //token generation
        const token = await existingUser.generateAuthToken();

        const result = {
          token,
        };
        res.status(200).json({ result, message: 'User logged in successfully!' });
      }
    } else {
      return res.status(400).json({ errorMessage: 'This user does not exist in the db' });
    }
  } catch (error) {
    console.error('Unexpected Server Error:', error);
    return res.status(500).json({ errorMessage: 'Internal Server Error', error });
  }
};

//verify user
exports.userVerify = async (req, res) => {
  try {
    const verifyUser = await userDB.findOne({ _id: req.userId });
    res.status(200).json(verifyUser);
  } catch (error) {
    console.error('Unexpected Server Error:', error);
    return res.status(500).json({ errorMessage: 'Internal Server Error', error });
  }
};

//code block for forgot password
exports.forgotpassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ errorMessage: 'Please enter your email address.' });
  }

  try {
    const userFind = await userDB.findOne({ email: email });
    if (!userFind) {
      res.status(404).json({ errorMessage: 'User not found, please check your email' });
    } else {
      //generate token for reset password
      const token = jwt.sign({ _id: userFind._id }, SECRET_KEY, {
        expiresIn: '600s',
      });

      const setUserToken = await userDB.findByIdAndUpdate({ _id: userFind._id }, { verifyToken: token }, { new: true });

      const link = `http://localhost:${process.env.FRONTEND_PORT}/resetpassword/${userFind._id}/${setUserToken.verifyToken}`;

      if (setUserToken) {
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: 'Sending Email for Password Reset',
          html: `
            <h2>Password Reset Request</h2>
            <p>Hello ${userFind.username},</p>
            <p>You requested to reset your password. Please click on the link below to reset your password:</p>
            <a href="${link}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 13px; color: white; background-color:rgb(207, 91, 56); text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thank you,</p>
            <p>The food recipe app team</p>
                  `,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('error', error);
            res.status(400).json({ errorMessage: 'Email not sent' });
          } else {
            console.log('Email sent: ', info.response);
            res.status(200).json({
              message: 'An email to reset your password has been sent successfully',
            });
          }
        });
      } else {
        res.status(400).json({ errorMessage: 'Invalid user' });
      }
    }
  } catch (error) {
    console.error('Unexpected Server Error:', error);
    res.status(500).json({ errorMessage: 'Internal Server Error', error });
  }
};

//code block for forgot password verify
exports.forgotpasswordVerify = async (req, res) => {
  const { id, token } = req.params;

  try {
    const validUser = await userDB.findOne({ _id: id, verifyToken: token });

    const verifyToken = jwt.verify(token, SECRET_KEY);

    if (validUser && verifyToken._id) {
      res.status(200).json({ message: 'Valid user' });
    } else {
      res.status(400).json({ errorMessage: 'Link expired!' });
    }
  } catch (error) {
    console.error('Unexpected Server Error:', error);
    res.status(500).json({ errorMessage: 'Internal Server Error', error });
  }
};

//code block for reset password
exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    const validUser = await userDB.findOne({ _id: id, verifyToken: token });

    const verifyToken = jwt.verify(token, SECRET_KEY);

    if (validUser && verifyToken._id) {
      const newPassword = await bcrypt.hash(password, 12);

      const setUserNewPassword = await userDB.findByIdAndUpdate({ _id: id }, { password: newPassword }, { new: true });

      res.status(200).json({ message: 'Password successfully updated!', setUserNewPassword });
    } else {
      res.status(400).json({ errorMessage: 'Link expired!' });
    }
  } catch (error) {
    console.error('Unexpected Server Error:', error);
    res.status(500).json({ errorMessage: 'Internal Server Error', error });
  }
};
