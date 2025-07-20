import mongoose from "mongoose";

const healthReportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true,
    default: () => `HR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  relative: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" 
  },
  reportType: {
    type: String,
    required: true,
    enum: [
      "general",
      "blood_test",
      "urine_test",
      "xray",
      "scan",
      "prescription",
      "follow_up"
    ]
  },
  diagnosis: {
    type: String,
    required: true
  },
  findings: {
    type: String,
    required: true
  },
  vitals: {
    sugar: {
      type: Number,
      min: 0
    },
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    height: {
      type: Number,
      min: 0
    },
    weight: {
      type: Number,
      min: 0
    },
    temperature: {
      type: Number,
      min: 0
    },
    pulse: {
      type: Number,
      min: 0
    }
  },
  isNormal: {
    type: Boolean,
    default: true
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low"
  },
  hospitalName: String,
  notes: String,
  followUpDate: Date,
  medications: [
    {
      name: String,
      dosage: String,
      frequency: String,
      duration: String
    }
  ],
  attachments: [
    {
      name: String,
      url: String,
      type: String
    }
  ]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for better query performance
healthReportSchema.index({ patient: 1, createdAt: -1 })
healthReportSchema.index({ doctor: 1, createdAt: -1 });
healthReportSchema.index({ reportType: 1 });

// Virtual for formatted blood pressure
healthReportSchema.virtual('formattedBloodPressure').get(function() {
  if (this.vitals?.bloodPressure) {
    return `${this.vitals.bloodPressure.systolic}/${this.vitals.bloodPressure.diastolic}`;
  }
  return null;
});

// Virtual for BMI calculation
healthReportSchema.virtual('bmi').get(function() {
  if (this.vitals?.height && this.vitals?.weight) {
    const heightInMeters = this.vitals.height / 100;
    return (this.vitals.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return null;
});

// Pre-save hook to generate report ID if not provided
healthReportSchema.pre('save', function(next) {
  if (!this.reportId) {
    this.reportId = `HR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

export const HealthReport = mongoose.model("HealthReport", healthReportSchema);