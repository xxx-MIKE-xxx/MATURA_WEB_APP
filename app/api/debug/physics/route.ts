// app/api/debug/physics/route.ts
import { NextResponse } from "next/server";
import { getPhysicsSubject, getPublishedPhysicsTasks } from "@/lib/data/queries/physics-queries";

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  if (typeof error === "object" && error !== null) {
    return {
      ...error,
      raw: JSON.stringify(error, null, 2),
    };
  }

  return {
    message: String(error),
  };
}

export async function GET() {
  try {
    const subject = await getPhysicsSubject();
    const tasks = await getPublishedPhysicsTasks();

    return NextResponse.json({
      ok: true,
      subject,
      taskCount: tasks.length,
      firstTaskId: tasks[0]?.task?.id ?? tasks[0]?.id ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: serializeError(error),
      },
      { status: 500 }
    );
  }
}