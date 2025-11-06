import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";

export namespace friendshipCRUD {
	export const getAll = async (userId: string) => {
		await db
			.select({
				friendshipId: schema.friendship.id,
				state: schema.friendship.state,
				sender: {
					id: schema.user.id,
					name: schema.user.name,
					email: schema.user.email,
					image: schema.user.image,
				},
				receiver: {
					id: schema.user.id,
					name: schema.user.name,
					email: schema.user.email,
					image: schema.user.image,
				},
			})
			.from(schema.friendship)
			.leftJoin(
				schema.user,
				or(
					eq(schema.user.id, schema.friendship.sender),
					eq(schema.user.id, schema.friendship.receiver),
				),
			)
			.where(
				or(
					eq(schema.friendship.sender, userId),
					eq(schema.friendship.receiver, userId),
				),
			);
	};

	export const send = async (sender: string, receiver: string) => {
		await db.insert(schema.friendship).values({
			sender,
			receiver,
		});
	};

	export const accept = async (friendshipId: string, state: number) => {
		if (state !== -1) {
			await db
				.update(schema.friendship)
				.set({ state })
				.where(eq(schema.friendship.id, friendshipId));
		} else {
			await db
				.delete(schema.friendship)
				.where(eq(schema.friendship.id, friendshipId));
		}
	};
}
