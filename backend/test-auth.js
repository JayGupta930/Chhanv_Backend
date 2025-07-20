#!/usr/bin/env node

/**
 * Development Authentication Test Script
 * This script helps test authentication flows in development mode
 */

import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "./secret.env" });

const BASE_URL = process.env.FRONTEND_URL || "http://localhost:4000";
const API_URL = `${BASE_URL}/api/v1`;

// Test credentials
const TEST_CREDENTIALS = {
  admin: {
    email: "admin@chhanv.com",
    password: "admin123",
  },
  doctor: {
    email: "doctor@chhanv.com",
    password: "doctor123",
  },
  user: {
    email: "user@chhanv.com",
    password: "user123",
  },
};

class AuthTester {
  constructor() {
    this.cookies = "";
    this.token = "";
  }

  async testLogin(userType) {
    console.log(`\n🔐 Testing ${userType} login...`);

    try {
      const credentials = TEST_CREDENTIALS[userType];
      if (!credentials) {
        throw new Error(`Unknown user type: ${userType}`);
      }

      const response = await axios.post(`${API_URL}/user/login`, credentials, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Login successful!");
      console.log("📊 Response:", {
        status: response.status,
        success: response.data.success,
        message: response.data.message,
        userRole: response.data.user?.role,
        hasToken: !!response.data.token,
      });

      // Extract cookies for future requests
      if (response.headers["set-cookie"]) {
        this.cookies = response.headers["set-cookie"].join("; ");
        console.log("🍪 Cookies set:", this.cookies);
      }

      this.token = response.data.token;
      return response.data;
    } catch (error) {
      console.log("❌ Login failed:");
      if (error.response) {
        console.log("📊 Error response:", {
          status: error.response.status,
          message: error.response.data?.message || "Unknown error",
        });
      } else {
        console.log("📊 Network error:", error.message);
      }
      throw error;
    }
  }

  async testProtectedRoute(endpoint, method = "GET") {
    console.log(`\n🔒 Testing protected route: ${method} ${endpoint}`);

    try {
      const config = {
        method: method.toLowerCase(),
        url: `${API_URL}${endpoint}`,
        withCredentials: true,
        headers: {
          Cookie: this.cookies,
          "Content-Type": "application/json",
        },
      };

      if (this.token) {
        config.headers["Authorization"] = `Bearer ${this.token}`;
      }

      const response = await axios(config);

      console.log("✅ Protected route access successful!");
      console.log("📊 Response status:", response.status);

      return response.data;
    } catch (error) {
      console.log("❌ Protected route access failed:");
      if (error.response) {
        console.log("📊 Error response:", {
          status: error.response.status,
          message: error.response.data?.message || "Unknown error",
        });
      } else {
        console.log("📊 Network error:", error.message);
      }
      throw error;
    }
  }

  async testLogout() {
    console.log("\n🚪 Testing logout...");

    try {
      const response = await axios.get(`${API_URL}/user/logout`, {
        withCredentials: true,
        headers: {
          Cookie: this.cookies,
        },
      });

      console.log("✅ Logout successful!");
      console.log("📊 Response:", response.data);

      // Clear stored credentials
      this.cookies = "";
      this.token = "";

      return response.data;
    } catch (error) {
      console.log("❌ Logout failed:");
      if (error.response) {
        console.log("📊 Error response:", {
          status: error.response.status,
          message: error.response.data?.message || "Unknown error",
        });
      } else {
        console.log("📊 Network error:", error.message);
      }
      throw error;
    }
  }
}

async function runTests() {
  console.log("🧪 Starting Authentication Tests");
  console.log("🌐 API URL:", API_URL);

  const tester = new AuthTester();

  try {
    // Test admin login
    await tester.testLogin("admin");

    // Test admin protected routes
    await tester.testProtectedRoute("/admin/users");
    await tester.testProtectedRoute("/admin/doctors");

    // Test logout
    await tester.testLogout();

    // Test doctor login
    await tester.testLogin("doctor");

    // Test doctor protected routes
    await tester.testProtectedRoute("/doctor/profile");

    console.log("\n🎉 All tests completed successfully!");
  } catch (error) {
    console.log("\n💥 Test suite failed");
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { AuthTester, runTests };
