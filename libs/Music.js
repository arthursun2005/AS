(function(global){
	var Music = {};
	Music.step = Math.pow(2,1/12);
	Music.noteNames = ['A','B','C','D','E','F','G'];
	Music.tt = function(a,b){
		return 240/a*b;
	};
	Music.nameToDynamics = function(name, L = 1/9){
		var d = L;
		for(var i=name.length-1;i>=0;i--){
			if(name[i] == 'm') d+=(L/1.5-d)*1/1.6;
			else if(name[i] == 'f') d+=(1-d)*1/3.5;
			else if(name[i] == 'p') d+=(-d)*1/3;
		}
		return d;
	};
	Music.isValidDynamicName = function(name){
		if(name == undefined || typeof name != 'string') return false;
		for(var i=0;i<name.length;i++){
			if(name[i] != 'p' && name[i] != 'f' && name[i] != 'm') return false;
		}
		return true;
	};
	Music.noteToFrequency = function(name, A = 440){
		var note = '', octave = 0, halfNotes = 0, on = 0, gg = 0;
		var arr = [''];
		for(var i=0;i<name.length;i++){
			arr[on]+=name[i];
			var f = Number(name[i]), f2 = Number(name[i+1]);
			if(isNaN(f2) || (isNaN(f) && !isNaN(f2)) || (isNaN(f2) && !isNaN(f1))){
				on++;
				arr.push('');
			}
		}
		for(var i=0;i<arr.length;i++){
			if(!isNaN(Number(arr[i])) && Number(arr[i]) != 0){
				octave+=Number(arr[i]); gg++;
			}else{
				var str = arr[i];
				if(str == '#'){
					halfNotes++;
				}else if(str == 'b'){
					halfNotes--;
				}else if(str == 'n'){
					halfNotes = 0;
				}else if(Music.noteNames.find(function(a){return a == str;})){
					note = str;
				}
			}
		}
		if(gg<=0) octave = 4;
		halfNotes+=12*(octave-4);
		if(note == 'C') halfNotes-=9;
		else if(note == 'D') halfNotes-=7;
		else if(note == 'E') halfNotes-=5;
		else if(note == 'F') halfNotes-=4;
		else if(note == 'G') halfNotes-=2;
		else if(note == 'B') halfNotes+=2;
		var frequency = Math.pow(Music.step, halfNotes)*A;
		return frequency;
	};
	Music.Note = function(score){
		this.duration = 1/4;
		this.info = {loudness: 1/9, texture: 50};
		// all time in beats
		this.name = 'C5';
		this.score = score;
		if(this.score) this.context = this.score.context;
		else this.context = new window.AudioContext();
		this.oscillator = this.context.createOscillator();
		this.gain = this.context.createGain();
		this.gain.gain.setTargetAtTime(this.info.loudness/8,0,0);
		this.oscillator.start();
		this.context.suspend();
		this.oscillator.type = 'triangle';
		this._s = 0.86;
		this.f = null;
	};
	Object.assign(Music.Note.prototype, {
		play: function(time = 0){ // in beats
			var A, T;
			var that = this;
			if(that.score){
				A = that.score.A;
				this.T = that.score.tempo;
			}else{
				A = 440;
				this.T = 180;
			}
			that.fp = function(){
				var T = that.T;
				that.context.resume();
				that.gain.connect(that.context.destination);
				that.oscillator.connect(that.gain);
				that.oscillator.frequency.setTargetAtTime(Music.noteToFrequency(that.name, A),that.context.currentTime,0);
				that.gain.gain.setTargetAtTime(that.info.loudness,that.context.currentTime+Math.min(0.18, Music.tt(T,that.duration)*0.05),that.info<1/2 ? Music.tt(T,that.duration)*2 : Music.tt(T,that.duration)*0.02);
				that.gain.gain.setTargetAtTime(0,that.context.currentTime+Music.tt(T,that.duration)*that._s, Music.tt(T,that.duration)*0.25);
				if(that.f) that.f();
			};
			window.setTimeout(that.fp, Music.tt(this.T,time)*1000);
		}
	});
	Music.Score = function(){
		this.context = new AudioContext();
		this.tempo = 180;
		this.A = 440;
		this.notes = [];
		this.L = 1/9;
		this._st = 0.56;
	};
	Object.assign(Music.Score.prototype, {
		play: function(){
			for(var i=0;i<this.notes.length;i++){
				this.notes[i].note.play(this.notes[i].wait);
			}
		},
		add: function(){
			var arr = arguments;
			var interval = 1/4, on = this.notes[this.notes.length-1] ? this.notes[this.notes.length-1].wait+this.notes[this.notes.length-1].note.duration : 0, loudness = this.L, chord = false, f = null;
			for(var i=0;i<arr.length;i++){
				var p = arr[i];
				if(typeof p == 'object'){
					if(Array.isArray(p)){
						if(typeof p[1] != 'string'){
							for(var j=0;j<p.length-1;j+=2){
								var a0 = p[j], b0 = p[j+1];
								if(typeof b0 == 'object'){
									interval = b0.rhythm || interval;
									loudness = Music.isValidDynamicName(b0.dynamics) ? Music.nameToDynamics(b0.dynamics) : loudness;
								}else if(typeof b0 == 'number'){
									interval = b0;
								}
								if(Array.isArray(a0)){
									for(var k=0;k<a0.length;k++){
										var a1 = a0[k];
										var n = new Music.Note(this);
										var _p = a0[k];
										n.name = _p;
										n.duration = interval;
										n.info.loudness = loudness;
										n.f = f;
										if(_p[0] == '.'){
											n._s = this._st;
										}
										this.notes.push({wait: on, note: n});
										f = null;
									}
									on+=interval;
								}else{
									var n = new Music.Note(this);
									var _p = a0;
									n.name = _p;
									n.duration = interval;
									n.info.loudness = loudness;
									n.f = f;
									if(_p[0] == '.'){
										n._s = this._st;
									}
									this.notes.push({wait: on, note: n});
									f = null;
									on+=interval;
								}
							}
							interval = p[1];
							for(var j=2;j<p.length-1;j+=2){
								if(typeof p[j] == 'number' && interval>p[j]) interval = p[j];
								else if(interval>p[j].rhythm) interval = p[j].rhythm;
							}
						}else{
							for(var j=0;j<p.length;j++){
								var n = new Music.Note(this);
								var _p = p[j];
								n.name = _p;
								n.duration = interval;
								n.info.loudness = loudness;
								n.f = f;
								if(_p[0] == '.'){
									n._s = this._st;
								}
								this.notes.push({wait: on, note: n});
								f = null;
							}
						}
					}else{
						p.times = p.times || 1;
						if('note' in p){
							for(var k = 0;k<p.times;k++){
								if('rhythm' in p){
									if(typeof p.rhythm == 'number') interval = p.rhythm;
									else interval = p.rhythm[k] != undefined ? p.rhythm[k] : interval;
								}
								if('dynamics' in p){
									if(Array.isArray(p.dynamics)) loudness = Music.isValidDynamicName(p.dynamics[k]) ? Music.nameToDynamics(p.dynamics[k]) : loudness;
									else if(typeof p.dynamics == 'string' && Music.isValidDynamicName(p.dynamics)) loudness = Music.nameToDynamics(p.dynamics);
								}
								if('f' in p){
									if(Array.isArray(p.f)) f = typeof p.f[k] == 'function' ? p.f[k] : null;
									else if(typeof p.f == 'function') f = p.f;
								}
								chord = 'isChord' in p ? p['isChord'] : false;
								if(Array.isArray(p['note'])){
									for(var j=0;j<p['note'].length;j++){
										if('subDynamics' in p){
											if(Array.isArray(p.subDynamics)) loudness = Music.isValidDynamicName(p.subDynamics[j]) ? Music.nameToDynamics(p.subDynamics[j]) : loudness;
											else if(typeof p.subDynamics == 'string' && Music.isValidDynamicName(p.subDynamics)) loudness = Music.nameToDynamics(p.subDynamics);
										}
										if('subRhythm' in p){
											interval = p.subRhythm[j] != undefined ? p.subRhythm[j] : interval;
										}
										if('subf' in p){
											if(Array.isArray(p.f)) f = typeof p.subf[j] == 'function' ? p.subf[j] : null;
											else if(typeof p.subf == 'function') f = p.subf;
										}
										var n = new Music.Note(this);
										var _p = p['note'][j];
										n.name = _p;
										n.duration = interval;
										n.info.loudness = loudness;
										n.f = f;
										if(_p[0] == '.'){
											n._s = this._st;
										}
										this.notes.push({wait: on, note: n});
										f = null;
										if(!chord) on+=interval;
									}
									for(var j=0;j<p['note'].length;j++){
										if('subRhythm' in p && interval>p.subRhythm[j]){
											interval = p.subRhythm[j] != undefined ? p.subRhythm[j] : interval;
										}
									}
								}else{
									var n = new Music.Note(this);
									var _p = p['note'];
									n.name = _p;
									n.duration = interval;
									n.info.loudness = loudness;
									n.f = f;
									if(_p[0] == '.'){
										n._s = this._st;
									}
									this.notes.push({wait: on, note: n});
									f = null;
									if(!chord) on+=interval;
								}
								if(chord) on+=interval;
							}
							if('rhythm' in p){
								if(typeof p.rhythm == 'number' && p.rhythm<interval){
									interval = p.rhythm;
								}else{
									for(var k = 0;k<p.times;k++){
										if(interval>p.rhythm[k]) interval = p.rhythm[k] != undefined ? p.rhythm[k] : interval;
									}
								}
							}
						}
					}
				}else if(typeof p == 'number'){
					interval = p;
				}else if(typeof p == 'string'){
					if(Music.isValidDynamicName(p)){
						loudness = Music.nameToDynamics(p, this.L);
					}else if(p == 'chord'){
						chord = true;
					}else if(p == '!chord'){
						chord = false;
						on+=interval
					}else if(!isNaN(Number(p))){
						interval = Number(p);
					}else if(p == 'wait'){
						on+=interval;
					}else if(p != ''){
						var n = new Music.Note(this);
						n.name = p;
						n.duration = interval;
						n.info.loudness = loudness;
						n.f = f;
						if(p[0] == '.'){
							n._s = this._st;
						}
						this.notes.push({wait: on, note: n});
						f = null;
						if(!chord) on+=interval;
					}
				}
			}
		}
	});
	global.Music = Music;
})(this);