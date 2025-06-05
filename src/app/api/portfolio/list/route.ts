import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/mongodb";
import { Portfolio } from "@/models/Portfolio";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = (await clientPromise).db();

  const portfolios = await Portfolio.find({ userEmail: session.user.email })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(portfolios);
}
