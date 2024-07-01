import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig";
import { FilterQuery, PipelineStage } from "mongoose";
import Movie from "@/models/movieModel";

connect();

// Calls the connect function to establish a connection to the database.

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search") || "";
    const sortField = request.nextUrl.searchParams.get("sortField") || "";
    const sortOrder = request.nextUrl.searchParams.get("sortOrder") || "";
    const skip = Number(request.nextUrl.searchParams.get("skip") || 0);
    const count = Number(request.nextUrl.searchParams.get("count") || 100);

    const query: FilterQuery<any> = {};

    if (search) {
      query.movie_name = { $regex: search, $options: "i" }; // 'i' for case-insensitive search
    }

    // Define the aggregation pipeline
    // @ts-ignore
    const pipeline: PipelineStage[] = [
      // @ts-ignore

      ...(search ? [{ $match: query }] : []), // Apply search filter
      // @ts-ignore
      ...(sortField && sortOrder
        ? [{ $sort: { [sortField]: sortOrder } }]
        : []), // Sort based on sortField and sortOrder
      // @ts-ignore
      {
        $project: {
          _id: 1,
          movie_name: 1,
          actors_mapped: {
            $map: {
              input: "$actors",
              as: "actor",
              in: {
                $convert: {
                  input: "$$actor",
                  to: "objectId",
                },
              },
            },
          },
          producer_mapped: { $toObjectId: "$producer" },
        },
      },
      //@ts-ignore
      {
        $lookup: {
          from: "actors", // foreign collection
          localField: "actors_mapped", // field in movie referencing actors
          foreignField: "_id", // field in Actor for matching
          as: "actors", // alias for joined data
        },
      },
      // @ts-ignore
      {
        $lookup: {
          from: "producers", // foreign collection
          localField: "producer_mapped", // field in movie referencing actors
          foreignField: "_id", // field in Actor for matching
          as: "producer", // alias for joined data
        },
      },
      // @ts-ignore
      {
        $unset: "actors_mapped",
      },
      // @ts-ignore
      {
        $unset: "producer_mapped",
      },
      // @ts-ignore
      {
        $facet: {
          // Facet for total count
          total: [{ $count: "totalActors" }],
          // Facet for paginated results
          data: [{ $skip: skip || 0 }, { $limit: count || 100 }],
        },
      },
    ];

    // Execute the aggregation query
    const results = await Movie.aggregate(pipeline).exec();

    // Extract total count and paginated actors
    const total = results?.[0]?.total?.[0]?.totalActors;
    const movies = results?.[0]?.data;

    if (movies)
      return NextResponse.json(
        {
          total,
          skip: skip || 0,
          count: count || 100,
          data: movies,
        },
        { status: 200 },
      );
    else return NextResponse.json({ error: "Not Found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
