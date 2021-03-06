import * as axios from "axios";
import * as discord from 'discord.js';
declare type noblox = object | any;
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
/**
 * Options for the client
 * @typedef {Object} ClientOptions
 * @property {String} provider
 */
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
     * @param {Boolean} partial Wether to return a partial
     * @param {Object} options Options to pass to the provider
     */
    getRobloxUser(user: discord.UserResolvable, partial: Boolean, options: any): Promise<RobloxUser | undefined>;
}
export {};
