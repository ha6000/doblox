import * as axios from  "axios";
import * as discord from 'discord.js';

const Axios = axios.default;

type noblox = object | any;

type ClientOptions = {
	provider: string
};

const defaultClientOptions = {
	provider: 'bloxlink'
};

type Provider = {
	baseURL: string,
	requests: number,
	per: number,
	handleData: Function
};

const providers = {
	rover: {
		baseURL: 'https://verify.eryn.io/api/user/',
		requests: 60,
		per: 60 * 1000
	},
	bloxlink: {
		baseURL: 'https://api.blox.link/v1/user/',
		requests: 60,
		per: 60 * 1000,
		handleData: async function(data, partial: boolean) {
			if (partial) {
				return {
					id: data.primaryAccount
				};
			}
			else {
				return this.axios.get(`https://users.roblox.com/v1/users/${data.primaryAccount}`)
					.then(res => {
						const data = res.data;

						return {
							username: data.name,
							id: data.id,
							description: data.description,
							createdAt: new Date(data.created)
						};
					});
			}
		}
	}
};

const pify = require('pify');

const Limiter = require('limiter').RateLimiter;
Limiter.prototype.asyncRemoveTokens = pify(Limiter.prototype.removeTokens);

type UserResolvable = RobloxUser | discord.UserResolvable;

/*
A reprensantation of a roblox user, when partial, id is the only value guaranteed.
 */
class RobloxUser {
	/**
	 * Username of the user
	 * @type {string}
	 */
	username: string;
	/**
	 * ID of the user
	 * @type {string}
	 */
	id: string
	/**
	 * Description of the user
	 * @type {string}
	 */
	description: string;
	/**
	 * Date at which the user is created
	 * @type {Date}
	 */
	createdAt: Date
	/**
	 * Whether it is partial data, id is only garunteed property.
	 * @type {Boolean}
	 */
	partial: Boolean
	/**
	 * @param {object} data RobloxUser data
	 * @param {boolean} partial Whether it's a partial
	 */
	constructor(data, partial: Boolean) {
		this.username = data.username;
		this.id = data.id;
		this.description = data.description;
		this.createdAt = data.createdAt;
		this.partial = partial;
	}
}


/**
 * A value that resolves to a discord user or roblox user
 * @typedef {RobloxUser | discord.UserResolvable} UserResolvable
 */

class UnkownUser extends ReferenceError {
	constructor() {
		super('Unkown user');
		this.errno = 1;
	}
	errno: number
}

class InvallidPlayer extends TypeError {
	constructor() {
		super('Invallid player');
		this.errno = 0;
	}
	errno: number
}

/*
Base client for api actions
 */
export class Client {
	noblox: noblox;
	client: discord.Client;
	options: ClientOptions;
	provider
	_RateLimit: typeof Limiter;
	providerAxios: axios.AxiosInstance
	axios: axios.AxiosInstance;
	/**
	 * @param {noblox}         noblox Your noblox module object, not required but kept for backwards compatibility.
	 * @param {discord.Client} client A discord client
	 */
	constructor(noblox: noblox | undefined, client: discord.Client, options: ClientOptions) {
		this.noblox = noblox;
		this.client = client;
		this.options = Object.assign({}, defaultClientOptions, options);
		this.provider = providers[this.options.provider];

		if (!this.provider) throw new ReferenceError('No such provider');

		this.providerAxios = Axios.create({
			baseURL: this.provider.baseURL
		});

		this.axios = Axios.create({});

		this._RateLimit = new Limiter();
	}
	/**
	 * @param {discord.UserResolvable} user The discord user to get robloxUser of
	 */
	async getRobloxUser(user: discord.UserResolvable, partial: Boolean = false): Promise<RobloxUser | undefined> {
		let userid;
		let resolvedUser = this.client.users.resolve(user);

		if (!resolvedUser) {
			if (typeof user == 'string') {
				userid = user;
			} else {
				throw new UnkownUser();
			}
		}
		else {
			userid = resolvedUser.id;
		};

		await this._RateLimit.asyncRemoveTokens(1);

		return this.providerAxios.get(userid)
			.then(async response => {
				const data = response.data;
				if (data && data.status != 'ok') {
					throw response;
				}
				const userData = await this.provider.handleData.call(this, data, partial);

				return new RobloxUser(userData, partial);
			})
			.catch(async err => {
				if(err.response && err.response.status == 404) return undefined;

				if (err.data) {
					throw new Error(err.data.error);
				}

				throw err;
			});
	}
}
