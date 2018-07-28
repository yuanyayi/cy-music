function cyPlayer(domEl, userPlayerList, option) {
  let $el = $(domEl),
    _this = this,
    // 设置实体参数
    songsList = userPlayerList,
    // ------------------- create DOMs --------------------- //
    audio = $el.find('audio')[0] || $el.append('<audio preload="auto" autoplay="false" hidden"></audio>').find('audio')[0],
    // 播放Btn
    playBtn = $el.find('.play'),
    // 暂停Btn
    pauseBtn = $el.find('.pause'),
    // 切换Btn
    nextBtn = $el.find('.next'),
    prevBtn = $el.find('.prev'),
    // 播放列表Btn
    menuBtn = $el.find('.menu'),
    // 音量控制
    soundBtn = $el.find('i.sound'),
    muteBtn = $el.find('i.mute'),
    volumeBox = $el.find('.volumeBox'),
    // 喜欢/收藏Btn
    heartBtn = $el.find('.heart'),
    // 播放器信息
    currentTime = $el.find('.current'),
    durationTime = $el.find('.duration'),
    // 正在播放
    indexNow = 0;
  // 媒体进度
  this.currentTime = function(value) {
    if (typeof value === 'number') {
      // 输入一个小数：
      if (value > 0 && value < 1) {
        audio.currentTime = Math.floor(audio.duration * value)
      }
      // 输入一个整数：
      else if (value <= audio.duration) {
        audio.currentTime = Math.floor(value)
      }
    }
    return audio.currentTime
  }
  // songProgress
  let songProgress = new Progress($el.find('.progressBox'), {
      max: audio.duration || 1,
      callback: _this.currentTime,
      labels: $el.find('.current'),
      labelFormat: formatTime,
    }),
    currentTimeText = $el.find('.current'),
    durationTimeText = $el.find('.duration'),
    // playList
    playListWrap = $el.find('.playListWrap'),
    playList = $el.find('.playList'),
    // playList Index
    songsIndexList = [];
  for (let i = 0; i < songsList.length; i++) {
    songsIndexList.push(i)
  }

  this.song = songProgress

  // ------------------- DOM行为 --------------------- //
  // 播放列表
  menuBtn.on('click', () => {
    playListWrap.slideToggle()
  })
  // 静音
  soundBtn.on('click', () => {
    this.savedVolume = this.volume()
    this.volume(0)
    muteBtn.show()
    soundBtn.hide()
  })
  muteBtn.on('click', () => {
    this.volume(this.savedVolume || 0.5)
    muteBtn.hide()
    soundBtn.show()
  })
  // ------------------- 基本方法 --------------------- //
  audio.onloadedmetadata = () => {
    currentTimeText.text(formatTime(0))
    durationTimeText.text(formatTime(audio.duration))
    songProgress.max = audio.duration
  }
  // 改变音量
  this.volume = (value) => {
    volumeProgress.setValue(value)
    return audio.volume
  }
  // volumeProgress
  volumeProgress = new Progress(volumeBox, {
    value: (function() {
      return window.localStorage ? localStorage.cyVolume : 0.5
    })(),
    callback: function(value) {
      if (value >= 0 && value <= 1) {
        audio.volume = value
      }
      if (window.localStorage) {
        localStorage.cyVolume = audio.volume
      }
    }
  })
  // volume init
  let initVolume = window.localStorage && localStorage.cyVolume ? localStorage.cyVolume : 0.5
  volumeProgress.setValue(initVolume)
  // 进度条计时器
  _playTimer = {
    playingTimer: { a: 1 },
    start: () => {
      let _this = this
      // 改变进度条
      function run() {
        songProgress.setValue(audio.currentTime, false)
      }
      _playTimer.playingTimer = setInterval(run, 1000)
      run()
    },
    clear: () => {
      clearInterval(_playTimer.playingTimer)
    }
  }
  // 播放
  _play = () => {
    audio.play()
    if (playBtn.is(':visible')) {
      playBtn.hide()
      pauseBtn.show()
    }
    _playTimer.start()
  }
  playBtn.on('click', _play)
  // 暂停
  _pause = () => {
    audio.pause()
    if (playBtn.is(':hidden')) {
      pauseBtn.hide()
      playBtn.show()
    }
    _playTimer.clear()
  }
  pauseBtn.on('click', _pause)
  // 停止
  _stop = () => {
    _pause();
    audio.currentTime = 0;
    songProgress.setValue(0)
  }
  // 上一下一
  _prev = () => {
    indexNow = indexNow - 1 >= 0 ? indexNow - 1 : songsList.length - 1
    _changeSong()
  }
  prevBtn.on('click', _prev)
  _next = (click) => {
    indexNow = indexNow + 1 < songsList.length ? indexNow + 1 : 0
    _changeSong()
    click ? _play() : ''
  }
  nextBtn.on('click', function() { _next(true) })
  audio.onended = () => {
    _next()
    _play()
  }
  this.onChangeSong = option.onChangeSong || function(song){console.log(song)}
  // 切换歌曲
  _changeSong = (i) => {
    if (i || i === 0) { indexNow = i }
    let song = songsList[indexNow]
    if (!song) return false
    _stop()
    // info
    $el.find('.songImage img').attr('src', song.picture)
    $el.find('.bgImg').css({ 'backgroundImage': 'url(' + song.picture + ')' })
    $el.find('.song').text(song.title)
    $el.find('.singer').text(song.artist)
    $el.find('.lrc').text(song.lrc)
    song.like ? heartBtn.addClass('like') : heartBtn.removeClass('like')
    // audio
    $(audio).find('source').attr('src', '' + song.url)
    audio.load()
    this.onChangeSong(song)
  }
  // 歌名切歌
  playList.on('click', 'li', (e) => {
    _changeSong($(e.currentTarget).index())
  })
  // 喜欢
  heartBtn.on('click', () => {
    heartBtn.toggleClass('like')
    songsList[indexNow].like = heartBtn.hasClass('like')
  })
  // 更新整个播放列表
  this.changeSongsList = (arr) => {
    songsList = arr
    _changeSong(0)
  }
  // ------------------- keyboard actions ------------------- //
  $('body').on('keyup', (e) => {
    // console.log(e.keyCode)
    const VOLUMEDIFF = 0.05
    // space
    if (e.keyCode === 32) {
      playBtn.is(':hidden') ? _pause() : _play()
    }
    // left
    if (e.keyCode === 37) {
      _prev()
    }
    // up
    if (e.keyCode === 38) {
      let vol = this.volume() + VOLUMEDIFF <= 1 ? this.volume() + VOLUMEDIFF : 1
      this.volume(vol)
      volumeProgress.setValue(vol, false)
    }
    // right
    if (e.keyCode === 39) {
      _next()
    }
    // down
    if (e.keyCode === 40) {
      let vol = this.volume() - VOLUMEDIFF >= 0 ? this.volume() - VOLUMEDIFF : 0
      this.volume(vol)
      volumeProgress.setValue(vol, false)
    }
  })
  // ------------------- init ------------------- // 
  addSongsToList(playList)
  _changeSong(0)
  // ------------------- library ------------------- //
  // 生成播放列表
  function addSongsToList(playList, type) {
    var listStr = ''
    for (var i in songsList) {
      let song = songsList[i]
      listStr += `
    <li class="item">
      <div class="frame">
        <img src="${song.picture}">
      </div>
      <p>${song.title.toUpperCase()}</p>
    </li>`
    }
    // 幻灯多几张
    if (type === 'slider') {
      for (var i = 0; i < 4; i++) {
        let song = songsList[i]
        listStr += `
    <li class="item">
      <div class="frame">
        <img src="${song.picture}">
      </div>
      <p>${song.title.toUpperCase()}</p>
    </li>`
      }
    }
    playList.append(listStr)
  }

  function formatTime(seconds) {
    return Math.floor(seconds / 60) + ':' + ((seconds % 60) >= 10 ? '' : '0') + Math.round(seconds % 60)
  }
  return this
}

