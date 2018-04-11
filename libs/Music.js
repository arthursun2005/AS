(function(global){
	var Music = {};
	Music.context = new (window.AudioContext || webkitAudioContext)();
	Music.step = Math.pow(2,1/12);
	Music.noteNames = ['C','D','E','F','G','A','B'];
	Music.tt = function(a,b){return 240/a*b;};
	Music.nameToDynamics = function(name, L = 1/9){
		var d = L;
		for(var i=name.length-1;i>=0;i--){
			if(name[i] == 'm') d+=(L/1.8-d)*1/1.3;
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
	global.beep = function(arr){
		var a = arr;
		if(!Array.isArray(a)){console.log('Enter a single array');return;}
		for(var i=0;i<a.length;i++){
			if(typeof a[i] == 'object'){
				var n = new Music.Note();
				n.name = a[i].name != undefined ? a[i].name : 'A';
				if(a[i].name[0] == '.'){n._s = 0.1;}
				n.info.loudness = Music.isValidDynamicName(a[i].dynamic) ? Music.nameToDynamics(a[i].dynamic, 1/7) : 1/7;
				n.duration = a[i].duration != undefined ? a[i].duration : 1/4;
				n.oscillator.type = a[i].type != undefined ? a[i].type : 'triangle';
				var pt = a[i].playTime != undefined ? a[i].playTime : 0;
				n.play(pt);
			}
		}
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
		this.info = {loudness: 1/7, texture: 50};
		// all time in beats
		this.name = 'C5';
		this.score = score;
		if(this.score) this.context = this.score.context;
		else this.context = Music.context;
		this.oscillator = this.context.createOscillator();
		this.gain = this.context.createGain();
		this.gain.gain.setTargetAtTime(this.info.loudness/8,0,0);
		this.oscillator.start();
		this.context.suspend();
		this.oscillator.type = 'triangle';
		this._s = this.score != undefined ? this.score._s : 0.86;
		this.f = null;
		this.T = this.score != undefined ? this.score.tempo : 148;
	};
	Object.assign(Music.Note.prototype, {
		play: function(time = 0){ // in beats
			var A;
			var that = this;
			if(that.score) A = that.score.A;
			else A = 440;
			that.fp = function(){
				var T = that.T;
				that.context.resume();
				that.gain.connect(that.context.destination);
				that.oscillator.connect(that.gain);
				that.oscillator.frequency.setTargetAtTime(Music.noteToFrequency(that.name, A),that.context.currentTime,0);
				that.gain.gain.setTargetAtTime(that.info.loudness,that.context.currentTime+Math.min(0.18, Music.tt(T,that.duration)*0.05),that.info<1/2 ? Music.tt(T,that.duration)*2 : Music.tt(T,that.duration)*0.0075);
				that.gain.gain.setTargetAtTime(0,that.context.currentTime+Music.tt(T,that.duration)*that._s, Music.tt(T,that.duration)*0.25);
				if(that.f) that.f();
			};
			window.setTimeout(that.fp, Music.tt(this.T,time)*1000);
		},
		stop: function(){
			this.context.suspend();
			this.gain.gain.setTargetAtTime(0, this.context.currentTime, 0);
		}
	});
	Music.Score = function(){
		this.context = Music.context;
		this.tempo = 180;
		this.A = 440;
		this.notes = [];
		this.L = 1/7;
		this._st = 0.25;
		this._s = 0.86;
		this.playing = false;
		this.looping = false;
		this.scl = 1;
		this.durationMode = 1/4;
		this.on = 0;
		this.draws = [];
		this.x = 0;
		this.iner = 4;
		this.onst = false;
	};
	Object.assign(Music.Score.prototype, {
		play: function(){
			if(this.notes.length<1){return;}
			this.notes.sort(function(b, a){return b.wait-a.wait});
			var time = 0;
			for(var i=0;i<this.notes.length;i++){
				this.notes[i].note.play(this.notes[i].wait);
				if(i>0){time+=(Music.tt(this.notes[i].note.T, this.notes[i].wait)-Music.tt(this.notes[i-1].note.T, this.notes[i-1].wait));}
				console.log(i);
			}
			var i = this.notes.length-1;
			time+=Music.tt(this.notes[i].note.T, this.notes[i].note.duration)
			this.playing = true;
			var that = this;
			window.setTimeout(function(){that.playing = false}, time*1000);
			if(this.looping){
				this.loop = window.setInterval(function(){if(!that.playing){that.play();}}, Music.tt(that.tempo, 1)*1000);
			}
			this.x = 0;
		},
		stop: function(){
			for(var i=0;i<this.notes.length;i++){
				this.note[i].note.stop();
			}
			this.playing = false;
		},
		add: function(arr){
			if(!Array.isArray(arr)){console.log('Enter a single array for Music.Score.add');return;}
			var a = arr;
			for(var i=0;i<a.length;i++){
				if(Array.isArray(a[i])){this.add(a[i]);}
				else{
					if(typeof a[i] == 'object'){
						var n = new Music.Note(this);
						n.name = a[i].name != undefined ? a[i].name : 'A';
						if(a[i].name[0] == '.'){n._s = this._st;}
						n.info.loudness = Music.isValidDynamicName(a[i].dynamic) ? Music.nameToDynamics(a[i].dynamic, this.L) : this.L;
						n.duration = a[i].duration != undefined ? a[i].duration : 1/4;
						n.oscillator.type = a[i].type != undefined ? a[i].type : 'triangle';
						var pt = a[i].playTime != undefined ? a[i].playTime : (this.notes.length>0 ? this.notes[this.notes.length-1].wait+this.notes[this.notes.length-1].note.duration : 0);
						this.notes.push({note: n, wait: pt});
					}
				}
			}
		},
		drawdraws: function(lh, sp){
			for (var op = this.draws.length - 1; op >= 0; op--) {
				var o = this.draws[op];
				tool.stroke(0);
				if(o.note.duration<1/2){tool.fill(0);}
				else{tool.noFill();}
				var x = o.x, y = o.y;
				tool.translate(x+this.x,y);
				tool.rotate(-0.36);
				tool.ellipse(0, 0 , sp/2+sp/7, sp/2);
				tool.pop();
				var jj = o.j;
				if(jj<6){
					for(var i=5;i>=jj;i-=2){
						tool.line(x-sp+this.x, lh[i], x+sp+this.x, lh[i]);
					}
				}else if(jj>16 && jj<19){
					for(var i=17;i<=jj;i+=2){
						tool.line(x-sp+this.x, lh[i], x+sp+this.x, lh[i]);
					}
				}else if(jj<22 && jj>=19){
					for(var i=21;i>=jj;i-=2){
						tool.line(x-sp+this.x, lh[i], x+sp+this.x, lh[i]);
					}
				}else if(jj>=33){
					for(var i=33;i<=jj;i+=2){
						tool.line(x-sp+this.x, lh[i], x+sp+this.x, lh[i]);
					}
				}
				if(o.note.duration<1){
					if(jj<=11){
						if(o.note.name[0] == '.'){
							tool.fill(0);
							tool.ellipse(x-this.x, y-sp, 2,2);
						}
						tool.line(x-sp/2-sp/7+this.x, y, x-sp/2-sp/7+this.x, y+100+5*(11-jj));
					}
					if(jj>11 && jj<=18){
						if(o.note.name[0] == '.'){
							tool.fill(0);
							tool.ellipse(x-this.x, y+sp, 2,2);
						}
						tool.line(x+sp/2+sp/7+this.x, y, x+sp/2+sp/7+this.x, y-100-(jj-11)*5);
					}
					if(jj>18 && jj<=27){
						if(o.note.name[0] == '.'){
							tool.fill(0);
							tool.ellipse(x-this.x, y-sp, 2,2);
						}
						tool.line(x-sp/2-sp/7+this.x, y, x-sp/2-sp/7+this.x, y+100+5*(27-jj));
					}
					if(jj>27){
						if(o.note.name[0] == '.'){
							tool.fill(0);
							tool.ellipse(x-this.x, y+sp, 2,2);
						}
						tool.line(x+sp/2+sp/7+this.x, y, x+sp/2+sp/7+this.x, y-100-(jj-27)*5);
					}
				}
				
			}
		},
		draw: function(tool, ww, hh){
			if(tool == undefined || typeof global.Draw == 'undefined'){return;}
			tool.stroke(0);
			tool.strokeWeight(1);
			var lineHeights = [];
			function dfl(x,y,l,sp,g){
				for(var i=y;i<y+5*sp;i+=sp){
					tool.stroke(0);
					tool.line(x,i,x+l,i);
				}
				if(g){
					for(var i=x;i<x+l;i+=g/2){
						tool.stroke(0,255,0);
						tool.line(i+sp/2*12,hh/6,i+sp/2*12,hh/4);
					}
				}
			}
			const sp = 30, pp = 10;
			dfl(this.x,hh/pp+hh/4-2.5*sp,ww-this.x, sp, 720);
			dfl(this.x,hh/pp+hh/4-2.5*sp+8*sp,ww-this.x, sp);
			for(var i=hh/pp+hh/4-6*sp;i<hh/2+hh/4-hh/pp+6*sp;i+=sp/2){
				lineHeights.push(i);
			}
			tool.stroke(96);
			if(this.durationMode<1/2){tool.fill(96);}
			else{tool.noFill();}
			var y = lineHeights[0], jj = 0;
			for (var i = lineHeights.length - 1; i >= 0; i--) {
				if(Math.abs(mouse.y+sp/2-lineHeights[i])<Math.abs(y-lineHeights[i])){
					y = lineHeights[i];
					jj = i;
				}
			}
			var spx = 720;
			var x = mouse.x-this.x;

			x = Math.round(x/spx*this.iner)*spx/this.iner;
			tool.translate(x+this.x,y);
			tool.rotate(-0.36);
			tool.ellipse(0, 0 , sp/2+sp/7, sp/2);
			tool.pop();
			if(jj<6){
				for(var i=5;i>=jj;i-=2){
					tool.line(x-sp+this.x, lineHeights[i], x+sp+this.x, lineHeights[i]);
				}
			}else if(jj>16 && jj<19){
				for(var i=17;i<=jj;i+=2){
					tool.line(x-sp+this.x, lineHeights[i], x+sp+this.x, lineHeights[i]);
				}
			}else if(jj<22 && jj>=19){
				for(var i=21;i>=jj;i-=2){
					tool.line(x-sp+this.x, lineHeights[i], x+sp+this.x, lineHeights[i]);
				}
			}else if(jj>=33){
				for(var i=33;i<=jj;i+=2){
					tool.line(x-sp+this.x, lineHeights[i], x+sp+this.x, lineHeights[i]);
				}
			}
			if(this.durationMode<1){
				if(jj<=11){
					if(this.onst){
						tool.fill(0);
						tool.ellipse(x-this.x, y-sp, 2,2);
					}
					tool.line(x-sp/2-sp/7+this.x, y, x-sp/2-sp/7+this.x, y+100+5*(11-jj));
				}
				if(jj>11 && jj<=18){
					if(this.onst){
						tool.fill(0);
						tool.ellipse(x-this.x, y+sp, 2,2);
					}
					tool.line(x+sp/2+sp/7+this.x, y, x+sp/2+sp/7+this.x, y-100-(jj-11)*5);
				}
				if(jj>18 && jj<=27){
					if(this.onst){
						tool.fill(0);
						tool.ellipse(x-this.x, y-sp, 2,2);
					}
					tool.line(x-sp/2-sp/7+this.x, y, x-sp/2-sp/7+this.x, y+100+5*(27-jj));
				}
				if(jj>27){
					if(this.onst){
						tool.fill(0);
						tool.ellipse(x-this.x, y+sp, 2,2);
					}
					tool.line(x+sp/2+sp/7+this.x, y, x+sp/2+sp/7+this.x, y-100-(jj-27)*5);
				}
			}
			var me = this;
			var corr = [
				'F6', 'E6', 'D6', 'C6', 'B5', 'A5', 'G5', 'F5', 'E5', 'D5', 'C5', 'B', 
				'A', 'G', 'F', 'E', 'D', 'C', 'B3', 'E', 'D', 'C', 'B3', 'A3', 'G3', 'F3', 
				'E3', 'D3', 'C3', 'B2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2', 'B1', 'A1', 'G1', 'F1', 'E1'
			];
			space.onmousedown = function(){
				var name = corr[jj];
				if(me.onst){name = '.'+name;}
				var n = new Music.Note(me);
				n.name = name;
				if(me.onst){n._s = me._st;}
				n.duration = me.durationMode;
				me.draws.push({note: n, x: x, y: y, j: jj});
				me.notes.push({wait: (x/spx), note: n});
				beep([{name: name}]);
			};
			this.drawdraws(lineHeights, sp);
			if(this.playing){this.x-=this.tempo/90;}
		}
	});
	Music.Sounds = {
	};
	global.Music = Music;
})(this);