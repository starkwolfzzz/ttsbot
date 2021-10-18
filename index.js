const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Tavern Bartender#8741 is online and is streaming with @Stark Wolfz#9300'));

app.listen(port /*, () => console.log(`app listening at http://localhost:${port}`)*/ );

// ================= START BOT CODE ===================

require('dotenv').config();
const config = require("./config.json");

const {
    Client,
    Intents,
    Collection,
    MessageEmbed
} = require('discord.js');

const {
    REST
} = require('@discordjs/rest');

const {
    Routes
} = require('discord-api-types/v9');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS]
});

const {
    joinVoiceChannel,
    createAudioResource,
    NoSubscriberBehavior,
    StreamType,
    AudioPlayerStatus,
    createAudioPlayer,
    getVoiceConnection
} = require('@discordjs/voice');
const request = require(`request`);

const { DiscordTogether } = require('discord-together');
client.discordTogether = new DiscordTogether(client);

const fs = require('fs');
const path = require('path');

const TOKEN = process.env['TOKEN'];

client.volume = config.volume;
client.prefix = config.prefix;
client.ttsPlayer = createAudioPlayer();

function changeConfig(data) {
    filePath = "./config.json";
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data), (err) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}

function changePrefix(prfx) {
    client.prefix = prfx;
    changeConfig("./config.json", { prefix, volume })
}

function changeVolume(vlm) {
    client.volume = vlm;
    changeConfig("./config.json", { prefix, volume })
}

const slashCommands = [];
client.slashCommands = new Collection();

const topSlashBars = 60
console.log(insertChar("_", topSlashBars))
console.log("|" + insertChar(" ", Math.round(((topSlashBars - 1) - (`Slash Commands`).length) / 2)) + "Slash Commands" + insertChar(" ", Math.floor(((topSlashBars - 1) - (`Slash Commands`).length) / 2)) + "|")
console.log("|" + insertChar("_", topSlashBars - 1) + "|")
console.log("|" + insertChar(" ", topSlashBars - 1) + "|")
const readSlashCommands = dir => {
    const slashCommandFiles = fs.readdirSync(path.join(__dirname, dir));
    for (const file of slashCommandFiles) {
        const stat = fs.lstatSync(path.join(__dirname, dir, file))
        if (stat.isDirectory()) {
            readSlashCommands(path.join(dir, file))
        } else {
            const slashCommand = require(path.join(__dirname, dir, file));
            var neededSpace1 = Math.round(((topSlashBars - 1) - ('Loaded: ' + dir.substring(dir.indexOf("\\") + 1, dir.length) + "/" + file).length) / 2);
            var neededSpace2 = Math.floor(((topSlashBars - 1) - ('Loaded: ' + dir.substring(dir.indexOf("\\") + 1, dir.length) + "/" + file).length) / 2);
            console.log("|" + insertChar(" ", neededSpace1) + '\x1b[32mLoaded:\x1b[0m \x1b[33m' + dir.substring(dir.indexOf("\\") + 1, dir.length).replace("\\", "/") + "\x1b[0m/\x1b[36m" + file + "\x1b[0m" + insertChar(" ", neededSpace2) + "|");
            if (slashCommand.Perms) slashCommand.defaultPermission = false;

            slashCommands.push(slashCommand);
            client.slashCommands.set(slashCommand.name, slashCommand);
        }
    }
}

readSlashCommands('slashCommands')
console.log("|" + insertChar(" ", topSlashBars - 1) + "|")
console.log(insertChar("‾", topSlashBars))

const commands = [];
client.commands = new Collection();

var topBars = 60;
console.log(insertChar("_", topBars))
console.log("|" + insertChar(" ", Math.round(((topBars - 1) - (`Commands`).length) / 2)) + "Commands" + insertChar(" ", Math.floor(((topBars - 1) - (`Commands`).length) / 2)) + "|")
console.log("|" + insertChar("_", topBars - 1) + "|")
console.log("|" + insertChar(" ", topBars - 1) + "|")
const readCommands = dir => {
    const commandFiles = fs.readdirSync(path.join(__dirname, dir));
    for (const file of commandFiles) {
        const stat = fs.lstatSync(path.join(__dirname, dir, file))
        if (stat.isDirectory()) {
            readCommands(path.join(dir, file))
        } else {
            const command = require(path.join(__dirname, dir, file));
            var neededSpace1 = Math.round(((topBars - 1) - ('Loaded: ' + dir.substring(dir.indexOf("\\") + 1, dir.length) + "/" + file).length) / 2);
            var neededSpace2 = Math.floor(((topBars - 1) - ('Loaded: ' + dir.substring(dir.indexOf("\\") + 1, dir.length) + "/" + file).length) / 2);
            console.log("|" + insertChar(" ", neededSpace1) + '\x1b[32mLoaded:\x1b[0m \x1b[33m' + dir.substring(dir.indexOf("\\") + 1, dir.length).replace("\\", "/") + "\x1b[0m/\x1b[36m" + file + "\x1b[0m" + insertChar(" ", neededSpace2) + "|");
            commands.push(command);
            client.commands.set(command.name, command);
        }
    }
}

function insertChar(char, frequency) {
    var num = 1;
    var c = char;
    for (i = 1; i < frequency; i++) {
        c += char;
        num++
    }
    return (c);
}

readCommands('commands')
console.log("|" + insertChar(" ", topBars - 1) + "|")
console.log(insertChar("‾", topBars))

client.login(TOKEN);