// ---------------- 进度条组件 ---------------- //
function Progress(obj, ...opts) {
  let _this = this
  let options = {
    value: 0,
    max: 1,
    min: 0,
    labels: [],
    labelFormat: function(val) { return val },
    callback: null
  }
  if (!obj || obj.length === 0) {
    console.error('试图建立一个不存在的进度条。')
  }
  // 初始化
  this.init = function() {
    $el = $(obj)
    this.container = _createBar($el)
    this.bar = this.container.find('.bar')
    opts = opts[0] || {}
    for (let option in options) {
      this[option] = opts[option] || options[option]
    }
  }
  this.init()
  // console.log(this)
  // 创建UI
  function _createBar(box) {
    if (box.find('.progress .bar').length === 0) {
      box.append(`<div class="progress">
        <span class="bar"></span>
      </div>`)
      box.find('.progress').css({
        'position': 'relative'
      })
      box.find('.bar').css({
        'position': 'absolute',
        'left': 0,
        'top': 0,
        'height': '100%',
      })
    }
    return box.find('.progress')
  }
  // 遍历并修改标签数值
  this.changeLabels = function() {
    let val = this.value
    if (this.labels instanceof jQuery) {
      this.labels.each(function() {
        $(this).text(_this.labelFormat(val))
      })
    }
  }
  // 直接修改数值：
  this.setValue = function(val, call) {
    this.value = valueFormat(val)
    this.bar.css('width', (this.value - this.min) / (this.max - this.min) * 100 + '%')
    this.changeLabels()
    if ((call || call === undefined) && typeof this.callback === 'function') {
      this.callback(this.value)
    }
  }
  this.setValue(this.value)
  // 拖拽
  this.container.on('mousedown', (ev) => {
    this.moveBar(ev)
    this.container.on('mousemove', (ev) => {
      let val = this.moveBar(ev)

    })
    $(document).on('mouseup', (ev) => {
      let val = this.moveBar(ev)
      this.setValue(val)

      this.container.off('mousemove')
      $(document).off('mouseup')
    })
  })
  // 封装移动效果
  this.moveBar = function(ev) {
    let len = ev.clientX - this.container.offset().left
    let val = len / this.container.width() * (this.max - this.min)
    this.bar.css('width', len)
    return valueFormat(val)
  }
  // 精度
  function valueFormat(val) {
    let v = Math.round(val * 100) / 100
    return v > _this.max ? _this.max : (v < _this.min ? _this.min : v)
  }
}