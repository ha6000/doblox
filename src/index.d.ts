import * as axios from "axios";
import * as discord from 'discord.js';
declare type noblox = object | any;
/**
 * @typedef {Object} ClientOptions
 * @property {String} provider
 */
declare type ClientOptions = {
    provider: string;
};
declare const Limiter: any;
declare class RobloxUser {
    username: string;
    id: string;
    description: string;
    createdAt: Date;
    partial: Boolean;
    /**
     * @param {Object}  data    RobloxUser data
     * @param {Boolean} partial Whether its a partial
     */
    constructor(data: any, partial: Boolean);
}
export declare class Client {
    noblox: noblox;
    client: discord.Client;
    options: ClientOptions;
    provider: any;
    _RateLimit: typeof Limiter;
    providerAxios: axios.AxiosInstance;
    axios: axios.AxiosInstance;
    /**
     * @param {noblox}         noblox Your noblox module object, not required but kept for backwards compatibility.
     * @param {discord.Client} client A discord client
     * @param {ClientOptions} options Options for the client
     */
    constructor(noblox: noblox | undefined, client: discord.Client, options: ClientOptions);
    /**
     * @param {discord.UserResolvable} user The discord user to get robloxUser of
     */
    getRobloxUser(user: discord.UserResolvable, partial?: Boolean): Promise<RobloxUser | undefined>;
}
export {};
