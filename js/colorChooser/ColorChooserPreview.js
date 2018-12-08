colorChooser.preview = {
	init:function(){
		main.setAttr(colorChooser.preview, setting.value.colorChooser.preview);
		colorChooser.preview.zIndex = main.zIndex;
		
		colorChooser.preview.chosen.init();
		colorChooser.preview.current.init();
	},
	setPreview:function(preview, event){
		//Set background Image.
		preview.bg.instance = main.createElement(
			"div",
			{className:preview.className},
			{width:colorChooser.preview.width + "px", height:colorChooser.preview.height + "px", 
				left:preview.offsetX + "px", top:preview.offsetY + "px", backgroundImage:"url(" + setting.source.img.colorChooser.opacity + ")",
				zIndex:colorChooser.preview.zIndex + 1 + ""},
			null,
			colorChooser.instance
		);
		preview.instance = main.createElement(
			"div",
			{id:preview.id, className:preview.className},
			{width:colorChooser.preview.width + "px", height:colorChooser.preview.height + "px", 
				left:preview.offsetX + "px", top:preview.offsetY + "px", zIndex:colorChooser.preview.zIndex + 2 + ""},
			null,
			colorChooser.instance
		);
		if(event){
			main.addEvent(preview.instance, {click:preview.eventClick});
		}
		colorChooser.preview.setColor(preview);
	},
	setText:function(preview){
		preview.text.instance = main.createElement(
			"span",
			{id:preview.text.id, className:preview.text.className, innerHTML:preview.text.value},
			{left:preview.offsetX + colorChooser.preview.width + preview.text.offsetX + "px", top:preview.offsetY + preview.text.offsetY + "px"},
			null,
			colorChooser.instance
		);
	},
	setColor:function(preview){
		preview.instance.style.backgroundColor = colorChooser.color.getColorString();
	},
	chosen:{
		init:function(){
			//Set preview div.
			main.setAttr(colorChooser.preview.chosen, setting.value.colorChooser.preview.chosen);
			colorChooser.preview.setPreview(colorChooser.preview.chosen);
			
			//Set preview text.
			main.setAttr(colorChooser.preview.chosen.text, setting.value.colorChooser.preview.chosen.text);
			colorChooser.preview.setText(colorChooser.preview.chosen);
		},
		bg:{},
		text:{},
	},
	current:{
		init:function(){
			//Set preview. div.
			main.setAttr(colorChooser.preview.current, setting.value.colorChooser.preview.current);
			colorChooser.preview.setPreview(colorChooser.preview.current, true);
			
			//Set preview text.
			main.setAttr(colorChooser.preview.current.text, setting.value.colorChooser.preview.current.text);
			colorChooser.preview.setText(colorChooser.preview.current);
		},
		eventClick:function(){
			colorChooser.color.setColorString(colorChooser.preview.current.instance.style.backgroundColor);
			colorChooser.panel.position(colorChooser.color.r, colorChooser.color.g, colorChooser.color.b, colorChooser.color.a);
			colorChooser.preview.setColor(colorChooser.preview.chosen);
			colorChooser.info.setColorInfo();
		},
		bg:{},
		text:{},
	},
};