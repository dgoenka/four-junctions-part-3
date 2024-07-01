import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig";
import Movie from "@/models/movieModel";

connect();

// Calls the connect function to establish a connection to the database.

export async function POST(request: NextRequest) {
  try {
    const movieDto = await request.json();

    const updatedDoc = {
      ...movieDto,
    };
    delete updatedDoc._id;

    // Saves the new user to the database.
    const movie = await Movie.findByIdAndUpdate(movieDto._id, updatedDoc, {
      new: true,
    }).exec();
    if (movie) return NextResponse.json({ movie }, { status: 200 });
    else return NextResponse.json({ error: "Not Found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
