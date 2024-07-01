import { NextRequest, NextResponse } from "next/server";
import Actor from "@/models/actorModel";
import { connect } from "@/dbConfig";
import { FilterQuery, PipelineStage } from "mongoose";
import isEmpty from "lodash.isempty";

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

    if (!isEmpty(search)) {
      query.actor_name = { $regex: search, $options: "i" }; // 'i' for case-insensitive search
    }

    // @ts-ignore
    const pipeline: PipelineStage[] = [
      // @ts-ignore
      ...(!isEmpty(search) ? [{ $match: query }] : []), // Apply search filter
      // @ts-ignore
      ...(!isEmpty(sortField) && !isEmpty(sortOrder)
        ? [{ $sort: { [sortField]: sortOrder } }]
        : []), // Sort based on sortField and sortOrder
    ];

    // Execute the aggregation query
    const results = await Actor.aggregate(pipeline).exec();

    // Extract total count and paginated actors
    const total = results?.[0]?.total?.[0]?.totalActors;
    const actors = results?.[0]?.data;

    if (!isEmpty(actors))
      return NextResponse.json(
        {
          total,
          skip: skip || 0,
          count: count || 100,
          data: actors,
        },
        { status: 200 },
      );
    else return NextResponse.json({ error: "No results" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
