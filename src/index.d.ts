import * as discord from 'discord.js';
declare type noblox = object | any;
declare type UserResolvable = RobloxUser | discord.UserResolvable;
declare class RobloxUser {
    username: string;
    id: string;
    /**
     * @param {string} username roblox username
     * @param {string} id
     */
    constructor(username: string, id: string);
}
/**
 * A value that resolves to a discord user or roblox user
 * @typedef {RobloxUser | discord.UserResolvable} UserResolvable
 */
export declare class Client {
    noblox: noblox;
    client: discord.Client;
    _RateLimit: Promise<any>;
    /**
     * @param {noblox}         noblox Your noblox module object
     * @param {discord.Client} client A discord client
     */
    constructor(noblox: noblox, client: discord.Client);
    RateLimit(limit?: number): Promise<any>;
    /**
     * @param {discord.UserResolvable} user The discord user to get robloxUser of
     */
    getRobloxUser(user: discord.UserResolvable): Promise<RobloxUser | undefined>;
    /**
     * get a role of a user in a group
     * @param  {UserResolvable}  player A roblox user or discord user
     * @param  {string}          group  The group to check in
     * @return {Promise<string>}        Promise resolving to role name
     */
    getRoleInGroup(player: UserResolvable, group: number): Promise<string>;
}
export {};
