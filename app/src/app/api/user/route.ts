import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const res = await axios.post("http://localhost:4000/login", {
      email,
      password,
    });

    if (res.status === 200) {
      // headers().set("");

      return NextResponse.json({ data: res.data }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: res.data.message },
        { status: res.status }
      );
    }
  } catch (error: unknown) {
    console.error("Error logging in: ", error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data.message || "Error from backend" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
