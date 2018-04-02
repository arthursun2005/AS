document.body.style.fontSize = "21px";
document.body.style.fontFamily = "monospace";
function createCanvas(id, w = window.innerWidth, h = window.innerHeight, sl){
	if(arguments.length == 2){
		w = window.innerWidth*arguments[1];
		h = window.innerHeight*arguments[1];
	}
	var ele = document.createElement("canvas");
	var t = window.innerHeight-h;
	ele.style = sl || "border: dashed 1px #000000;margin-top: "+t/2+"px";
	ele.width = w, ele.height = h;
	ele.id = id;
	document.body.appendChild(ele);
	ele.style.cursor = 'crosshair';
	return ele;
}
Array.prototype._clone = function(){
	var arr = [];
	for(var i=0;i<this.length;i++){
		var o = this[i];
		if(typeof o == 'object'){
			if(Array.isArray(o)){
				arr[i] = o._clone();
			}else{
				arr[i] = o.clone();
			}
		}else{
			arr[i] = this[i];
		}
	}
	return arr;
};
Object.prototype.clone = function(){
	var obj = {}, me = this;
	for(var key in me){
		var o = me[i];
		if(typeof o == 'object'){
			if(Array.isArray(o)){
				arr[i] = o._clone();
			}else{
				arr[i] = o.clone();
			}
		}else{
			obj[key] = this[key];
		}
	}
	return obj;
};
Array.prototype._sort = function(changeObj){
	// using my method to decrease time complexity
	var arr = this;
	if(arr.length<1) return null;
	var r = 'r', p = 'p';
	for(var key in changeObj){
		switch(key){
			case 'p': p = changeObj[key];
			break;
			case 'r': r = changeObj[key];
			break;
		}
	}
	var all = [];
	var maxD = arr[0][r]*2;
	var minP = arr[0][p]._clone();
	for (var i = arr.length - 1; i >= 1; i--) {
		var c = arr[i];
		if(c[r]>maxD/2) maxD = c[r]*2;
		if(c[p].x<minP.x) minP.x = c[p].x;
		if(c[p].y<minP.y) minP.y = c[p].y;
	}
	for (var i = arr.length - 1; i >= 0; i--) {
		var c = arr[i];
		var y = Math.floor((c[p].y-minP.y)/maxD);
		var x = Math.floor((c[p].x-minP.x)/maxD);
		if(!all[y]) all[y] = [];
		if(!all[y][x]) all[y][x] = [];
		all[y][x].push({obj: c, id: i});
	}
	return {all: all, minP: minP, maxD: maxD, arr: arr, p: p};
};
Array._sortLoop = function(f, obj, times = 3){
	if(!obj) return false;
	var all = obj.all, minP = obj.minP, maxD = obj.maxD, arr = obj.arr, p = obj.p;
	times = Math.round(times);
	if(times%2 == 0){
		// is even
		var a = times/2-1;
		var b = times/2;
	}else{
		// is odd
		var a = Math.floor(times/2);
		var b = a;
	}
	for (var i = arr.length - 1; i >= 0; i--) {
		var c = arr[i];
		if(times%2 == 0){
			var y = Math.floor((c[p].y-minP.y-maxD/2)/maxD);
			var x = Math.floor((c[p].x-minP.x-maxD/2)/maxD);
		}else{
			var y = Math.floor((c[p].y-minP.y)/maxD);
			var x = Math.floor((c[p].x-minP.x)/maxD);
		}
		for(var py=y-a;py<=y+b;py++){
			if(!all[py]) continue;
			for(var px=x-a;px<=x+b;px++){
				if(!all[py][px]) continue;
				if(y>py && x>px) continue;
				for (var j = all[py][px].length - 1; j >= 0; j--) {
					var j0 = all[py][px][j];
					if(i == j0.id) continue;
					if(f) f({obj1: c, obj2: j0.obj, id1: i, id2: j0.id, all: all, arr: arr, minP: minP, maxD: maxD});
				}
			}
		}
	}
};
Math.dx = 1e-6;
Math.integral = function(f,a,b){
	var sum = 0;
	for(var i=a;i<b;i+=this.dx) sum+=this.dx*f(i);
	return sum;
};
Math.mag = function(x,y){
	return this.pow(x*x+y*y,1/2);
};
Math.sum = function(a,b,e) {
	var num = 0;
	for(var i=a;i<b;i++){num+=eval(e);}
	return num;
};
Math.isPrime = function(num){
	num = Math.floor(Math.abs(num));
	function ii(n){
		return (Math.round(n)-n == 0) ? true : false;
	}
	for(var i=2;i<=Math.sqrt(num);i++){
		if(ii(num/i)) return false;
	}
	window._primes();
	return true;
};
(function(gl){
	gl._primes = function(){
		var p = [2];
		for(var i=0;i<1e4-1;i++){
			var g = p[p.length-1];
			g++;
			while(!Math.isPrime(g)){g++;}
			p.push(g);
		}
		function ii(n){
			return (Math.abs(Math.round(n)-n)<Math.dx) ? true : false;
		}
		gl.primes = p;
		function c(){
			gl.Math.isPrime = function(num){
				num = Math.floor(Math.abs(num));
				if(Math.abs(num)<=1) return false;
				var n = Math.sqrt(num);
				for(var i=0;i<n;i++){
					if(n>p[p.length-1]){
						if(ii(num/i)) return false;
					}else{
						if(ii(num/p[i]) && num != p[i]) return false;
					}
				}
				return true;
			};
		}
		c();
		for(var i=0;i<9e4;i++){
			var g = p[p.length-1];
			g++;
			while(!Math.isPrime(g)){g++;}
			p.push(g);
		}
		gl.primes = p;
		c();
	};
})(this);
function primeFactor(n){
	var i = 2;
	var factors = [];
	while(n>1){
		if(Math.isInt(n/i)){
			factors.push(i);
			n/=i;
		}else{
			i++;
			while(!Math.isPrime(i)) i++;
		}
	}
	return factors;
}
Math.roundToZero = function(n){
	return n>0 ? this.floor(n) : this.ceil(n); 
}
Math.roundAwayZero = function(n){
	return n>0 ? this.ceil(n) : this.floor(n);
}
Math.isInt = function(n){return (this.round(Number(n)) == Number(n));};
Math.change = function(num,a,b){
	var n1 = parseInt(num,a);
	return n1.toString(b);
};
function toHexColor(r,g,b,a = 255){
	var _a = arguments;
	if(r == undefined){
		return '#000000';
	}else if(g == undefined && r != undefined){
		if(typeof r == 'string'){
			return r;
		}else if(typeof r == 'number'){
			g = r;
			b = r;
			a = 255;
		}
	}else if(g != undefined && b == undefined && typeof _a[0] == 'number'&& typeof _a[1] == 'number'){
		var _g = g;
		g = r;
		b = r;
		a = _g;
	}
	r = constrain(r,0,255);
	g = constrain(g,0,255);
	b = constrain(b,0,255);
	a = constrain(a,0,255);
	function t0(n){
		var a0 = Math.change(n,10,16);
		if(n<16) a0 = "0"+a0;
		return a0;
	}
	return "#"+t0(r)+t0(g)+t0(b)+t0(a);
}
function mixColors(a, b, k){
	function toObj(str){
		str = str.substring(1,str.length);
		r = Math.change(str.substring(0,2), 16, 10);
		g = Math.change(str.substring(2,4), 16, 10);
		_b = Math.change(str.substring(4,6), 16, 10);
		if(str.length<7){
			a = 255;
		}else{
			a = Math.change(str.substring(6,8), 16, 10);
		}
		return {r: Number(r),g: Number(g),b: Number(_b),a: Number(a)};
	}
	var o1 = toObj(a), o2 = toObj(b);
	var diff = {
		r: o2.r-o1.r, 
		g: o2.g-o1.g, 
		b: o2.b-o1.b, 
		a: o2.a-o1.a, 
	};
	o1.r+=Math.roundAwayZero(diff.r*k), o1.g+=Math.roundAwayZero(diff.g*k), o1.b+=Math.roundAwayZero(diff.b*k), o1.a+=Math.roundAwayZero(diff.a*k);
	o2.r-=Math.roundAwayZero(diff.r*k), o2.g-=Math.roundAwayZero(diff.g*k), o2.b-=Math.roundAwayZero(diff.b*k), o2.a-=Math.roundAwayZero(diff.a*k);
	a3 = toHexColor(o1.r,o1.g,o1.b,o1.a);
	b3 = toHexColor(o2.r,o2.g,o2.b,o2.a);
	return {a:a3,b:b3};
}
function hexToNumber(str){
	if(str.length<9) str[7] = 'f', str[8] = 'f';
	return [str.substring(1,3), str.substring(3,5), str.substring(5,7), str.substring(7,9)];
}
function constrain(value, min, max){
	if(value<=min) return min;
	if(value>=max) return max;
	else return value;
}
function map(value, l1, h1, l2, h2) {
	return l2+(h2-l2)*(value-l1)/(h1-l1);
}
function dist(x1,y1,x2,y2){
	if(arguments.length == 2){
		return Math.sqrt(Math.pow(y1.x-x1.x,2)+Math.pow(y1.y-x1.y,2));
	}
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}
function randomFloat(a, b){
	return a+Math.random()*(b-a);
}
function Timer(){
	var a = arguments;
	this.createByArray(a);
}
Timer.prototype = {
	create: function(){
		var a = arguments;
		if(a.length%2 != 0){
			console.warn('An odd number of arguments');
			return;
		}
		for (var i = a.length - 1; i >= 1; i-=2) {
			this._c(a[i-1], a[i]);
		}
	},
	createByArray: function(arr){
		if(arr.length%2 != 0){
			console.warn('An odd number of values');
			return;
		}
		for (var i = arr.length - 1; i >= 1; i-=2) {
			this._c(arr[i-1], arr[i]);
		}
	},
	_c: function(a,b){
		if(this[a]) this[a].d = b;
		else this[a] = {t: 1, d: b};
	},
	is: function(a){
		return this[a].t == 0;
	},
	update: function(){
		for(var key in this){
			this[key].t = (this[key].t+1)%this[key].d;
		}
	}
};
function Point(x,y){
	if(!y && x instanceof Point){
		this.x = x.x;
		this.y = x.y;
	}else{
		this.x = x || 0;
		this.y = y || 0;
	}
	return this;
}
Object.assign(Point.prototype, {
	set: function(x,y){
		if(!y && x instanceof Point){
			this.x = x.x;
			this.y = x.y;
		}else{
			this.x = x || 0;
			this.y = y || 0;
		}
		return this;
	},
	_clone: function(){
		return new this.constructor(this.x,this.y);
	},
	scale: function(s){
		this.x*=s;
		this.y*=s;
		return this;
	},
	scale0: function(s){
		return Point.scale(this, s);
	},
	inverse: function(){
		return new Point(1/this.x,1/this.y);
	},
	minus: function(){
		return new Point(-this.x,-this.y);
	},
	dot: function(v){
		return this.x*v.x+this.y*v.y;
	},
	mul: function(v){
		this.x = this.x*v.x+this.y*v.y,
		this.y = this.x*v.y+this.y*v.x;
		return this;
	},
	add: function(v,w){
		if(w){
			this.x+=v;
			this.y+=w;
		}else{
			this.x+=v.x;
			this.y+=v.y;
		}
		return this;
	},
	sub: function(v,w){
		if(w){
			this.x-=v;
			this.y-=w;
		}else{
			this.x-=v.x;
			this.y-=v.y;
		}
		return this;
	},
	cross: function(v){
		return this.x*v.y-this.y*v.x;
	},
	floor: function(){
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	},
	round: function(){
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	},
	ceil: function(){
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		return this;
	},
	mag: function(){
		return Math.mag(this.x,this.y);
	},
	roundToZero: function(){
		this.x = (this.x<0) ? Math.ceil(this.x) : Math.floor(this.x);
		this.y = (this.y<0) ? Math.ceil(this.y) : Math.floor(this.y);
		return this;
	},
	normalize: function(){
		this.x/=this.mag();
		this.y/=this.mag();
		return this;
	},
	normalized: function(){
		var v = this._clone(), m = this.mag();
		v.x/=m;
		v.y/=m;
		return v;
	},
	angle: function(){
		var a = Math.atan2(this.y,this.x);
		if(a<0) a+=2*Math.PI;
		return a;
	},
	lerp: function(v,a){
		this.x = (v.x-this.x)*a;
		this.y = (v.y-this.y)*a;
		return this;
	},
	equals: function(v){
		return ((v.x == this.x) && (v.y == this.y));
	},
	rotate: function(a){
		var a0 = this.angle()+a;
		var m = this.mag();
		this.x = Math.cos(a0)*m;
		this.y = Math.sin(a0)*m;
		return this;
	},
	rotateAround: function(x,y,a){
		if(a == undefined && x instanceof Point){
			var p = x._clone();
			a = y;
			this.sub(p);
			this.rotate(a);
			this.add(p);
		}else{
			var p = new Point(x,y);
			this.sub(p);
			this.rotate(a);
			this.add(p);
		}
	},
	changeAxis: function(angle){
		var m = this.mag();
		var a0 = angle-this.angle();
		this.set(Point.polar(m, a0));
		return this;
	},
	isZero: function(){
		return this.x == 0 && this.y == 0;
	},
	random: function(a,b,c,d){
		if(c == undefined){
			if(a == undefined){
				this.x = randomFloat(-1,1);
				this.y = randomFloat(-1,1);
				return;
			}
			if(b == undefined){
				this.x = randomFloat(-a,a);
				this.y = randomFloat(-a,a);
				return;
			}
			this.x = randomFloat(a,b);
			this.y = randomFloat(a,b);
			return;
		}else{
			this.x = randomFloat(a,b);
			this.y = randomFloat(c,d);
			return;
		}
	},
	constrain: function(a,b,c,d){
		if(c == undefined){
			if(a == undefined){
				this.x = constrain(this.x,-1,1);
				this.y = constrain(this.y,-1,1);
				return;
			}
			if(b == undefined){
				a = Math.abs(a);
				var n = this.normalized().scale(a);
				if(this.mag()>a) this.x = n.x, this.y = n.y;
				return;
			}
			this.x = constrain(this.x,a,b);
			this.y = constrain(this.y,a,b);
			return;
		}else{
			this.x = constrain(this.x,a,b);
			this.y = constrain(this.y,c,d);
			return;
		}
	},
	get: function(p){
		this.x = p.x, this.y = p.y;
	}
});
Object.assign(Point, {
	add: function(){
		var p = new Point();
		for(var i=0;i<arguments.length;i++){p.add(arguments[i]);}
		return p;
	},
	sub: function(a,b){
		return new Point(a.x-b.x,a.y-b.y);
	},
	scale: function(a,s){
		var a = a._clone();
		a.scale(s);
		return a;
	},
	mult: function(a,b){
		var a = a._clone();
		a.mult(b);
		return a;
	},
	dot: function(a,b){
		return a.dot(b);
	},
	cross: function(a,b){
		return a.cross(b);
	},
	mag: function(a){
		return a.mag();
	},
	normalize: function(a){
		var b = a._clone();
		return b.normalize();
	},
	angle: function(v){
		return v.angle();
	},
	equals: function(a,b){
		return a.equals(b);
	},
	floor: function(a){
		return a._clone().floor();
	},
	round: function(a){
		return a._clone().round();
	},
	ceil: function(a){
		return a._clone().ceil();
	},
	inverse: function(a){
		return new Point(1/a.x,1/a.y);
	},
	minus: function(a){
		return new Point(-a.x,-a.y);
	},
	polar: function(r,a){
		return new Point(Math.cos(a)*r,Math.sin(a)*r);
	},
	random: function(a,b,c,d){
		var p = new Point();
		p.random(a,b,c,d);
		return p;
	}
});
function Draw(space){
	this.space = space;
	this.fillColor = "#ffffffff";
	this.strokeColor = "#000000ff";
	this.lineWidth = 1;

	this._fill = true;
	this._stroke = true;
	this._textSize = 21;
	this._font = "monospace";
	this._textAlign = "center";

	this.tas = [];
	this.rectAlign = "corner";
	this.d = this.space.getContext("2d");
	this.d0 = this.space.getContext("2d");
	this.d1 = false;
}
Object.assign(Draw.prototype, {
	noStroke: function(){
		this._stroke = false;
	},
	noFill: function(){
		this._fill = false;
	},
	strokeWeight: function(w){
		this.lineWidth = w;
	},
	rectMode: function(m){
		this.rectAlign = m;
	},
	textAlign: function(a){
		this._textAlign = a;
	},
	textSize: function(s){
		this._textSize = s;
	},
	font: function(f){
		this._font = f;
	},
	stroke: function(r,g,b,a){
		this._stroke = true;
		this.strokeColor = toHexColor(r, g, b, a);
	},
	fill: function(r,g,b,a){
		this._fill = true;
		this.fillColor = toHexColor(r, g, b, a);
	},
	strokeSetA: function(obj){
		function t0(n){
			var a0 = Math.change(n,10,16);
			if(n<16) a0 = "0"+a0;
			return a0;
		}
		if(typeof obj == 'string'){
			this.strokeColor[7] = obj[0] || "f";
			this.strokeColor[8] = obj[1] || "f";
		}else if(typeof obj == 'number'){
			obj = constrain(obj, 0, 255);
			var str = t0(obj);
			this.strokeColor[7] = str[0];
			this.strokeColor[8] = str[1];
		}else{
			console.log('What did you enter?');
		}
	},
	fillSetA: function(){
		// _clone of this.strokeSetA()
		function t0(n){
			var a0 = Math.change(n,10,16);
			if(n<16) a0 = "0"+a0;
			return a0;
		}
		if(typeof obj == 'string'){
			this.fillColor[7] = obj[0] || "f";
			this.fillColor[8] = obj[1] || "f";
		}else if(typeof obj == 'number'){
			obj = constrain(obj, 0, 255);
			var str = t0(obj);
			this.fillColor[7] = str[0];
			this.fillColor[8] = str[1];
		}else{
			console.log('What did you enter?');
		}
	},
	translate: function(x,y){
		if(!y && x instanceof Point){
			var _x = x.x;
			var _y = x.y;
		}else{
			var _x = x, _y = y;
		}
		var obj = {type: 'translate', x: _x, y: _y};
		var o1 = this.tas[this.tas.length-1];
		if(o1 && o1.type == 'translate' && o1.x == -obj.x && o1.y == -obj.y){
			this.tas.splice(this.tas.length-1, 1);
			return;
		}
		this.tas.push(obj);
	},
	rotate: function(a){
		var obj = {type: 'rotate', a: a};
		var o1 = this.tas[this.tas.length-1];
		if(o1 && o1.type == 'rotate' && o1.a == -obj.a){
			this.tas.splice(this.tas.length-1, 1);
			return;
		}
		this.tas.push(obj);
	},
	scale: function(x,y){
		if(y == undefined){
			y = x;
		}
		var obj = {type: 'scale', x: x, y: y};
		var o1 = this.tas[this.tas.length-1];
		if(o1 && o1.type == 'scale' && o1.x == 1/obj.x && o1.y == 1/obj.y){
			this.tas.splice(this.tas.length-1, 1);
			return;
		}
		this.tas.push(obj);
	},
	pop: function(){
		this.tas = [];
	},
	s0: function(){
		for(var i=0;i<this.tas.length;i++){
			if(this.tas[i].type == 'translate'){
				this.d.translate(this.tas[i].x, this.tas[i].y);
			}else if(this.tas[i].type == 'rotate'){
				this.d.rotate(this.tas[i].a);
			}else if(this.tas[i].type == 'scale'){
				this.d.scale(this.tas[i].x, this.tas[i].y);
			}
		}
	},
	f0: function(){
		for(var i=this.tas.length-1;i>=0;i--){
			if(this.tas[i].type == 'translate'){
				this.d.translate(-this.tas[i].x, -this.tas[i].y);
			}else if(this.tas[i].type == 'rotate'){
				this.d.rotate(-this.tas[i].a);
			}else if(this.tas[i].type == 'scale'){
				this.d.scale(1/this.tas[i].x, 1/this.tas[i].y);
			}
		}

	},
	s1: function(){
		for(var i=this.tas.length-1;i>=0;i--){
			if(this.tas[i].type == 'translate'){
				this.d0.translate(-this.tas[i].x, -this.tas[i].y);
			}else if(this.tas[i].type == 'rotate'){
				this.d0.rotate(-this.tas.a);
			}else if(this.tas[i].type == 'scale'){
				this.d0.scale(1/this.tas[i].x, 1/this.tas[i].y);
			}
		}
	},
	f1: function(){
		for(var i=this.tas.length-1;i>=0;i--){
			if(this.tas[i].type == 'translate'){
				this.d0.translate(-this.tas[i].x, -this.tas[i].y);
			}else if(this.tas[i].type == 'rotate'){
				this.d0.rotate(-this.tas.a);
			}else if(this.tas[i].type == 'scale'){
				this.d0.scale(1/this.tas[i].x, 1/this.tas[i].y);
			}
		}
	},
	line: function(x1,y1,x2,y2){
		d = this.space.getContext("2d");
		d.beginPath();
		this.s0();
		this.d.lineWidth = this.lineWidth;
		this.d.strokeStyle = this.strokeColor;
		if(arguments.length == 2 && x1 instanceof Point && y1 instanceof Point){
			d.moveTo(x1.x,x1.y);
			d.lineTo(y1.x,y1.y);
		}else{
			d.moveTo(x1,y1);
			d.lineTo(x2,y2);
		}
		if(this._stroke) d.stroke();
		this.f0();
	},
	rect: function(x,y,w,h,r){
		if(!r){
			if(!this._fill && this._stroke){
				this.d.beginPath();
				this.s0();
				this.d.strokeStyle = this.strokeColor;
				if(this.rectAlign == "center") this.d.translate(-w/2,-h/2);
				this.d.rect(x,y,w,h);
				if(this.rectAlign == "center") this.d.translate(w/2,h/2);
				this.d.stroke();
				this.f0();
			}
			if(!this._stroke && this._fill){
				this.d.beginPath();
				this.s0();
				if(this.rectAlign == "center") this.d.translate(-w/2,-h/2);
				this.d.fillStyle = this.fillColor;
				this.d.fillRect(x,y,w,h);
				this.d.stroke();
				if(this.rectAlign == "center") this.d.translate(w/2,h/2);
				this.f0();
			}
			if(this._stroke && this._fill){
				this.d.beginPath();
				this.s0();
				if(this.rectAlign == "center") this.d.translate(-w/2,-h/2);
				this.d.fillStyle = this.fillColor;
				this.d.strokeStyle = this.strokeColor;
				this.d.rect(x,y,w,h);
				this.d.fillRect(x,y,w,h);
				this.d.stroke();
				this.d.fill();
				if(this.rectAlign == "center") this.d.translate(w/2,h/2);
				this.f0();
			}
		}else if(r){
			this.d.beginPath();
			this.s0();
			if(this.rectAlign == "center") this.d.translate(-w/2,-h/2);
			this.d.moveTo(x+r, y);
			this.d.lineTo(x+w-r, y);
			this.d.quadraticCurveTo(x+w, y, x+w, y+r);
			this.d.lineTo(x+w, y+h-r);
			this.d.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
			this.d.lineTo(x+r,y+h);
			this.d.quadraticCurveTo(x, y+h, x, y+h-r);
			this.d.lineTo(x, y+r);
			this.d.quadraticCurveTo(x,y,x+r,y);
			this.d.lineWidth = this.lineWidth;
			this.d.fillStyle = this.fillColor;
			this.d.strokeStyle = this.strokeColor;
			if(this._stroke) this.d.stroke();
			if(this._fill) this.d.fill();
			if(this.rectAlign == "center") this.d.translate(w/2,h/2);
			this.f0();
		}
	},
	ellipse: function(x, y, w, h, a = 0, b = 2*Math.PI){
		this.d.beginPath();
		this.s0();
		this.d.ellipseMode = 'center';
		this.d.ellipse(x,y,w,h,0,a,b);
		this.d.lineWidth = this.lineWidth;
		this.d.fillStyle = this.fillColor;
		this.d.strokeStyle = this.strokeColor;
		if(this._stroke) this.d.stroke();
		if(this._fill) this.d.fill();
		this.f0();
	},
	triangle: function(x1,y1,x2,y2,x3,y3){
		this.d.beginPath();
		this.s0();
		this.d.lineWidth = this.lineWidth;
		this.d.strokeStyle = this.strokeColor;
		this.d.fillStyle = this.fillColor;
		this.d.moveTo(x1,y1); this.d.lineTo(x2,y2);
		this.d.moveTo(x2,y2); this.d.lineTo(x3,y3);
		this.d.moveTo(x3,y3); this.d.lineTo(x1,y1);
		if(this._stroke) this.d.stroke();
		if(this._fill) this.d.fill();
		this.f0();
	},
	quad: function(x1,y1,x2,y2,x3,y3,x4,y4){
		this.d.beginPath();
		this.s0();
		this.d.lineWidth = this.lineWidth;
		this.d.strokeStyle = this.strokeColor;
		this.d.fillStyle = this.fillColor;
		this.d.moveTo(x1,y1); this.d.lineTo(x2,y2);
		this.d.moveTo(x2,y2); this.d.lineTo(x3,y3);
		this.d.moveTo(x3,y3); this.d.lineTo(x4,y4);
		this.d.moveTo(x4,y4); this.d.lineTo(x1,y1);
		if(this._stroke) this.d.stroke();
		if(this._fill) this.d.fill();
		this.f0();
	},
	text: function(t,x,y){
		this.d.beginPath();
		this.s0();
		this.d.fillStyle = this.fillColor;
		this.d.textAlign = this._textAlign;
		this.d.font = this._textSize+"px "+this._font;
		if(arguments.length == 2){
			this.d.fillText(t, x.x, x.y);
		}else{
			this.d.fillText(t, x, y);
		}
		if(this._stroke) this.d.stroke();
		if(this._fill) this.d.fill();
		this.f0();
	},
	strokeText: function(t,x,y){
		this.d.beginPath();
		this.s0();
		this.d.strokeStyle = this.strokeColor;
		this.d.textAlign = this._textAlign;
		this.d.font = this._textSize+"px "+this._font;
		if(arguments.length == 2){
			this.d.fillText(t, x.x, x.y);
		}else{
			this.d.strokeText(t, x, y);
		}
		if(this._stroke) this.d.stroke();
		this.f0();
	},
	beginShape: function(){
		this.d0.beginPath();
		this.s1();
		this.d1 = false;
	},
	vertex: function(x,y){
		if(!y && x instanceof Point){
			var _x = x;
			var y = _x.y;
			var x = _x.x;
		}
		if(this.d1){
			this.d0.moveTo(this.last.x,this.last.y);
			this.d0.lineTo(x,y);
			this.last = new Point(x,y);
		}else{
			this.d0.moveTo(x,y);
			this.d1 = true;
			this.last = new Point(x,y);
		}
	},
	endShape: function(){
		this.d0.lineWidth = this.lineWidth;
		this.d0.strokeStyle = this.strokeColor;
		this.d0.fillStyle = this.fillColor;
		if(this._stroke) this.d.stroke();
		if(this._fill) this.d.fill();
		this.f1();
		this.d1 = false;
	}
});
function Button(x,y,w,h,t,f){
	this.p = new Point(x, y);
	this.d = new Point(w, h);
	this.v = new Point();
	this.t = t || 'new Button';
	this.f = f;
	this.a = 1;
	this.ac = 0;
	this.c = '#00ddeeff';
	window.addEventListener('mousedown', this.f, false);
}
Button.prototype = {
	in: function(x,y){
		if(x instanceof Point){
			var _p = x._clone();
		}else{
			var _p = new Point(x,y);
		}
		_p.rotateAround(this.p, -this.a);
		return _p.x>this.p.x-this.d.x/2 && 
			_p.x<this.p.x+this.d.x/2 && 
			_p.y>this.p.y-this.d.y/2 &&
			_p.y<this.p.y+this.d.y/2;
	},
	change: function(f){
		window.removeEventListener('mousedown', this.f, false);
		this.f = f;
		window.addEventListener('mousedown', f, false);
	},
	update: function(){
		this.p.add(this.v);
		this.a+=this.ac;
	},
	draw: function(tool){
		tool.fill(this.c);
		tool.stroke(0);
		tool.rectMode('center');
		tool.translate(this.p);
		tool.rotate(this.a);
		tool.rect(0,0,this.d.x,this.d.y,6);
		tool.fill(0);
		var s = this.d.x*this.t.length*1/20>this.d.y ? this.d.y/this.t.length*7 : this.d.x/5.5;
		tool.textSize(s*0.9);
		tool.text(this.t,0,this.d.x/20);
		tool.pop();
	},
	run: function(tool){
		this.update();
		this.draw(tool);
	}
};
function SlideShow(space, tool){
	if(arguments.length<2){
		throw new Error('Need 2 parameters for constructing a SlideShow,  but '+arguments.length+' is present');
	}
	this.slides = [];
	this.page = 0;
	this.move = function(){
		this.page++;
	};
	this.running = false;
	this.finished = false;
	this.tool = tool;
	var move = this.move, running = this.running;
	function run(event){
	}
	this.transStyles = [];
}
SlideShow.transitionsStyles = {
	fade: function(){
	},
	squares: function(){
	},
	shuffle: function(){
	},
	zoom: function(){
	},
};
Object.assign(SlideShow.prototype, {
	draw: function(index){
		this.slides[index](this.tool);
	},
	run: function(){
		this.running = true;
		this.draw(this.page);
	}
});



