import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, "Full-name is required"],
      minLength: [2, "Minimum length at least 2 character"],
      maxLength: [30, "maximum length at most 30 character"],
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: [8, "password at least 6 character"],
    },
    profilePicture: {
      type: String,
      trim: true,
      default: "",
    },
    nativeLanguage: {
      type: String,
      trim: true,
      default: "",
    },
    learningLanguage: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      country: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "" },
      street: { type: String, trim: true, default: "" },
    },
    onBoarding: {
      type: Boolean,
      default: false,
    },
    friends: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

// pre hook
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  } catch (err) {
    console.log("Error in mongodb pre hook", err);
  }
});

userSchema.methods.comparePassword = async function (enterPassword) {
  try {
    return await bcrypt.compare(enterPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const userModel = model("User", userSchema);
export default userModel;
