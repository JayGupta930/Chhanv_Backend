import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Camp } from "../models/camp.js";
import { Doctor } from "../models/doctor.js";

// Create a new camp
export const createCamp = catchAsyncErrors(async (req, res, next) => {
  const {
    location,
    date,
    startTime,
    endTime,
    address,
    conductedBy,
    limit,
    createdBy,
  } = req.body;

  // Validate required fields
  if (
    !location ||
    !date ||
    !startTime ||
    !endTime ||
    !address ||
    !conductedBy ||
    !limit
  ) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  // Validate conductedBy is an array
  if (!Array.isArray(conductedBy) || conductedBy.length === 0) {
    return next(new ErrorHandler("conductedBy must be a non-empty array", 400));
  }

  // Validate date is not in the past
  const campDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (campDate < today) {
    return next(new ErrorHandler("Camp date cannot be in the past", 400));
  }

  // Validate time format (HH:MM)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    return next(new ErrorHandler("Time must be in HH:MM format", 400));
  }

  // Validate start time is before end time
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  if (startMinutes >= endMinutes) {
    return next(new ErrorHandler("Start time must be before end time", 400));
  }

  // Validate limit is positive
  if (limit <= 0) {
    return next(new ErrorHandler("Limit must be a positive number", 400));
  }

  // Validate doctors exist
  const doctors = await Doctor.find({ _id: { $in: conductedBy } });
  if (doctors.length !== conductedBy.length) {
    return next(new ErrorHandler("One or more doctors not found", 404));
  }

  // Check for duplicate camp (same location and start time on same date)
  const existingCamp = await Camp.findOne({
    location: location.trim(),
    date: campDate,
    startTime,
  });

  if (existingCamp) {
    return next(
      new ErrorHandler("A camp already exists at this location and time", 400)
    );
  }

  const camp = await Camp.create({
    location: location.trim(),
    date: campDate,
    startTime,
    endTime,
    address: address.trim(),
    conductedBy,
    limit,
    createdBy: createdBy || "Admin",
  });

  const populatedCamp = await Camp.findById(camp._id).populate(
    "conductedBy",
    "firstName lastName specialization"
  );

  res.status(201).json({
    success: true,
    message: "Camp created successfully",
    camp: populatedCamp,
  });
});

// Get all camps
export const getAllCamps = catchAsyncErrors(async (req, res, next) => {
  const camps = await Camp.find()
    .populate("conductedBy", "firstName lastName specialization")
    .sort({ date: 1, startTime: 1 });

  res.status(200).json({
    success: true,
    count: camps.length,
    camps,
  });
});

// Get camp by ID
export const getCampById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const camp = await Camp.findById(id).populate(
    "conductedBy",
    "firstName lastName specialization email phone"
  );

  if (!camp) {
    return next(new ErrorHandler("Camp not found", 404));
  }

  res.status(200).json({
    success: true,
    camp,
  });
});

// Update camp
export const updateCamp = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const camp = await Camp.findById(id);
  if (!camp) {
    return next(new ErrorHandler("Camp not found", 404));
  }

  // Validate date if provided
  if (updates.date) {
    const campDate = new Date(updates.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (campDate < today) {
      return next(new ErrorHandler("Camp date cannot be in the past", 400));
    }
    updates.date = campDate;
  }

  // Validate time format if provided
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (updates.startTime && !timeRegex.test(updates.startTime)) {
    return next(new ErrorHandler("Start time must be in HH:MM format", 400));
  }
  if (updates.endTime && !timeRegex.test(updates.endTime)) {
    return next(new ErrorHandler("End time must be in HH:MM format", 400));
  }

  // Validate time logic if both times are provided
  const startTime = updates.startTime || camp.startTime;
  const endTime = updates.endTime || camp.endTime;

  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  if (startMinutes >= endMinutes) {
    return next(new ErrorHandler("Start time must be before end time", 400));
  }

  // Validate limit if provided
  if (updates.limit && updates.limit <= 0) {
    return next(new ErrorHandler("Limit must be a positive number", 400));
  }

  // Validate doctors if provided
  if (updates.conductedBy) {
    if (
      !Array.isArray(updates.conductedBy) ||
      updates.conductedBy.length === 0
    ) {
      return next(
        new ErrorHandler("conductedBy must be a non-empty array", 400)
      );
    }
    const doctors = await Doctor.find({ _id: { $in: updates.conductedBy } });
    if (doctors.length !== updates.conductedBy.length) {
      return next(new ErrorHandler("One or more doctors not found", 404));
    }
  }

  // Check for duplicate if location, date, or startTime is being updated
  if (updates.location || updates.date || updates.startTime) {
    const checkLocation = updates.location
      ? updates.location.trim()
      : camp.location;
    const checkDate = updates.date || camp.date;
    const checkStartTime = updates.startTime || camp.startTime;

    const existingCamp = await Camp.findOne({
      _id: { $ne: id },
      location: checkLocation,
      date: checkDate,
      startTime: checkStartTime,
    });

    if (existingCamp) {
      return next(
        new ErrorHandler("A camp already exists at this location and time", 400)
      );
    }
  }

  // Trim string fields
  if (updates.location) updates.location = updates.location.trim();
  if (updates.address) updates.address = updates.address.trim();

  const updatedCamp = await Camp.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).populate("conductedBy", "firstName lastName specialization");

  res.status(200).json({
    success: true,
    message: "Camp updated successfully",
    camp: updatedCamp,
  });
});

// Delete camp
export const deleteCamp = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const camp = await Camp.findById(id);
  if (!camp) {
    return next(new ErrorHandler("Camp not found", 404));
  }

  await Camp.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Camp deleted successfully",
  });
});

// Get upcoming camps
export const upComingCamps = catchAsyncErrors(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingCamps = await Camp.find({
    date: { $gte: today },
  })
    .populate("conductedBy", "firstName lastName specialization")
    .sort({ date: 1, startTime: 1 });

  res.status(200).json({
    success: true,
    count: upcomingCamps.length,
    camps: upcomingCamps,
  });
});

// Get past camps count
export const pastCampsCount = catchAsyncErrors(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await Camp.countDocuments({
    date: { $lt: today },
  });

  res.status(200).json({
    success: true,
    count,
  });
});

// Get upcoming camps count
export const upComingCampsCount = catchAsyncErrors(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await Camp.countDocuments({
    date: { $gte: today },
  });

  res.status(200).json({
    success: true,
    count,
  });
});

// Get this month's camps count
export const thisMonthCampsCount = catchAsyncErrors(async (req, res, next) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const count = await Camp.countDocuments({
    date: {
      $gte: startOfMonth,
      $lt: startOfNextMonth,
    },
  });

  res.status(200).json({
    success: true,
    count,
  });
});
