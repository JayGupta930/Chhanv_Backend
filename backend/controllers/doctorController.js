import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { HealthReport } from "../models/Report.js";
import { User } from "../models/User.js";
import { Doctor } from "../models/doctor.js";

// Create a new doctor
export const createDoctor = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    specialization,
    phoneNo,
    experience,
    email,
    qualification,
    location,
  } = req.body;

  if (
    !name ||
    !specialization ||
    !phoneNo ||
    !experience ||
    !email ||
    !qualification ||
    !location
  ) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  // Check for duplicate email
  const existingDoctor = await Doctor.findOne({ email });
  if (existingDoctor) {
    return next(new ErrorHandler("Doctor with this email already exists", 400));
  }

  const doctor = await Doctor.create({
    name,
    specialization,
    phoneNo,
    experience,
    email,
    qualification,
    location,
  });

  res.status(201).json({
    success: true,
    message: "Doctor created successfully",
    doctor,
  });
});

// Create a new health report
export const createHealthReport = catchAsyncErrors(async (req, res, next) => {
  const {
    patientId,
    relativeId,
    reportType,
    reportDate,
    doctorName,
    hospitalName,
    findings,
    isNormal,
    severity,
  } = req.body;

  // Validate required fields
  if (!patientId || !reportType || !doctorName || !findings) {
    return next(
      new ErrorHandler(
        "patientId, reportType, doctorName, and findings are required",
        400
      )
    );
  }

  // Check if patient exists
  const patient = await User.findById(patientId);
  if (!patient) {
    return next(new ErrorHandler("Patient not found", 404));
  }

  // Create health report
  const healthReport = await HealthReport.create({
    patient: patientId,
    relative: relativeId,
    reportType,
    reportDate: reportDate || new Date(),
    doctor: req.user._id, // Assuming doctor is logged in
    hospitalName,
    findings,
    isNormal: isNormal !== undefined ? isNormal : true,
    severity: severity || "low",
  });

  // Add report to patient's health reports
  if (relativeId) {
    const relativeExists = patient.relatives.some((rel) =>
      rel._id.equals(relativeId)
    );
    if (!relativeExists) {
      return next(new ErrorHandler("Relative not found for this patient", 404));
    }
  } else {
    patient.healthReports.push(healthReport._id);
  }

  await patient.save();

  // Populate the report details
  const populatedReport = await HealthReport.findById(healthReport._id)
    .populate("patient", "firstName lastName email")
    .populate("doctor", "name specialization");

  res.status(201).json({
    success: true,
    message: "Health report created successfully",
    healthReport: populatedReport,
  });
});

// Get all health reports created by a doctor
export const getDoctorHealthReports = catchAsyncErrors(
  async (req, res, next) => {
    const { doctorName } = req.query;

    if (!doctorName) {
      return next(new ErrorHandler("Doctor name is required", 400));
    }

    const healthReports = await HealthReport.find({ doctorName })
      .populate("patientId", "firstName lastName email phoneNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Health reports fetched successfully",
      healthReports,
      totalReports: healthReports.length,
    });
  }
);

// Get a specific health report by ID
export const getHealthReportById = catchAsyncErrors(async (req, res, next) => {
  const { reportId } = req.params;

  const healthReport = await HealthReport.findById(reportId).populate(
    "patientId",
    "firstName lastName email phoneNumber dateOfBirth gender bloodGroup"
  );

  if (!healthReport) {
    return next(new ErrorHandler("Health report not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Health report fetched successfully",
    healthReport,
  });
});

// Update a health report
export const updateHealthReport = catchAsyncErrors(async (req, res, next) => {
  const { reportId } = req.params;
  const {
    reportType,
    reportDate,
    doctorName,
    hospitalName,
    findings,
    isNormal,
    severity,
  } = req.body;

  const healthReport = await HealthReport.findById(reportId);

  if (!healthReport) {
    return next(new ErrorHandler("Health report not found", 404));
  }

  // Update fields if provided
  if (reportType) healthReport.reportType = reportType;
  if (reportDate) healthReport.reportDate = reportDate;
  if (doctorName) healthReport.doctorName = doctorName;
  if (hospitalName) healthReport.hospitalName = hospitalName;
  if (findings) healthReport.findings = findings;
  if (isNormal !== undefined) healthReport.isNormal = isNormal;
  if (severity) healthReport.severity = severity;

  await healthReport.save();

  res.status(200).json({
    success: true,
    message: "Health report updated successfully",
    healthReport,
  });
});

// Delete a health report
export const deleteHealthReport = catchAsyncErrors(async (req, res, next) => {
  const { reportId } = req.params;

  const healthReport = await HealthReport.findById(reportId);

  if (!healthReport) {
    return next(new ErrorHandler("Health report not found", 404));
  }

  // Remove report from patient's health reports
  const patient = await User.findById(healthReport.patientId);
  if (patient) {
    // Remove from main health reports
    patient.healthReports = patient.healthReports.filter(
      (report) => report.toString() !== reportId
    );

    // Remove from relatives' health reports
    patient.relatives.forEach((relative) => {
      relative.healthReports = relative.healthReports.filter(
        (report) => report.toString() !== reportId
      );
    });

    await patient.save();
  }

  await HealthReport.findByIdAndDelete(reportId);

  res.status(200).json({
    success: true,
    message: "Health report deleted successfully",
  });
});

// Get health reports by patient ID
export const getPatientHealthReports = catchAsyncErrors(
  async (req, res, next) => {
    const { patientId } = req.params;

    const patient = await User.findById(patientId).populate({
      path: "healthReports",
      options: { sort: { createdAt: -1 } },
    });

    if (!patient) {
      return next(new ErrorHandler("Patient not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Patient health reports fetched successfully",
      patient: {
        _id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        healthReports: patient.healthReports,
      },
      totalReports: patient.healthReports.length,
    });
  }
);

// Get health reports for a specific relative
export const getRelativeHealthReports = catchAsyncErrors(
  async (req, res, next) => {
    const { patientId, relativeId } = req.params;

    const patient = await User.findById(patientId).populate({
      path: "relatives.healthReports",
      model: "HealthReport",
      options: { sort: { createdAt: -1 } },
    });

    if (!patient) {
      return next(new ErrorHandler("Patient not found", 404));
    }

    const relative = patient.relatives.id(relativeId);
    if (!relative) {
      return next(new ErrorHandler("Relative not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Relative health reports fetched successfully",
      relative: {
        _id: relative._id,
        firstName: relative.firstName,
        lastName: relative.lastName,
        relationship: relative.relationship,
        healthReports: relative.healthReports,
      },
      totalReports: relative.healthReports.length,
    });
  }
);

// Get all health reports (admin/doctor view)
export const getAllHealthReports = catchAsyncErrors(async (req, res, next) => {
  const { page = 1, limit = 10, reportType, severity, doctorName } = req.query;

  // Build filter object
  const filter = {};
  if (reportType) filter.reportType = reportType;
  if (severity) filter.severity = severity;
  if (doctorName) filter.doctorName = { $regex: doctorName, $options: "i" };

  const healthReports = await HealthReport.find(filter)
    .populate("patientId", "firstName lastName email phoneNumber")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const totalReports = await HealthReport.countDocuments(filter);

  res.status(200).json({
    success: true,
    message: "All health reports fetched successfully",
    healthReports,
    totalReports,
    currentPage: page,
    totalPages: Math.ceil(totalReports / limit),
  });
});
