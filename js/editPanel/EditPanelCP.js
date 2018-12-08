editPanel.cp = {
	init:function(){
		main.setAttr(editPanel.cp, setting.value.editPanel.cp);
		main.setAttr(editPanel.cp, {zIndex:++main.zIndex});
		
		editPanel.cp.scale.init();
		editPanel.cp.rotate.init();
	},
	position:function(x, y, w, h){
		var offset = canvas.offsetX - editPanel.cp.scale.halfWidth;
		if(canvas.tool.current.id == canvas.tool.line.id){
			main.setAttr(
				editPanel.cp.scale.source.instance.style, 
				{left:canvas.tool.line.source.x + offset + "px", top:canvas.tool.line.source.y + offset + "px"}
			);
			main.setAttr(
				editPanel.cp.scale.dest.instance.style,
				{left:canvas.tool.line.dest.x + offset + "px", top:canvas.tool.line.dest.y + offset + "px"}
			);
		}else{
			var offsetX = x + offset;
			var offsetY = y + offset;
			var halfWidth = w / 2;
			var halfHeight = h / 2;
			
			main.setAttr(editPanel.cp.scale.lt.instance.style, {left:offsetX + "px", top:offsetY + "px"});
			main.setAttr(editPanel.cp.scale.mt.instance.style, {left:offsetX + halfWidth + "px", top:offsetY + "px"});
			main.setAttr(editPanel.cp.scale.rt.instance.style, {left:offsetX + w + "px", top:offsetY + "px"});
			main.setAttr(editPanel.cp.scale.lm.instance.style, {left:offsetX + "px", top:offsetY + halfHeight + "px"});
			main.setAttr(editPanel.cp.scale.rm.instance.style, {left:offsetX + w + "px", top:offsetY + halfHeight + "px"});
			main.setAttr(editPanel.cp.scale.lb.instance.style, {left:offsetX + "px", top:offsetY + h + "px"});
			main.setAttr(editPanel.cp.scale.mb.instance.style, {left:offsetX + halfWidth + "px", top:offsetY + h + "px"});
			main.setAttr(editPanel.cp.scale.rb.instance.style, {left:offsetX + w + "px", top:offsetY + h + "px"});
			
			main.setAttr(
				editPanel.cp.rotate.position, 
				{x:x + canvas.offsetX + halfWidth, y:y + canvas.offsetY - editPanel.cp.rotate.offsetY - editPanel.cp.rotate.width}
			);
			main.setAttr(
				editPanel.cp.rotate.instance.style, 
				{left:editPanel.cp.rotate.position.x - editPanel.cp.scale.width + "px", 
					top:editPanel.cp.rotate.position.y + "px"}
			);
		}
	},
	show:function(){
		editPanel.cp.hide();
		if(canvas.tool.current.id == canvas.tool.line.id){
			editPanel.cp.scale.source.instance.style.display = "block";
			editPanel.cp.scale.dest.instance.style.display = "block";
		}else{
			for(var i = 0; i < editPanel.cp.scale.array.length - 2; i++){
				editPanel.cp.scale.array[i].instance.style.display = "block";
			}
			editPanel.cp.rotate.instance.style.display = "block";
		}
	},
	hide:function(){
		for(var i = 0; i < editPanel.cp.scale.array.length; i++){
			editPanel.cp.scale.array[i].instance.style.display = "none";
		}
		editPanel.cp.rotate.instance.style.display = "none";
	},
	setDefaultBounds:function(){
		editPanel.cp.bounds.minX = !main.exist(editPanel.cp.bounds.minX) ? canvas.tool.current.region.minX - 1 : editPanel.cp.bounds.minX;
		editPanel.cp.bounds.minY = !main.exist(editPanel.cp.bounds.minY) ? canvas.tool.current.region.minY - 1 : editPanel.cp.bounds.minY;
		editPanel.cp.bounds.maxX = !main.exist(editPanel.cp.bounds.maxX) ? canvas.tool.current.region.maxX : editPanel.cp.bounds.maxX;
		editPanel.cp.bounds.maxY = !main.exist(editPanel.cp.bounds.maxY) ? canvas.tool.current.region.maxY : editPanel.cp.bounds.maxY;
		editPanel.cp.bounds.w = !main.exist(editPanel.cp.bounds.w) ? canvas.tool.current.region.w  : editPanel.cp.bounds.w;
		editPanel.cp.bounds.h = !main.exist(editPanel.cp.bounds.h) ? canvas.tool.current.region.h  : editPanel.cp.bounds.h;
	},
	scale:{
		init:function(){
			main.setAttr(editPanel.cp.scale, setting.value.editPanel.cp.scale);
			main.setAttr(editPanel.cp.scale, {halfWidth:editPanel.cp.scale.width / 2});
			
			editPanel.cp.scale.lt.init();
			editPanel.cp.scale.mt.init();
			editPanel.cp.scale.rt.init();
			editPanel.cp.scale.lm.init();
			editPanel.cp.scale.rm.init();
			editPanel.cp.scale.lb.init();
			editPanel.cp.scale.mb.init();
			editPanel.cp.scale.rb.init();
			editPanel.cp.scale.source.init();
			editPanel.cp.scale.dest.init();
		},
		setScale:function(scale, order, cursor){
			scale.instance = main.createElement(
				"div", 
				{className:editPanel.cp.scale.className, order:order}, 
				{width:editPanel.cp.scale.width + "px", height:editPanel.cp.scale.width + "px", 
					zIndex:editPanel.cp.zIndex + "", cursor:cursor + "-resize"}, 
				{mousedown:scale.eventMouseDown}, 
				document.body
			);
			editPanel.cp.scale.array[order] = scale;
		},
		scale:function(x1, y1, x2, y2){
			canvas.clear(canvas.process);
			main.setAttr(canvas.tool.current.source, {x:x1, y:y1});
			if(canvas.tool.current.id == setting.value.canvas.tool.line.id){
				canvas.tool.line.dest = {x:x2, y:y2};
				canvas.tool.setRegion(x1, y1, x2, y2);
				canvas.tool.line.stroke();
			}else if(canvas.tool.current.id != setting.value.canvas.tool.select.id){
				canvas.tool.setRegion(x1, y1, x2, y2);
				canvas.tool.current.stroke();
				editPanel.cp.rotate.rotate();
			}else{
				canvas.tool.setRegion(x1, y1, x2, y2);
				canvas.clear(canvas.process);
				canvas.process.context.translate(canvas.tool.select.region.centerX, canvas.tool.select.region.centerY);
				canvas.process.context.rotate(editPanel.cp.rotate.radian);
				try{
					canvas.process.context.drawImage(
						canvas.temp.instance,
						canvas.tool.select.origin.x, canvas.tool.select.origin.y,
						canvas.tool.select.origin.w, canvas.tool.select.origin.h,
						canvas.tool.select.region.minX - canvas.tool.select.region.centerX, 
						canvas.tool.select.region.minY - canvas.tool.select.region.centerY,
						canvas.tool.select.region.width, canvas.tool.select.region.height
					);
				}catch(e){
					console.log(e);
				}
				editPanel.cp.rotate.rotateCP(editPanel.cp.rotate.radian * 180 / Math.PI);
				canvas.process.context.setTransform(1, 0, 0, 1, 0, 0);
			}
			editPanel.setPanel(
				canvas.tool.current.region.minX, canvas.tool.current.region.minY, 
				canvas.tool.current.region.width, canvas.tool.current.region.height
			);
		},
		eventMouseDown:function(scale){
			main.mask.show();
			main.addEvent(main.mask.instance, {mousemove:scale.eventMouseMove, mouseup:scale.eventMouseUp});
			main.setAttr(main.mask.instance.style, {cursor:scale.instance.style.cursor});
		},
		eventMouseUp:function(scale){
			main.mask.hide();
			main.removeEvent(main.mask.instance, {mousemove:scale.eventMouseMove, mouseup:scale.eventMouseUp});
			main.setAttr(main.mask.instance.style, {cursor:canvas.tool.current.cursor});
		},
		lt:{
			init:function(){
				editPanel.cp.scale.setScale(editPanel.cp.scale.lt, 0, "nw");
			},
			eventMouseDown:function(){
				editPanel.cp.scale.eventMouseDown(editPanel.cp.scale.lt);
			},
			eventMouseMove:function(e){
				var x = e.clientX - canvas.offsetX;
				var y = e.clientY - canvas.offsetY;
				x = (x > canvas.tool.current.region.maxX) ? canvas.tool.current.region.maxX : x;
				y = (y > canvas.tool.current.region.maxY) ? canvas.tool.current.region.maxY : y;
				editPanel.cp.scale.scale(x, y, canvas.tool.current.region.maxX, canvas.tool.current.region.maxY);
			},
			eventMouseUp:function(){
				editPanel.cp.scale.eventMouseUp(editPanel.cp.scale.lt);
			},
			rotate:function(degree){
				var rotate = "rotate(" + degree + "deg)";
				var origin = degree == 0 
					? "0px 0px" 
					:  (editPanel.cp.scale.halfWidth + canvas.tool.current.region.width / 2) + "px " 
						+ (editPanel.cp.scale.halfWidth + canvas.tool.current.region.height / 2) + "px";
				main.setAttr(
					editPanel.cp.scale.lt.instance.style,
					{transformOrigin:origin, msTransformOrigin:origin, webkitTransformOrigin:origin, 
						oTranformOrigin:origin, mozTransformOrigin:origin,
						transform:rotate, msTransform:rotate, webkitTransform:rotate, oTransform:rotate, mozTransform:rotate}
				);
			},
		},
		mt:{
			init:function(){
				editPanel.cp.scale.setScale(editPanel.cp.scale.mt, 1, "n");
			},
			eventMouseDown:function(){
				editPanel.cp.scale.eventMouseDown(editPanel.cp.scale.mt);
			},
			eventMouseMove:function(e){
				var y = e.clientY - canvas.offsetY;
				y = (y > canvas.tool.current.region.maxY) ? canvas.tool.current.region.maxY : y;
				editPanel.cp.scale.scale(canvas.tool.current.region.minX, y, canvas.tool.current.region.maxX, canvas.tool.current.region.maxY);
			},
			eventMouseUp:function(){
				editPanel.cp.scale.eventMouseUp(editPanel.cp.scale.mt);
			},
			rotate:function(degree){
				var rotate = "rotate(" + degree + "deg)";
				var origin = degree == 0 
					? "0px 0px" 
					:  editPanel.cp.scale.halfWidth + "px " + (editPanel.cp.scale.halfWidth + canvas.tool.current.region.height / 2) + "px";
				main.setAttr(
					editPanel.cp.scale.mt.instance.style,
					{transformOrigin:origin, msTransformOrigin:origin, webkitTransformOrigin:origin, 
						oTranformOrigin:origin, mozTransformOrigin:origin,
						transform:rotate, msTransform:rotate, webkitTransform:rotate, oTransform:rotate, mozTransform:rotate}
				);
			},
		},
		rt:{
			init:function(){
				editPanel.cp.scale.setScale(editPanel.cp.scale.rt, 2, "ne");
			},
			eventMouseDown:function(){
				editPanel.cp.scale.eventMouseDown(editPanel.cp.scale.rt);
			},
			eventMouseMove:function(e){
				var x = e.clientX - canvas.offsetX;
				var y = e.clientY - canvas.offsetY;
				x = (x < canvas.tool.current.region.minX) ? canvas.tool.current.region.minX : x;
				y = (y > canvas.tool.current.region.maxY) ? canvas.tool.current.region.maxY : y;
				editPanel.cp.scale.scale(canvas.tool.current.region.minX, y, x, canvas.tool.current.region.maxY);
			},
			eventMouseUp:function(){
				editPanel.cp.scale.eventMouseUp(editPanel.cp.scale.rt);
			},
			rotate:function(degree){
				var rotate = "rotate(" + degree + "deg)";
				var origin = degree == 0 
					? "0px 0px" 
					:  (-1 * (canvas.tool.current.region.width / 2 - editPanel.cp.scale.halfWidth)) + "px " 
						+ (editPanel.cp.scale.halfWidth + canvas.tool.current.region.height / 2) + "px";
				main.setAttr(
					editPanel.cp.scale.rt.instance.style,
					{transformOrigin:origin, msTransformOrigin:origin, webkitTransformOrigin:origin, 
						oTranformOrigin:origin, mozTransformOrigin:origin,
						transform:rotate, msTransform:rotate, webkitTransform:rotate, oTransform:rotate, mozTransform:rotate}
				);
			},
		},
		lm:{
			init:function(){
				editPanel.cp.scale.setScale(editPanel.cp.scale.lm, 3, "w");
			},
			eventMouseDown:function(){	
				editPanel.cp.scale.eventMouseDown(editPanel.cp.scale.lm);
			},
			eventMouseMove:function(e){
				var x = e.clientX - canvas.offsetX;
				x = (x > canvas.tool.current.region.maxX) ? canvas.tool.current.region.maxX : x;
				editPanel.cp.scale.scale(x, canvas.tool.current.region.minY, canvas.tool.current.region.maxX, canvas.tool.current.region.maxY);
			},
			eventMouseUp:function(){
				editPanel.cp.scale.eventMouseUp(editPanel.cp.scale.lm);
			},
			rotate:function(degree){
				var rotate = "rotate(" + degree + "deg)";
				var origin = degree == 0 
					? "0px 0px" 
					:  (editPanel.cp.scale.halfWidth + canvas.tool.current.region.width / 2) + "px " + editPanel.cp.scale.halfWidth + "px";
				main.setAttr(
					editPanel.cp.scale.lm.instance.style,
					{transformOrigin:origin, msTransformOrigin:origin, webkitTransformOrigin:origin, 
						oTranformOrigin:origin, mozTransformOrigin:origin,
						transform:rotate, msTransform:rotate, webkitTransform:rotate, oTransform:rotate, mozTransform:rotate}
				);
			},
		},
		rm:{
			init:function(){
				editPanel.cp.scale.setScale(editPanel.cp.scale.rm, 4, "e");
			},
			eventMouseDown:function(){
				editPanel.cp.scale.eventMouseDown(editPanel.cp.scale.rm);
			},
			eventMouseMove:function(e){
				var x = e.clientX - canvas.offsetX;
				x = (x < canvas.tool.current.region.minX) ? canvas.tool.current.region.minX : x;
				editPanel.cp.scale.scale(canvas.tool.current.region.minX, canvas.tool.current.region.minY, x, canvas.tool.current.region.maxY);
			},
			eventMouseUp:function(){
				editPanel.cp.scale.eventMouseUp(editPanel.cp.scale.rm);
			},
			rotate:function(degree){
				var rotate = "rotate(" + degree + "deg)";
				var origin = degree == 0 
					? "0px 0px" 
					:  (-1 * (canvas.tool.current.region.width / 2 - editPanel.cp.scale.halfWidth)) + "px " + editPanel.cp.scale.halfWidth + "px";
				main.setAttr(
					editPanel.cp.scale.rm.instance.style,
					{transformOrigin:origin, msTransformOrigin:origin, webkitTransformOrigin:origin, 
						oTranformOrigin:origin, mozTransformOrigin:origin,
						transform:rotate, msTransform:rotate, webkitTransform:rotate, oTransform:rotate, mozTransform:rotate}
				);
			},
		},
		lb:{
			init:function(){
				editPanel.cp.scale.setScale(editPanel.cp.scale.lb, 5, "sw");
			},
			eventMouseDown:function(){
				editPanel.cp.scale.eventMouseDown(editPanel.cp.scale.lb);
			},
			eventMouseMove:function(e){
				var x = e.clientX - canvas.offsetX;
				var y = e.clientY - canvas.offsetY;
				x = (x > canvas.tool.current.region.maxX) ? canvas.tool.current.region.maxX : x;
				y = (y < canvas.tool.current.region.minY) ? canvas.tool.current.region.minY : y;
				editPanel.cp.scale.scale(x, canvas.tool.current.region.minY, canvas.tool.current.region.maxX, y);
			},
			eventMouseUp:function(){
				editPanel.cp.scale.eventMouseUp(editPanel.cp.scale.lb);
			},
			rotate:function(degree){
				var rotate = "rotate(" + degree + "deg)";
				var origin = degree == 0 
					? "0px 0px" 
					:  (editPanel.cp.scale.halfWidth + canvas.tool.current.region.width / 2) + "px " 
						+ (-1 * (canvas.tool.current.region.height / 2 - editPanel.cp.scale.halfWidth)) + "px";
				main.setAttr(
					editPanel.cp.scale.lb.instance.style,
					{transformOrigin:origin, msTransformOrigin:origin, webkitTransformOrigin:origin, 
						oTranformOrigin:origin, mozTransformOrigin:origin,
						transform:rotate, msTransform:rotate, webkitTransform:rotate, oTransform:rotate, mozTransform:rotate}
				);
			},
		},
		mb:{
			init:function(){
				editPanel.cp.scale.setScale(editPanel.cp.scale.mb, 6, "s");
			},
			eventMouseDown:function(){
				editPanel.cp.scale.eventMouseDown(editPanel.cp.scale.mb);
			},
			eventMouseMove:function(e){
				var y = e.clientY - canvas.offsetY;
				y = (y < canvas.tool.current.region.minY) ? canvas.tool.current.region.minY : y;
				editPanel.cp.scale.scale(canvas.tool.current.region.minX, canvas.tool.current.region.minY, canvas.tool.current.region.maxX, y);
			},
			eventMouseUp:function(){
				editPanel.cp.scale.eventMouseUp(editPanel.cp.scale.mb);
			},
			rotate:function(degree){
				var rotate = "rotate(" + degree + "deg)";
				var origin = degree == 0 
					? "0px 0px" 
					:  editPanel.cp.scale.halfWidth + "px " 
						+ (-1 * (canvas.tool.current.region.height / 2 - editPanel.cp.scale.halfWidth)) + "px";
				main.setAttr(
					editPanel.cp.scale.mb.instance.style,
					{transformOrigin:origin, msTransformOrigin:origin, webkitTransformOrigin:origin, 
						oTranformOrigin:origin, mozTransformOrigin:origin,
						transform:rotate, msTransform:rotate, webkitTransform:rotate, oTransform:rotate, mozTransform:rotate}
				);
			},
		},
		rb:{
			init:function(){
				editPanel.cp.scale.setScale(editPanel.cp.scale.rb, 7, "se");
			},
			eventMouseDown:function(){
				editPanel.cp.scale.eventMouseDown(editPanel.cp.scale.rb);
			},
			eventMouseMove:function(e){
				var x = e.clientX - canvas.offsetX;
				var y = e.clientY - canvas.offsetY;
				x = (x < canvas.tool.current.region.minX) ? canvas.tool.current.region.minX : x;
				y = (y < canvas.tool.current.region.minY) ? canvas.tool.current.region.minY : y;
				editPanel.cp.scale.scale(canvas.tool.current.region.minX, canvas.tool.current.region.minY, x, y);
			},
			eventMouseUp:function(){
				editPanel.cp.scale.eventMouseUp(editPanel.cp.scale.rb);
			},
			rotate:function(degree){
				var rotate = "rotate(" + degree + "deg)";
				var origin = degree == 0 
					? "0px 0px" 
					:  (-1 * (canvas.tool.current.region.width / 2 - editPanel.cp.scale.halfWidth)) + "px " 
						+ (-1 * (canvas.tool.current.region.height / 2 - editPanel.cp.scale.halfWidth)) + "px";
				main.setAttr(
					editPanel.cp.scale.rb.instance.style,
					{transformOrigin:origin, msTransformOrigin:origin, webkitTransformOrigin:origin, 
						oTranformOrigin:origin, mozTransformOrigin:origin,
						transform:rotate, msTransform:rotate, webkitTransform:rotate, oTransform:rotate, mozTransform:rotate}
				);
			},
		},
		source:{
			init:function(){
				editPanel.cp.scale.setScale(editPanel.cp.scale.source, 8, "n");
			},
			eventMouseDown:function(){
				editPanel.cp.scale.eventMouseDown(editPanel.cp.scale.source);
			},
			eventMouseMove:function(e){
				var x = e.clientX - canvas.offsetX;
				var y = e.clientY - canvas.offsetY;
				editPanel.cp.scale.scale(x, y, canvas.tool.current.dest.x, canvas.tool.current.dest.y);
			},
			eventMouseUp:function(){
				editPanel.cp.scale.eventMouseUp(editPanel.cp.scale.source);
			},
		},
		dest:{
			init:function(){
				editPanel.cp.scale.setScale(editPanel.cp.scale.dest, 9, "s");
			},
			eventMouseDown:function(){
				editPanel.cp.scale.eventMouseDown(editPanel.cp.scale.dest);
			},
			eventMouseMove:function(e){
				var x = e.clientX - canvas.offsetX;
				var y = e.clientY - canvas.offsetY;
				editPanel.cp.scale.scale(canvas.tool.current.source.x, canvas.tool.current.source.y, x, y);
			},
			eventMouseUp:function(){
				editPanel.cp.scale.eventMouseUp(editPanel.cp.scale.dest);
			},
		},
		array:[],
	},
	rotate:{
		init:function(){
			main.setAttr(editPanel.cp.rotate, setting.value.editPanel.cp.rotate);
			
			editPanel.cp.rotate.instance = main.createElement(
				"div",
				{id:editPanel.cp.rotate.id},
				{cursor:"url(" + source.image.editPanel.cp.rotate.cursor.src + "),default", zIndex:editPanel.cp.zIndex},
				{mousedown:editPanel.cp.rotate.eventMouseDown},
				document.body
			);
			editPanel.cp.rotate.bg =  source.image.editPanel.cp.rotate.bg.instance;
			editPanel.cp.rotate.instance.appendChild(editPanel.cp.rotate.bg);
		},
		rotate:function(){
			canvas.process.context.clearRect(0, 0, canvas.width, canvas.height);
			canvas.process.context.translate(canvas.tool.current.region.centerX, canvas.tool.current.region.centerY);
			canvas.process.context.rotate(editPanel.cp.rotate.radian);
			if(canvas.tool.current.id == canvas.tool.select.id){
				try{
					canvas.process.context.drawImage(
						canvas.temp.instance,
						canvas.tool.select.origin.x, canvas.tool.select.origin.y,
						canvas.tool.select.origin.w, canvas.tool.select.origin.h,
						canvas.tool.select.region.minX - canvas.tool.select.region.centerX, 
						canvas.tool.select.region.minY - canvas.tool.select.region.centerY,
						canvas.tool.select.region.width, canvas.tool.select.region.height
					);
				}catch(e){}
			}else{
				canvas.tool.current.stroke(true);
			}
			
			editPanel.cp.rotate.rotateCP(editPanel.cp.rotate.radian * 180 / Math.PI);
			canvas.process.context.setTransform(1, 0, 0, 1, 0, 0);
		},
		rotateCP:function(degree){
			var rotate = "rotate(" + degree + "deg)";
			var origin = degree == 0 
				? "0px 0px" 
				:  editPanel.cp.scale.width + "px " + (canvas.tool.current.region.centerY + canvas.offsetY - editPanel.cp.rotate.position.y) + "px";
			main.setAttr(
				editPanel.cp.rotate.instance.style,
				{transformOrigin:origin, msTransformOrigin:origin, WebkitTransformOrigin:origin, OTranformOrigin:origin, MozTransformOrigin:origin,
					transform:rotate, msTransform:rotate, WebkitTransform:rotate, OTransform:rotate, MozTransform:rotate}
			);
		},
		calVector:function(x1, y1, x2, y2){
			var vector = new Object();
			vector.x = x2 - x1;
			vector.y = y2 - y1;
			vector.length = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
			return vector;
		},
		calRadian:function(vectorX, vectorY){
			var cos = (vectorX.x * vectorY.x + vectorX.y * vectorY.y) / (vectorX.length * vectorY.length);
			var radian = (vectorX.x < vectorY.x) ? Math.PI * 2 - Math.acos(cos) : Math.acos(cos);
			return radian;
		},
		eventMouseDown:function(){
			main.mask.show();
			main.addEvent(
				main.mask.instance,
				{mousemove:editPanel.cp.rotate.eventMouseMove, mouseup:editPanel.cp.rotate.eventMouseUp}
			);
			main.setAttr(main.mask.instance.style, {cursor:editPanel.cp.rotate.instance.style.cursor});
		},
		eventMouseMove:function(e){
			var centerX = canvas.tool.current.region.centerX + canvas.offsetX;
			var centerY = canvas.tool.current.region.centerY + canvas.offsetY;
			var vectorX = editPanel.cp.rotate.calVector(centerX, centerY, e.clientX, e.clientY);
			var vectorY = editPanel.cp.rotate.calVector(centerX, centerY, editPanel.cp.rotate.position.x, editPanel.cp.rotate.position.y);
			editPanel.cp.rotate.radian = editPanel.cp.rotate.calRadian(vectorX, vectorY);
			
			editPanel.cp.rotate.rotate();
		},
		eventMouseUp:function(){
			main.mask.hide();
			main.removeEvent(
				main.mask.instance,
				{mousemove:editPanel.cp.rotate.eventMouseMove, mouseup:editPanel.cp.rotate.eventMouseUp}
			);
			main.setAttr(main.mask.instance.style, {cursor:canvas.tool.current.cursor});
		},
		position:{},
		radian:0,
	},
};