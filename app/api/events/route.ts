import { NextResponse } from "next/server";
import {
  maxNumberOfChildren,
  minNumberOfChildren,
} from "@/app/shared/constants";
import { testData } from "@/app/shared/test_data";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // posting id data
    const { id, numOfChildren, acknowledgement } = await request.json();
    let errors = [];
    if (!checkIdValidity(id)) {
      errors.push("Id does not match");
    }
    if (
      numOfChildren < minNumberOfChildren ||
      numOfChildren > maxNumberOfChildren
    ) {
      errors.push(
        `Number of Children must be within range of ${minNumberOfChildren}-${maxNumberOfChildren}`,
      );
    }
    if (!acknowledgement) {
      errors.push("Must accept the acknowledgement to procede");
    }
    if (errors.length === 0) {
      // if using a database, you would probably store it here.
      // currently its handled in the frontend using cookies.
      return NextResponse.json({}, { status: 200 });
    } else {
      console.log(errors);
      return NextResponse.json({ errors }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({
      message: "Internal Server Error while processing request",
      error: err,
    }, { status: 500 });
  }
}

function checkIdValidity(eventId: string) {
  // hard coded for demonstration, but should query a database
  const results = testData.find(({id}) => {return id === eventId})
  return results !== undefined;
}
