import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
      minLength: [8, "Password must contain at least 8 characters."],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    // User role for authorization
    role: {
      type: String,
      enum: ["user", "admin", "doctor"],
      default: "user",
    },

    // Health-related information
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    // References to relatives (can be existing users or inline details)
    relatives: [
      {
        // If relative is an existing user
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        // If relative is created inline (not a user)
        firstName: {
          type: String,
        },
        lastName: {
          type: String,
        },
        phoneNumber: {
          type: String,
        },
        dateOfBirth: {
          type: Date,
        },
        gender: {
          type: String,
          enum: ["male", "female", "other"],
        },
        bloodGroup: {
          type: String,
          enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        relationship: {
          type: String,
          enum: [
            "parent",
            "child",
            "sibling",
            "spouse",
            "grandparent",
            "grandchild",
            "uncle",
            "aunt",
            "cousin",
            "other",
          ],
          required: true,
        },
        // Health reports for this relative
        healthReports: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HealthReport",
          },
        ],
        isExistingUser: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // References to health reports
    healthReports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HealthReport",
      },
    ],
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
