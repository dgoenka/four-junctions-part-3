import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig";
import Movie from "@/models/movieModel";
import isEmpty from "lodash.isempty";

connect();

// Calls the connect function to establish a connection to the database.

export async function POST(request: NextRequest) {
  try {
    const movieDto = await request.json();

    const newMovie = new Movie({
      ...movieDto,
    });

    // Saves the new user to the database.
    const movie = await newMovie.save();
    if (!isEmpty(movie)) return NextResponse.json({ movie }, { status: 200 });
    else return NextResponse.json({ error: "Error Occurred" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
