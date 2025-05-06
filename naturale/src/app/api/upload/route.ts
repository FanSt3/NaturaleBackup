import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG and WEBP are allowed." },
        { status: 400 }
      );
    }

    // Create a unique filename
    const buffer = await file.arrayBuffer();
    const filename = `${randomUUID()}-${file.name.replace(/\s/g, "_")}`;
    
    // Save to public/uploads directory
    const uploadDir = join(process.cwd(), "public/uploads");
    await writeFile(join(uploadDir, filename), Buffer.from(buffer));
    
    // Return the path that can be used in the <Image> component
    const imagePath = `/uploads/${filename}`;
    
    return NextResponse.json({ url: imagePath });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
} 