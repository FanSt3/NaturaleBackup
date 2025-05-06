import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/team/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/team/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, position, description, image } = body;

    const teamMember = await prisma.teamMember.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        position,
        description,
        image,
      },
    });

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/team/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.teamMember.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 