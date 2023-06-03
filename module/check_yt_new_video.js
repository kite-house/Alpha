const Parser = require('rss-parser')
const parser = new Parser()

module.exports = (client, db, config) => {
    let name;
    db.query(`SELECT * FROM media_partners WHERE 1 `, function(error, results) {
        if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: YouTube Plugin, STATUS: ${error}`);
        for (i in results){
            name = results[i].name
            channel_id = results[i].channel_id
            link = results[i].link
            lastvideo = results[i].lastvideo

            data = async (name, channel_id, link, lastvideo) => {
                const data = await parser
                    .parseURL(
                        `https://youtube.com/feeds/videos.xml?channel_id=${channel_id}`
                    )
                    .catch(console.error)

                if(lastvideo == null){
                    lastvideo = data.items[0].id
                    db.query(`UPDATE media_partners SET lastvideo = '${lastvideo}' WHERE channel_id = '${channel_id}'`, function(error, result){
                        if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: YouTube: ${channel_id}, STATUS: ${error}`);
                        client.channels.cache.get(config.database).send(`DATABASE MIGRATION: YouTube: ${channel_id}, STATUS: ACCEPT!`)
                    })
                }

                else if(lastvideo != null){
                    if (lastvideo != data.items[0].id){
                        client.channels.cache.get(config.movie)
                            .send(`||@everyone||У нашего братишки ${name} вышел новый видос!\nhttps://www.youtube.com/watch?v=${data.items[0].id.replace('yt:video:', '')}`)

                        db.query(`UPDATE media_partners SET lastvideo = '${data.items[0].id}' WHERE channel_id = '${channel_id}'`, function(error, result){
                            if(error) client.channels.cache.get(config.database).send(`DATABASE MIGRATION: YouTube: ${channel_id}, STATUS: ${error}`);
                            client.channels.cache.get(config.database).send(`DATABASE MIGRATION: YouTube: ${channel_id}, STATUS: ACCEPT!`)
                        })
                        console.log(`MODULE_INFO: CHECK_YT_NEW_VIDEO | INFO: ${name} | STATUS:`, 'ACCEPT!'.green)
                    }

                }

                return data.title
            }
            main = async () => {
                title = await data(name, channel_id, link, lastvideo)
            }
        
            main()
        }
    })
}