import { NextResponse } from "next/server";
import { testData } from "@/app/shared/test_data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // grabbing event data by id
    const { id } = await params;
    const result = getEventById(id);
    if (result) {
      return NextResponse.json({ result }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Event Not Found" }, { status: 404 })
    }
  } catch (err) {
    return NextResponse
      .json({
        message: "Internal Server Error while processing request",
        error: err,
      }, { status: 500 });
  }
}

function getEventById(eventId: string) {
  // In production this should call to a database
  let event = testData.find(({id}) => {return id === eventId});
  return event?.data;
}
