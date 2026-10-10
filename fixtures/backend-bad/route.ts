// 冒烟测试：故意埋了 18+ 处硬伤的坏 fixture（请勿作为示例代码）
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const SECRET = "my-secret-key-12345";
const password = "s3cr3t-p@ss";
const API_URL = "http://localhost:3000/api";

export async function GET(req: Request) {
  const b = await req.json().catch(() => null);
  const orders = await db.order.findMany();
  console.log("orders", orders);
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const body = await req.json();
  const userId = body.userId;

  const q = "SELECT * FROM users WHERE id = " + userId;
  const rows = await db.$queryRawUnsafe(q);

  if (password === body.password) {
    console.log("password ok", password);
  }

  const ids: string[] = body.ids || [];
  for (let i = 0; i < ids.length; i++) {
    const u = await db.user.findUnique({ where: { id: ids[i] } });
    console.log("u", u);
  }

  try {
    const order = await db.order.create({ data: { userId } });
    return NextResponse.json({ error: "创建失败" }, { status: 200 });
  } catch {
  }

  return NextResponse.json({ password_hash: "abc", order: null });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  await db.user.deleteMany();
  debugger;
  return NextResponse.json({ ok: true }, { headers: { "Access-Control-Allow-Origin": "*" } });
}

export function broken(err: Error) {
  return NextResponse.json(err);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const token = jwt.sign({ sub: body.userId }, SECRET);
  const a = await db.audit.create({ data: { action: "put" } });
  const b = await db.audit.create({ data: { action: "put2" } });
  return NextResponse.json({ token });
}
