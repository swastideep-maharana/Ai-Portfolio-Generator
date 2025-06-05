import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/mongodb";
import { Portfolio } from "@/models/Portfolio";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const db = (await clientPromise).db();

  const newPortfolio = new Portfolio({
    userEmail: session.user.email,
    ...body,
  });

  await newPortfolio.save();

  return NextResponse.json({ message: "Portfolio saved successfully!" });
}
