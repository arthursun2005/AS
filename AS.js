document.body.style.textAlign = "center";
function createCanvas(id, w = window.innerWidth, h = window.innerHeight, sl){
	if(!id){
		throw new Error("Please enter an id in createCanvas()");
		return;
	}
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
}
function Poly(){
	var a = arguments;
	if(a.length%2 != 0){
		var massage = "Invalid use of Poly()"+"\nEnter an even number of arguments, the function will return a new function. \n\tPoly(a,b,c,d) will return \n\nfunction(x){\n\treturn a*Math.pow(x,b)+c*Math.pow(x,d)\n}";
		throw new Error(massage);
	}
	function f(x){
		var value = 0;
		for(var i=0;i<a.length-1;i+=2){
			value+=Math.pow(x,a[i+1])*a[i];
		}
		if(x == "info"){
			return a;
		}
		return value;
	}
	return f;
}
function isArray(obj){
	if(typeof obj == "object" && (obj.length || typeof obj.push == "function")){
		return true;
	}else{
		return false;
	}
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
Math.mag = function(x,y){
	return this.pow(x*x+y*y,1/2);
};
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
	minus: function(){
		return new Point(-this.x,-this.y);
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
		var m = this.mag();
		this.x = Math.cos(a0)*m;
		this.y = Math.sin(a0)*m;
		return this;
	},
	rotateAround: function(x,y,a){
		if(arguments.length == 2 && x instanceof Point){
			var p = x.copy();
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
		this.x = Math.cos(a0)*m;
		this.y = Math.sin(a0)*m;
		return this;
	},
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
	},
	floor: function(a){
		return a.copy().floor();
	},
	round: function(a){
		return a.copy().round();
	},
	ceil: function(a){
		return a.copy().ceil();
	},
	inverse: function(a){
		return new Point(1/a.x,1/a.y);
	},
	minus: function(a){
		return new Point(-a.x,-a.y);
	},
	polar: function(r,a){
		return new Point(Math.cos(a)*r,Math.sin(a)*r);
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

	this.mx = 0;
	this.my = 0;
	this.a = 0;
	this.sx = 1;
	this.sy = 1;
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
		if(typeof r == "string"){
			this.strokeColor = r;
			return;
		}
		this.strokeColor = toHexColor(r,g,b,a);
	},
	fill: function(r,g,b,a){
		this._fill = true;
		if(typeof r == "string"){
			this.fillColor = r;
			return;
		}
		this.fillColor = toHexColor(r,g,b,a);
	},
	translate: function(x,y){
		if(!y){
			try{
				this.mx+=x.x;
				this.my+=x.y;
			}catch(e){
				throw e;
			}
		}else{
			this.mx+=x;
			this.my+=y;
		}
	},
	rotate: function(a){
		this.a+=a;
	},
	scale: function(sx,sy){
		if(!sy){
			this.sx*=sx;
			this.sy*=sx;
			return
		}
		this.sx*=sx;
		this.sy*=sy;
	},
	s0: function(){
		this.d.translate(this.mx,this.my);
		this.d.rotate(this.a);
		this.d.scale(this.sx,this.sy);
	},
	f0: function(){
		this.d.scale(1/this.sx,1/this.sy);
		this.d.rotate(-this.a);
		this.d.translate(-this.mx,-this.my);
	},
	s1: function(){
		this.d0.translate(this.mx,this.my);
		this.d0.rotate(this.a);
		this.d0.scale(this.sx,this.sy);
	},
	f1: function(){
		this.d0.scale(1/this.sx,1/this.sy);
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
				if(this.rectAlign == "center") this.d.translate(-w/2,-h/2);
				this.s0();
				this.d.strokeStyle = this.strokeColor;
				this.d.rect(x,y,w,h);
				this.d.stroke();
				this.f0();
				if(this.rectAlign == "center") this.d.translate(w/2,h/2);
			}
			if(!this._stroke && this._fill){
				this.d.beginPath();
				if(this.rectAlign == "center") this.d.translate(-w/2,-h/2);
				this.s0();
				this.d.fillStyle = this.fillColor;
				this.d.fillRect(x,y,w,h);
				this.d.stroke();
				this.f0();
				if(this.rectAlign == "center") this.d.translate(w/2,h/2);
			}
			if(this._stroke && this._fill){
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
			if(this._stroke) this.d.stroke();
			if(this._fill) this.d.fill();
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
var Geometry = {};
var Physics = {};
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
	Graph: function(){},
	Line: function(){}
});
Geometry.Graph = function(x,y,f){
	if(typeof x == "object"){
		this.origin = x.copy();
		this.f = y;
	}else{
		this.origin = new Point(x,y);
		this.f = f;
	}
	this.isComplexPlane = false;
	this.drawNumbers = true;
	this.numberScale = 1/40;
	this.rotation = 0;
	this.numbersColor = "#007700";
	this.font = "monospace";
	this.drawGridLines = true;
	this.gridLinesWeight = 1;
	this.gridLinesColor = "#00000055";
	this.graphLineColor = "#ff00ff";
	this.normal = false;
	this._background = null;
	this.axisData = {
		x: {
			scale: 1,
			color: "#ff0000",
			draw: true,
			spacing: 40,
			start: -300,
			end: 300,
			weight: 1
		},
		y: {
			scale: 1,
			color: "#0000ff",
			draw: true,
			spacing: 40,
			start: -300,
			end: 300,
			weight: 1
		}
	};
	this.dx = 2.5;
};
Object.assign(Geometry.Graph.prototype, {
	background: function(r,g,b,a){
		if(typeof r == "string"){
			this._background = r;
			return;
		}
		this._background = toHexColor(r,g,b,a);
	},
	graph: function(d){
		var ad = this.axisData;
		d.translate(this.origin);
		d.rotate(this.rotation);
		d.scale(ad.x.scale,ad.y.scale);
		d.beginShape();
		d.noFill();
		d.stroke(this.graphLineColor);
		for(var x=ad.x.start;x<ad.x.end;x+=this.dx){
			var v = x*this.numberScale;
			var y = this.f(v)/this.numberScale;
			if(this.normal) y*=-1;
			d.vertex(v/this.numberScale,y);
		}
		d.endShape();
		d.scale(1/ad.x.scale,1/ad.y.scale);
		d.rotate(-this.rotation);
		d.translate(this.origin.minus());
	},
	draw: function(d){
		if(this.isComplexPlane) this.normal = true;
		var ad = this.axisData;
		d.translate(this.origin);
		d.rotate(this.rotation);
		d.scale(ad.x.scale,ad.y.scale);
		if(this._background){
			d.noStroke();
			d.fill(this._background);
			d.rect(ad.x.start,ad.y.start,ad.x.end-ad.x.start,ad.y.end-ad.y.start);
		}
		if(ad.x.draw){
			d.strokeWeight(ad.x.weight);
			d.stroke(ad.x.color);
			d.line(ad.x.start,0,ad.x.end,0);
		}
		if(ad.y.draw){
			d.strokeWeight(ad.y.weight);
			d.stroke(ad.y.color);
			d.line(0,ad.y.start,0,ad.y.end);
		}
		if(this.drawNumbers){
			var size;
			d.fill(this.numbersColor);
			d.font(this.font);
			d.textAlign("center");
			var c0 = 22, c1 = 1.75;
			for(var i=0;i<ad.x.end;i+=ad.x.spacing){
				var value = (i*this.numberScale).toFixed(2);
				value*=1;
				size = ad.x.spacing/(Math.pow(value.toString().length,1/2)*c1);
				d.textSize(size);
				var pos = new Point(i, 15);
				if(i == 0) pos.x-=10;
				d.text(value,pos);
			}
			for(var i=-ad.x.spacing;i>ad.x.start;i-=ad.x.spacing){
				var value = (i*this.numberScale).toFixed(2);
				value*=1;
				size = ad.x.spacing/(Math.pow(value.toString().length,1/2)*c1);
				d.textSize(size);
				var pos = new Point(i, 15);
				d.text(value,pos);
			}
			for(var i=ad.y.spacing;i<ad.y.end;i+=ad.y.spacing){
				var pos = new Point(-15,i);
				var value = (i*this.numberScale).toFixed(2);
				if(this.normal) value*=-1;
				size = ad.y.spacing/(Math.pow(value.toString().length,1/2)*c1);
				if(this.isComplexPlane) value+="i";
				d.textSize(size);
				d.text(value,pos);
			}
			for(var i=-ad.y.spacing;i>ad.y.start;i-=ad.y.spacing){
				var pos = new Point(-15,i);
				var value = (i*this.numberScale).toFixed(2);
				if(this.normal) value*=-1;
				size = ad.y.spacing/(Math.pow(value.toString().length,1/2)*c1);
				if(this.isComplexPlane) value+="i";
				d.textSize(size);
				d.text(value,pos);
			}
		}
		if(this.drawGridLines){
			d.stroke(this.gridLinesColor);
			for(var i=ad.x.spacing;i<ad.x.end;i+=ad.x.spacing){
				d.line(i,ad.y.start,i,ad.y.end);
			}
			for(var i=-ad.x.spacing;i>ad.x.start;i-=ad.x.spacing){
				d.line(i,ad.y.start,i,ad.y.end);
			}
			for(var i=ad.y.spacing;i<ad.y.end;i+=ad.y.spacing){
				d.line(ad.x.start,i,ad.x.end,i);
			}
			for(var i=-ad.y.spacing;i>ad.y.start;i-=ad.y.spacing){
				d.line(ad.x.start,i,ad.x.end,i);
			}
		}
		d.scale(1/ad.x.scale,1/ad.y.scale);
		d.rotate(-this.rotation);
		d.translate(this.origin.minus());
		this.graph(d);
	},
	int: function(a,b){
		var start, finish;
		var al = arguments.length;
		if(al == 0){
			start = this.axisData.x.start;
			finish = this.axisData.y.finish;
		}else if(al == 1){
			start = -a;
			finish = a;
		}else if(al == 2){
			start = a;
			finish = b;
		}
		return Math.integral(this.f,start,finish);
	},
	average: function(a,b){
		var start, finish;
		var al = arguments.length;
		if(al == 0){
			start = this.axisData.x.start;
			finish = this.axisData.y.finish;
		}else if(al == 1){
			start = -a;
			finish = a;
		}else if(al == 2){
			start = a;
			finish = b;
		}
		return this.int(start,finish)/(finish-start);
	}
});
Geometry.Line = function(){
	var a = arguments;
	if(a.length == 2){
		this.p1 = a[0].copy();
		this.p2 = a[1].copy();
	}else if(a.length == 4){
		this.p1 = new Point(a[0],a[1]);
		this.p2 = new Point(a[2],a[3]);
	}
	if(a.length == 1 || a.length == 3 || a.length > 4){
		throw new Error('Not understood for construction of Geometry.Line()');
	}
};
Object.assign(Geometry.Line.prototype, {
	angle: function(){
		return Point.sub(this.p2,this.p1).angle();
	},
	length: function(){
		return dist(this.p1,this.p2);
	},
	draw: function(){
		d.strokeWeight(1);
		d.stroke(255,0,255);
		d.line(this.p1,this.p2);
	},
	center: function(){
		var p = Point.add(this.p1,this.p2);
		return Point.scale(p,1/2);
	},
	rotateAroundP1: function(a){
		p2.sub(p1);
		p2.rotate(a);
		p2.add(p1);
	},
	rotateAroundCenter: function(a){
		p2.sub(this.center());
		p1.sub(this.center());
		p2.rotate(a);
		p1.rotate(a);
		p2.add(this.center());
		p1.add(this.center());
	},
	rotateAroundP2: function(a){
		p1.sub(p2);
		p1.rotate(a);
		p1.add(p2);
	}
});
Object.assign(Physics, {
	Particle: function(){},
	ParticleGroup: function(){},
	ParticleSystem: function(){},
	Obj: function(){}
});
Physics.Particle = function(x,y){
	this.p = new Point(x,y);
	this.v = new Point();
	this.age = 0;
	this.lifeTime = 0;
	this.fixed = false;
	this.group = null;
	this.r = null;
	this.weight = 0;
	this.pressure = 0;
};
Physics.Particle.prototype.draw = function(){
	throw new Error('Use Physics.ParticleGroup.prototype.draw or Physics.ParticleSystem.prototype.draw instead');
};
Physics.Particle.prototype.update = function(){
	if(!this.fixed) this.p.add(this.v);
	this.age++;
};
Physics.Particle.prototype.copy = function(){
	var p = new this.constructor(this.p.x,this.p.y);
	p.age = this.age;
	p.fixed = this.fixed;
	p.lifeTime = this.lifeTime;
	p.v = this.v.copy();
	p.group = this.group;
	return p;
};
Physics.ParticleGroup = function(){
	this.forces = {
		viscous: 0.2,
		elastic: 0,
		tensile: 0,
		powder: 0
	};
	this.system = null;
	this.powderParticles = false;
	this.w1 = 0.9;
	this.ps = [];
	this.rs = 2;
	this.c = "#ffffff84";
};
Object.assign(Physics.ParticleGroup.prototype, {
	addParticle: function(p){
		this.ps.push(p);
		p.r = this.rs;
		p.group = this;
	},
	changeColor: function(r,g,b,a){
		if(typeof r == "string"){
			this.c = r;
			return;
		}
		this.c = toHexColor(r,g,b,a);
	},
	draw: function(d){
		for (var i = this.ps.length - 1; i >= 0; i--) {
			var p = this.ps[i];
			p.r = this.rs;
			d.translate(p.p);
			d.noStroke();
			d.fill(this.c);
			d.ellipse(0,0,this.rs,this.rs);
			d.translate(p.p.minus());
		}
	},
	cal: function(weight){
		return Math.max(0,weight-this.w1);
	}
});
Physics.ParticleSystem = function(){
	this.w0 = 0.7;
	this.GroupLists = [];
	this.maxRadius = null;
	this.all = [];
	this.ps = [];
	this.forces = {
		pressure: 0.2,
		repulsion: 1
	}
};
Object.assign(Physics.ParticleSystem.prototype, {
	split: function(){
		this.ps = [];
		for (var i = this.GroupLists.length - 1; i >= 0; i--) {
			var g = this.GroupLists[i];
			for (var j = g.ps.length - 1; j >= 0; j--){
				this.ps.push(g.ps[j]);
			}
		}
	},
	_ps: function(){
		var arr = [];
		for (var i = this.ps.length - 1; i >= 0; i--) arr[i] = this.ps[i].copy();
		return arr;
	},
	getMaxRadius: function(){
		this.maxRadius = (this.GroupLists.sort(function(a,b){b.rs-a.rs})[0]).rs;
	},
	addGroup: function(g){
		this.GroupLists.push(g);
		this.split();
		this.getMaxRadius();
	},
	sort: function(){
		var all = this.all;
		var ps = this.ps;
		var maxD = this.maxRadius*2;
		var minP = ps[0].p.copy();
		for (var i = ps.length - 1; i >= 1; i--) {
			if(ps[i].p.x<minP.x) minP.x = ps[i].p.x;
			if(ps[i].p.y<minP.y) minP.y = ps[i].p.y;
		}
		for (var i = ps.length - 1; i >= 0; i--) {
			var p = ps[i];
			var x = Math.floor((p.p.x-minP.x)/maxD),
				y = Math.floor((p.p.y-minP.y)/maxD);
			if(!all[y]) all[y] = [];
			if(!all[y][x]) all[y][x] = [];
			all[y][x].push({obj: p, id: i});
		}
	},
	solve: function(){
		var obj, p2, D, d, n, m;
		var all = this.all;
		var ps = this.ps;
		var maxD = this.maxRadius*2;
		var cop = this._ps();
		for (var i = ps.length - 1; i >= 0; i--) {
			var p1 = ps[i];
			var fx = Math.floor((p1.p.x-minP.x+maxD/2)/maxD);
			var fy = Math.floor((p1.p.y-minP.y+maxD/2)/maxD);
			for(var y=fy;y<=fy+1;y++){
			if(!all[y]) continue;
			for(var x=fx;x<=fx+1;x++){
			if(!all[y][x] || (y == fy && x == fx)) continue;
				for (var j = all[y][x].length - 1; j >= 0; j--) {
					obj = all[y][x][j];
					p2 = obj.obj;
					D = p1.r+p2.r;
					d = Point.sub(p2.p,p1.p);
					m = d.mag();
					if(m<D){
						var weight = 1-m/D;
						p1.weight+=weight;
						p2.weight+=weight;
					}
				}
			}}
		}
		for (var i = ps.length - 1; i >= 0; i--) {
			var p1 = ps[i];
			var fx = Math.floor((p1.p.x-minP.x+maxD/2)/maxD);
			var fy = Math.floor((p1.p.y-minP.y+maxD/2)/maxD);
			for(var y=fy;y<=fy+1;y++){
			if(!all[y]) continue;
			for(var x=fx;x<=fx+1;x++){
			if(!all[y][x] || (y == fy && x == fx)) continue;
				for (var j = all[y][x].length - 1; j >= 0; j--) {
					obj = all[y][x][j];
					p2 = obj.obj;
					D = p1.r+p2.r;
					d = Point.sub(p2.p,p1.p);
					m = d.mag();
					n = Point.normalize(d);
				}
			}}
		}
	},
	update: function(){
		for (var i = this.ps.length - 1; i >= 0; i--) {
			this.ps[i].update();
		}
	},
	draw: function(d){
		for (var i = this.GroupLists.length - 1; i >= 0; i--) {
			this.GroupLists[i].draw(d);
		}
	},
	cal: function(weights){
		return Math.max(0,this.forces.pressure*(weights-this.w0))
	}
});
Physics.Obj = function(){
	this.points = [];
	this.mass = 1;
	this.angle = 0;
};
Object.assign(Physics.Obj.prototype, {
	addPoint: function(p){
	},
	applyForce: function(fv){
		var F = fv.copy();
	},
	update: function(){
	}
});
function SlideShow(space, tool){
	if(arguments.length<2){
		throw new Error('Need 2 parameters for constructing a SlideShow,  but '+arguments.length+' is present')
		;
	}
	this.slides = [];
	this.page = 0;
	this.move = function(){
		this.page++;
	};
	this.running = false;
	this.finished = false;
	this.tool = tool;
	function f10(){};
	space.addEventListener('mousedown', f10, false);
	space.addEventListener('keydown', f10, false);
}
Object.assign(SlideShow.prototype, {
	draw: function(index){
		this.slides[index](this.tool);
	},
	run: function(){
		this.running = true;
		this.draw(this.page);
	}
});