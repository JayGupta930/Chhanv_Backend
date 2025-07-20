import app from "./app.js";
import { config } from "dotenv";

// Load environment variables
config({ path: "./secret.env" });

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);

  if (NODE_ENV === "development") {
    console.log(`\n🔧 Development Mode Active:`);
    console.log(
      `   - CORS Origins: ${
        process.env.CORS_ORIGIN || "Default localhost ports"
      }`
    );
    console.log(
      `   - Rate Limit: ${process.env.RATE_LIMIT_MAX || 1000} requests per ${
        process.env.RATE_LIMIT_WINDOW || 15
      } minutes`
    );
    console.log(`   - JWT Debug: Enabled`);
    console.log(`   - Cookie Security: Relaxed for localhost`);
    console.log(`\n🌐 Test your API at: http://localhost:${PORT}`);
  }
});
