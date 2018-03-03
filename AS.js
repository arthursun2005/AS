function createCanvas(id, w = window.innerWidth, h = window.innerHeight){
	if(!id){
		throw new Error("Please enter an id in createCanvas()");
		return;
	}
	if(arguments.length == 2){
		w = window.innerWidth*arguments[1];
		h = window.innerHeight*arguments[1];
	}
	var ele = document.createElement("canvas");
	ele.style = "width: "+w+"px;height: "+h+"px;border: 1px dashed;position: absolute;margin: 5%";
	ele.id = id;
	document.body.appendChild(ele);
}
createCanvas("example",3/4);
function poly(){
	var a = arguments;
	function f(x){
		var value = 0;
		for(var i=0;i<a.length;i++) value+=Math.pow(x,i)*a[i];
		return value;
	}
	return f;
}
Math.Area = {
	triangle: function(a,b,c){
		var s = (a+b+c)/2;
		return Math.sqrt(s*(s-a)*(s-b)*(s-c));
	},
	ellipse: function(a,b){
		return a*b*Math.PI;
	},
	rect: function(w,h){
		return w*h;
	}
};
Math.Volume = {
	cuboid: function(a,b,c){
		return a*b*c;
	},
	sphere: function(){
		if(a && b && c){return a*b*c*Math.PI*4/3;
		}else if(a && b){return a*a*b*Math.PI*4/3;
		}else{return a*a*a*Math.PI*4/3;}
	}
};
Math.dx = 1e-6;
Math.integral = function(f,a,b){
	var sum = 0;
	for(var i=a;i<b;i+=this.dx) sum+=this.dx*f(i);
	return sum;
};
Math.mag = function(x,y){return this.sqrt(x*x+y*y);};
Math.sum = function(a,b,e) {
	var num = 0;
	for(var i=a;i<b;i++){num+=eval(e);}
	return num;
};
const letters = [
	"A","B","C","D","E",
	"F","G","H","I","J",
	"K","L","M","N","O",
	"P","Q","R","S","T",
	"U","V","W","X","Y",
	"Z"
];
Math.isInt = function(n){return (this.round(Number(n)) == n);};
Math.change = function(num,a,b){
	var n1 = parseInt(num,a);
	return n1.toString(b);
};
function toHexColor(r,g,b,a = 255){
	function t0(n){
		var a = Math.change(n,10,16);
		if(n<16) a = "0"+a;
		return a;
	}
	return "#"+t0(r)+t0(g)+t0(b)+t0(a);
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
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}
function randomFloat(a, b){
	return a+Math.random()*(b-a);
}
function Point(x,y){
	this.x = x || 0;
	this.y = y || 0;
	return this;
}
Object.assign(Point.prototype, {
	set: function(x,y){
		this.x = x || 0;
		this.y = y || 0;
		return this;
	},
	copy: function(){
		return new this.constructor(this.x,this.y);
	},
	scale: function(s){
		this.x*=s;
		this.y*=s;
		return this;
	},
	inverse: function(){
		return new Point(1/this.x,1/this.y);
	},
	dot: function(v){
		return this.x*v.x+this.y*v.y;
	},
	mult: function(v){
		this.x = this.x*v.x-this.y*v.y,
		this.y = this.x*v.y+this.y*v.x;
		return this;
	},
	add: function(v){
		this.x+=v.x;
		this.y+=v.y;
		return this;
	},
	sub: function(v){
		this.x-=v.x;
		this.y-=v.y;
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
		return ((v.x === this.x) && (v.y === this.y));
	},
	rotate: function(a){
		var a0 = this.angle()+a;
		this.x = Math.cos(a0)*this.mag();
		this.y = Math.sin(a0)*this.mag();
		return this;
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
		var a = a.copy();
		a.scale(s);
		return a;
	},
	mult: function(a,b){
		var a = a.copy();
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
		var b = a.copy();
		return b.normalize();
	},
	angle: function(v){
		return v.angle();
	},
	equals: function(a,b){
		return a.equals(b);
	}
});
function Draw(space){
	this.space = space;
	this.fillColor = "#ffffffff";
	this.strokeColor = "#000000ff";
	this.lineWidth = 1;
	this.fill = true;
	this.stroke = true;

	this._textSize = 21;
	this._font = "monospace";
	this._textAlign = "center";

	this.mx = 0;
	this.my = 0;
	this.a = 0;
	this.s = 1;
	this.rectAlign = "corner";
	this.d = this.space.getContext("2d");
	this.d0 = this.space.getContext("2d");
	this.d1 = false;
}
Object.assign(Draw.prototype, {
	noStroke: function(){
		this.stroke = false
	},
	noFill: function(){
		this.stroke = false
	},
	strokeWeight: function(w){
		this.lineWidth = strokeWeight;
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
		this.strokeColor = toHexColor(r,g,b,a);
	},
	fill: function(r,g,b,a){
		this.fillColor = toHexColor(r,g,b,a);
	},
	translate: function(x,y){
		this.mx+=x;
		this.my+=y;
	},
	rotate: function(a){
		this.a+=a;
	},
	scale: function(s){
		this.s*=s;
	},
	s0: function(){
		this.d.translate(this.mx,this.my);
		this.d.rotate(this.a);
		this.d.scale(this.s);
	},
	f0: function(){
		this.d.scale(1/this.s);
		this.d.rotate(-this.a);
		this.d.translate(-this.mx,-this.my);
	},
	s1: function(){
		this.d0.translate(this.mx,this.my);
		this.d0.rotate(this.a);
		this.d0.scale(this.s);
	},
	f1: function(){
		this.d0.scale(1/this.s);
		this.d0.rotate(-this.a);
		this.d0.translate(-this.mx,-this.my);
	},
	reset: function(){
		this.mx = 0;
		this.my = 0;
		this.a = 0;
		this.s = 1;
	},
	line: function(x1,y1,x2,y2){
		this.d.beginPath();
		this.s0();
		this.d.lineWidth = this.lineWidth;
		this.d.strokeStyle = this.strokeColor;
		this.d.moveTo(x1,y1);
		this.d.lineTo(x2,y2);
		if(this.stroke) this.d.stroke();
		this.f0();
	},
	rect: function(x,y,w,h,r){
		if(!r){
			if(!this.fill && this.stroke){
				this.d.beginPath();
				if(this.rectAlign == "center") this.d.translate(-w/2,-h/2);
				this.s0();
				this.d.strokeStyle = this.strokeColor;
				this.d.rect(x,y,w,h);
				this.d.stroke();
				this.f0();
				if(this.rectAlign == "center") this.d.translate(w/2,h/2);
			}
			if(!this.stroke && this.fill){
				this.d.beginPath();
				if(this.rectAlign == "center") this.d.translate(-w/2,-h/2);
				this.s0();
				this.d.fillStyle = this.fillColor;
				this.d.fillRect(x,y,w,h);
				this.d.stroke();
				this.f0();
				if(this.rectAlign == "center") this.d.translate(w/2,h/2);
			}
			if(this.stroke && this.fill){
				this.d.beginPath();
				if(this.rectAlign == "center") this.d.translate(-w/2,-h/2);
				this.s0();
				this.d.fillStyle = this.fillColor;
				this.d.strokeStyle = this.strokeColor;
				this.d.rect(x,y,w,h);
				this.d.fillRect(x,y,w,h);
				this.d.stroke();
				this.d.fill();
				this.f0();
				if(this.rectAlign == "center") this.d.translate(w/2,h/2);
			}
		}else if(r){
			this.d.beginPath();
			if(this.rectAlign == "center") this.d.translate(-w/2,-h/2);
			this.s0();
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
			if(this.stroke) this.d.stroke();
			if(this.fill) this.d.fill();
			this.f0();
			if(this.rectAlign == "center") this.d.translate(w/2,h/2);
		}
	},
	ellipse: function(x, y, w, h, a = 0, b = 2*Math.PI){
		this.d.beginPath();
		this.s0();
		this.d.ellipse(x,y,w,h,0,a,b);
		this.d.lineWidth = this.lineWidth;
		this.d.fillStyle = this.fillColor;
		this.d.strokeStyle = this.strokeColor;
		if(this.stroke) this.d.stroke();
		if(this.fill) this.d.fill();
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
		if(this.stroke) this.d.stroke();
		if(this.fill) this.d.fill();
		this.f0();
	},
	text: function(t,x,y){
		this.d.beginPath();
		this.s0();
		this.d.fillStyle = this.fillColor;
		d.textAlign = this._textAlign;
		d.font = this._font+" "+this._textSize;
		d.fillText(t, x, y);
		if(this.stroke) this.d.stroke();
		if(this.fill) this.d.fill();
		this.f0();
	},
	strokeText: function(t,x,y){
		this.d.beginPath();
		this.s0();
		this.d.strokeStyle = this.strokeColor;
		d.textAlign = this._textAlign;
		d.font = this._font+" "+this._textSize;
		d.strokeText(t, x, y);
		if(this.stroke) this.d.stroke();
		if(this.fill) this.d.fill();
		this.f0();
	},
	beginShape: function(){
		this.d0.beginPath();
		this.s1();
	},
	vertex: function(x,y){
		if(this.d1){
			this.d.lineTo(x,y);
		}else{
			this.d.moveTo(x,y);
			this.d1 = true;
			this.start = new Point(x,y);
		}
	},
	endShape: function(){
		this.d.moveTo(this.start.x,this.start.y);
		if(!this.d1) return;
		this.d0.lineWidth = this.lineWidth;
		this.d0.strokeStyle = this.strokeColor;
		this.d0.fillStyle = this.fillColor;
		if(this.stroke) this.d.stroke();
		if(this.fill) this.d.fill();
		this.f1();
		this.dl = false;
	}
});
const Geometry = {};
const Physics = {};
Object.assign(Geometry, {
	pointsOnLine: function(x1,y1,x2,y2,s = 1){
		var points = [];
		var p1 = new Point(x1,y1), p2 = new Point(x2,y2);
		var d = Point.sub(p2,p1), m = d.mag(), a = d.angle();
		for(var i=0;i<=m;i+=s) points.push(new Point(Math.cos(a)*i+p1.x,Math.sin(a)*i+p1.y));
		return points;
	},
	pointsOnCircle: function(x,y,r,d = 1){
		var points = [];
		var a = d/r;
		for(var _a = 0; _a<2*Math.PI;_a+=a){
			points.push(new Point(Math.cos(_a)*r+x,Math.sin(_a)*r+y));
		}
		return points;
	},
	pointsOnFunction: function(f,a,b,dx = 1){
		var points = [];
		for(var i=a;i<b;i+=dx){
			points.push(new Point(i,f(i)));
		}
		return points;
	},
	Graph: function(){}
});
Geometry.Graph.constructor = function(x,y){
	this.origin = new Point(x,y);
	this.isComplexPlane = false;
	this.drawNumbers = true;
	this.numberScale = 1;
	this.numbersColor = "#000000";
	this.drawGridLines = true;
	this.gridLinesColor = "#333333";
	this.axisData = {
		x: {
			scale: 1,
			color: "#000000",
			draw: true,
			spacing: 10,
			start: -100,
			end: 100
		},
		y: {
			scale: 1,
			color: "#000000",
			draw: true,
			spacing: 10,
			start: -100,
			end: 100
		}
	};
}
Object.assign(Geometry.Graph.prototype, {
	draw: function(){
	}
});
Object.assign(Physics, {
	Particle: function(){},
	ParticleGroup: function(){},
	ParticleSystem: function(){},
	Obj: function(){}
});
Physics.Particle.constructor = function(x,y){
	this.p = new Point(x,y);
	this.v = new Point();
	this.age = 0;
	this.lifeTime = 0;
	this.fixed = false;
};
Object.assign(Physics.Particle.prototype, {
	update: function(){
		if(!this.fixed) this.p.add(this.v);
		this.age++;
	}
});
Physics.ParticleGroup.constructor = function(){
	this.forces = {
		viscous: 0.2,
		pressure: 0.3,
		repulsion: 1.0,
		elastic: 0,
		tensile: 0,
		powder: 0
	};
	this.powder = false;
	this.w1 = 0.9;
};
Object.assign(Physics.ParticleGroup.prototype, {
});
Physics.ParticleSystem.constructor = function(){
	this.w0 = 0.7;
	this.GroupList = [];
};
Object.assign(Physics.ParticleSystem.prototype, {
});
Physics.Obj.constructor = function(){
	this.vertexs = [];
};
Object.assign(Physics.Obj.prototype, {
});
function SlideShow(){
	this.slides = [];
}
Object.assign(SlideShow.prototype, {
});