import { NextRequest, NextResponse } from "next/server";
import Producer from "@/models/producerModel";
import { connect } from "@/dbConfig";

connect();

// Calls the connect function to establish a connection to the database.

export async function GET(request: NextRequest) {
  try {
    const ids = (request.nextUrl.searchParams.get("ids") || "").split(",");
    console.log("ids is " + ids);
    console.log("ids is a" + typeof ids);

    const producers = await Producer.find({ _id: { $in: ids } }).exec();

    if (producers) return NextResponse.json({ producers }, { status: 200 });
    else NextResponse.json({ error: "Not Found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
