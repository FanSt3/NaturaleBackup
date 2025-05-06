import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await auth();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { currentPassword, newPassword } = body;
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, dbUser.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password and set firstLogin to false
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        firstLogin: false
      },
    });
    
    return NextResponse.json({ 
      message: "Password changed successfully" 
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
} 