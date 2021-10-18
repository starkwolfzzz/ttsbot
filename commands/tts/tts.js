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
const fs = require(`fs`);

module.exports = {
    name: "tts",
    description: "Does tts in vc",
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        if (voiceChannel != null) {
            if (client.ttsPlayer.state.status == "playing") {
                message.react("❌")
            } else {
                //var voice = args.shift();
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
    }
}