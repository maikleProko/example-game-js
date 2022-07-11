
var fire = document.createElement("AUDIO")
document.body.appendChild(fire);
fire.src = '../audio/click_combo.wav'

var soundManager = {
    clips: {},
    context: null,
    gainNode: null,
    loaded: false,
    mus000: null,
    mus001: null,
    mus002: null,

    init: ()=>{
        soundManager.mus000 = "../audio/mus000.mp3";
        soundManager.mus001 = "../audio/mus001.mp3";
        soundManager.mus002 = "../audio/mus002.mp3";
        fire.src = '../audio/click_combo.wav'

        this.context = new AudioContext();
        this.gainNode = this.context.createGain ?
        this.context.createGain() : this.context.createGainNode()
        this.gainNode.connect(this.context.destination);

    },
    load: (path, callback)=>{
        if(soundManager.clips[path]){
            callback(this.clips[path]);
            return;
        }
        let clip = {path: path, buffer: null, loaded: false};
        clip.play = (volume, loop)=>{
            soundManager.play(this.path, {looping: loop ? loop : false, volume: volume ? volume : 1});
        };
        soundManager.clips[path] = clip;
        let request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';
        request.onload = ()=>{
            console.log('entry?')
            console.log(soundManager.context)
            soundManager.context.decodeAudioData(request.response, (buffer)=>{
                console.log('entry')
                clip.buffer = buffer;
                clip.loaded = true;
                callback(clip);
            });
        };
        request.send();
    },
    loadArray: (array)=>{
        for(let i = 0; i < array.length; i++){
            soundManager.load(array[i], ()=>{
                if(array.length === Object.keys(soundManager.clips).length){
                    for(let sd in soundManager.clips){
                        if(!soundManager.clips[sd].loaded){
                            return;
                        }
                    }
                    soundManager.loaded = true;
                }
            });
        }
    },
    play: (path, settings)=>{
        console.log(path)
        fire.currentTime = 0;
        fire.play()
        if(!soundManager.loaded){
            setTimeout(()=>{
                //soundManager.play(path, settings);
            }, 1000);
            return;
        }
        let looping = false;
        let volume = 1;
        if(settings){
            if(settings.looping){
                looping = settings.looping;
            }
            if(settings.volume){
                volume= settings.volume;
            }
        }
        let sd = this.clips[path];
        if(sd === null){
            return false;
        }
        let sound = soundManager.context.createBufferSource();
        sound.buffer = sd.buffer;
        sound.connect(soundManager.gainNode);
        sound.loop = looping;
        soundManager.gainNode.gain.value = volume;
        sound.start(0);
        return true;
    },

    playSound: function (sound) {
        sound.currentTime = 0;
        sound.play()

    },

};

soundManager.init();