(function(global){
	global.initSpace = function(){
		var a = arguments;
		var space = createCanvas();
		const ww = space.width, hh = space.height;
		var tool = new Draw(space);
		var center = new Point(ww/2, hh/2);
		var mouse = new Point(center);
		var timer = new Timer();
		var g = [
			'space', 
			'ww', 
			'hh', 
			'tool', 
			'center', 
			'mouse', 
			'timer',
		];
		for(var i=0;i<g.length;i++){
			global[g[i]] = eval(g[i]);
		}
		function f(e){
			mouse.set(e.offsetX, e.offsetY);
		}
		space.addEventListener('mousemove', f, false);
	};
	global.pointMouse = function(){
		tool.noStroke();
		tool.fill(255,144,0);
		tool.ellipse(mouse.x,mouse.y,2.5,2.5);
	};
	global.pauseButton = function(varName = 'pause'){
		global[varName] = false;
		var butt = document.createElement('button');
		butt.onclick = function(e){
			global[varName] = !global[varName];
		};
		butt.innerHTML = 'Pause';
		butt.style.textAlign = 'center';
		document.body.appendChild(butt);
	};
	global.background = function(a,b,c,d){
		tool.noStroke();
		tool.fill(a,b,c,d);
		tool.rectMode('');
		tool.rect(0,0,ww,hh);
	};
	global.key = function(){
		global.keys = {};
		function f1(e){
			keys[e.key] = true;
		}
		function f2(e){
			keys[e.key] = false;
		}
		window.addEventListener('keydown', f1, false);
		window.addEventListener('keyup', f2, false);
	};
})(this);