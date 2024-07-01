import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig";
import Producer from "@/models/producerModel";

connect();

// Calls the connect function to establish a connection to the database.

export async function POST(request: NextRequest) {
  try {
    const producerDto = await request.json();

    const newProducer = new Producer({
      ...producerDto,
    });

    // Saves the new user to the database.
    const producer = await newProducer.save();
    if (producer) return NextResponse.json({ producer }, { status: 200 });
    else return NextResponse.json({ error: "Not Found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
