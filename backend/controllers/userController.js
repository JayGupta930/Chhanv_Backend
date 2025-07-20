import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/User.js";
import { generateToken } from "../utils/jwtToken.js";

export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    password,
    email,
    phoneNumber,
    dateOfBirth,
    gender,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !password ||
    !email ||
    !phoneNumber ||
    !dateOfBirth ||
    !gender
  ) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorHandler("User already exists", 400));
  }
  const user = await User.create({
    firstName,
    lastName,
    password,
    email,
    phoneNumber,
    dateOfBirth,
    gender,
  });
  generateToken(user, "User registered successfully", 201, res);
});


export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, phoneNumber } = req.body;
  
  // Support both email and phone number login
  if ((!email && !phoneNumber) || !password) {
    return next(new ErrorHandler("Please provide email/phone number and password", 400));
  }
  
  // Find user by email or phone number
  let user;
  if (email) {
    user = await User.findOne({ email }).select("+password");
  } else if (phoneNumber) {
    user = await User.findOne({ phoneNumber }).select("+password");
  }
  
  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }
  
  // Include role in response
  const userData = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    bloodGroup: user.bloodGroup,
  };
  
  generateToken(user, "User logged in successfully", 200, res, userData);
});

// Admin login (same user table with role check)
export const adminLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }
  
  const user = await User.findOne({ email, role: 'admin' }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid admin credentials", 401));
  }
  
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid admin credentials", 401));
  }
  
  const adminData = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };
  
  generateToken(user, "Admin logged in successfully", 200, res, adminData);
});

// Doctor login (same user table with role check)
export const doctorLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }
  
  const user = await User.findOne({ email, role: 'doctor' }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid doctor credentials", 401));
  }
  
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid doctor credentials", 401));
  }
  
  const doctorData = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };
  
  generateToken(user, "Doctor logged in successfully", 200, res, doctorData);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    user,
  });
});

export const updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    dateOfBirth,
    gender,
    bloodGroup,
  } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if email is being changed and if it already exists
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email already exists", 400));
    }
  }

  // Update only provided fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (dateOfBirth) user.dateOfBirth = dateOfBirth;
  if (gender) user.gender = gender;
  if (bloodGroup) user.bloodGroup = bloodGroup;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

export const changePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(
      new ErrorHandler("Please provide both current and new password", 400)
    );
  }

  if (newPassword.length < 6) {
    return next(
      new ErrorHandler("New password must be at least 6 characters long", 400)
    );
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isPasswordMatched = await user.comparePassword(currentPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Current password is incorrect", 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

export const addRelative = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    dateOfBirth,
    gender,
    bloodGroup,
    relationship,
    userId, // Optional: if adding existing user as relative
  } = req.body;

  // Validate required fields
  if (!relationship) {
    return next(new ErrorHandler("Relationship is required", 400));
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  let relativeData = {
    relationship,
    createdAt: new Date(),
  };

  // If userId is provided, add existing user as relative
  if (userId) {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return next(new ErrorHandler("Relative user not found", 404));
    }

    // Check if this user is already added as relative
    const existingRelative = user.relatives.find(
      (rel) => rel.userId && rel.userId.toString() === userId
    );
    if (existingRelative) {
      return next(
        new ErrorHandler("This user is already added as relative", 400)
      );
    }

    relativeData.userId = userId;
    relativeData.isExistingUser = true;
  } else {
    // Create new relative with provided details
    if (!firstName || !lastName || !phoneNumber || !dateOfBirth || !gender) {
      return next(
        new ErrorHandler(
          "For new relative, firstName, lastName, phoneNumber, dateOfBirth, and gender are required",
          400
        )
      );
    }

    // Check if relative with same details already exists
    const existingRelative = user.relatives.find(
      (rel) =>
        !rel.isExistingUser &&
        rel.firstName === firstName &&
        rel.lastName === lastName &&
        rel.phoneNumber === phoneNumber
    );
    if (existingRelative) {
      return next(
        new ErrorHandler("Relative with same details already exists", 400)
      );
    }

    relativeData = {
      ...relativeData,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      bloodGroup,
      isExistingUser: false,
    };
  }

  user.relatives.push(relativeData);
  await user.save();

  // Populate the relative details if it's an existing user
  await user.populate({
    path: "relatives.userId",
    select:
      "firstName lastName email phoneNumber dateOfBirth gender bloodGroup",
  });

  res.status(200).json({
    success: true,
    message: "Relative added successfully",
    relative: user.relatives[user.relatives.length - 1],
    totalRelatives: user.relatives.length,
  });
});

export const getRelatives = catchAsyncErrors(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const user = await User.findById(req.user._id)
    .populate({
      path: "relatives.userId",
      select: "firstName lastName email",
      options: { skip: (page - 1) * limit, limit: +limit }
    });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Relatives fetched successfully",
    relatives: user.relatives,
    totalRelatives: user.relatives.length,
  });
});

export const updateRelative = catchAsyncErrors(async (req, res, next) => {
  const { relativeId } = req.params;
  const {
    firstName,
    lastName,
    phoneNumber,
    dateOfBirth,
    gender,
    bloodGroup,
    relationship,
  } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const relative = user.relatives.id(relativeId);
  if (!relative) {
    return next(new ErrorHandler("Relative not found", 404));
  }

  // Can only update non-existing user relatives (inline relatives)
  if (relative.isExistingUser) {
    return next(
      new ErrorHandler("Cannot update details of existing user relative", 400)
    );
  }

  // Update fields if provided
  if (firstName) relative.firstName = firstName;
  if (lastName) relative.lastName = lastName;
  if (phoneNumber) relative.phoneNumber = phoneNumber;
  if (dateOfBirth) relative.dateOfBirth = dateOfBirth;
  if (gender) relative.gender = gender;
  if (bloodGroup) relative.bloodGroup = bloodGroup;
  if (relationship) relative.relationship = relationship;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Relative updated successfully",
    relative,
  });
});

export const removeRelative = catchAsyncErrors(async (req, res, next) => {
  const { relativeId } = req.params;

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const relativeIndex = user.relatives.findIndex(
    (rel) => rel._id.toString() === relativeId
  );

  if (relativeIndex === -1) {
    return next(new ErrorHandler("Relative not found", 404));
  }

  user.relatives.splice(relativeIndex, 1);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Relative removed successfully",
    totalRelatives: user.relatives.length,
  });
});
