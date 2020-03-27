import Discord from "discord.js";
import Noblox from "noblox.js";

interface robloxPlayer {
    name: string,
    id: number
};

type rankName = string;
type groupId = number;

declare class Doblox {
    constructor(noblox: Object, client: Discord.Client);
    getRobloxPlayer(user: Discord.UserResolvable): Promise<robloxPlayer>
    getRankInGroup(user: Discord.UserResolvable, groupId: groupId): Promise<rankName>
};

export default Doblox;