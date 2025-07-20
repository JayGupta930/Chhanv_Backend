export const generateToken = (
  user,
  message,
  statusCode,
  res,
  userData = null
) => {
  const token = user.generateJsonWebToken();

  const isDevelopment = process.env.NODE_ENV === "development";
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // false for development
    sameSite: isDevelopment ? "lax" : "strict", // more permissive for local development
  };

  if (isDevelopment) {
    cookieOptions.domain = "localhost";
  }

  if (isDevelopment) {
    console.log("🍪 Cookie configuration:", cookieOptions);
    console.log("🔑 Generated token for user:", user.email || user.username);
  }

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      user: userData || user,
      token,
    });
};
