import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig";
import Actor from "@/models/actorModel";
import isEmpty from "lodash.isempty";

connect();

// Calls the connect function to establish a connection to the database.

export async function POST(request: NextRequest) {
  try {
    const actorDto = await request.json();

    const newUser = new Actor({
      ...actorDto,
    });

    // Saves the new user to the database.
    const actor = await newUser.save();
    if (!isEmpty(actor)) return NextResponse.json({ actor }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
