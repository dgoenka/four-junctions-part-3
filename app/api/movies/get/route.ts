import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig";
import Movie from "@/models/movieModel";
import isEmpty from "lodash.isempty";

connect();

// Calls the connect function to establish a connection to the database.

export async function GET(request: NextRequest) {
  try {
    const ids = (request.nextUrl.searchParams.get("ids") || "").split(",");
    console.log("ids is " + ids);
    console.log("ids is a" + typeof ids);

    const movies = await Movie.find({ _id: { $in: ids } }).exec();

    if (!isEmpty(movies)) return NextResponse.json({ movies }, { status: 200 });
    else NextResponse.json({ error: "Not Found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
