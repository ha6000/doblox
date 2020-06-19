"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const axios_1 = require("axios");
const apiRateLimit = 1000;
const apiEndpoints = {
    rover: 'https://verify.eryn.io/api/user/',
    bloxlink: 'https://api.blox.link/v1/user/'
};
const pify = require('pify');
const Limiter = require('limiter').RateLimiter;
Limiter.prototype.asyncRemoveTokens = pify(Limiter.removeTokens);
/*
A reprensantation of a roblox user
 */
class RobloxUser {
    /**
     * @param {string} username roblox username
     * @param {string} id
     */
    constructor(username, id) {
        this.username = username;
        this.id = id;
    }
}
/**
 * A value that resolves to a discord user or roblox user
 * @typedef {RobloxUser | discord.UserResolvable} UserResolvable
 */
class NonOKStatus extends TypeError {
    constructor(response) {
        super('Non ok status');
        this.response = response;
        this.errno = 0;
    }
}
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
/*
Base client for api actions
 */
class Client {
    /**
     * @param {noblox}         noblox Your noblox module object
     * @param {discord.Client} client A discord client
     */
    constructor(noblox, client) {
        this.noblox = noblox;
        this.client = client;
        this._RateLimit = new Limiter();
    }
    /**
     * @param {discord.UserResolvable} user The discord user to get robloxUser of
     */
    async getRobloxUser(user) {
        const resolvedUser = this.client.users.resolve(user);
        if (!resolvedUser) {
            throw new UnkownUser();
        }
        ;
        const userid = resolvedUser.id;
        await this._RateLimit.asyncRemoveTokens(1);
        return axios_1.default.get(apiEndpoints.rover + userid)
            .then((response) => {
            const data = response.data;
            if (data.status != 'ok') {
                throw new NonOKStatus(response);
            }
            return new RobloxUser(data.robloxUsername, data.robloxId);
        })
            .catch(error => {
            if (error.response.status == 404)
                return undefined;
            throw error;
        });
    }
    /**
     * get a role of a user in a group
     * @param  {UserResolvable}  player A roblox user or discord user
     * @param  {string}          group  The group to check in
     * @return {Promise<string>}        Promise resolving to role name
     */
    async getRoleInGroup(player, group) {
        if (player instanceof RobloxUser) {
            var user = player;
        }
        else {
            try {
                var user = await this.getRobloxUser(player);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        }
        if (!user)
            throw new InvallidPlayer();
        return this.noblox.getRankNameInGroup(group, user.id);
    }
}
exports.Client = Client;
