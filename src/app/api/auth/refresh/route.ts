import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Count users to check database connection
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: "ok",
      message: "Auth system is working",
      databaseConnection: "ok",
      userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Auth refresh error:", error);
    return NextResponse.json({
      status: "error",
      message: "Error checking auth system",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 