(function(global){
	// require AS.js
	var Beep = {};
	Beep.step = Math.pow(2,1/12);
	Beep.noteNames = ['A','B','C','D','E','F','G'];
	Beep.tt = function(a,b){
		return 240000/a*b;
	};
	Beep.noteToFrequency = function(name, A = 440){
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
				}else if(Beep.noteNames.find(function(a){return a == str;})){
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
		var frequency = Math.pow(Beep.step, halfNotes)*A;
		return frequency;
	};
	Beep.Note = function(){
		this.duration = 1;
		this.info = {loudness: 1, texture: 50};
		// all time in beats
		this.name = 'A';
		this.score = null;
		this.context = new window.AudioContext();
		this.oscillator = this.context.createOscillator();
		this.gain = this.context.createGain();
		this.gain.gain.setTargetAtTime(this.info.loudness/8,0,0);
		this.gain.connect(this.context.destination);
		this.oscillator.connect(this.gain);
	};
	Object.assign(Beep.Note.prototype, {
		play: function(){
			var that = this, A, T;
			if(this.score){
				A = this.score.A;
				T = this.score.tempo;
			}else{
				A = 440;
				T = 168;
			}
			this.oscillator.frequency.setTargetAtTime(Beep.noteToFrequency(this.name, A),this.context.currentTime,0);
			this.gain.gain.setTargetAtTime(this.info.loudness,this.context.currentTime+0.15*Beep.tt(T,that.duration)/1000,Beep.tt(T,that.duration)/2000*0.3);
			this.oscillator.start();
			window.setTimeout(function(){that.oscillator.stop()}, Beep.tt(T,that.duration));
			window.setTimeout(
				function(){
					that.gain.gain.setTargetAtTime(0,that.context.currentTime, Beep.tt(T,that.duration)/2000*0.1);
				}
			,Beep.tt(T,that.duration)*0.7);
		}
	});
	Beep.Score = function(){
		this.tempo = 168;
		this.A = 440;
		this.notes = [];
	};
	Object.assign(Beep.Score.prototype, {
		play: function(){
			for(var i=0;i<this.notes.length;i++){
			}
		},
		fromArray: function(){
		}
	});
	global.Beep = Beep;
})(this);