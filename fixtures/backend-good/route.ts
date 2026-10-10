// 冒烟测试：干净对照 fixture（无硬伤）
import { NextResponse } from "next/server";
import { z } from "zod";

const CreateOrderSchema = z.object({
  items: z.array(z.object({ sku_id: z.string(), qty: z.number().int().positive() })).min(1),
});

const db = getDb(); // 单例客户端（连接池）

function err(code: string, message: string, status: number, details?: object) {
  return NextResponse.json({ code, message, ...(details ? { details } : {}) }, { status });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") || 20), 200);
    const cursor = searchParams.get("cursor") || undefined;
    const orders = await db.order.findMany({
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { created_at: "desc" },
      select: { id: true, status: true, total: true, created_at: true },
    });
    const next = orders.length === limit ? orders[orders.length - 1].id : null;
    return NextResponse.json({
      data: orders,
      page_info: { next_cursor: next, has_more: next !== null },
    });
  } catch (e) {
    return err("ORDER_LIST_FAILED", "订单列表查询失败", 500);
  }
}

export async function POST(req: Request) {
  try {
    const idempotencyKey = req.headers.get("Idempotency-Key");
    const parsed = CreateOrderSchema.safeParse(await req.json());
    if (!parsed.success) {
      return err("ORDER_INVALID_INPUT", "订单参数不合法", 400, { issues: parsed.error.issues });
    }
    if (!idempotencyKey) {
      return err("ORDER_IDEMPOTENCY_REQUIRED", "创建订单需要 Idempotency-Key", 400);
    }
    const existing = await db.order.findFirst({ where: { idempotency_key: idempotencyKey } });
    if (existing) {
      return NextResponse.json({ id: existing.id, status: existing.status }, { status: 200 });
    }
    const order = await db.order.create({
      data: {
        idempotency_key: idempotencyKey,
        status: "created",
        items: { create: parsed.data.items },
      },
      select: { id: true, status: true },
    });
    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    return err("ORDER_CREATE_FAILED", "订单创建失败", 500);
  }
}
