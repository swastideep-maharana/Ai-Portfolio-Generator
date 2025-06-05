import { NextRequest, NextResponse } from "next/server";
import { callGeminiAI } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate inputs (basic)
    if (
      !body.name?.trim() ||
      !body.role?.trim() ||
      !body.skills?.trim() ||
      !body.projects?.trim()
    ) {
      return NextResponse.json(
        { error: "All fields (name, role, skills, projects) are required." },
        { status: 400 }
      );
    }

    // Sanitize inputs (trim whitespace)
    const name = body.name.trim();
    const role = body.role.trim();
    const skills = body.skills.trim();
    const projects = body.projects.trim();

    const prompt = `
You are an expert portfolio writer. Based on the info below, generate:
1. A short personal bio
2. Professionally written descriptions for each project
3. Format it clearly for a developer portfolio

Name: ${name}
Role: ${role}
Skills: ${skills}
Projects: ${projects}
    `;

    // Call Gemini AI (assuming callGeminiAI returns a string)
    const result = await callGeminiAI("explain", prompt);

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Error in /api/generate:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
