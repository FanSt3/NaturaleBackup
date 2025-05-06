import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { jwtVerify } from "jose";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Parse cookies - simpler approach
    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = value;
      }
    });

    const token = cookies["auth-token"];
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Verify token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "your-fallback-secret-key")
    );

    const userId = payload.id as string;

    // Check if prisma client is initialized
    if (!prisma) {
      throw new Error("Database client not initialized");
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth /me error:", error);
    return NextResponse.json({ 
      user: null, 
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 401 });
  }
} 