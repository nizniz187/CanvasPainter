var canvas = {
	init:function(parent){	
		//Initialize canvas.
		main.setAttr(canvas, setting.value.canvas);
		main.setAttr(canvas, {maxClientX:canvas.offsetX + canvas.width, maxClientY:canvas.offsetY + canvas.height});
		canvas.main.init(parent);
		canvas.process.init(parent);
		canvas.glass.init(parent);
		canvas.temp.init(parent);
		canvas.record.init();
		canvas.tool.init();
		
		//Set default parameters.
		canvas.setDefault();
	},
	setDefault:function(){
		canvas.main.context.fillStyle = canvas.bgColor;
		canvas.main.context.fillRect(0, 0, canvas.width, canvas.height);
		
		canvas.process.context.strokeStyle = canvas.main.context.fillStyle = canvas.color;
		canvas.process.context.lineCap = canvas.lineCap;
		canvas.process.context.lineJoin = canvas.lineJoin;
		
		canvas.glass.context.strokeStyle = canvas.glass.context.fillStyle = canvas.color;
		canvas.glass.context.lineCap = canvas.lineCap;
		canvas.glass.context.lineJoin = canvas.lineJoin;
		
		canvas.setLineWidth(canvas.lineWidth);
		canvas.tool.lineWidth.setLineWidth(canvas.lineWidth);
		canvas.tool.path.setToolCurrent();
	},
	update:function(){
		canvas.main.context.drawImage(canvas.process.instance, 0, 0, canvas.width, canvas.height);
		canvas.clear(canvas.process);
		canvas.clear(canvas.temp);
		canvas.record.append();
	},
	setLineWidth:function(lineWidth){
		canvas.lineWidth = canvas.process.context.lineWidth = canvas.glass.context.lineWidth = lineWidth;
		main.setAttr(toolbar.lineWidth.lineWidthDiv, {innerHTML:lineWidth + ""});
	},
	setColor:function(color){
		canvas.main.context.strokeStyle = canvas.main.context.fillStyle = color;
		canvas.process.context.strokeStyle = canvas.process.context.fillStyle = color;
		canvas.glass.context.strokeStyle = canvas.glass.context.fillStyle = color;
	},
	clear:function(cv){
		cv.context.clearRect(0, 0, canvas.width, canvas.height);
	},
	main:{
		init:function(parent){
			main.setAttr(canvas.main, setting.value.canvas.main);
			canvas.main.zIndex = ++main.zIndex;
			
			canvas.main.instance = main.createElement(
				"canvas", 
				{id:canvas.main.id, width:canvas.width + "", height:canvas.height + "", className:canvas.main.className},
				{left:canvas.offsetX + "px", top:canvas.offsetY + "px", zIndex:canvas.main.zIndex + ""},
				null,
				parent
			);
			if(!canvas.main.instance || !canvas.main.instance.getContext){
				alert("This browser does not support HTML5 Canvas");
				return;
			}
			canvas.main.context = canvas.main.instance.getContext("2d");
		},
	},
	process:{
		init:function(parent){
			main.setAttr(canvas.process, setting.value.canvas.process);
			canvas.process.zIndex = ++main.zIndex;
			
			canvas.process.instance = main.createElement(
				"canvas", 
				{id:canvas.process.id, width:canvas.width + "", height:canvas.height + "", className:canvas.process.className},
				{left:canvas.offsetX + "px", top:canvas.offsetY + "px", zIndex:canvas.process.zIndex + ""},
				null,
				parent
			);
			if(!canvas.process.instance || !canvas.process.instance.getContext){
				return;
			}
			canvas.process.context = canvas.process.instance.getContext("2d");
		},
	},
	glass:{
		init:function(parent){
			main.setAttr(canvas.glass, setting.value.canvas.glass);
			canvas.glass.zIndex = ++main.zIndex;
			
			canvas.glass.instance = main.createElement(
				"canvas",
				{id:canvas.glass.id, width:canvas.width + "", height:canvas.height + "", className:canvas.glass.className},
				{left:canvas.offsetX + "px", top:canvas.offsetY + "px", zIndex:canvas.glass.zIndex + ""},
				null,
				parent
			);
			if(!canvas.glass.instance || !canvas.glass.instance.getContext){
				return;
			}
			canvas.glass.context = canvas.glass.instance.getContext("2d");
		},
		cursor:{
			show:function(maskOnly){
				if(!maskOnly){
					main.addEvent(canvas.glass.instance, {mousemove:canvas.glass.cursor.eventMouseMove, mouseout:canvas.glass.cursor.eventMouseOut});
				}
				if(main.mask.instance){
					main.addEvent(main.mask.instance, {mousemove:canvas.glass.cursor.eventMouseMove, mouseout:canvas.glass.cursor.eventMouseOut});
				}
			},
			hide:function(maskOnly){
				canvas.clear(canvas.glass);
				if(!maskOnly){
					main.removeEvent(
						canvas.glass.instance, 
						{mousemove:canvas.glass.cursor.eventMouseMove, mouseout:canvas.glass.cursor.eventMouseOut}
					);
				}
				main.removeEvent(main.mask.instance, {mousemove:canvas.glass.cursor.eventMouseMove, mouseout:canvas.glass.cursor.eventMouseOut});
			},
			eventMouseMove:function(e){
				canvas.clear(canvas.glass);
				canvas.glass.context.strokeRect(e.clientX - canvas.offsetX, e.clientY - canvas.offsetY, 0.01, 0.01);
			},
			eventMouseOut:function(){
				canvas.clear(canvas.glass);
			},
		}
	},
	temp:{
		init:function(parent){
			main.setAttr(canvas.temp, setting.value.canvas.temp);
			canvas.temp.instance = main.createElement(
				"canvas", 
				{id:canvas.temp.id, width:canvas.width + "", height:canvas.height + ""},
				null,
				null,
				parent
			);
			if(!canvas.temp.instance || !canvas.temp.instance.getContext){
				return;
			}
			canvas.temp.context = canvas.temp.instance.getContext("2d");
		},
	},
};