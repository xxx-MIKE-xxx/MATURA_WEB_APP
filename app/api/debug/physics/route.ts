// app/api/debug/physics/route.ts
import { NextResponse } from "next/server";
import { getPhysicsSubject, getPublishedPhysicsTasks } from "@/lib/data/queries/physics-queries";

export async function GET() {
  try {
    const subject = await getPhysicsSubject();
    const tasks = await getPublishedPhysicsTasks();

    return NextResponse.json({
      ok: true,
      subject,
      taskCount: tasks.length,
      firstTaskId: tasks[0]?.task.id ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}