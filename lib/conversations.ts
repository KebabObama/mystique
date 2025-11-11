"use server";

import { arrayContains } from "drizzle-orm";
import { db } from "@/db";
import { message } from "@/db/schema";
import type { Message } from "@/sockets/messages";

export const getUserMessages = async (userId: string): Promise<Message[]> => {
	return await db
		.select()
		.from(message)
		.where(arrayContains(message.users, [userId]));
};

export const uploadNewMessage = async (msg: Message) => {
	await db.insert(message).values({ users: [...msg.users], data: msg.data });
};
