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
		'lifeTime': 30000, 
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
		this.timer = new Timer('d',200);
		this.isDead = false;
		this.activated = false;
		this.active = true;
		this.gone = false;
		this.m = this.r*this.r;
		this.health = this.m;
		this.speed = 0;
	}
	Object.assign(Cell.prototype, {
		join: function(cell){
			this.r = Math.sqrt(this.m+cell.m);
			cell.gone = true;
		},
		eat: function(cell){
			var power = this.m/200;
			if(cell.m-power<0){
				cell.gone = true;
			}else{
				this.r = Math.sqrt(this.m+power);
				cell.r = Math.sqrt(cell.m-power);
			}
		},
		damage: function(cell){
			cell.eat(this);
			cell.health-=this.m/100;
		},
		fire: function(angle, r, v, f){
			if(this.m<r*r){
				this.gone = true;
				var c = new Cell();
				c.gone = true;
				return c;
			}
			this.r = Math.sqrt(this.m-r*r);
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
			var r = randomFloat(4,6);
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
			this.r = Math.sqrt(this.m/2);
			var newCell = this.clone();
			newCell.v = Point.polar(this.v.mag(), randomFloat(0,2*Math.PI));
			newCell.r = this.r;
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
		this.s = 1;
	}
	Object.assign(Body.prototype, {
		draw: function(tool){
			tool = tool || this.tool;
			tool.noStroke();
			tool.translate(this.center);
			tool.scale(this.s);
			tool.translate(this.m);
			for(var i=0;i<this.cells.length;i++){
				var cell = this.cells[i];
				var r = cell.r;
				tool.fill(cell.c.r, cell.c.g, cell.c.b, cell.c.a);
				tool.ellipse(cell.p.x,cell.p.y,r,r);
			}
			for(var i=0;i<this.cells.length;i++){
				var cell = this.cells[i];
				var r = cell.r/3*1.8, _g = 40;
				tool.fill(cell.c.r+_g, cell.c.g+_g, cell.c.b+_g, cell.c.a);
				if(cell.c.r+cell.c.g+cell.c.b>200*2) tool.fill(cell.c.r-_g, cell.c.g-_g, cell.c.b-_g, cell.c.a);
				tool.ellipse(cell.p.x,cell.p.y,r,r);
			}
			tool.translate(this.m.minus());
			tool.scale(1/this.s);
			tool.translate(this.center.minus());
		},
		solve: function(){
			function solve(data){
				const tt = 50;
				var obj1 = data.obj1, obj2 = data.obj2;
				var id1 = data.id1, id2 = data.id2;
				var D = obj1.r+obj2.r;
				var d = Point.sub(obj2.p, obj1.p);
				var m = d.mag(), a = d.angle();
				if(d.isZero()) a = randomFloat(0,2*Math.PI);
				if(obj1.gone == false && obj2.gone == false){
					function repel(){
						var force = (1-m/D)*(1-m/D)*(obj1.m+obj2.m)/5;
						var mf = (obj1.m+obj2.m)/45; if(force>mf) force = mf;
						var pp = Point.polar(force, a);
						var index = 10;
						obj1.v.scale(Math.pow(m/D, 1/index));
						obj2.v.scale(Math.pow(m/D, 1/index));
						obj1.v.sub(pp.scale0(2/obj1.m));
						obj2.v.add(pp.scale0(2/obj2.m));
					}
					function attract(){
						var force = (m/D)*(m/D)*(obj1.m+obj2.m)/2000;
						var mf = (obj1.m+obj2.m)/3000; if(force>mf) force = mf;
						var pp = Point.polar(force, a+Math.PI);
						obj1.v.sub(pp.scale0(2/obj1.m));
						obj2.v.add(pp.scale0(2/obj2.m));
					}
					var reach = Math.sqrt(D)*12;
					if(obj1.clock.time>tt && obj2.clock.time>tt && m<D+reach && ((obj1.DNA.isCell && obj2.DNA.isProtein && !obj1.isDead) || (obj2.DNA.isCell && obj1.DNA.isProtein && !obj2.isDead))){
						attract();
					}else if(obj1.clock.time>tt && obj2.clock.time>tt && ((!obj1.isDead && obj2.isDead && obj1.DNA.isCell) || (obj1.isDead && !obj2.isDead && obj2.DNA.isCell))){
						attract();
					}
					if(!obj1.isDead && obj2.isDead && obj1.DNA.isCell && obj2.r>obj1.r/2){
						obj1.go(a+Math.PI);
					}
					if(obj1.isDead && !obj2.isDead && obj2.DNA.isCell && obj1.r>obj2.r/2){
						obj2.go(a+Math.PI);
					}
					if(m<D){
						repel();
						var mr = 6;
						if(!obj1.isDead && !obj2.isDead && obj1.DNA.isProtein && obj2.DNA.isProtein && obj1.DNA.type == obj2.DNA.type && obj1.r<mr && obj2.r<mr){
							obj1.join(obj2);
						}
						if(!obj1.isDead && obj1.DNA.isCell && obj2.DNA.isProtein && obj2.clock.time>tt){
							if(obj2.DNA.isVirus && !obj2.isDead) obj2.damage(obj1);
							else obj1.eat(obj2);
						}
						if(!obj2.isDead && obj2.DNA.isCell && obj1.DNA.isProtein && obj1.clock.time>tt){
							if(obj1.DNA.isVirus && !obj1.isDead) obj1.damage(obj2);
							else obj2.eat(obj1);
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
				c.m = c.r*c.r;
				c.speed = Math.sqrt(c.r)/100;
				c.fv.add(Point.random(1/(c.v.mag()+1)/220).scale(1/c.m));
				c.v.add(c.fv);
				c.v.scale(c.m/(c.m+Math.PI));
				c.p.add(c.v);
				c.timer.update();
				if((c.timer.is('d') || c.isDead) && c.DNA.isCell && (c.r>c.initR || c.isDead)){
					var ii = Math.floor(c.m*1/500);
					if(c.isDead) c.disintegrate();
					for(var j=0;j<ii;j++){
						this.addCell(c.disintegrate());
					}
				}
				if(c.m>c.initR*c.initR*2 && c.DNA.isCell){
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
			if(a instanceof Cell) this.cells.push(a);
			else this.cells.push(new Cell(a,b,c,d));
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
		}
	});
	const gs = ['defaultDNAValues', 'Body', 'DNA', 'Cell'];
	for(var i=0;i<gs.length;i++){
		global[gs[i]] = eval(gs[i]);
	}
})(this);