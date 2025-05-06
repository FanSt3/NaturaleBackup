import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/blogs
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

    const blogs = await prisma.blog.findMany({
      where: {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await prisma.blog.count({
      where: {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      },
    });

    return NextResponse.json({
      blogs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error in /api/blogs:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

// POST /api/blogs
export async function POST(request: Request) {
  try {
    if (!prisma) {
      throw new Error("Database client not initialized");
    }

    const body = await request.json();
    const { title, content, authorId, published } = body;

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        published: published || false,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/blogs:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
} 