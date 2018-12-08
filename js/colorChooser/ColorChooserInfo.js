colorChooser.info = {
	init:function(){
		//Initialize info div.
		main.setAttr(colorChooser.info, setting.value.colorChooser.info);
		colorChooser.info.zIndex = main.zIndex;
		colorChooser.info.instance = main.createElement(
			"div",
			{id:colorChooser.info.id, className:colorChooser.info.className},
			{width:colorChooser.info.width + "px", height:colorChooser.info.height + "px", 
				left:colorChooser.info.offsetX + "px", top:colorChooser.info.offsetY + "px", 
				padding:colorChooser.info.padding + "px", zIndex:colorChooser.info.zIndex},
			null,
			colorChooser.instance
		);
		
		//Initialize rgb text & input.
		colorChooser.info.r.init();
		colorChooser.info.insertLine();
		colorChooser.info.g.init();
		colorChooser.info.insertLine();
		colorChooser.info.b.init();
		colorChooser.info.insertLine();
		colorChooser.info.a.init();
	},
	setText:function(text){
		text.instance = main.createElement(
			"span",
			{id:text.id, innerHTML:text.value},
			null,
			null,
			colorChooser.info.instance
		);
	},
	setInput:function(input, value){
		input.instance = main.createElement(
			"input",
			{id:input.id, type:"text", value:value, className:input.className},
			{width:colorChooser.info.inputWidth + "px"},
			{click:function(){this.focus();}, change:input.eventChange},
			colorChooser.info.instance
		);
	},
	setColorInfo:function(){
		colorChooser.info.r.input.instance.value = colorChooser.color.r;
		colorChooser.info.g.input.instance.value = colorChooser.color.g;
		colorChooser.info.b.input.instance.value = colorChooser.color.b;
		colorChooser.info.a.input.instance.value = Math.floor(colorChooser.color.a * 100);
	},
	insertLine:function(){
		var br = main.createElement("br", null, null, null, colorChooser.info.instance);
	},
	r:{
		init:function(){
			main.setAttr(colorChooser.info.r, setting.value.colorChooser.info.r);
			colorChooser.info.r.text.init();
			colorChooser.info.r.input.init();
		},
		text:{
			init:function(){
				main.setAttr(colorChooser.info.r.text, setting.value.colorChooser.info.r.text);
				colorChooser.info.setText(colorChooser.info.r.text);
			},
		},
		input:{
			init:function(){
				main.setAttr(colorChooser.info.r.input, setting.value.colorChooser.info.r.input);
				colorChooser.info.setInput(colorChooser.info.r.input, colorChooser.color.r);
			},
			eventChange:function(){
				var value = colorChooser.info.r.input.instance.value;
				for(var i = 0; i < value.length; i++){
					var code = value.charCodeAt(i);
					if(code < 48 || code > 57){
						alert("Wrong Value!");
						return;
					}
				}
				value = parseInt(value);
				if(value < 0 || value > 255){
					alert("Wrong Value!");
					return;
				}
				colorChooser.color.setColor(value);
				colorChooser.preview.setColor(colorChooser.preview.chosen);
				
				colorChooser.panel.position(colorChooser.color.r, colorChooser.color.g, colorChooser.color.b, colorChooser.color.a);
			},
		},
	},
	g:{
		init:function(){
			main.setAttr(colorChooser.info.g, setting.value.colorChooser.info.g);
			colorChooser.info.g.text.init();
			colorChooser.info.g.input.init();
		},
		text:{
			init:function(){
				main.setAttr(colorChooser.info.g.text, setting.value.colorChooser.info.g.text);
				colorChooser.info.setText(colorChooser.info.g.text);
			},
		},
		input:{
			init:function(){
				main.setAttr(colorChooser.info.g.input, setting.value.colorChooser.info.g.input);
				colorChooser.info.setInput(colorChooser.info.g.input, colorChooser.color.g);
			},
			eventChange:function(){
				var value = colorChooser.info.g.input.instance.value;
				for(var i = 0; i < value.length; i++){
					var code = value.charCodeAt(i);
					if(code < 48 || code > 57){
						alert("Wrong Value!");
						return;
					}
				}
				value = parseInt(value);
				if(value < 0 || value > 255){
					alert("Wrong Value!");
					return;
				}
				colorChooser.color.setColor(null, value);
				colorChooser.preview.setColor(colorChooser.preview.chosen);
				
				colorChooser.panel.position(colorChooser.color.r, colorChooser.color.g, colorChooser.color.b, colorChooser.color.a);
			},
		},
	},
	b:{
		init:function(){
			main.setAttr(colorChooser.info.b, setting.value.colorChooser.info.b);
			colorChooser.info.b.text.init();
			colorChooser.info.b.input.init();
		},
		text:{
			init:function(){
				main.setAttr(colorChooser.info.b.text, setting.value.colorChooser.info.b.text);
				colorChooser.info.setText(colorChooser.info.b.text);
			},
		},
		input:{
			init:function(){
				main.setAttr(colorChooser.info.b.input, setting.value.colorChooser.info.b.input);
				colorChooser.info.setInput(colorChooser.info.b.input, colorChooser.color.b);
			},
			eventChange:function(){
				var value = colorChooser.info.b.input.instance.value;
				for(var i = 0; i < value.length; i++){
					var code = value.charCodeAt(i);
					if(code < 48 || code > 57){
						alert("Wrong Value!");
						return;
					}
				}
				value = parseInt(value);
				if(value < 0 || value > 255){
					alert("Wrong Value!");
					return;
				}
				colorChooser.color.setColor(null, null, value);
				colorChooser.preview.setColor(colorChooser.preview.chosen);
				
				colorChooser.panel.position(colorChooser.color.r, colorChooser.color.g, colorChooser.color.b, colorChooser.color.a);
			},
		},
	},
	a:{
		init:function(){
			main.setAttr(colorChooser.info.a, setting.value.colorChooser.info.a);
			colorChooser.info.a.text.init();
			colorChooser.info.a.input.init();
		},
		text:{
			init:function(){
				main.setAttr(colorChooser.info.a.text, setting.value.colorChooser.info.a.text);
				colorChooser.info.setText(colorChooser.info.a.text);
			},
		},
		input:{
			init:function(){
				main.setAttr(colorChooser.info.a.input, setting.value.colorChooser.info.a.input);
				colorChooser.info.setInput(colorChooser.info.a.input, colorChooser.color.a * 100);
			},
			eventChange:function(){
				var value = colorChooser.info.a.input.instance.value;
				for(var i = 0; i < value.length; i++){
					var code = value.charCodeAt(i);
					if(code < 48 || code > 57){
						alert("Wrong Value!");
						return;
					}
				}
				value = parseInt(value);
				if(value < 0 || value > 100){
					alert("Wrong Value!");
					return;
				}
				colorChooser.color.setColor(null, null, null, value / 100);
				colorChooser.preview.setColor(colorChooser.preview.chosen);
				
				colorChooser.panel.position(colorChooser.color.r, colorChooser.color.g, colorChooser.color.b, colorChooser.color.a);
			},
		},
	},
};