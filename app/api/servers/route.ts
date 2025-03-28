import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
  } catch (error) {
    console.error("[SERVERS_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
