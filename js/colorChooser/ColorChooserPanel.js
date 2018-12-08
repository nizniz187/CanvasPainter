colorChooser.panel = {
	init:function(){
		colorChooser.panel.zIndex = ++main.zIndex;
	
		colorChooser.panel.plate.init();
		colorChooser.panel.bright.init();
		colorChooser.panel.opacity.init();
	},
	setPanel:function(panel){
		panel.instance = main.createElement(
			"canvas", 
			{id:panel.id, width:panel.width + "", height:panel.height + "", className:panel.className}, 
			{left:panel.offsetX + "px", top:panel.offsetY + "px", zIndex:colorChooser.panel.zIndex}, 
			null, 
			colorChooser.instance
		);
		panel.context = panel.instance.getContext("2d");
	},
	setGlass:function(panel){
		panel.glass.instance = main.createElement(
			"div",
			{id:panel.glass.id, className:panel.glass.className},
			{width:panel.width + "px", height:panel.height + "px", 
				left:panel.offsetX + panel.glass.offsetX + "px", top:panel.offsetY + panel.glass.offsetY + "px",
				zIndex:colorChooser.panel.zIndex + 2 + ""},
			{mousedown:panel.eventMouseDown},
			colorChooser.instance
		);
	},
	setCursor:function(panel, img, left, top, event){
		panel.cursor.instance = img;
		main.setAttr(panel.cursor.instance, {id:panel.cursor.id, className:panel.cursor.className});
		main.setAttr(panel.cursor.instance.style, {left:left + "px", top:top + "px", zIndex:colorChooser.panel.zIndex + 1 + ""});
		if(event){
			main.addEvent(panel.cursor.instance, {mousedown:panel.eventMouseDown});
		}
		colorChooser.instance.appendChild(panel.cursor.instance);
	},
	setCursorPosition:function(cursor, x, y){
		main.setAttr(cursor.instance.style, {left:x + "px", top:y + "px"});
	},
	adjustCursorPosition:function(panel, x, y){
		if(x < panel.minLeft){
			x = panel.minLeft;
		}else if(x > panel.maxLeft){
			x = panel.maxLeft;
		}
		if(y < panel.minTop){
			y = panel.minTop;
		}else if(y > panel.maxTop){
			y = panel.maxTop;
		}
		main.setAttr(panel.cursor.gPosition, {x:x, y:y});
	},
	chooseColor:function(panel){
		var index = panel.width * panel.cursor.lPosition.y * 4 + panel.cursor.lPosition.x * 4;
		if(index > panel.imageData.data.length - 3){
			index = panel.imageData.data.length - 3;
		}
		var a = panel.imageData.data[index + 3] * 1 / 256;
		if(index > (panel.height - 1) * panel.width * 4){
			if(panel.id == "colorPlate"){
				colorChooser.color.setColor(127, 127, 127);
			}else if(panel.id == "colorBright"){
				colorChooser.color.setColor(0, 0, 0);
			}else{
				colorChooser.color.a = 1;
			}
		}else{
			colorChooser.color.setColor(panel.imageData.data[index], panel.imageData.data[index + 1], panel.imageData.data[index + 2], a);
		}
	},
	position:function(r, g, b, a){
		var hsl = colorChooser.color.rgbToHsl(r, g, b);
		var x = colorChooser.color.h / colorChooser.panel.plate.wStep + colorChooser.panel.plate.cursor.offsetX;
		var y = (colorChooser.color.s < 3) 
			? (colorChooser.panel.plate.height + colorChooser.panel.plate.maxTopOffset)
			: ((100 - colorChooser.color.s) / colorChooser.panel.plate.hStep);
		y += colorChooser.panel.plate.cursor.offsetY;
		main.setAttr(colorChooser.panel.plate.cursor.lPosition, {x:x, y:y});
		colorChooser.panel.setCursorPosition(colorChooser.panel.plate.cursor, x, y);
		
		colorChooser.panel.bright.setGradient();		
		x = colorChooser.panel.bright.cursor.left;
		y = (colorChooser.color.l < 3)
			? (colorChooser.panel.bright.height + colorChooser.panel.bright.maxTopOffset)
			: ((100 - colorChooser.color.l) / colorChooser.panel.bright.hStep);
		y += colorChooser.panel.bright.cursor.offsetY;
		main.setAttr(colorChooser.panel.bright.cursor.lPosition, {x:x, y:y});
		colorChooser.panel.setCursorPosition(colorChooser.panel.bright.cursor, x, y);
		
		colorChooser.panel.opacity.setGradient();
		x = colorChooser.panel.opacity.cursor.left;
		y = (a > 0.7)
			? (colorChooser.panel.opacity.height + colorChooser.panel.opacity.maxTopOffset)
			: (Math.floor(a * 100 / colorChooser.panel.opacity.hStep));
		y += colorChooser.panel.opacity.cursor.offsetY;
		main.setAttr(colorChooser.panel.opacity.cursor.lPosition, {x:x, y:y});
		colorChooser.panel.setCursorPosition(colorChooser.panel.opacity.cursor, x, y);
	},
	plate:{
		init:function(){
			//Set panel.
			main.setAttr(colorChooser.panel.plate, setting.value.colorChooser.panel.plate);
			main.setAttr(
				colorChooser.panel.plate, 
				{minLeft:colorChooser.offsetX + colorChooser.panel.plate.offsetX + colorChooser.panel.plate.minLeftOffset,
					minTop:colorChooser.offsetY + colorChooser.panel.plate.offsetY + colorChooser.panel.plate.minTopOffset}
			);
			main.setAttr(
				colorChooser.panel.plate,
				{maxLeft:colorChooser.panel.plate.minLeft + colorChooser.panel.plate.width + colorChooser.panel.plate.maxLeftOffset,
					maxTop:colorChooser.panel.plate.minTop + colorChooser.panel.plate.height + colorChooser.panel.plate.maxTopOffset}
			);
			colorChooser.panel.setPanel(colorChooser.panel.plate);
			
			//Set gradient.
			main.setAttr(
				colorChooser.panel.plate,
				{imageData:colorChooser.panel.plate.context.getImageData(0, 0, colorChooser.panel.plate.width, colorChooser.panel.plate.height),
					wStep:361 / colorChooser.panel.plate.width, hStep:101 / colorChooser.panel.plate.height},
				true
			)
			colorChooser.panel.plate.setGradient();
			
			//Set cursor.
			main.setAttr(colorChooser.panel.plate.cursor, setting.value.colorChooser.panel.plate.cursor);
			colorChooser.panel.setCursor(
				colorChooser.panel.plate,
				source.image.colorChooser.panel.plate.cursor.instance,
				colorChooser.panel.plate.offsetX - Math.floor(colorChooser.panel.plate.cursor.width / 2), 
				colorChooser.panel.plate.offsetY - Math.floor(colorChooser.panel.plate.cursor.height / 2)
			);
				
			//Set glass.
			main.setAttr(colorChooser.panel.plate.glass, setting.value.colorChooser.panel.plate.glass);
			colorChooser.panel.setGlass(colorChooser.panel.plate);
			
		},
		setGradient:function(){
			var index = 0;
			var rgb;
			for(var s = 100; s >= 0; s -= colorChooser.panel.plate.hStep){
				for(var h = 0; h <= 360; h += colorChooser.panel.plate.wStep){
					rgb = colorChooser.color.hslToRgb(h, s, 50, index);
					colorChooser.panel.plate.imageData.data[index] = rgb.r;
					colorChooser.panel.plate.imageData.data[index + 1] = rgb.g;
					colorChooser.panel.plate.imageData.data[index + 2] = rgb.b;
					colorChooser.panel.plate.imageData.data[index + 3] = 255;
					index += 4;
				}
			}
			while(index < colorChooser.panel.plate.imageData.data.length){
				colorChooser.panel.plate.imageData.data[index] = rgb.r;
				colorChooser.panel.plate.imageData.data[index + 1] = rgb.g;
				colorChooser.panel.plate.imageData.data[index + 2] = rgb.b;
				colorChooser.panel.plate.imageData.data[index + 3] = 255;
				index += 4;
			}
			colorChooser.panel.plate.context.putImageData(colorChooser.panel.plate.imageData, 0, 0);
		},
		eventMouseDown:function(e){
			var x = Math.floor(e.clientX - colorChooser.panel.plate.offsetX - colorChooser.offsetX) 
				 + colorChooser.panel.plate.colorAdjustX;
			var y = Math.floor(e.clientY - colorChooser.panel.plate.offsetY - colorChooser.offsetY)
				 + colorChooser.panel.plate.colorAdjustY;
			main.setAttr(colorChooser.panel.plate.cursor.lPosition, {x:x, y:y});
			colorChooser.panel.setCursorPosition(
				colorChooser.panel.plate.cursor, 
				x + colorChooser.panel.plate.cursor.offsetX, 
				y + colorChooser.panel.plate.cursor.offsetY
			);
			
			colorChooser.panel.chooseColor(colorChooser.panel.plate);
			colorChooser.panel.bright.setGradient();
			colorChooser.panel.chooseColor(colorChooser.panel.bright);
			colorChooser.panel.opacity.setGradient();
			colorChooser.panel.chooseColor(colorChooser.panel.opacity);
			colorChooser.preview.setColor(colorChooser.preview.chosen);
			colorChooser.info.setColorInfo();
			main.addEvent(document.body, {mousemove:colorChooser.panel.plate.eventMouseMove, mouseup:colorChooser.panel.plate.eventMouseUp});
		},
		eventMouseMove:function(e){
			colorChooser.panel.adjustCursorPosition(colorChooser.panel.plate, e.clientX, e.clientY);
			var x = Math.floor(colorChooser.panel.plate.cursor.gPosition.x - colorChooser.panel.plate.offsetX - colorChooser.offsetX);
			var y = Math.floor(colorChooser.panel.plate.cursor.gPosition.y - colorChooser.panel.plate.offsetY - colorChooser.offsetY) - 1;
			main.setAttr(colorChooser.panel.plate.cursor.lPosition, {x:x, y:y});
			colorChooser.panel.setCursorPosition(
				colorChooser.panel.plate.cursor, 
				x + colorChooser.panel.plate.cursor.offsetX, 
				y + colorChooser.panel.plate.cursor.offsetY
			);
			
			colorChooser.panel.chooseColor(colorChooser.panel.plate);
			colorChooser.panel.bright.setGradient();
			colorChooser.panel.chooseColor(colorChooser.panel.bright);
			colorChooser.panel.opacity.setGradient();
			colorChooser.panel.chooseColor(colorChooser.panel.opacity);
			colorChooser.preview.setColor(colorChooser.preview.chosen);
			colorChooser.info.setColorInfo();
		},
		eventMouseUp:function(){
			main.removeEvent(document.body, {mousemove:colorChooser.panel.plate.eventMouseMove, mouseup:colorChooser.panel.plate.eventMouseUp});
		},
		cursor:{
			gPosition:{x:null, y:null},
			lPosition:{x:null, y:null},
		},
		glass:{},
	},
	bright:{
		init:function(){
			//Set panel.
			main.setAttr(colorChooser.panel.bright, setting.value.colorChooser.panel.bright);
			main.setAttr(
				colorChooser.panel.bright, 
				{minLeft:colorChooser.offsetX + colorChooser.panel.bright.offsetX + colorChooser.panel.bright.minLeftOffset,
					minTop:colorChooser.offsetY + colorChooser.panel.bright.offsetY + colorChooser.panel.bright.minTopOffset}
			);
			main.setAttr(
				colorChooser.panel.bright,
				{maxLeft:colorChooser.panel.bright.minLeft + colorChooser.panel.bright.width + colorChooser.panel.bright.maxLeftOffset,
					maxTop:colorChooser.panel.bright.minTop + colorChooser.panel.bright.height + colorChooser.panel.bright.maxTopOffset}
			);
			
			colorChooser.panel.setPanel(colorChooser.panel.bright);
			colorChooser.panel.bright.imageData = 
				colorChooser.panel.bright.context.getImageData(0, 0, colorChooser.panel.bright.width, colorChooser.panel.bright.height);
			colorChooser.panel.bright.hStep = 101 / colorChooser.panel.bright.height;
			colorChooser.panel.bright.setGradient();
			
			//Set cursor.
			main.setAttr(colorChooser.panel.bright.cursor, setting.value.colorChooser.panel.bright.cursor);
			colorChooser.panel.bright.cursor.left = colorChooser.panel.bright.offsetX + colorChooser.panel.bright.width + 1;
			colorChooser.panel.setCursor(
				colorChooser.panel.bright,
				source.image.colorChooser.panel.bright.cursor.instance,
				colorChooser.panel.bright.cursor.left, 
				colorChooser.panel.bright.offsetY - colorChooser.panel.bright.cursor.height / 2,
				true
			);
				
			//Set glass.
			main.setAttr(colorChooser.panel.bright.glass, setting.value.colorChooser.panel.bright.glass);
			colorChooser.panel.setGlass(colorChooser.panel.bright);
			
		},
		setGradient:function(){
			var index = 0;
			var rgb;
			for(var l = 100; l >= 0; l -= colorChooser.panel.bright.hStep){
				for(var i = 0; i < colorChooser.panel.bright.width; i++){
					rgb = colorChooser.color.hslToRgb(colorChooser.color.h, colorChooser.color.s, l, index);
					colorChooser.panel.bright.imageData.data[index] = rgb.r;
					colorChooser.panel.bright.imageData.data[index + 1] = rgb.g;
					colorChooser.panel.bright.imageData.data[index + 2] = rgb.b;
					colorChooser.panel.bright.imageData.data[index + 3] = 255;
					index += 4;
				}
			}
			while(index < colorChooser.panel.bright.imageData.data.length){
				colorChooser.panel.bright.imageData.data[index] = rgb.r;
				colorChooser.panel.bright.imageData.data[index + 1] = rgb.g;
				colorChooser.panel.bright.imageData.data[index + 2] = rgb.b;
				colorChooser.panel.bright.imageData.data[index + 3] = 255;
				index += 4;
			}
			colorChooser.panel.bright.context.putImageData(colorChooser.panel.bright.imageData, 0, 0);
		},
		eventMouseDown:function(e){
			colorChooser.panel.adjustCursorPosition(colorChooser.panel.bright, e.clientX, e.clientY);
			var x = Math.floor(colorChooser.panel.bright.cursor.gPosition.x - colorChooser.panel.bright.offsetX - colorChooser.offsetX)
				 + colorChooser.panel.bright.colorAdjustX;
			var y = Math.floor(colorChooser.panel.bright.cursor.gPosition.y - colorChooser.panel.bright.offsetY - colorChooser.offsetY)
				 + colorChooser.panel.bright.colorAdjustY;
			main.setAttr(colorChooser.panel.bright.cursor.lPosition, {x:x, y:y});
			colorChooser.panel.setCursorPosition(
				colorChooser.panel.bright.cursor, 
				colorChooser.panel.bright.cursor.left, 
				y + colorChooser.panel.bright.cursor.offsetY
			);
			
			colorChooser.panel.chooseColor(colorChooser.panel.bright);
			colorChooser.panel.opacity.setGradient();
			colorChooser.panel.chooseColor(colorChooser.panel.opacity);
			colorChooser.preview.setColor(colorChooser.preview.chosen);
			colorChooser.info.setColorInfo();
			main.addEvent(document.body, {mousemove:colorChooser.panel.bright.eventMouseMove, mouseup:colorChooser.panel.bright.eventMouseUp});
		},
		eventMouseMove:function(e){
			colorChooser.panel.adjustCursorPosition(colorChooser.panel.bright, e.clientX, e.clientY);
			var x = Math.floor(colorChooser.panel.bright.cursor.gPosition.x - colorChooser.panel.bright.offsetX - colorChooser.offsetX)
				 + colorChooser.panel.bright.colorAdjustX;
			var y = Math.floor(colorChooser.panel.bright.cursor.gPosition.y - colorChooser.panel.bright.offsetY - colorChooser.offsetY)
				 + colorChooser.panel.bright.colorAdjustY;
			main.setAttr(colorChooser.panel.bright.cursor.lPosition, {x:x, y:y});
			colorChooser.panel.setCursorPosition(
				colorChooser.panel.bright.cursor, 
				colorChooser.panel.bright.cursor.left, 
				y + colorChooser.panel.bright.cursor.offsetY
			);
			colorChooser.panel.setCursorPosition(
				colorChooser.panel.bright.cursor, colorChooser.panel.bright.cursor.left, y + colorChooser.panel.bright.cursor.offsetY);
			colorChooser.panel.chooseColor(colorChooser.panel.bright);
			colorChooser.panel.opacity.setGradient();
			colorChooser.panel.chooseColor(colorChooser.panel.opacity);
			colorChooser.preview.setColor(colorChooser.preview.chosen);
			colorChooser.info.setColorInfo();
		},
		eventMouseUp:function(){
			main.removeEvent(document.body, {mousemove:colorChooser.panel.bright.eventMouseMove, mouseup:colorChooser.panel.bright.eventMouseUp});
		},
		cursor:{
			gPosition:{x:null, y:null},
			lPosition:{x:null, y:null},
		},
		glass:{},
	},
	opacity:{
		init:function(){
			main.setAttr(colorChooser.panel.opacity, setting.value.colorChooser.panel.opacity);
			
			//Set background image.
			colorChooser.panel.opacity.bg.instance = main.createElement(
				"div",
				{className:colorChooser.panel.opacity.className},
				{width:colorChooser.panel.opacity.width + "px", height:colorChooser.panel.opacity.height + "px", 
					left:colorChooser.panel.opacity.offsetX + "px",	top:colorChooser.panel.opacity.offsetY + "px", 
					backgroundImage:"url(" + setting.source.img.colorChooser.opacity + ")"},
				null,
				colorChooser.instance
			);
		
			//Set panel.
			main.setAttr(
				colorChooser.panel.opacity, 
				{minLeft:colorChooser.offsetX + colorChooser.panel.opacity.offsetX + colorChooser.panel.opacity.minLeftOffset,
					minTop:colorChooser.offsetY + colorChooser.panel.opacity.offsetY + colorChooser.panel.opacity.minTopOffset}
			);
			main.setAttr(
				colorChooser.panel.opacity,
				{maxLeft:colorChooser.panel.opacity.minLeft + colorChooser.panel.opacity.width + colorChooser.panel.opacity.maxLeftOffset,
					maxTop:colorChooser.panel.opacity.minTop + colorChooser.panel.opacity.height + colorChooser.panel.opacity.maxTopOffset}
			);
			
			colorChooser.panel.setPanel(colorChooser.panel.opacity);
			colorChooser.panel.opacity.hStep = 101 / colorChooser.panel.opacity.height;
			colorChooser.panel.opacity.setGradient();
			
			//Set cursor.
			main.setAttr(colorChooser.panel.opacity.cursor, setting.value.colorChooser.panel.opacity.cursor);
			colorChooser.panel.opacity.cursor.left = colorChooser.panel.opacity.offsetX + colorChooser.panel.opacity.width + 1;
			colorChooser.panel.setCursor(
				colorChooser.panel.opacity,
				source.image.colorChooser.panel.opacity.cursor.instance,
				colorChooser.panel.opacity.cursor.left, 
				colorChooser.panel.opacity.offsetY - colorChooser.panel.opacity.cursor.height / 2,
				true
			);
				
			//Set glass.
			main.setAttr(colorChooser.panel.opacity.glass, setting.value.colorChooser.panel.opacity.glass);
			colorChooser.panel.setGlass(colorChooser.panel.opacity);
			
		},
		setGradient:function(){
			colorChooser.panel.opacity.context.clearRect(0, 0, colorChooser.panel.opacity.width, colorChooser.panel.opacity.height);
			
			var gradient = colorChooser.panel.opacity.context.createLinearGradient(0, 0, 0, colorChooser.panel.opacity.height);
			gradient.addColorStop(0, "rgba(" + colorChooser.color.r + ", " + colorChooser.color.g + ", " + colorChooser.color.b + ", 0)");
			gradient.addColorStop(1, "rgba(" + colorChooser.color.r + ", " + colorChooser.color.g + ", " + colorChooser.color.b + ", 1)");
			colorChooser.panel.opacity.context.fillStyle = gradient;
			colorChooser.panel.opacity.context.fillRect(0, 0, colorChooser.panel.opacity.width, colorChooser.panel.opacity.height);
			
			colorChooser.panel.opacity.imageData = 
				colorChooser.panel.opacity.context.getImageData(0, 0, colorChooser.panel.opacity.width, colorChooser.panel.opacity.height);
		},
		eventMouseDown:function(e){
			colorChooser.panel.adjustCursorPosition(colorChooser.panel.opacity, e.clientX, e.clientY);
			var x = Math.floor(colorChooser.panel.opacity.cursor.gPosition.x - colorChooser.panel.opacity.offsetX - colorChooser.offsetX)
				 + colorChooser.panel.opacity.colorAdjustX;
			var y = Math.floor(colorChooser.panel.opacity.cursor.gPosition.y - colorChooser.panel.opacity.offsetY - colorChooser.offsetY)
				 + colorChooser.panel.opacity.colorAdjustY;
			main.setAttr(colorChooser.panel.opacity.cursor.lPosition, {x:x, y:y});
			colorChooser.panel.setCursorPosition(
				colorChooser.panel.opacity.cursor, 
				colorChooser.panel.opacity.cursor.left, 
				y + colorChooser.panel.opacity.cursor.offsetY
			);
			
			colorChooser.panel.chooseColor(colorChooser.panel.opacity);
			colorChooser.preview.setColor(colorChooser.preview.chosen);
			colorChooser.info.setColorInfo();
			main.addEvent(document.body, {mousemove:colorChooser.panel.opacity.eventMouseMove, mouseup:colorChooser.panel.opacity.eventMouseUp});
		},
		eventMouseMove:function(e){
			colorChooser.panel.adjustCursorPosition(colorChooser.panel.opacity, e.clientX, e.clientY);
			var x = Math.floor(colorChooser.panel.opacity.cursor.gPosition.x - colorChooser.panel.opacity.offsetX - colorChooser.offsetX)
				 + colorChooser.panel.opacity.colorAdjustX;
			var y = Math.floor(colorChooser.panel.opacity.cursor.gPosition.y - colorChooser.panel.opacity.offsetY - colorChooser.offsetY)
				 + colorChooser.panel.opacity.colorAdjustY;
			main.setAttr(colorChooser.panel.opacity.cursor.lPosition, {x:x, y:y});
			colorChooser.panel.setCursorPosition(
				colorChooser.panel.opacity.cursor, 
				colorChooser.panel.opacity.cursor.left, 
				y + colorChooser.panel.opacity.cursor.offsetY
			);
			colorChooser.panel.setCursorPosition(
				colorChooser.panel.opacity.cursor, colorChooser.panel.opacity.cursor.left, y + colorChooser.panel.opacity.cursor.offsetY);
			colorChooser.panel.chooseColor(colorChooser.panel.opacity);
			colorChooser.preview.setColor(colorChooser.preview.chosen);
			colorChooser.info.setColorInfo();
		},
		eventMouseUp:function(){
			main.removeEvent(document.body, {mousemove:colorChooser.panel.opacity.eventMouseMove, mouseup:colorChooser.panel.opacity.eventMouseUp});
		},
		cursor:{
			gPosition:{x:null, y:null},
			lPosition:{x:null, y:null},
		},
		glass:{},
		bg:{},
	},
};