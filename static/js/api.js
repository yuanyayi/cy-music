let base_url = 'http://api.jirengu.com/fm/'
if(location && location.protocol=='https:'){
  base_url = 'https://jirenguapi.applinzi.com/fm'
}

function getChannels() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: base_url+'getChannels.php',
      type: 'get',
      success: (data)=>{
        resolve(JSON.parse(data).channels)
      },
      error: (errormsg)=>{
        reject(errormsg)
      }
    })
  })
}

function getSong(channel_id) {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: base_url+'getSong.php',
      data: {
        channel: channel_id
      },
      type: 'get',
      success: (data)=>{
        resolve(JSON.parse(data).song)
      },
      error: (errormsg)=>{
        reject(errormsg)
      }
    })
  })
}

function getLyric(sid){
  return new Promise(function(resolve, reject){
    $.ajax({
      url: base_url + 'getLyric.php',
      type: 'get',
      jsonp: 'callback',
      data: {
        sid: sid
      },
      success: (data)=>{
        resolve(data.error)
      },
      error: (errormsg)=>{
        reject(errormsg)
      }
    })
  })
}

getLyric('758918')
