import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig";
import Actor from "@/models/actorModel";

connect();

// Calls the connect function to establish a connection to the database.

export async function POST(request: NextRequest) {
  try {
    const producerDto = await request.json();

    const updatedDoc = {
      ...producerDto,
    };
    delete updatedDoc._id;

    // Saves the new user to the database.
    const producer = await Actor.findByIdAndUpdate(
      producerDto._id,
      updatedDoc,
      {
        new: true,
      },
    ).exec();
    if (producer) return NextResponse.json({ producer }, { status: 200 });
    else return NextResponse.json({ error: "Not Found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
