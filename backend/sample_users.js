// Sample user creation script
// Run this in MongoDB Compass or via API calls

// Create Admin User
db.users.insertOne({
  firstName: "छांव",
  lastName: "एडमिन",
  email: "admin@chhanv.com",
  phoneNumber: "9999999999",
  password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // admin123
  role: "admin",
  dateOfBirth: new Date("1980-01-01"),
  gender: "male",
  createdAt: new Date(),
  updatedAt: new Date()
});

// Create Doctor User
db.users.insertOne({
  firstName: "डॉ. राम",
  lastName: "शर्मा",
  email: "doctor@chhanv.com",
  phoneNumber: "8888888888",
  password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // doctor123
  role: "doctor",
  dateOfBirth: new Date("1975-05-15"),
  gender: "male",
  createdAt: new Date(),
  updatedAt: new Date()
});

// Create Regular User
db.users.insertOne({
  firstName: "राज",
  lastName: "कुमार",
  email: "user@chhanv.com",
  phoneNumber: "9876543210",
  password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // user123
  role: "user",
  dateOfBirth: new Date("1990-10-20"),
  gender: "male",
  bloodGroup: "B+",
  createdAt: new Date(),
  updatedAt: new Date()
});
