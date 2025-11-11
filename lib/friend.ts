"use server";

import { and, eq, ilike, ne, or } from "drizzle-orm";
import { validate as isUuid } from "uuid";
import { db } from "@/db";
import { friend, user } from "@/db/schema";
import { cache } from "@/lib/cache";

const getCacheKey = (prefix: string, userId: string) =>
	`friend-${prefix}:${userId}`;

export const searchUsers = async (query: string, currentUserId: string) => {
	const cacheKey = getCacheKey("search", `${currentUserId}:${query}`);
	try {
		const cached = await cache.get(cacheKey);
		if (cached) return JSON.parse(cached);
	} catch (error) {
		console.error("cache get error:", error);
	}
	const conditions = [
		ilike(user.name, `%${query}%`),
		ilike(user.email, `%${query}%`),
	];
	if (isUuid(query)) conditions.push(eq(user.id, query));
	const results = await db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			image: user.image,
		})
		.from(user)
		.where(and(or(...conditions), ne(user.id, currentUserId)))
		.limit(10);
	const filteredResults = results.filter((u) => u.id !== currentUserId);
	try {
		await cache.set(cacheKey, JSON.stringify(filteredResults), {
			EX: Number(process.env.CACHE_TTL),
		});
	} catch (error) {
		console.error("cache set error:", error);
	}
	return filteredResults;
};

export const sendRequest = async (
	sender: string,
	receiver: string,
): Promise<void> => {
	await db.insert(friend).values({ sender, receiver, status: false });
	try {
		await Promise.all([
			cache.del(getCacheKey("friends", sender)),
			cache.del(getCacheKey("friends", receiver)),
			cache.del(getCacheKey("requests_for_me", receiver)),
			cache.del(getCacheKey("requests_from_me", sender)),
		]);
	} catch (error) {
		console.error("cache cache invalidation error:", error);
	}
};

export const acceptRequest = async (
	sender: string,
	receiver: string,
): Promise<void> => {
	await db
		.update(friend)
		.set({ status: true })
		.where(
			or(
				and(eq(friend.sender, sender), eq(friend.receiver, receiver)),
				and(eq(friend.sender, receiver), eq(friend.receiver, sender)),
			),
		);
	try {
		await Promise.all([
			cache.del(getCacheKey("friends", sender)),
			cache.del(getCacheKey("friends", receiver)),
			cache.del(getCacheKey("requests_for_me", receiver)),
			cache.del(getCacheKey("requests_from_me", sender)),
		]);
	} catch (error) {
		console.error("cache cache invalidation error:", error);
	}
};

export const denyRequest = async (
	sender: string,
	receiver: string,
): Promise<void> => {
	await db
		.delete(friend)
		.where(
			or(
				and(eq(friend.sender, sender), eq(friend.receiver, receiver)),
				and(eq(friend.sender, receiver), eq(friend.receiver, sender)),
			),
		);
	try {
		await Promise.all([
			cache.del(getCacheKey("friends", sender)),
			cache.del(getCacheKey("friends", receiver)),
			cache.del(getCacheKey("requests_for_me", receiver)),
			cache.del(getCacheKey("requests_from_me", sender)),
		]);
	} catch (error) {
		console.error("cache cache invalidation error:", error);
	}
};

export const getFromMeRequests = async (userId: string) => {
	const cacheKey = getCacheKey("requests_from_me", userId);

	try {
		const cached = await cache.get(cacheKey);
		if (cached) return JSON.parse(cached);
	} catch (error) {
		console.error("cache get error:", error);
	}

	const results = await db
		.select({
			friendshipId: friend.id,
			id: user.id,
			email: user.email,
			name: user.name,
			image: user.image,
			sender: friend.sender,
			receiver: friend.receiver,
		})
		.from(friend)
		.innerJoin(user, eq(friend.receiver, user.id))
		.where(and(eq(friend.status, false), eq(friend.sender, userId)));

	try {
		await cache.set(cacheKey, JSON.stringify(results), {
			EX: Number(process.env.CACHE_TTL),
		});
	} catch (error) {
		console.error("Redis set error:", error);
	}

	return results;
};

export const getForMeRequests = async (userId: string) => {
	const cacheKey = getCacheKey("requests_for_me", userId);

	try {
		const cached = await cache.get(cacheKey);
		if (cached) {
			return JSON.parse(cached);
		}
	} catch (error) {
		console.error("cache get error:", error);
	}

	const results = await db
		.select({
			friendshipId: friend.id,
			id: user.id,
			email: user.email,
			name: user.name,
			image: user.image,
			sender: friend.sender,
			receiver: friend.receiver,
		})
		.from(friend)
		.innerJoin(user, eq(friend.sender, user.id))
		.where(and(eq(friend.status, false), eq(friend.receiver, userId)));

	try {
		await cache.set(cacheKey, JSON.stringify(results), {
			EX: Number(process.env.CACHE_TTL),
		});
	} catch (error) {
		console.error("cache set error:", error);
	}
	return results;
};

export const getFriends = async (userId: string) => {
	const cacheKey = getCacheKey("friends", userId);

	try {
		const cached = await cache.get(cacheKey);
		if (cached) return JSON.parse(cached);
	} catch (error) {
		console.error("cache get error:", error);
	}

	const results = await db
		.select({
			friendshipId: friend.id,
			id: user.id,
			email: user.email,
			name: user.name,
			image: user.image,
			sender: friend.sender,
			receiver: friend.receiver,
		})
		.from(friend)
		.innerJoin(
			user,
			or(eq(friend.sender, user.id), eq(friend.receiver, user.id)),
		)
		.where(
			and(
				eq(friend.status, true),
				or(eq(friend.sender, userId), eq(friend.receiver, userId)),
			),
		)
		.then((friends) => friends.filter((f) => f.id !== userId));

	try {
		await cache.set(cacheKey, JSON.stringify(results), {
			EX: Number(process.env.CACHE_TTL),
		});
	} catch (error) {
		console.error("cache set error:", error);
	}

	return results;
};