client.on('ready', async() => {
    var type = "listening";
    client.user.setStatus("online");
    client.user.setActivity("to music with @Stark Wolfz#9300", {
        type: type.toUpperCase(),
        url: "https://twitch.tv/starkwolfzz"
    });

    //Slash commands
    topBars = 60;
    console.log(insertChar("_", topBars))
    console.log("|" + insertChar(" ", Math.round(((topBars - 1) - (`Updated Slash Guilds`).length) / 2)) + "Updated Slash Guilds" + insertChar(" ", Math.floor(((topBars - 1) - (`Updated Slash Guilds`).length) / 2)) + "|")
    console.log("|" + insertChar("_", topBars - 1) + "|")
    console.log("|" + insertChar(" ", topBars - 1) + "|")

    var bar = new Promise((resolve, reject) => {
        var size = client.guilds.cache.size;
        var sizeW = size - 1;
        var n = 0;
        for (i = 0; i < size; i++) {
            const mainGuild = client.guilds.cache.get(client.guilds.cache.map(guild => guild.id)[i]);
            mainGuild.commands.set(slashCommands).then((cmd) => {
                const Roles = (commandName) => {
                    const cmdPerms = slashCommands.find(c => c.name === commandName).Perms;

                    if (!cmdPerms) return null;

                    return mainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms) && !r.managed);
                }

                const fullPermissions = cmd.reduce((accumulator, x) => {
                    const roles = Roles(x.name);
                    if (!roles) return accumulator;

                    const permissions = roles.reduce((a, v) => {
                        return [...a, { id: v.id, type: "ROLE", permission: true }]
                    }, []);

                    return [...accumulator, { id: x.id, permissions }]
                }, []);

                mainGuild.commands.permissions.set({ fullPermissions })
                    .catch((error) => {
                        var neededSpace1 = Math.round(((topBars - 1) - ((mainGuild.name).length)) / 2);
                        var neededSpace2 = Math.floor(((topBars - 1) - ((mainGuild.name).length)) / 2);
                        console.log("|" + insertChar(" ", neededSpace1) + "\x1b[31m" + mainGuild.name + "\x1b[0m" + insertChar(" ", neededSpace2) + "|");
                        if (n == sizeW) {
                            resolve()
                        } else {
                            n += 1;
                        }
                    })
                    .then(() => {
                        var neededSpace1 = Math.round(((topBars - 1) - ((mainGuild.name).length)) / 2);
                        var neededSpace2 = Math.floor(((topBars - 1) - ((mainGuild.name).length)) / 2);
                        console.log("|" + insertChar(" ", neededSpace1) + "\x1b[32m" + mainGuild.name + "\x1b[0m" + insertChar(" ", neededSpace2) + "|");
                        if (n == sizeW) {
                            resolve()
                        } else {
                            n += 1;
                        }
                    });
            })
        }
    })

    bar.then(() => {
        console.log("|" + insertChar(" ", topBars - 1) + "|")
        console.log(insertChar("‾", topBars))
        console.info(`${client.user.tag} is ${client.user.presence.status} and is ${type} ${client.user.presence.activities[0]}`);
    })
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    switch (message.channel.name) {
        case "tts":
            const args = message.content.split(/ +/);
            const voiceChannel = message.member.voice.channel;
            if (voiceChannel != null) {
                if (client.ttsPlayer.state.status == "playing") {
                    message.react("❌")
                } else {
                    var text = encodeURIComponent(args.join(' '));
                    var url = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${text}`

                    var path = `./tts/${text.slice(0, 20)}_${Date.now()}.ogg`;

                    request.get(url)
                        .on('error', (e) => console.error(e))
                        .pipe(fs.createWriteStream(path).on('finish', () => playtts(voiceChannel, path)));
                }
            } else {
                await message.reply(`⛔ You must be in a voice channel to play a tts message`)
            }

            async function playtts(voiceChannel, path) {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator
                })

                const connection1 = getVoiceConnection(voiceChannel.guild.id);
                var resource = createAudioResource(path, { inlineVolume: true });
                resource.volume.setVolume(client.volume / 100);
                await client.ttsPlayer.play(resource);
                connection1.subscribe(client.ttsPlayer);

                message.react("✅")
                client.ttsPlayer.on(AudioPlayerStatus.Idle, async() => {
                    if (fs.existsSync(path) && client.ttsPlayer.state.status != "playing") fs.unlinkSync(path)
                });

                client.ttsPlayer.on('error', error => {
                    console.error(`Error: ${error.message} with song ${path} because: ${error.stack}`);
                    message.channel.send(`⛔ ***Error***: Couldn't play ${path}.`)
                });
            }
            break;
    }

    if (!message.content.startsWith(client.prefix)) return;
    const args = message.content.slice(client.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);
    if (!cmd) return;
    try {
        await cmd.execute(client, message, args);
    } catch (error) {
        if (error) console.error(error);
        await message.reply({ content: 'There was an error while executing this command!' });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    // const arguments = [];

    // for(let option of interaction.options.data){
    //   if(option.type === 'SUB_COMMAND'){
    //     option.options?.forEach((x) => {
    //       if(x.value) arguments.push(option.value);
    //     });
    //   } else if(option.value) arguments.push(option.value)
    // }
    try {
        await command.execute(client, interaction /*, arguments*/ );
    } catch (error) {
        if (error) console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

exports.changeCfg = function(prefix, volume) {
    changeConfig({ prefix, volume })
}