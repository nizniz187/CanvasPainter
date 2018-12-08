canvas.tool = {
	init:function(){
		canvas.tool.lineWidth.init();
		canvas.tool.path.init();
		canvas.tool.eraser.init();
		canvas.tool.line.init();
		canvas.tool.rect.init();
		canvas.tool.circle.init();
		canvas.tool.select.init();
		canvas.tool.colorChooser.init();
		canvas.tool.colorPicker.init();
		canvas.tool.undo.init();
		canvas.tool.redo.init();
	},
	setToolEvent:function(tool, current){
		if(current){
			main.removeEvent(canvas.glass.instance, {mousedown:current.eventMouseDown});
			toolbar.setChosen(tool.button, current.button);
		}
		else{
			toolbar.setChosen(tool.button);
		}
		canvas.tool.current = tool;
		main.addEvent(canvas.glass.instance, {mousedown:tool.eventMouseDown});
	},
	setRegion:function(x1, y1, x2, y2){
		canvas.tool.current.region.minX = Math.min(x1, x2);
		canvas.tool.current.region.maxX = Math.max(x1, x2);
		canvas.tool.current.region.minY = Math.min(y1, y2);
		canvas.tool.current.region.maxY = Math.max(y1, y2);
		canvas.tool.current.region.width = canvas.tool.current.region.maxX - canvas.tool.current.region.minX;
		canvas.tool.current.region.height = canvas.tool.current.region.maxY - canvas.tool.current.region.minY;
		canvas.tool.current.region.centerX = canvas.tool.current.region.minX + canvas.tool.current.region.width / 2;
		canvas.tool.current.region.centerY = canvas.tool.current.region.minY + canvas.tool.current.region.height / 2;
	},
	setCursor:function(cursor, useGlassCursor){
		main.setAttr(canvas.glass.instance.style, {cursor:cursor});
		if(main.mask.instance){
			main.setAttr(main.mask.instance.style, {cursor:cursor});
		}
		if(useGlassCursor){
			canvas.glass.cursor.show();
		}else if(main.mask.instance){
			canvas.glass.cursor.hide();
		}
	},
	current:null,
	lineWidth:{
		init:function(){
			canvas.tool.lineWidth.range = range.createRange(
				"toolLineWidthRange",  
				++main.zIndex, 
				canvas.lineWidthMin, 
				canvas.lineWidthMax, 
				canvas.lineWidth,
				toolbar.lineWidth.offsetX + toolbar.buttonWidth / 2 - range.width / 2,
				toolbar.lineWidth.offsetY - range.height
			);
			main.addEvent(canvas.tool.lineWidth.range.ctrller.instance, {mousedown:canvas.tool.lineWidth.eventMouseDown});
			main.addEvent(canvas.tool.lineWidth.range.text.instance, {change:canvas.tool.lineWidth.eventChange});
			
			document.body.appendChild(canvas.tool.lineWidth.range.instance);
			canvas.tool.lineWidth.button = document.getElementById(setting.value.toolbar.lineWidth.id);
			main.addEvent(canvas.tool.lineWidth.button, {click:canvas.tool.lineWidth.eventClick});
		},
		setZIndex:function(zIndex){
			canvas.tool.lineWidth.range.instance.style.zIndex = zIndex;
		},
		setLineWidth:function(lineWidth){
			canvas.tool.lineWidth.range.ctrller.setValue(lineWidth);
			canvas.tool.lineWidth.range.text.setValue(lineWidth);
		},
		eventClick:function(){
			if(!canvas.tool.lineWidth.range.display){
				canvas.tool.lineWidth.range.show();
				canvas.tool.lineWidth.range.display = true;
			}else{
				canvas.tool.lineWidth.range.hide();
				canvas.tool.lineWidth.range.display = false;
			}
			editPanel.reset();
		},
		eventMouseDown:function(){
			main.addEvent(
				document.body, 
				{mousemove:canvas.tool.lineWidth.eventMouseMove, mouseup:canvas.tool.lineWidth.eventMouseUp}
			);
		},
		eventMouseMove:function(){
			canvas.setLineWidth(canvas.tool.lineWidth.range.value);
		},
		eventMouseUp:function(){
			main.removeEvent(
				document.body, 
				{mousemove:canvas.tool.lineWidth.eventMouseMove, mouseup:canvas.tool.lineWidth.eventMouseUp}
			);
		},
		eventChange:function(){
			canvas.setLineWidth(canvas.tool.lineWidth.range.value);
		},
	},
	path:{
		init:function(){
			main.setAttr(canvas.tool.path, setting.value.canvas.tool.path);
			canvas.tool.path.button = document.getElementById(setting.value.toolbar.path.id);
			main.addEvent(canvas.tool.path.button, {click:canvas.tool.path.setToolCurrent});
		},
		setToolCurrent:function(){
			canvas.tool.setToolEvent(canvas.tool.path, canvas.tool.current);
			canvas.tool.setCursor(canvas.tool.path.cursor, true);
			canvas.setColor(canvas.color);
			editPanel.reset();
			canvas.tool.lineWidth.range.hide();
		},
		eventMouseDown:function(e){
			canvas.tool.lineWidth.range.hide();
			
			var point = {x:e.clientX - canvas.offsetX, y:e.clientY - canvas.offsetY};
			canvas.tool.path.track = new Array();
			canvas.tool.path.track.push(point);
			canvas.clear(canvas.process);
			canvas.tool.path.stroke();
			
			main.mask.show();
			canvas.glass.cursor.hide(true);
			main.addEvent(main.mask.instance, {mousemove:canvas.tool.path.eventMouseMove, mouseup:canvas.tool.path.eventMouseUp});
		},
		eventMouseMove:function(e){
			var point = {x:e.clientX - canvas.offsetX, y:e.clientY - canvas.offsetY};
			canvas.tool.path.track.push(point);
			canvas.clear(canvas.process);
			canvas.tool.path.stroke();
		},
		eventMouseUp:function(e){
			main.mask.hide();
			canvas.glass.cursor.show(true);
			main.removeEvent(main.mask.instance, {mousemove:canvas.tool.path.eventMouseMove, mouseup:canvas.tool.path.eventMouseUp});
			
			canvas.update();
		},
		stroke:function(){
			if(canvas.tool.path.track.length == 1){
				canvas.process.context.strokeRect(canvas.tool.path.track[0].x, canvas.tool.path.track[0].y, 0.01, 0.01);
			}
			
			canvas.process.context.beginPath();
			canvas.process.context.moveTo(canvas.tool.path.track[0].x, canvas.tool.path.track[0].y);
			for(var i = 0; i < canvas.tool.path.track.length; i++){
				canvas.process.context.lineTo(canvas.tool.path.track[i].x, canvas.tool.path.track[i].y);
			}
			canvas.process.context.stroke();
			canvas.process.context.closePath();
		},
	},
	eraser:{
		init:function(){
			main.setAttr(canvas.tool.eraser, setting.value.canvas.tool.eraser);
			main.setAttr(
				canvas.tool.eraser, 
				{eventMouseDown:canvas.tool.path.eventMouseDown, eventMouseMove:canvas.tool.path.eventMouseMove, 
					eventMouseUp:canvas.tool.path.eventMouseUp, stroke:canvas.tool.path.stroke}
			);
			canvas.tool.eraser.button = document.getElementById(setting.value.toolbar.eraser.id);
			main.addEvent(canvas.tool.eraser.button, {click:canvas.tool.eraser.setToolCurrent});
		},
		setToolCurrent:function(){
			canvas.tool.setToolEvent(canvas.tool.eraser, canvas.tool.current);
			canvas.tool.setCursor(canvas.tool.eraser.cursor, true);
			canvas.setColor(canvas.bgColor);
			editPanel.reset();
			canvas.tool.lineWidth.range.hide();
		},
	},
	line:{
		init:function(){
			main.setAttr(canvas.tool.line, setting.value.canvas.tool.line);
			canvas.tool.line.button = document.getElementById(setting.value.toolbar.line.id);
			main.addEvent(canvas.tool.line.button, {click:canvas.tool.line.setToolCurrent});
		},
		setToolCurrent:function(){
			canvas.tool.setToolEvent(canvas.tool.line, canvas.tool.current);
			canvas.tool.setCursor(canvas.tool.line.cursor, true);
			canvas.setColor(canvas.color);
			editPanel.reset();
			canvas.tool.lineWidth.range.hide();
		},
		eventMouseDown:function(e){
			canvas.tool.lineWidth.range.hide();
			
			editPanel.reset();
			canvas.tool.line.source = {x:e.clientX - canvas.offsetX, y:e.clientY - canvas.offsetY};
			canvas.tool.line.dest = {};
			canvas.tool.line.region = {};
			
			main.mask.show();
			canvas.glass.cursor.hide(true);
			main.addEvent(main.mask.instance, {mousemove:canvas.tool.line.eventMouseMove, mouseup:canvas.tool.line.eventMouseUp});
		},
		eventMouseMove:function(e){
			canvas.tool.line.dest = {x:e.clientX - canvas.offsetX, y:e.clientY - canvas.offsetY};
			canvas.tool.setRegion(canvas.tool.line.source.x, canvas.tool.line.source.y, canvas.tool.line.dest.x, canvas.tool.line.dest.y);
			
			canvas.clear(canvas.process);
			canvas.tool.line.stroke();
		},
		eventMouseUp:function(e){
			main.mask.hide();
			canvas.glass.cursor.show(true);
			main.removeEvent(main.mask.instance, {mousemove:canvas.tool.line.eventMouseMove, mouseup:canvas.tool.line.eventMouseUp});
			
			if(canvas.tool.line.region.width > 0 || canvas.tool.line.region.height > 0){
				editPanel.show();
			}
		},
		stroke:function(){
			canvas.process.context.beginPath();
			canvas.process.context.moveTo(canvas.tool.line.source.x, canvas.tool.line.source.y);
			canvas.process.context.lineTo(canvas.tool.line.dest.x, canvas.tool.line.dest.y);
			canvas.process.context.closePath();
			canvas.process.context.stroke();
		},
		source:{},
		dest:{},
		region:{},
	},
	rect:{
		init:function(){
			main.setAttr(canvas.tool.rect, setting.value.canvas.tool.rect);
			canvas.tool.rect.button = document.getElementById(setting.value.toolbar.rect.id);
			main.addEvent(canvas.tool.rect.button, {click:canvas.tool.rect.setToolCurrent});
		},
		setToolCurrent:function(){
			canvas.tool.setToolEvent(canvas.tool.rect, canvas.tool.current);
			canvas.tool.setCursor(canvas.tool.line.cursor, true);
			canvas.setColor(canvas.color);
			editPanel.reset();
			canvas.tool.lineWidth.range.hide();
		},
		eventMouseDown:function(e){
			canvas.tool.lineWidth.range.hide();
			
			editPanel.reset();
			canvas.tool.rect.source = {x:e.clientX - canvas.offsetX, y:e.clientY - canvas.offsetY};
			canvas.tool.rect.region = {};
			
			main.mask.show();
			canvas.glass.cursor.hide(true);
			main.addEvent(main.mask.instance, {mousemove:canvas.tool.rect.eventMouseMove, mouseup:canvas.tool.rect.eventMouseUp});
		},
		eventMouseMove:function(e){
			canvas.tool.setRegion(e.clientX - canvas.offsetX, e.clientY - canvas.offsetY, canvas.tool.rect.source.x, canvas.tool.rect.source.y);
			canvas.clear(canvas.process);
			canvas.tool.rect.stroke();
		},
		eventMouseUp:function(e){
			main.mask.hide();
			canvas.glass.cursor.show(true);
			main.removeEvent(main.mask.instance, {mousemove:canvas.tool.rect.eventMouseMove, mouseup:canvas.tool.rect.eventMouseUp});
			
			if(canvas.tool.rect.region.width > 0 || canvas.tool.rect.region.height > 0){
				editPanel.show();
			}
		},
		stroke:function(rotate){
			if(!rotate){
				canvas.process.context.strokeRect(
					canvas.tool.rect.region.minX, canvas.tool.rect.region.minY, 
					canvas.tool.rect.region.width, canvas.tool.rect.region.height
				);
			}else{
				canvas.process.context.strokeRect(
					-0.5 * canvas.tool.rect.region.width, -0.5 * canvas.tool.rect.region.height,
					canvas.tool.rect.region.width, canvas.tool.rect.region.height
				);
			}
		},
		source:{},
		region:{},
	},
	circle:{
		init:function(){
			main.setAttr(canvas.tool.circle, setting.value.canvas.tool.circle);
			canvas.tool.circle.button = document.getElementById(setting.value.toolbar.circle.id);
			main.addEvent(canvas.tool.circle.button, {click:canvas.tool.circle.setToolCurrent});
		},
		setToolCurrent:function(){
			canvas.tool.setToolEvent(canvas.tool.circle, canvas.tool.current);
			canvas.tool.setCursor(canvas.tool.line.cursor, true);
			canvas.setColor(canvas.color);
			editPanel.reset();
			canvas.tool.lineWidth.range.hide();
		},
		eventMouseDown:function(e){
			canvas.tool.lineWidth.range.hide();
			
			editPanel.reset();
			canvas.tool.circle.source = {x:e.clientX - canvas.offsetX, y:e.clientY - canvas.offsetY};
			canvas.tool.circle.region = {};
			
			main.mask.show();
			canvas.glass.cursor.hide(true);
			main.addEvent(main.mask.instance, {mousemove:canvas.tool.circle.eventMouseMove, mouseup:canvas.tool.circle.eventMouseUp});
		},
		eventMouseMove:function(e){
			canvas.tool.setRegion(canvas.tool.circle.source.x, canvas.tool.circle.source.y, e.clientX - canvas.offsetX, e.clientY - canvas.offsetY);
			canvas.clear(canvas.process);
			canvas.tool.circle.stroke();
		},
		eventMouseUp:function(e){
			main.mask.hide();
			canvas.glass.cursor.show(true);
			main.removeEvent(main.mask.instance, {mousemove:canvas.tool.circle.eventMouseMove, mouseup:canvas.tool.circle.eventMouseUp});
			
			if(canvas.tool.circle.region.width > 0 || canvas.tool.circle.region.height > 0){
				editPanel.show();
			}
		},
		stroke:function(rotate){
			var offsetX = rotate ? canvas.tool.circle.region.width / 2 + canvas.tool.circle.region.minX : 0;
			var offsetY = rotate ? canvas.tool.circle.region.height / 2 + canvas.tool.circle.region.minY : 0;
			var minX = canvas.tool.circle.region.minX - offsetX;
			var maxX = canvas.tool.circle.region.maxX - offsetX;
			var minY = canvas.tool.circle.region.minY - offsetY;
			var maxY = canvas.tool.circle.region.maxY - offsetY;
			var xr = canvas.tool.circle.region.width / 2;
			var yr = canvas.tool.circle.region.height / 2;
			var xo = xr * canvas.tool.circle.kappa;
			var yo = yr * canvas.tool.circle.kappa;
			var xm = minX + xr;
			var ym = minY + yr;
			
			canvas.process.context.beginPath();
			canvas.process.context.moveTo(minX, ym);
			canvas.process.context.bezierCurveTo(minX, ym - yo, xm - xo, minY, xm, minY);
			canvas.process.context.bezierCurveTo(xm + xo, minY, maxX, ym - yo, maxX, ym);
			canvas.process.context.bezierCurveTo(maxX, ym + yo, xm + xo, maxY, xm, maxY);
			canvas.process.context.bezierCurveTo(xm - xo, maxY, minX, ym + yo, minX, ym);
			canvas.process.context.closePath();
			canvas.process.context.stroke();
		},
		source:{},
		region:{},
		kappa:0.5522848,
	},
	select:{
		init:function(){
			main.setAttr(canvas.tool.select, setting.value.canvas.tool.select);
			canvas.tool.select.button = document.getElementById(setting.value.toolbar.select.id);
			main.addEvent(canvas.tool.select.button, {click:canvas.tool.select.setToolCurrent});
		},
		setToolCurrent:function(){
			canvas.tool.setToolEvent(canvas.tool.select, canvas.tool.current);
			canvas.tool.setCursor(canvas.tool.select.cursor);
			editPanel.reset();
			canvas.tool.lineWidth.range.hide();
		},
		eventMouseDown:function(e){
			canvas.tool.lineWidth.range.hide();
			
			editPanel.reset();
			canvas.tool.select.source = {x:e.clientX - canvas.offsetX, y:e.clientY - canvas.offsetY};
			canvas.tool.select.region = canvas.tool.select.origin = {};
			
			main.mask.show();
			main.addEvent(main.mask.instance, {mousemove:canvas.tool.select.eventMouseMove, mouseup:canvas.tool.select.eventMouseUp});
		},
		eventMouseMove:function(e){
			canvas.tool.setRegion(e.clientX - canvas.offsetX, e.clientY - canvas.offsetY, canvas.tool.select.source.x, canvas.tool.select.source.y);
			main.setAttr(
				canvas.tool.select.origin, 
				{x:canvas.tool.select.region.minX, y:canvas.tool.select.region.minY, 
					w:canvas.tool.select.region.width, h:canvas.tool.select.region.height}
			);
			editPanel.show();
		},
		eventMouseUp:function(e){
			main.mask.hide();
			main.removeEvent(main.mask.instance, {mousemove:canvas.tool.select.eventMouseMove, mouseup:canvas.tool.select.eventMouseUp});
			
			if(canvas.tool.current.origin.w && canvas.tool.current.origin.h){
				canvas.process.context.drawImage(
					canvas.main.instance,
					canvas.tool.current.origin.x, canvas.tool.current.origin.y,
					canvas.tool.current.origin.w, canvas.tool.current.origin.h,
					canvas.tool.current.region.minX, canvas.tool.current.region.minY, 
					canvas.tool.current.region.width, canvas.tool.current.region.height
				);
				canvas.temp.context.drawImage(
					canvas.main.instance,
					canvas.tool.current.origin.x, canvas.tool.current.origin.y,
					canvas.tool.current.origin.w, canvas.tool.current.origin.h,
					canvas.tool.current.region.minX, canvas.tool.current.region.minY, 
					canvas.tool.current.region.width, canvas.tool.current.region.height
				);
				canvas.setColor(canvas.bgColor);
				canvas.main.context.fillRect(
					canvas.tool.current.origin.x, canvas.tool.current.origin.y,
					canvas.tool.current.origin.w, canvas.tool.current.origin.h
				);
				canvas.setColor(canvas.color);
				
				editPanel.cp.show();
			}
		},
		source:{},
		origin:{},
		region:{},
	},
	colorChooser:{
		init:function(){
			main.setAttr(canvas.tool.colorChooser, setting.value.canvas.tool.colorChooser);
			canvas.tool.colorChooser.button = document.getElementById(setting.value.toolbar.colorChooser.id);
			main.addEvent(canvas.tool.colorChooser.button, {click:canvas.tool.colorChooser.eventClick});
		},
		eventClick:function(){
			main.mask.show(true);
			canvas.tool.lineWidth.range.hide();
			colorChooser.show();
			editPanel.reset();
		},
	},
	colorPicker:{
		init:function(){
			main.setAttr(canvas.tool.colorPicker, setting.value.canvas.tool.colorPicker);
			main.setAttr(canvas.tool.colorPicker, {cursor:"url(" + source.image.canvas.tool.colorPicker.cursor.src + "),default"});
			
			canvas.tool.colorPicker.button = document.getElementById(setting.value.toolbar.colorPicker.id);
			main.addEvent(canvas.tool.colorPicker.button, {click:canvas.tool.colorPicker.setToolCurrent});
		},
		setToolCurrent:function(){
			canvas.tool.setToolEvent(canvas.tool.colorPicker, canvas.tool.current);
			canvas.tool.setCursor(canvas.tool.colorPicker.cursor);
			editPanel.reset();
			canvas.tool.lineWidth.range.hide();
		},
		eventMouseDown:function(e){
			canvas.tool.lineWidth.range.hide();
			
			var x = e.clientX - canvas.offsetX;
			var y = e.clientY - canvas.offsetY + canvas.tool.colorPicker.cursorOffsetY;
			var index = y * canvas.width * 4 + x * 4;
			var imageData = canvas.record.array[canvas.record.index].data;
			canvas.color = "rgba(" + imageData[index] + ", " + imageData[index + 1] + ", " + 
				imageData[index + 2] + ", " + imageData[index + 3] + ")";
			canvas.setColor(canvas.color);
		},
	},
	undo:{
		init:function(){
			main.setAttr(canvas.tool.undo, setting.value.canvas.tool.undo);
			canvas.tool.undo.button = document.getElementById(setting.value.toolbar.undo.id);
			main.addEvent(canvas.tool.undo.button, {click:canvas.tool.undo.eventClick});
		},
		eventClick:function(){
			canvas.tool.lineWidth.range.hide();
			
			canvas.record.undo();
		},
	},
	redo:{
		init:function(){
			main.setAttr(canvas.tool.redo, setting.value.canvas.tool.redo);
			canvas.tool.redo.button = document.getElementById(setting.value.toolbar.redo.id);
			main.addEvent(canvas.tool.redo.button, {click:canvas.tool.redo.eventClick});
		},
		eventClick:function(){
			canvas.tool.lineWidth.range.hide();
			
			canvas.record.redo();
		},
	},
};