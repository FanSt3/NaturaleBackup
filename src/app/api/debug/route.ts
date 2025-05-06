import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get counts of all database models
    const userCount = await prisma.user.count();
    const blogCount = await prisma.blog.count();
    const activityCount = await prisma.activity.count();
    const teamMemberCount = await prisma.teamMember.count();
    
    // Get first item of each type
    const firstUser = await prisma.user.findFirst();
    const firstBlog = await prisma.blog.findFirst();
    const firstActivity = await prisma.activity.findFirst();
    const firstTeamMember = await prisma.teamMember.findFirst();
    
    return NextResponse.json({ 
      status: "success",
      message: "API is working correctly",
      counts: {
        users: userCount,
        blogs: blogCount,
        activities: activityCount,
        teamMembers: teamMemberCount
      },
      samples: {
        user: firstUser ? { id: firstUser.id, name: firstUser.name } : null,
        blog: firstBlog ? { id: firstBlog.id, title: firstBlog.title } : null,
        activity: firstActivity ? { id: firstActivity.id, title: firstActivity.title } : null,
        teamMember: firstTeamMember ? { id: firstTeamMember.id, name: firstTeamMember.name } : null
      },
      prismaInitialized: Boolean(prisma),
      nodeEnv: process.env.NODE_ENV
    });
  } catch (error) {
    console.error("Debug API error:", error);
    
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
} 