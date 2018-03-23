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
		'speed': 1, 
		'endurance': 10, 
		'energyNeeded': Eq('x'), 
		'isCancer': false, 
		'isCell': true, 
		'isProtein': false, 
		'isBacteria': false, 
		'isVirus': false, 
		'lifeTime': -1, 
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
			if(info instanceof DNA){
				for(var key in info){
					this[key] = info[key];
				}
			}else{
				for(var key in defaultDNAValues){
					if(key in info) this[key] = info[key];
					else this[key] = defaultDNAValues[key];
				}
			}
		}
	};
	DNA.prototype.clone = function(info) {
		return new DNA(this);
	};
	/**
		I counted all cells and proteins and other stuff as just cells
	**/
	function Cell(x,y,r,_DNA){
		if(x instanceof Point){
			r = y, _DNA = r;
			var _x = x.copy();
			x = _x.x, y = _x.y;
		}
		this.p = new Point(x,y);
		this.v = new Point();
		this.r = r || 27;
		if(_DNA) this.DNA = _DNA.clone();
		else this.DNA = new DNA();
		this.c = {r: 180, g: 120, b: 40, a: 255};
		this.clock = new Clock();
		this.timer = new Timer('a',500); 
		this.isDead = false;
		this.innerColor = undefined;
		this.activated = false;
		this.active = true;
		this.m = this.r*this.r;
		this.health = this.m;
		this.energy = this.m;
	}
	Object.assign(Cell.prototype, {
		split: function(){
			var newCell = this.clone();
			newCell.v = Point.polar(this.v.mag(), randomFloat(0,2*Math.PI));
			this.energy/=2;
			newCell.energy = this.energy;
			return newCell;
		},
		clone: function(){
			var cell = new this.constructor(this.p,this.r,this.DNA);
			cell.v = this.v.copy();
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
	const types = ['healer','communicator', 'guard', 'ebola', 'antibody', 'attack', 'bcell', 'bloodCell', 'whiteCell', 'bodyCell'];
	function Body(tool){
		if(tool) this.tool = tool;
		else{
			this.tool = undefined;
			console.warn('No tool in Body');
		}
		this.cells = [];
		this.pause = false;
	}
	Object.assign(Body.prototype, {
		draw: function(tool){
			tool = tool || this.tool;
			tool.noStroke();
			for(var i=0;i<this.cells.length;i++){
				var cell = this.cells[i];
				var r = cell.r;
				tool.fill(cell.c.r, cell.c.b, cell.c.b, cell.c.a);
				tool.translate(cell.p);
				tool.ellipse(0,0,r,r);
				tool.translate(cell.p.minus());
			}
			for(var i=0;i<this.cells.length;i++){
				var cell = this.cells[i];
				var r = cell.r/3*1.8;
				tool.fill(cell.c.r+30, cell.c.b+30, cell.c.b+30, cell.c.a);
				if(cell.innerColor) tool.fill(cell.innerColor);
				tool.translate(cell.p);
				tool.ellipse(0,0,r,r);
				tool.translate(cell.p.minus());
			}
		},
		solve: function(){
			function solve(data){
				var obj1 = data.obj1, obj2 = data.obj2;
				var id1 = data.id1, id2 = data.id2;
				var D = obj1.r+obj2.r;
				var d = Point.sub(obj2.p, obj1.p);
				var m = d.mag(), a = d.angle();
				if(d.isZero()) a = randomFloat(0,2*Math.PI);
				if(m<D){
					var force = 10*(1-m/D)*(1-m/D)*(obj1.m+obj2.m)/50;
					var mf = (obj1.m+obj2.m)/40; if(force>mf) force = mf;
					var pp = Point.polar(force, a);
					var index = 10;
					obj1.v.scale(Math.pow(m/D, 1/index));
					obj2.v.scale(Math.pow(m/D, 1/index));
					obj1.v.sub(pp.scale0(2/obj1.m));
					obj2.v.add(pp.scale0(2/obj2.m));
					//
				}
			}
			var sorted = this.cells._sort();
			Array._sortLoop(solve, sorted);
		},
		update: function(){
			for (var i = this.cells.length - 1; i >= 0; i--) {
				var c = this.cells[i];
				if(c.clock.time>c.DNA.lifeTime && c.DNA.lifeTime != -1) c.isDead = true;
				c.m = c.r*c.r;
				c.v.scale(c.m/(c.m+Math.PI*2));
				c.p.add(c.v);
				c.clock.update();
				c.timer.update();
				if(c.timer.is('a')){
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
			this.draw(tool);
		}
	});
	const gs = ['defaultDNAValues', 'Body', 'DNA', 'Cell'];
	for(var i=0;i<gs.length;i++){
		global[gs[i]] = eval(gs[i]);
	}
})(this);