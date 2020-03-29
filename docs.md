## Classes

<dl>
<dt><a href="#Doblox">Doblox</a></dt>
<dd><p>Main class for doblox, allowes you interact with most roblox things.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Noblox">Noblox</a> : <code>Object</code></dt>
<dd><p>Object containing your noblox module</p>
</dd>
<dt><a href="#player">player</a> : <code>Discord.UserResolvable</code> | <code><a href="#robloxPlayer">robloxPlayer</a></code></dt>
<dd><p>A Discord UserResolvable or roblox id</p>
</dd>
<dt><a href="#robloxPlayer">robloxPlayer</a> : <code>Object</code></dt>
<dd><p>A player information Object</p>
</dd>
</dl>

<a name="Doblox"></a>

## Doblox
Main class for doblox, allowes you interact with most roblox things.

**Kind**: global class  

* [Doblox](#Doblox)
    * [new Doblox(noblox, client)](#new_Doblox_new)
    * [.getRobloxPlayer(user)](#Doblox+getRobloxPlayer) ⇒ [<code>robloxPlayer</code>](#robloxPlayer)
    * [.getRankInGroup(user, groupId)](#Doblox+getRankInGroup) ⇒ <code>Promise.&lt;string&gt;</code>

<a name="new_Doblox_new"></a>

### new Doblox(noblox, client)

| Param | Type | Description |
| --- | --- | --- |
| noblox | [<code>Noblox</code>](#Noblox) | Noblox module |
| client | <code>Discord.Client</code> | Discord.js client |

<a name="Doblox+getRobloxPlayer"></a>

### doblox.getRobloxPlayer(user) ⇒ [<code>robloxPlayer</code>](#robloxPlayer)
Gets information of a roblox player

**Kind**: instance method of [<code>Doblox</code>](#Doblox)  
**Returns**: [<code>robloxPlayer</code>](#robloxPlayer) - The information  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>Discord.UserResolvable</code> | The Discord user |

<a name="Doblox+getRankInGroup"></a>

### doblox.getRankInGroup(user, groupId) ⇒ <code>Promise.&lt;string&gt;</code>
Gets the rank of a player in a group

**Kind**: instance method of [<code>Doblox</code>](#Doblox)  
**Returns**: <code>Promise.&lt;string&gt;</code> - Returns Promise with the name of the rank  

| Param | Type | Description |
| --- | --- | --- |
| user | [<code>player</code>](#player) | The player you want the information of |
| groupId | <code>string</code> | The group the rank is in |

<a name="Noblox"></a>

## Noblox : <code>Object</code>
Object containing your noblox module

**Kind**: global typedef  
<a name="player"></a>

## player : <code>Discord.UserResolvable</code> \| [<code>robloxPlayer</code>](#robloxPlayer)
A Discord UserResolvable or roblox id

**Kind**: global typedef  
<a name="robloxPlayer"></a>

## robloxPlayer : <code>Object</code>
A player information Object

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the roblox player |
| id | <code>number</code> | Id of the player |

