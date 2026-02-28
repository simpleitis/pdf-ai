// import { NextResponse } from "next/server";
// import {createClient} from "../../../lib/supabase/server";

// export const runtime = "nodejs";

// const supabase = createClient();

// export const GET = async (req) => {
//   try {
//     // Read query params from the request URL
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");

//     if (!userId) {
//       return NextResponse.json(
//         { error: "userId is required" },
//         { status: 400 }
//       );
//     }

//     const { data, error } = await supabase
//       .from("documents")
//       .select("id, filename, created_at")
//       .eq("user_id", userId)
//       .order("created_at", { ascending: false });

//     if (error) {
//       return NextResponse.json(
//         { error: "Failed to fetch documents" },
//         { status: 500 }
//       );
//     }

//     const documents = data.map((doc) => ({
//       id: doc.id,
//       fileName: doc.filename,
//       createdAt: doc.created_at,
//     }));
//     return NextResponse.json({ documents: documents });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// };


// dummy route.js
import { NextResponse } from "next/server";

export const GET = async (req) => {
    return NextResponse.json({ documents: [] });
}

