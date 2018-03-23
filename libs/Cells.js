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
		this.r = r || 27;
		if(_DNA) this.DNA = _DNA.clone();
		else this.DNA = new DNA();
		this.c = {r: 220, g: 120, b: 60, a: 255};
		this.clock = new Clock();
		this.timer = new Timer(); 
		this.isDead = false;
		this.innerColor = undefined;
		this.activated = false;
		this.active = true;
		this.m = this.r*this.r;
		this.health = this.m;
		this.energy = this.m;
	}
	Object.assign(Cell.prototype, {
		duplicate: function(){
			var newCell = this.clone();
			console.log(newCell.v);
			newCell.v = new Point();
			newCell.v.random(this.v.mag());
			return newCell;
		},
		clone: function(){
			var cell = new this.constructor(this.p,this.r,this.DNA);
			cell.v = this.v.copy();
			cell.clock = new Clock(); // track new time
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
				tool.fill(cell.c.r, cell.c.b, cell.c.b, cell.c.a);
				tool.translate(cell.p);
				tool.ellipse(0,0,r,r);
				tool.translate(cell.p.minus());
			}
			for(var i=0;i<this.cells.length;i++){
				var cell = this.cells[i];
				var r = cell.r/3*1.8;
				tool.fill(cell.c.r+20, cell.c.b+20, cell.c.b+20, cell.c.a);
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
					var force = (1-m/D)*(obj1.m+obj2.m)/3e2+Math.pow(obj1.v.mag()+obj2.v.mag(), 2)*Math.PI*2;
					var pp = Point.polar(force, a);
					var index = 30;
					obj1.v.scale(Math.pow(m/D, 1/index));
					obj2.v.scale(Math.pow(m/D, 1/index));
					obj1.v.sub(pp.scale0(1/obj2.m));
					obj2.v.add(pp.scale0(1/obj1.m));
					//
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
				c.v.scale(c.m/(c.m+Math.PI*2));
				c.p.add(c.v);
				c.clock.update();
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