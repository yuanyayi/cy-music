let base_url = 'http://api.jirengu.com/fm'
if (location && location.protocol == 'https:') {
  base_url = 'https://jirenguapi.applinzi.com/fm'
}

function getChannels() {
  return new Promise(function(resolve, reject) {
    $.get(base_url + '/getChannels.php', (data) => {
      resolve(JSON.parse(data).channels)
    })
  })
}

function getSong(channel_id) {
  return new Promise(function(resolve, reject) {
    $.get(base_url + '/getSong.php', {
      channel: channel_id
    }, (data) => {
      let songs = JSON.parse(data).song
      // console.log(songs)
      resolve(songs)
    })
  })
}

function getLyric(sid) {
  return new Promise(function(resolve, reject) {
    $.get(base_url + '/getLyric.php', {
      sid: sid
    }, (data) => {
      resolve(JSON.parse(data.replace(/^error/, '')))
    })
  })
}