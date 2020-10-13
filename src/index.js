"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const axios = require("axios");
const Axios = axios.default;
const defaultClientOptions = {
    provider: 'bloxlink'
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
        handleData: async function (data, partial) {
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
/*
 * A reprensantation of a roblox user, when partial, id is the only value guaranteed.
 * @class RobloxUser
 */
class RobloxUser {
    /**
     * @param {Object}  data    RobloxUser data
     * @param {Boolean} partial Whether its a partial
     */
    constructor(data, partial) {
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
}
class InvallidPlayer extends TypeError {
    constructor() {
        super('Invallid player');
        this.errno = 0;
    }
}
/**
 * Options for the client
 * @typedef {Object} ClientOptions
 * @property {String} provider
 */
/*
Base client for api actions
 */
class Client {
    /**
     * @param {noblox}         noblox Your noblox module object, not required but kept for backwards compatibility.
     * @param {discord.Client} client A discord client
     * @param {ClientOptions} options Options for the client
     */
    constructor(noblox, client, options) {
        this.noblox = noblox;
        this.client = client;
        this.options = Object.assign({}, defaultClientOptions, options);
        this.provider = providers[this.options.provider];
        if (!this.provider)
            throw new ReferenceError('No such provider');
        this.providerAxios = Axios.create({
            baseURL: this.provider.baseURL
        });
        this.axios = Axios.create({});
        this._RateLimit = new Limiter();
    }
    /**
     * @param {discord.UserResolvable} user The discord user to get robloxUser of
     */
    async getRobloxUser(user, partial = false) {
        let userid;
        let resolvedUser = this.client.users.resolve(user);
        if (!resolvedUser) {
            if (typeof user == 'string') {
                userid = user;
            }
            else {
                throw new UnkownUser();
            }
        }
        else {
            userid = resolvedUser.id;
        }
        ;
        await this._RateLimit.asyncRemoveTokens(1);
        return this.providerAxios.get(userid)
            .then(async (response) => {
            const data = response.data;
            if (data && data.status != 'ok') {
                throw response;
            }
            const userData = await this.provider.handleData.call(this, data, partial);
            return new RobloxUser(userData, partial);
        })
            .catch(async (err) => {
            if (err.response && err.response.status == 404)
                return undefined;
            if (err.data) {
                throw new Error(err.data.error);
            }
            throw err;
        });
    }
}
exports.Client = Client;
