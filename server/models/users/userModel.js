const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email not valid. Please enter a valid email");
        }
      },
    },
    userprofile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],

    //code block for forgot password
    verifyToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//token generation
userSchema.methods.generateAuthToken = async function () {
  try {
    let newToken = jwt.sign({ _id: this._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    this.tokens = this.tokens.concat({ token: newToken });
    await this.save();
    return newToken;
  } catch (error) {
    res.status(400).json({ errorMessage: "Unable to generate token", error });
  }
};

//model code block
const userDB = new mongoose.model("users", userSchema);
module.exports = userDB;
