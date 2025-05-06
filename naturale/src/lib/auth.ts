import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "./db";

interface JwtPayload {
  id: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export async function auth() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth-token")?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-fallback-secret-key"
    ) as JwtPayload;
    
    if (!decoded || !decoded.id) {
      return null;
    }
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        firstLogin: true,
      },
    });
    
    if (!user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
} 