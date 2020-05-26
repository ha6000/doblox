<a name="Client"></a>

## Client
**Kind**: global class  

* [Client](#Client)
    * [new Client(noblox, client)](#new_Client_new)
    * [.getRobloxUser(user)](#Client+getRobloxUser)
    * [.getRoleInGroup(player, group)](#Client+getRoleInGroup) ⇒ <code>Promise.&lt;string&gt;</code>

<a name="new_Client_new"></a>

### new Client(noblox, client)

| Param | Type | Description |
| --- | --- | --- |
| noblox | <code>noblox</code> | Your noblox module object |
| client | <code>discord.Client</code> | A discord client |

<a name="Client+getRobloxUser"></a>

### client.getRobloxUser(user)
**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>discord.UserResolvable</code> | The discord user to get robloxUser of |

<a name="Client+getRoleInGroup"></a>

### client.getRoleInGroup(player, group) ⇒ <code>Promise.&lt;string&gt;</code>
get a role of a user in a group

**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <code>Promise.&lt;string&gt;</code> - Promise resolving to role name  

| Param | Type | Description |
| --- | --- | --- |
| player | <code>UserResolvable</code> | A roblox user or discord user |
| group | <code>string</code> | The group to check in |

