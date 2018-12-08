var main = {
	init:function(){
		document.onmousedown = function(){return false;};
		
		main.canvasDiv = main.createElement("div", {id:setting.value.main.canvasDiv.id}, null, null, document.body);
		toolbar.init(main.canvasDiv);
		canvas.init(main.canvasDiv);
		editPanel.init(document.body);
		main.mask.init();
		colorChooser.init(document.body);
	},
	log:function(obj){
		try{
			for(var name in obj){
				console.log(name + ": " + obj[name]);
			}
		}catch(exception){
			return;
		}
	},
	createElement:function(type, attr, style, event, parent){
		var element = document.createElement(type);
		if(attr){
			main.setAttr(element, attr);
		}
		if(style){
			main.setAttr(element.style, style);
		}
		if(event){
			main.addEvent(element, event);
		}
		if(parent){
			parent.appendChild(element);
		}
		return element;
	},
	setAttr:function(element, attr, nested){
		for(var name in attr){
			if(typeof attr[name] == "object" && !nested){
				return;
			}
			element[name] = attr[name];
		}
	},
	addEvent:function(element, event, useCapture){
		for(var name in event){
			element.addEventListener(name, event[name], useCapture);
		}
	},
	removeEvent:function(element, event, useCapture){
		for(var name in event){
			element.removeEventListener(name, event[name], useCapture);
		}
	},
	exist:function(obj){
		return obj || obj == 0;
	},
	mask:{
		init:function(){
			main.setAttr(main.mask, setting.value.main.mask);
			main.mask.zIndex = ++main.zIndex;
			main.mask.instance = main.createElement(
				"div", 
				{id:main.mask.id}, 
				{zIndex:main.mask.zIndex + "", cursor:canvas.tool.current.cursor}, 
				{mousemove:canvas.glass.instance.onmousemove}, 
				document.body
			);
		},
		show:function(color){
			if(color){
				main.setAttr(main.mask.instance.style, {backgroundColor:"gray", opacity:"0.5"});
			}else{
				main.setAttr(main.mask.instance.style, {backgroundColor:""});
			}
			main.mask.instance.style.display = "block";
		},
		hide:function(){
			main.mask.instance.style.display = "none";
		},
	},
	zIndex:0,
};