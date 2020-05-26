import axios from "axios";
import * as discord from 'discord.js';

type noblox = object | any;

const apiRateLimit = 1000;

const apiEndpoints = {
	user: 'https://verify.eryn.io/api/user/'
}

function rateLimit(limit?: number) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, limit || apiRateLimit);
	});
}

type UserResolvable = RobloxUser | discord.UserResolvable;

class RobloxUser {
	username: string;
	id: string
	constructor(username: string, id: string) {
		this.username = username;
		this.id = id;
	}
}


/**
 * A value that resolves to a discord user or roblox user
 * @typedef {RobloxUser | discord.UserResolvable} UserResolvable
 */

/*
Base client for api actions
 */
export class Client {
	noblox: noblox;
	client: discord.Client;
	_RateLimit: Promise<any>;
	/**
	 * @param {noblox}         noblox Your noblox module object
	 * @param {discord.Client} client A discord client
	 */
	constructor(noblox: noblox, client: discord.Client) {
		this.noblox = noblox;
		this.client = client;
		this._RateLimit = Promise.resolve();
	}
	RateLimit(limit?: number) {
		return this._RateLimit = this._RateLimit
			.then(() => {
				return rateLimit(limit);
			});
	}
	/**
	 * @param {discord.UserResolvable} user The discord user to get robloxUser of
	 */
	async getRobloxUser(user: discord.UserResolvable): Promise<RobloxUser> {
		const resolvedUser = this.client.users.resolve(user);
		if (!resolvedUser) {
			return Promise.reject({
				message: 'Unkown user',
				errno: 1
			});
		};
		const userid = resolvedUser.id;
		await this.RateLimit()
		return axios.get(apiEndpoints.user + userid)
			.then((response) => {
				const data = response.data;
				if (data.status != 'ok') {
					if (data.retryAfterSeconds) {
						return this.RateLimit(data.retryAfterSeconds)
							.then(() => {
								return this.getRobloxUser(userid);
							});
					} else {
						return Promise.reject({
							message: 'Non ok status',
							errno: 0,
							response: data
						});
					}
				}

				return new RobloxUser(data.robloxUsername, data.robloxId);
			});
	}
	/**
	 * get a role of a user in a group
	 * @param  {UserResolvable}  player A roblox user or discord user
	 * @param  {string}          group  The group to check in
	 * @return {Promise<string>}        Promise resolving to role name
	 */
	async getRoleInGroup(player: UserResolvable, group: number): Promise<string> {
		if (player instanceof RobloxUser) {
			var user = player;
		} else {
			try {
				var user = await this.getRobloxUser(player);
			} catch (error) {
				console.log(error);
				return error;
			}
		}
		return this.noblox.getRankNameInGroup(group, user.id);
	}
}