import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/administrators/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing administrator ID" },
        { status: 400 }
      );
    }

    const admin = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        firstLogin: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Administrator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ admin });
  } catch (error) {
    console.error("Error in GET /api/administrators/[id]:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/administrators/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing administrator ID" },
        { status: 400 }
      );
    }

    // Check if we're deleting the last admin
    const adminCount = await prisma.user.count();
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the last administrator" },
        { status: 400 }
      );
    }

    const admin = await prisma.user.delete({
      where: { id },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Administrator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: "Administrator deleted successfully" 
    });
  } catch (error) {
    console.error("Error in DELETE /api/administrators/[id]:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
} 