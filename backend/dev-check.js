#!/usr/bin/env node

/**
 * Development Environment Checker
 * Validates that all required environment variables and dependencies are set up correctly
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DevChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.success = [];
  }

  checkFile(filePath, description) {
    if (fs.existsSync(filePath)) {
      this.success.push(`✅ ${description}: ${filePath}`);
      return true;
    } else {
      this.errors.push(`❌ ${description}: ${filePath} not found`);
      return false;
    }
  }

  checkEnvFile() {
    console.log("\n🔍 Checking environment configuration...");

    const envPath = path.join(__dirname, "secret.env");
    if (!this.checkFile(envPath, "Environment file")) {
      this.errors.push(
        "💡 Run: cp secret.env.example secret.env (if available)"
      );
      return false;
    }

    // Read and validate env variables
    try {
      const envContent = fs.readFileSync(envPath, "utf8");
      const requiredVars = [
        "PORT",
        "DB_URI",
        "JWT_SECRET_KEY",
        "JWT_EXPIRES",
        "COOKIE_EXPIRE",
        "NODE_ENV",
      ];

      const optionalVars = [
        "FRONTEND_URL",
        "CLOUDINARY_CLIENT_NAME",
        "CLOUDINARY_CLIENT_API",
        "CLOUDINARY_CLIENT_SECRET",
      ];

      requiredVars.forEach((varName) => {
        if (envContent.includes(`${varName}=`)) {
          const match = envContent.match(new RegExp(`${varName}=(.+)`));
          if (match && match[1].trim()) {
            this.success.push(`✅ ${varName} is set`);
          } else {
            this.errors.push(`❌ ${varName} is empty`);
          }
        } else {
          this.errors.push(`❌ ${varName} is missing`);
        }
      });

      optionalVars.forEach((varName) => {
        if (envContent.includes(`${varName}=`)) {
          const match = envContent.match(new RegExp(`${varName}=(.+)`));
          if (match && match[1].trim()) {
            this.success.push(`✅ ${varName} is set (optional)`);
          } else {
            this.warnings.push(`⚠️  ${varName} is empty (optional)`);
          }
        } else {
          this.warnings.push(`⚠️  ${varName} is missing (optional)`);
        }
      });
    } catch (error) {
      this.errors.push(`❌ Error reading environment file: ${error.message}`);
    }
  }

  checkFiles() {
    console.log("\n🔍 Checking project files...");

    const requiredFiles = [
      { path: "package.json", desc: "Package configuration" },
      { path: "server.js", desc: "Server entry point" },
      { path: "app.js", desc: "Application configuration" },
      { path: "config/db.js", desc: "Database configuration" },
      { path: "models/User.js", desc: "User model" },
      { path: "models/doctor.js", desc: "Doctor model" },
      { path: "models/Report.js", desc: "Report model" },
      { path: "controllers/userController.js", desc: "User controller" },
      { path: "controllers/doctorController.js", desc: "Doctor controller" },
      { path: "controllers/adminController.js", desc: "Admin controller" },
      { path: "middlewares/auth.js", desc: "Authentication middleware" },
      { path: "utils/jwtToken.js", desc: "JWT utility" },
    ];

    requiredFiles.forEach((file) => {
      const fullPath = path.join(__dirname, file.path);
      this.checkFile(fullPath, file.desc);
    });
  }

  checkPackageJson() {
    console.log("\n🔍 Checking package.json dependencies...");

    try {
      const packagePath = path.join(__dirname, "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

      const requiredDeps = [
        "express",
        "mongoose",
        "jsonwebtoken",
        "bcryptjs",
        "cookie-parser",
        "cors",
        "dotenv",
      ];

      const devDeps = ["nodemon"];

      requiredDeps.forEach((dep) => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          this.success.push(`✅ ${dep} dependency installed`);
        } else {
          this.errors.push(`❌ ${dep} dependency missing`);
        }
      });

      devDeps.forEach((dep) => {
        if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
          this.success.push(`✅ ${dep} dev dependency installed`);
        } else {
          this.warnings.push(`⚠️  ${dep} dev dependency missing`);
        }
      });

      // Check scripts
      if (packageJson.scripts) {
        if (packageJson.scripts.dev || packageJson.scripts.start) {
          this.success.push("✅ Start scripts configured");
        } else {
          this.warnings.push("⚠️  No start scripts found");
        }
      }
    } catch (error) {
      this.errors.push(`❌ Error reading package.json: ${error.message}`);
    }
  }

  checkNodeModules() {
    console.log("\n🔍 Checking node_modules...");

    const nodeModulesPath = path.join(__dirname, "node_modules");
    if (fs.existsSync(nodeModulesPath)) {
      this.success.push("✅ node_modules directory exists");

      // Check if it has content
      try {
        const contents = fs.readdirSync(nodeModulesPath);
        if (contents.length > 0) {
          this.success.push(`✅ node_modules has ${contents.length} packages`);
        } else {
          this.warnings.push("⚠️  node_modules is empty");
        }
      } catch (error) {
        this.warnings.push("⚠️  Cannot read node_modules contents");
      }
    } else {
      this.errors.push("❌ node_modules directory missing");
      this.errors.push("💡 Run: npm install");
    }
  }

  generateDevSetupSuggestions() {
    console.log("\n💡 Development Setup Suggestions:");

    const suggestions = [
      "1. Set NODE_ENV=development in your secret.env file",
      "2. Use nodemon for auto-restarting: npm run dev",
      "3. Check server logs for authentication debug info",
      "4. Use the test-auth.js script to test login flows",
      "5. Ensure MongoDB is running locally or connection string is correct",
      "6. Test API endpoints with tools like Postman or curl",
      "7. Check browser cookies for token storage",
      "8. Verify CORS settings for frontend-backend communication",
    ];

    suggestions.forEach((suggestion) => {
      console.log(`  ${suggestion}`);
    });
  }

  printReport() {
    console.log("\n📋 DEVELOPMENT ENVIRONMENT REPORT");
    console.log("=".repeat(50));

    if (this.success.length > 0) {
      console.log("\n✅ SUCCESS:");
      this.success.forEach((msg) => console.log(`  ${msg}`));
    }

    if (this.warnings.length > 0) {
      console.log("\n⚠️  WARNINGS:");
      this.warnings.forEach((msg) => console.log(`  ${msg}`));
    }

    if (this.errors.length > 0) {
      console.log("\n❌ ERRORS:");
      this.errors.forEach((msg) => console.log(`  ${msg}`));
    }

    console.log("\n📊 SUMMARY:");
    console.log(`  ✅ Success: ${this.success.length}`);
    console.log(`  ⚠️  Warnings: ${this.warnings.length}`);
    console.log(`  ❌ Errors: ${this.errors.length}`);

    if (this.errors.length === 0) {
      console.log("\n🎉 Environment is ready for development!");
      this.generateDevSetupSuggestions();
    } else {
      console.log("\n🔧 Please fix the errors above before proceeding.");
    }
  }

  run() {
    console.log("🧪 Development Environment Checker");
    console.log("🕐 " + new Date().toLocaleString());

    this.checkFiles();
    this.checkEnvFile();
    this.checkPackageJson();
    this.checkNodeModules();
    this.printReport();
  }
}

// Run checker if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const checker = new DevChecker();
  checker.run();
}

export default DevChecker;
