colorChooser.button = {
	init:function(){
		main.setAttr(colorChooser.button, setting.value.colorChooser.button);
		colorChooser.button.zIndex = main.zIndex;
		colorChooser.button.ok.init();
		colorChooser.button.cancel.init();
	},
	setButton:function(button){
		button.instance = main.createElement(
			"button",
			{id:button.id, innerHTML:button.value, className:button.className},
			{width:colorChooser.button.width + "px", left:button.offsetX + "px", top:button.offsetY + "px", zIndex:colorChooser.button.zIndex + ""},
			{click:button.eventClick},
			colorChooser.instance
		);
	},
	ok:{
		init:function(){
			main.setAttr(colorChooser.button.ok, setting.value.colorChooser.button.ok);
			colorChooser.button.setButton(colorChooser.button.ok);
		},
		eventClick:function(){
			main.mask.hide();
			colorChooser.hide();
			canvas.color = colorChooser.color.getColorString();
			canvas.setColor(canvas.color);
		},
	},
	cancel:{
		init:function(){
			main.setAttr(colorChooser.button.cancel, setting.value.colorChooser.button.cancel);
			colorChooser.button.setButton(colorChooser.button.cancel);
		},
		eventClick:function(){
			main.mask.hide();
			colorChooser.hide();
		},
	},
};