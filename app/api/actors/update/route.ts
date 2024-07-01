import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig";
import Actor from "@/models/actorModel";
import isEmpty from "lodash.isempty";

connect();

// Calls the connect function to establish a connection to the database.

export async function POST(request: NextRequest) {
  try {
    const actorDto = await request.json();

    const updatedDoc = {
      ...actorDto,
    };
    delete updatedDoc._id;

    // Saves the new user to the database.
    const actor = await Actor.findByIdAndUpdate(actorDto._id, updatedDoc, {
      new: true,
    }).exec();
    if (!isEmpty(actor)) return NextResponse.json({ actor }, { status: 200 });
    else return NextResponse.json({ error: "Not Found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
