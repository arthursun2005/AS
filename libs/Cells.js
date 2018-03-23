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
		'foodNeeded': 10, 
		'isCancer': false, 
		'isCell': true, 
		'isProtein': false, 
		'isBacteria': false, 
		'isVirus': false, 
		'lifeTime': 120, 
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
		this.r = r || 30;
		if(_DNA) this.DNA = _DNA.clone();
		else this.DNA = new DNA();
		this.c = {r: 220, g: 160, b: 80};
		this.clock = new Clock();
		this.isDead = false;
		this.innerColor = undefined;
		this.activated = false;
		this.m = this.r*this.r;
		this.health = this.m;
	}
	Object.assign(Cell.prototype, {
		split: function(fraction){
			var thisFraction = 1-fraction;
			this.r = Math.sqrt(thisFraction*this.m);
			var otherR = Math.sqrt(fraction*this.m);
			var newCell = new Cell(x,y,otherR,this.DNA);
			return newCell;
		},
		clone: function(){
			var cell = new this.constructor(this.p,this.r,this.DNA);
			cell.v = this.c.copy();
			cell.clock = this.clock.clone();
			cell.health = this.health;
			cell.isDead = this.isDead;
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
	}
	Object.assign(Body.prototype, {
		draw: function(tool){
			tool = tool || this.tool;
			tool.noStroke();
			for(var i=0;i<this.cells.length;i++){
				var cell = this.cells[i];
				var r = cell.r;
				tool.fill(cell.c.r, cell.c.b, cell.c.b);
				tool.translate(cell.p);
				tool.ellipse(0,0,r,r);
				tool.translate(cell.p.minus());
			}
			for(var i=0;i<this.cells.length;i++){
				var cell = this.cells[i];
				var r = cell.r/3*1.8;
				tool.fill(cell.c.r-40, cell.c.b-40, cell.c.b-40);
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
				if(m<D){
					var force = (1-m/D)*(obj1.m+obj2.m)*1/(Math.PI*2);
					var pp = Point.polar(force, a+randomFloat(-0.05,0.05));
					obj1.v.sub(pp.scale0(1/obj2.m));
					obj2.v.add(pp.scale0(1/obj1.m));
				}
			}
			var sorted = this.cells._sort();
			Array._sortLoop(solve, sorted);
		},
		update: function(){
			for (var i = this.cells.length - 1; i >= 0; i--) {
				var c = this.cells[i];
				if(c.clock.time>c.DNA.lifeTime) c.isDead = true;
				c.m = c.r*c.r;
				c.v.scale(c.m/(c.m+Math.PI));
				c.p.add(c.v);
				c.clock.update();
				if(c.isDead){
				}
			}
		},
		addCell: function(a,b,c,d){
			if(a instanceof Cell) this.cells.push(a);
			else this.cells.push(new Cell(a,b,c,d));
		},
		run: function(tool){
			this.solve();
			this.update();
			this.draw(tool);
		}
	});
	const gs = ['defaultDNAValues', 'Body', 'DNA', 'Cell'];
	for(var i=0;i<gs.length;i++){
		global[gs[i]] = eval(gs[i]);
	}
})(this);