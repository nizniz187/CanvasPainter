var toolbar = {
	init:function(parent){
		//Initialize toolbar div.
		main.setAttr(toolbar, setting.value.toolbar);
		toolbar.offsetX = setting.value.canvas.offsetX;
		toolbar.offsetY = setting.value.canvas.offsetY * 2 + setting.value.canvas.height;
		toolbar.instance = main.createElement(
			"div",
			{id:toolbar.id}, 
			{left:toolbar.offsetX + "px", top:toolbar.offsetY + "px"}, 
			null,
			parent
		);
		
		//Initialize toolbar buttons.
		toolbar.lineWidth.init();
		toolbar.path.init();
		toolbar.eraser.init();
		toolbar.line.init();
		toolbar.rect.init();
		toolbar.circle.init();
		toolbar.select.init();
		toolbar.colorChooser.init();
		toolbar.colorPicker.init();
		toolbar.undo.init();
		toolbar.redo.init();
	},
	setButton:function(tool, image){
		//Create toolbar button.
		tool.button = main.createElement(
			"button", 
			{id:tool.id}, 
			{verticalAlign:"middle", marginLeft:toolbar.buttonOffsetX + "px", marginTop:toolbar.buttonOffsetY + "px",
				marginBottom:toolbar.buttonOffsetY + "px", width:toolbar.buttonWidth + "px", height:toolbar.buttonHeight + "px"}, 
			null, 
			toolbar.instance
		);
		
		//Set tool button attribute
		main.setAttr(
			tool, 
			{order:tool.order, offsetX:toolbar.offsetX + tool.order * toolbar.buttonOffsetX + (tool.order - 1) * toolbar.buttonWidth,
				offsetY:toolbar.offsetY + toolbar.buttonOffsetY}
		);
		tool.icon = image;
		
		//Set tool button image
		tool.button.appendChild(tool.icon);
	},
	setChosen:function(chosen, current){
		chosen.disabled = "disabled";
		if(current){
			current.disabled = "";
		}
	},
	lineWidth:{
		init:function(){
			main.setAttr(toolbar.lineWidth, setting.value.toolbar.lineWidth);
			toolbar.setButton(toolbar.lineWidth, source.image.toolbar.lineWidth.instance);
			
			toolbar.lineWidth.lineWidthDiv = main.createElement(
				"div",
				{innerHTML:""},
				{fontSize:"10px", lineHeight:"20px"},
				null,
				toolbar.lineWidth.button
			);
		}
	},
	path:{
		init:function(){
			main.setAttr(toolbar.path, setting.value.toolbar.path);
			toolbar.setButton(toolbar.path, source.image.toolbar.path.instance);
		},
	},
	eraser:{
		init:function(){
			main.setAttr(toolbar.eraser, setting.value.toolbar.eraser);
			toolbar.setButton(toolbar.eraser, source.image.toolbar.eraser.instance);
		},
	},
	line:{
		init:function(){
			main.setAttr(toolbar.line, setting.value.toolbar.line);
			toolbar.setButton(toolbar.line, source.image.toolbar.line.instance);
		},
	},
	rect:{
		init:function(){
			main.setAttr(toolbar.rect, setting.value.toolbar.rect);
			toolbar.setButton(toolbar.rect, source.image.toolbar.rect.instance);
		},
	},
	circle:{
		init:function(){
			main.setAttr(toolbar.circle, setting.value.toolbar.circle);
			toolbar.setButton(toolbar.circle, source.image.toolbar.circle.instance);
		},
	},
	select:{
		init:function(){
			main.setAttr(toolbar.select, setting.value.toolbar.select);
			toolbar.setButton(toolbar.select, source.image.toolbar.select.instance);
		},
	},
	colorChooser:{
		init:function(){
			main.setAttr(toolbar.colorChooser, setting.value.toolbar.colorChooser);
			toolbar.setButton(toolbar.colorChooser, source.image.toolbar.colorChooser.instance);
		},
	},
	colorPicker:{
		init:function(){
			main.setAttr(toolbar.colorPicker, setting.value.toolbar.colorPicker);
			toolbar.setButton(toolbar.colorPicker, source.image.toolbar.colorPicker.instance);
		},
	},
	undo:{
		init:function(){
			main.setAttr(toolbar.undo, setting.value.toolbar.undo);
			toolbar.setButton(toolbar.undo, source.image.toolbar.undo.instance);
		},
	},
	redo:{
		init:function(){
			main.setAttr(toolbar.redo, setting.value.toolbar.redo);
			toolbar.setButton(toolbar.redo, source.image.toolbar.redo.instance);
		},
	},
};