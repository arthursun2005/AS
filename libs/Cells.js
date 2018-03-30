(function(global){
	if(typeof Draw == 'undefined' || typeof Point == 'undefined'){
		console.error("include in AS.js");
		return;
	}
	/**
		There are many diiferent types of cells and proteins
	**/
	const defaultDNAValues = {
		'type': 'bloodCell',
		'efficiency': 0.7, // max 1
		'isCancer': false, 
		'isCell': true, 
		'isProtein': false, 
		'isBacteria': false, 
		'isVirus': false, 
		'lifeTime': 2000, 
	};
	function DNA(info){
		this.set(info);
	}
	DNA.prototype.set = function(info) {
		if(info == undefined){
			var obj = defaultDNAValues.clone();
			for(var key in obj){
				this[key] = obj[key];
			}
		}else{
			for(var key in defaultDNAValues){
				if(key in info) this[key] = info[key];
				else this[key] = defaultDNAValues[key];
			}
		}
	};
	DNA.prototype._clone = function() {
		return new DNA(this);
	};
	/**
		I counted all cells and proteins and other stuff as just cells
	**/
	function Cell(x,y,r,_DNA){
		if(x instanceof Point){
			 _DNA = r, r = y;
			this.p = x.copy();
		}else{
			this.p = new Point(x,y);
		}
		this.v = new Point();
		this.fv = new Point();
		this.r = r || 27;
		this.initR = this.r;
		if(_DNA) this.DNA = _DNA._clone();
		else this.DNA = new DNA();
		this.c = {r: 220, g: 180, b: 0, a: 255};
		this.clock = new Clock();
		this.timer = new Timer('d',1100);
		this.isDead = false;
		this.activated = false;
		this.active = true;
		this.gone = false;
		this.health = this._m();
		this.speed = 0;
		this.usage = 0;
	}
	Object.assign(Cell.prototype, {
		_r: function(num){
			this.r = num;
			this.initR = num;
			this.health = this._m();
		},
		_m: function(){
			return this.r*this.r;
		},
		join: function(cell){
			this.r = Math.sqrt(this._m()+cell._m());
			cell.gone = true;
		},
		eat: function(cell){
			var power = this._m()/120;
			if(cell.m-power<=0){
				cell.gone = true;
			}else{
				this.r = Math.sqrt(this._m()+power);
				cell.r = Math.sqrt(cell._m()-power);
			}
		},
		damage: function(cell){
			cell.eat(this);
			cell.health-=this._m()/120;
		},
		fire: function(angle, r, v, f){
			var m = this._m();
			if(m<r*r){
				this.gone = true;
				var c = new Cell();
				c.gone = true;
				return c;
			}
			this.r = Math.sqrt(m-r*r);
			var newCell = new Cell(Point.polar(this.r+r*2,angle).add(this.p),r);
			newCell.v = Point.polar(v,angle);
			if(f) f(newCell);
			return newCell;
		},
		go: function(angle){
			this.v.add(Point.polar(this.speed,angle));
		},
		disintegrate: function(){
			var a = randomFloat(0,2*Math.PI);
			var r = randomFloat(this.r/2.8,this.r/4.5);
			var v = randomFloat(this.r/4,this.r/2);
			function f(c){
				var dna = new DNA({isCell: false, isProtein: true, type: 'bodyCell'});
				c.DNA = dna;
				c.c = {r: 255, g: 255, b: 0, a: 255};
			}
			var newCell = this.fire(a,r,v,f);
			return newCell;
		},
		split: function(){
			var m = this._m();
			this.r = Math.sqrt(m/2);
			var newCell = this.clone();
			newCell.v = Point.polar(this.v.mag(), randomFloat(0,2*Math.PI));
			return newCell;
		},
		clone: function(){
			var cell = new this.constructor(this.p,this.r,this.DNA);
			cell.v = this.v.copy();
			cell.initR = this.initR;
			cell.clock = new Clock(); // track new time
			cell.health = this.health;
			cell.energy = this.energy;
			cell.innerColor = this.innerColor;
			cell.activated = this.activated;
			cell.active = this.active;
			cell.innerColor = this.innerColor;
			return cell;
		}
	});
	const types = ['healer','communicator', 'guard', 'ebola', 'antibody', 'attack', 'bcell', 'bloodCell', 'whiteCell', 'bodyCell', 'killer'];
	function Body(tool){
		if(tool) this.tool = tool;
		else{
			this.tool = undefined;
			console.warn('No tool in Body');
		}
		this.cells = [];
		this.pause = false;
		this.lastPauseMode = false;
		this.m = new Point();
		this.center = new Point();
		this.info = false;
		this.s = 1;
	}
	Object.assign(Body.prototype, {
		draw: function(tool){
			tool = tool || this.tool;
			tool.translate(this.center);
			tool.scale(this.s);
			tool.translate(this.m);
			for(var i=0;i<this.cells.length;i++){
				var cell = this.cells[i];
				var r = cell.r;
				tool.noStroke();
				tool.fill(cell.c.r, cell.c.g, cell.c.b, cell.c.a);
				tool.translate(cell.p);
				tool.ellipse(0,0,r,r);
				if(cell.DNA.isCell && this.info){
					var _a = map(cell.timer['d'].t,0,cell.timer['d'].d,0,2*Math.PI)-Math.PI/2;
					tool.stroke(255,0,0);
					tool.line(0,0,Math.cos(-Math.PI/2)*r,Math.sin(-Math.PI/2)*r);
					tool.stroke(0,0,0);
					tool.line(0,0,Math.cos(_a)*r,Math.sin(_a)*r);
					if(cell.DNA.lifeTime!=-1 && !cell.isDead){
						var _a2 = map(cell.clock.time,0,cell.DNA.lifeTime,0,2*Math.PI)-Math.PI/2;
						tool.stroke(0,255,0);
						tool.line(0,0,Math.cos(_a2)*r,Math.sin(_a2)*r);
					}
				}
				tool.translate(cell.p.minus());
			}
			for(var i=0;i<this.cells.length;i++){
				var cell = this.cells[i];
				var r = cell.r/3*1.8, _g = 40;
				tool.noStroke();
				tool.fill(cell.c.r+_g, cell.c.g+_g, cell.c.b+_g, cell.c.a);
				tool.translate(cell.p);
				if(cell.c.r+cell.c.g+cell.c.b>200*2) tool.fill(cell.c.r-_g, cell.c.g-_g, cell.c.b-_g, cell.c.a);
				tool.ellipse(0,0,r,r);
				if(cell.DNA.isCell && this.info && !cell.isDead){
					tool.fill(0,0,0);
					tool.textSize(r/3);
					tool.text('H: '+Math.round(cell.health),0,-r/3);
					tool.text('S: '+(cell._m()/(cell.initR*cell.initR*2)).toFixed(2),0,r/3);
				}
				tool.translate(cell.p.minus());
			}
			tool.pop();
		},
		solve: function(){
			function solve(data){
				const tt = 50;
				var obj1 = data.obj1, obj2 = data.obj2;
				var id1 = data.id1, id2 = data.id2;
				var D = obj1.r+obj2.r;
				var d = Point.sub(obj2.p, obj1.p);
				var m = d.mag(), a = d.angle();
				var m1 = obj1._m(), m2 = obj2._m();
				if(d.isZero()) a = randomFloat(0,2*Math.PI);
				if(obj1.gone == false && obj2.gone == false){
					function repel(){
						var force = (1-m/D)*(1-m/D)*(m1+m2)/5;
						var mf = (m1+m2)/45; if(force>mf) force = mf;
						var pp = Point.polar(force, a);
						var index = 10;
						obj1.v.scale(Math.pow(m/D, 1/index));
						obj2.v.scale(Math.pow(m/D, 1/index));
						obj1.v.sub(pp.scale0(2/m1));
						obj2.v.add(pp.scale0(2/m2));
					}
					function attract(){
						var force = (m/D)*(m/D)*(m1+m2)/2000;
						var mf = (m1+m2)/3000; if(force>mf) force = mf;
						var pp = Point.polar(force, a+Math.PI);
						obj1.v.sub(pp.scale0(2/m1));
						obj2.v.add(pp.scale0(2/m2));
					}
					var reach = Math.sqrt(D)*12;
					if(m<D+reach){
						if(obj1.isCell && obj2.isProtein && obj2.clock.time>tt && !obj1.isDead){
							attract();
						}
						if(obj2.isCell && obj1.isProtein && obj1.clock.time>tt && !obj2.isDead){
							attract();
						}
					}
					var rs = 3.6;
					if(m<obj1.r*13+obj2.r && !obj1.isDead && obj2.isDead && obj1.DNA.isCell && obj2.r>obj1.r/rs){
						obj1.go(a);
					}
					if(m<obj2.r*13+obj1.r && obj1.isDead && !obj2.isDead && obj2.DNA.isCell && obj1.r>obj2.r/rs){
						obj2.go(a+Math.PI);
					}
					if(m<D){
						repel();
						var mr = 13;
						if(!obj1.isDead && !obj2.isDead && obj1.DNA.isProtein && obj2.DNA.isProtein && obj1.DNA.type == obj2.DNA.type && obj1.r<mr && obj2.r<mr){
							obj1.join(obj2);
						}
						if(!obj1.isDead && obj1.DNA.isCell && obj2.DNA.isProtein && obj2.clock.time>tt){
							obj1.eat(obj2);
						}
						if(!obj2.isDead && obj2.DNA.isCell && obj1.DNA.isProtein && obj1.clock.time>tt){
							obj2.eat(obj1);
						}
						if(!obj1.isDead && obj2.isDead && obj1.DNA.isCell){
							obj1.eat(obj2);
						}
						if(obj1.isDead && !obj2.isDead && obj2.DNA.isCell){
							obj2.eat(obj1);
						}
					}
				}
			}
			var sorted = this.cells._sort();
			Array._sortLoop(solve, sorted);
		},
		update: function(){
			for (var i = this.cells.length - 1; i >= 0; i--) {
				var c = this.cells[i];
				if(c.gone){
					this.cells.splice(i,1);
					continue;
				}
				if(c.clock.time>c.DNA.lifeTime && c.DNA.lifeTime != -1) c.isDead = true;
				c.speed = Math.sqrt(c.r)/420;
				c.fv.add(Point.random(1/(c.v.mag()+1)/220).scale(1/c._m()));
				c.v.add(c.fv);
				c.v.scale(c._m()/(c._m()+Math.PI));
				c.p.add(c.v);
				c.timer.update();
				if(c.timer.is('d') && c.DNA.isCell && (c.r>c.initR || c.isDead)){
					var ii = Math.floor(c._m()*1/600);
					for(var j=0;j<ii;j++){
						this.addCell(c.disintegrate());
					}
				}
				if(c._m()>=c.initR*c.initR*2 && c.DNA.isCell){
					this.addCell(c.split());
				}
				if(c.isDead){
					var str = toHexColor(c.c.r, c.c.g, c.c.b, c.c.a);
					str = mixColors(str, '#777777ff', 1/150).a;
					var a = hexToNumber(str);
					c.c.r = Number(Math.change(a[0],16,10)), c.c.g = Number(Math.change(a[1],16,10)), c.c.b = Number(Math.change(a[2],16,10)), c.c.a = Number(Math.change(a[3],16,10));
				}
			}
		},
		addCell: function(a,b,c,d){
			if(a instanceof Cell){
				a.clock.running = !this.pause;
				this.cells.push(a);
			}else{
				var _c_ = new Cell(a,b,c,d);
				_c_.clock.running = !this.pause;
				this.cells.push(_c_);
			}
		},
		run: function(tool){
			if(!this.pause){
				this.solve();
				this.update();
			}
			for (var i = this.cells.length - 1; i >= 0; i--) {
				this.cells[i].clock.update();
			}
			if(this.pause != this.lastPauseMode){
				for (var i = this.cells.length - 1; i >= 0; i--) {
					this.cells[i].clock.running = !this.pause;
				}
			}
			this.lastPauseMode = this.pause;
			this.draw(tool);
		},
		controls: function(){
			if(typeof keys != undefined){
				if(keys.z) this.s*=1.005;
				if(keys.x) this.s/=1.005;
				if(keys.ArrowUp) this.m.y+=2.2;
				if(keys.ArrowDown) this.m.y-=2.2;
				if(keys.ArrowLeft) this.m.x+=2.2;
				if(keys.ArrowRight) this.m.x-=2.2;
			}else{
				console.log('Hello');
			}
		}
	});
	const gs = ['defaultDNAValues', 'Body', 'DNA', 'Cell'];
	for(var i=0;i<gs.length;i++){
		global[gs[i]] = eval(gs[i]);
	}
})(this);