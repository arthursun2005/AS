(function(global){
	if(typeof Draw == 'undefined' || typeof Point == 'undefined'){
		console.error("include in AS.js");
		return;
	}
	/**
		There are many diiferent types of cells and proteins
	**/
	const defaultDNAValues = {
		'type': 'attack',
		'maxSpeed': 3, 
		'endurance': 10, 
		'foodNeeded': 10, 
		'isCancer': false, 
		'isCell': true, 
		'isProtein': false, 
		'isBacteria': false, 
		'isVirus': false, 
		'lifeTime': 120, 
		'lifeVariation': 30, 
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
		if(_DNA) this.DNA = _DNA;
		else this.DNA = new DNA();
		this.c = {r: 220, g: 160, b: 80};
		this.clock = new Clock();
		this.isDead = false;
		this.innerColor = undefined;
	}
	Object.assign(Cell.prototype, {
		split: function(fraction){
			var thisFraction = 1-fraction;
			var totalArea = this.r*this.r;
			this.r = Math.sqrt(thisFraction*totalArea);
			var otherR = Math.sqrt(fraction*totalArea);
			var newCell = new Cell(x,y,otherR);
			newCell.DNA = this.DNA.clone();
			return newCell;
		}
	});
	function Body(tool){
		if(tool) this.tool = tool;
		else{
			this.tool = undefined;
			console.warn('Give a drawing tool for Body(Body.tool = new Draw(space))');
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
			function solve(){}
			this.cells._sortLoop(solve, this._sort(this.cells));
		},
		update: function(){
			for (var i = this.cells.length - 1; i >= 0; i--) {
				var c = this.cells[i];
				c.p.add(c.v);
				c.clock.update();
			}
		},
		addCell: function(cell){
			if(cell instanceof Cell){
				this.cells.push(cell);
			}
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