import { config } from "dotenv";
import jwt from "jsonwebtoken";

// Load environment variables
config({ path: "./secret.env" });

/**
 * Development testing utilities for JWT tokens
 */
export class DevTestUtils {
  static createTestToken(
    payload = { id: "test123", email: "test@example.com" }
  ) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return null;
    }
  }

  static logEnvironmentInfo() {
    console.log("\n🔍 Development Environment Info:");
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`   PORT: ${process.env.PORT}`);
    console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL}`);
    console.log(`   JWT_EXPIRE: ${process.env.JWT_EXPIRE}`);
    console.log(`   COOKIE_EXPIRE: ${process.env.COOKIE_EXPIRE} days`);
    console.log(`   COOKIE_SECURE: ${process.env.COOKIE_SECURE}`);
    console.log(`   COOKIE_SAMESITE: ${process.env.COOKIE_SAMESITE}`);
    console.log(`   RATE_LIMIT_MAX: ${process.env.RATE_LIMIT_MAX}`);
  }

  static testTokenGeneration() {
    console.log("\n🧪 Testing Token Generation:");

    const testPayload = {
      id: "test_user_123",
      email: "developer@test.com",
      role: "user",
    };

    const token = this.createTestToken(testPayload);
    console.log(`   Generated Token: ${token.substring(0, 50)}...`);

    const decoded = this.verifyToken(token);
    if (decoded) {
      console.log(
        `   ✅ Token Valid - Expires: ${new Date(decoded.exp * 1000)}`
      );
      console.log(`   📄 Payload:`, decoded);
    } else {
      console.log(`   ❌ Token Invalid`);
    }
  }
}

// If running this file directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("🚀 Chhanv Backend - Development Testing");
  DevTestUtils.logEnvironmentInfo();
  DevTestUtils.testTokenGeneration();

  console.log("\n💡 Usage Tips:");
  console.log("   - Use Postman/Insomnia for API testing");
  console.log("   - Check browser console for JWT debug info");
  console.log("   - Cookies will work with localhost domain");
  console.log("   - Rate limiting is relaxed in development");
}
