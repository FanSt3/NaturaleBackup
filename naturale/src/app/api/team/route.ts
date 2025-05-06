import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/team
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || "";

    // Check if prisma client is initialized
    if (!prisma) {
      throw new Error("Database client not initialized");
    }

    const teamMembers = await prisma.teamMember.findMany({
      where: {
        OR: [
          { name: { contains: search } },
          { position: { contains: search } },
          { description: { contains: search } },
        ],
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await prisma.teamMember.count({
      where: {
        OR: [
          { name: { contains: search } },
          { position: { contains: search } },
          { description: { contains: search } },
        ],
      },
    });

    return NextResponse.json({
      teamMembers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error in /api/team:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

// POST /api/team
export async function POST(request: Request) {
  try {
    // Check if prisma client is initialized
    if (!prisma) {
      throw new Error("Database client not initialized");
    }

    const body = await request.json();
    const { name, position, description, image } = body;

    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        position,
        description,
        image,
      },
    });

    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/team:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
} 