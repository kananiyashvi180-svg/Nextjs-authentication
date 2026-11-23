import jwt from "jsonwebtoken";

// Throw at module load time so errors are caught early during server startup
const JWT_SECRET: string = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return secret;
})();

// ─── Generate Token ───────────────────────────────────────────────────────────
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
}

// ─── Verify Token ─────────────────────────────────────────────────────────────
export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded === "string" ||
      typeof (decoded as jwt.JwtPayload).userId !== "string"
    ) {
      return null;
    }

    return decoded as jwt.JwtPayload & { userId: string };
  } catch {
    // Covers TokenExpiredError, JsonWebTokenError, NotBeforeError
    return null;
  }
}
