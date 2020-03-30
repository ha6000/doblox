const fetch = require('node-fetch');
const roverUserApiUrl = new URL('https://verify.eryn.io/api/user/');

/**
 * Object containing your noblox module
 * @typedef {Object} Noblox
 */

/**
 * A Discord UserResolvable or roblox id
 * @typedef {(Discord.UserResolvable|robloxPlayer)} player
 */

/**
 * A player information Object
 * @typedef {Object} robloxPlayer
 * @property {string} name The name of the roblox player
 * @property {number} id Id of the player
 */

/**
 * Main class for doblox, allowes you interact with most roblox things.
 * @class
 */
class Doblox {
	/**
	 * @param  {Noblox} noblox Noblox module
	 * @param  {Discord.Client} client Discord.js client
	 */
	constructor(noblox, client) {
		this.noblox = noblox;
		this.client = client;
	};
	/**
	 * Gets information of a roblox player
	 * @param  {Discord.UserResolvable} user The Discord user
	 * @return {robloxPlayer}      The information
	 */
	getRobloxPlayer(user) {
		return new Promise((resolve, reject) => {
			user = this.client.users.resolve(user);
			var userUrl = new URL(roverUserApiUrl);
			userUrl.pathname += user.id;
			fetch(userUrl).then(res => res.json()).then(json => {
				if (json.errorCode) return resolve(undefined);
				resolve({
					name: json.robloxUsername,
					id: json.robloxId
				});
			}).catch(error => {
				reject(error);
			});
		});
	};
	/**
	 * Gets the rank of a player in a group
	 * @param  {player} user The player you want the information of
	 * @param  {string} groupId The group the rank is in
	 * @return {Promise<string>}         Returns Promise with the name of the rank
	 */
	getRankInGroup(user, groupId) {
		return new Promise(async (resolve, reject) => {
			var player;
			if (typeof user == 'object') {
				player = user;
			} else {
				try {
					await getRobloxPlayer(user);
				} catch (error) {
					reject(error);
				};
			};
		
			this.noblox.getRankNameInGroup(groupId, player.id).then(name => {
				resolve(name);
			}).catch(reject);
		});
	};
};

module.exports = Doblox;