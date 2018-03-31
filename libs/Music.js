(function(global){
	var Music = {};
	Music.step = Math.pow(2,1/12);
	Music.noteNames = ['A','B','C','D','E','F','G'];
	Music.tt = function(a,b){
		return 240/a*b;
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
		this.info = {loudness: 1/3, texture: 50};
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
	};
	Object.assign(Music.Note.prototype, {
		play: function(time = 0){ // in beats
			var A, T;
			var that = this;
			if(that.score){
				A = that.score.A;
				T = that.score.tempo;
			}else{
				A = 440;
				T = 168;
			}
			that.fp = function(){
				that.context.resume();
				window.clearTimeout(that.stop);
				that.gain.connect(that.context.destination);
				that.oscillator.connect(that.gain);
				that.oscillator.frequency.setTargetAtTime(Music.noteToFrequency(that.name, A),that.context.currentTime,0);
				that.gain.gain.setTargetAtTime(that.info.loudness,that.context.currentTime+Math.min(0.15, Music.tt(T,that.duration)*0.05),Music.tt(T,that.duration)*0.2/2);
				that.gain.gain.setTargetAtTime(0,that.context.currentTime+Music.tt(T,that.duration)*0.7, Music.tt(T,that.duration)*0.04);
				that.stop = window.setTimeout(function(){
					that.context.suspend();
				}, Music.tt(T,that.duration)*1000);
			};
			window.setTimeout(that.fp, Music.tt(T,time)*1000);
		}
	});
	Music.Score = function(){
		this.tempo = 168;
		this.A = 440;
		this.notes = [];
	};
	Object.assign(Music.Score.prototype, {
		play: function(){
			for(var i=0;i<this.notes.length;i++){
			}
		},
		add: function(arr, all = false){
			if(all) this.notes = [];
			var interval;
			for(var i=0;i<arr.length;i++){
				var p = arr[i];
				if(typeof p == 'object'){
					if(Array.isArray(p)){
					}else{
					}
				}else if(typeof p == 'string'){
				}
			}
		}
	});
	global.Music = Music;
})(this);