import discord from 'discord.js';
import noblox from 'noblox.js';

type noblox = object | any;

type UserResolvable = RobloxUser | discord.UserResolvable;

class RobloxUser {
	username: string;
	id: string
	constructor(username: string, id: string) {
		this.username = username;
		this.id = id;
	}
}

class Client {
	noblox: noblox;
	client: discord.Client;
	_RateLimit: Promise<any>;
	constructor(noblox: noblox, client: discord.Client);
	RateLimit(limit?: number): Promise<any>;
	async getRobloxUser(user: discord.UserResolvable): Promise<RobloxUser>;
	async getRoleInGroup(player: UserResolvable, group: number): Promise<string>;
}