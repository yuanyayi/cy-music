function cyMusic(domEl) {
  this.create = () => {
    // jQuery实例
    let $el = $(domEl),
      // html5播放器
      audio = $el.find('audio')[0] || $el.append('<audio preload="auto" autoplay="false" hidden"></audio>').find('audio')[0],
      // 播放列表
      playList = [],
      // 播放排序列表
      playIndexList = [],
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
      // 喜欢/收藏Btn
      heartBtn = $el.find('.heart'),
      // 播放器信息
      currentTime = $el.find('.current'),
      durationTime = $el.find('.duration'),
      // 正在播放
      indexNow = 0
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
  // 暂停
  _pause = () => {
    audio.pause()
    if (playBtn.is(':hidden')) {
      pauseBtn.hide()
      playBtn.show()
    }
    _playTimer.clear()
  }
  // 停止
  _stop = () => {
    _pause();
    audio.currentTime = 0;
  }
  // 上一下一
  _prev = () => {
    indexNow = indexNow - 1 >= 0 ? indexNow - 1 : songsList.length - 1
    _changeSong()
  }
  _next = () => {
    indexNow = indexNow + 1 < songsList.length ? indexNow + 1 : 0
    _changeSong()
  }
  // 连播功能
  audio.onended = () => {
    _next()
    _play()
  }
  // 进度条计时器
  _playTimer = {
    playingTimer: {},
    start: () => {
      // 改变进度条
      function todo() {
        let d = _this.player.duration
        _this.songProgress._setProgressValue(_this.player.currentTime + 1)
        _this.currentTimeText.text(formatTime(_this.player.currentTime))
      }
      todo()
      this._playTimer.playingTimer = setInterval(todo, 1000)
    },
    clear: () => {
      clearInterval(this._playTimer.playingTimer)
    }
  }
  // 切换歌曲
  this._changeSong = (i) => {
    if (i || i === 0) { this.indexNow = i }
    let song = this.songsList[this.songsIndexList[this.indexNow]]
    if (!song) return false
    this._stop()
    // info
    $el.find('.songImage img').attr('src', './asset/images/' + song.img)
    $el.find('.bgImg').css({ 'backgroundImage': 'url(./asset/images/' + song.img + ')' })
    $el.find('.song').text(song.songName)
    $el.find('.singer').text(song.singerName)
    // audio
    $(this.player).find('source').attr('src', './asset/songs/' + song.src)
    this.player.load()
  }
  // 初始化
  this.init = () => {}
}