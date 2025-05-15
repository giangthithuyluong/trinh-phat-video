var list = []
var video = document.getElementById('current_video')

var progress = document.getElementById('progress')
var volumeValue = document.getElementById('volume_value')
var time = document.getElementById('time')

var playBtn = document.getElementById('control')
var prevBtn = document.getElementById('prev')
var nextBtn = document.getElementById('next')
var ccBtn = document.getElementById('video_cc')
var videoSetting = document.getElementById('video_setting')
var videoSmall = document.getElementById('video_to_small')
var closeSmall = document.getElementById('small_mode_close')
var videoMode = document.getElementById('video_mode')
var modeFullscreen = document.getElementById('video_screen_mode')

const app = {
    currentIndex: 0,
    render() {
        video.src = list[this.currentIndex].link
        volumeValue.value = video.volume * 100
    },
    loadSong(index) {
        this.currentIndex = index
        video.src = list[this.currentIndex].link

        

        setTimeout(video.play(), 1000)
    },
    defineProperties() {
        let length = list.length
        Object.defineProperty(this, 'prevIndex', {
            get: function() {
                return this.currentIndex == 0 ? length-1 : this.currentIndex - 1
            }
        })
        Object.defineProperty(this, 'nextIndex', {
            get: function() {
                return this.currentIndex == length-1 ? 0 : this.currentIndex + 1
            }
        })
    },
    handle() {
        var _this = this

        video.onplay = (e) => {
            playBtn.classList.add('pause')
            playBtn.classList.remove('play')
        }
        video.onpause = (e) => {
            playBtn.classList.add('play')
            playBtn.classList.remove('pause')
        }
        video.onclick = (e) => {
            !video.currentTime || video.paused ? video.play() : video.pause()
        }
        video.ontimeupdate = (e) => {
            let duration = video.duration
            if(!isNaN(duration)){
                let minute = Math.floor(duration / 60)
                let second = Math.floor(duration % 60)
                let hour = 0
                if(minute >= 60) {
                    hour = Math.floor(minute / 60)
                    minute = Math.floor(minute % 60)
                }
                time.querySelector('#duration').innerText = `/${hour > 0 ? hour+':': ''}${minute}:${second}`
            }

            let currentTime = video.currentTime
            let minute = Math.floor(currentTime / 60)
            let second = Math.floor(currentTime % 60)
            let hour = 0
            if(minute >= 60) {
                hour = Math.floor(minute / 60)
                minute = Math.floor(minute % 60)
            }
            time.querySelector('#current_time').innerText = `${hour > 0 ? hour+':': ''}${minute}:${second}`

            progress.value = isNaN(duration) ? 0 : currentTime / duration * 100

            if(currentTime == duration) {
                _this.loadSong(_this.nextIndex)
            }
        }

        progress.oninput = (e) => {
            let currentTime = e.target.value * video.duration / 100
            video.currentTime = currentTime
        }
        volumeValue.onchange = (e) => {
            video.volume = volumeValue.value / 100
        }

        playBtn.onclick = (e) => {
            playBtn.classList.contains('play') && video.play()
            playBtn.classList.contains('pause') && video.pause()
        }
        prevBtn.onclick = (e) => {
            _this.loadSong(_this.prevIndex)
        }
        nextBtn.onclick = (e) => {
            _this.loadSong(_this.nextIndex)
        }
        videoSmall.onclick = (e) => {
            let smallMode = document.getElementById('small_mode')
            closeSmall.style.display = 'block'
            Object.assign(smallMode.style,{
                width: '30vw',
                height: 'max-content',
                position: 'absolute',
                bottom: 0,
                right: 0
            })
        }
        closeSmall.onclick = (e) => {
            let smallMode = document.getElementById('small_mode')
            smallMode.removeAttribute('style')
            e.target.style.display = 'none'
        }
        videoMode.onclick = (e) => {
            let videoDiv = document.querySelector('.video')
            video.classList.contains('cinema') ? videoDiv.removeAttribute('style') : videoDiv.style.width = '100%'
            video.classList.toggle('cinema')
        }
        modeFullscreen.onclick = (e) => {
            video.requestFullscreen()
        }
    },
    start() {
        this.render()
        this.defineProperties()
        this.handle()
    }
}
var interval = setInterval(() => {
    if(list.length > 0) {
        app.start()
        clearInterval(interval)
    } 
}, 500)
var GetList = async() => {
    list = await fetch('./acess/data.json')
        .then(res => {
            return res.json()
        })
        .catch(err => {
            clearInterval(interval)
            alert(err)
            return []
        }
        )
}
GetList()
