import { NextRequest, NextResponse } from "next/server";
import { callGeminiAI } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const prompt = `
You are an expert portfolio writer. Based on the info below, generate:
1. A short personal bio
2. Professionally written descriptions for each project
3. Format it clearly for a developer portfolio

Name: ${body.name}
Role: ${body.role}
Skills: ${body.skills}
Projects: ${body.projects}
`;

  try {
    const result = await callGeminiAI("explain", prompt);
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
