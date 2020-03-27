const fetch = require('node-fetch');
const roverUserApiUrl = new URL('https://verify.eryn.io/api/user/');

class Doblox {
	constructor(noblox, client) {
		this.noblox = noblox;
		this.client = client;
	};
	getRobloxPlayer(user) {
		return new Promise((resolve, reject) => {
			user = this.client.users.resolve(user);
			var userUrl = new URL(roverUserApiUrl);
			userUrl.pathname += user.id;
			fetch(userUrl).then(res => res.json()).then(json => {
				resolve({
					name: json.robloxUsername,
					id: json.robloxId
				});
			}).catch(error => {
				reject(error);
			});
		});
	};
	getRankInGroup(user, groupId) {
		return new Promise((resolve, reject) => {
			getRobloxPlayer(user).then(player => {
				this.noblox.getRankNameInGroup(groupId, player.id).then(name => {
					resolve(name);
				}).catch(reject);
			}).catch(reject);
		});
	};
};