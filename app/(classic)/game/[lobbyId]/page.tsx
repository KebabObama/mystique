import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { schema } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async ({ params }: { params: Promise<{ lobbyId: string }> }) => {
  const { lobbyId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return null;

  const data = await db.query.lobby.findFirst({
    where: eq(schema.lobby.id, lobbyId),
    with: { members: true, characters: true },
  });

  const isMember = data?.members.some((e) => e.userId === session.user.id);
  if (!data || !isMember) redirect("/dashboard");

  return <Card className="size-full p-0"></Card>;
};

