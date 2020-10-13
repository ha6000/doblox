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
		handleURL(user, userid, partial: boolean, options, doblox) {
			return `${this.baseURL}${userid}${options.guild && user instanceof discord.GuildMember ? `?guild=${user.guild.id}` : ''}`;
		},
		handleData: async function(data, partial: boolean, user, options) {
			const id = options.guild ? data.matchingAccount || data.primaryAccount : data.primaryAccount;

			if (partial) {
				return {
					id
				};
			}
			else {
				return this.axios.get(`https://users.roblox.com/v1/users/${id}`)
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
		},
		handleError(response) {
			if (response.data && response.data.status == 'error') {
				if (response.data.error == 'This user is not linked with Bloxlink.') return undefined;
				else throw new Error(response.data.error);
			}

			throw response;
		}
	}
};

const pify = require('pify');

const Limiter = require('limiter').RateLimiter;
Limiter.prototype.asyncRemoveTokens = pify(Limiter.prototype.removeTokens);

type UserResolvable = RobloxUser | discord.UserResolvable;

/*
 * A reprensantation of a roblox user, when partial, id is the only value guaranteed.
 * @class RobloxUser
 */
class RobloxUser {
	username: string;
	id: string
	description: string;
	createdAt: Date
	partial: Boolean
	/**
	 * @param {Object}  data    RobloxUser data
	 * @param {Boolean} partial Whether its a partial
	 */
	constructor(data, partial: Boolean) {
		/**
		 * Username of the user
		 * @type {String}
		 */
		this.username = data.username;
		/**
		 * ID of the user
		 * @type {Number}
		 */
		this.id = data.id;
		/**
		 * Description of the user
		 * @type {String}
		 */
		this.description = data.description;
		/**
		 * Date at which the user was created at
		 * @type {Date}
		 */
		this.createdAt = data.createdAt;
		/**
		 * Whether the data is partial
		 * @type {Boolean}
		 */
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

/**
 * Options for the client
 * @typedef {Object} ClientOptions
 * @property {String} provider
 */

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
	 * @param {ClientOptions} options Options for the client
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
	 * @param {Boolean} partial Wether to return a partial
	 * @param {Object} options Options to pass to the provider
	 */
	async getRobloxUser(user: discord.UserResolvable, partial: Boolean = false, options): Promise<RobloxUser | undefined> {
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

		return (typeof this.provider.handleURL == 'function' ? this.axios.get(this.provider.handleURL(user, userid, partial, options, this)) : this.providerAxios.get(userid))
			.then(async response => {
				const data = response.data;
				if (data && data.status != 'ok') {
					throw response;
				}
				const userData = await this.provider.handleData.call(this, data, partial, user, options);

				return new RobloxUser(userData, partial);
			})
			.catch(async (err) => {
				return this.provider.handleError.call(this, err.response || err);
			});
	}
}
