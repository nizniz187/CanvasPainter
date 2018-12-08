var range = {
	init:function(rangeObj){
		rangeObj.show = function(){
			rangeObj.instance.style.display = "block";
			rangeObj.display = true;
		};
		rangeObj.hide = function(){
			rangeObj.instance.style.display = "none";
			rangeObj.display = false;
		};
		range.setDefault(rangeObj);
		range.setInstance(rangeObj);
		
		range.setBar(rangeObj);
		range.setCtrller(rangeObj);
		range.setText(rangeObj);
	},
	setDefault:function(rangeObj){
		for(var attr in rangeObj){
			if(rangeObj[attr] != 0 && !rangeObj[attr]){
				rangeObj[attr] = range[attr];
			}
		}
		rangeObj.diff = rangeObj.max - rangeObj.min + 1;
	},
	setInstance:function(rangeObj){
		rangeObj.instance = document.createElement("div");
		rangeObj.instance.id = rangeObj.id;
		rangeObj.instance.style.zIndex = rangeObj.zIndex;
		rangeObj.instance.style.position = "absolute";
		rangeObj.instance.style.border = "1px solid black";
		rangeObj.instance.style.backgroundColor = range.backgroundColor;
		rangeObj.instance.style.left = rangeObj.offsetX + "px";
		rangeObj.instance.style.top = rangeObj.offsetY + "px";
		rangeObj.instance.style.width = rangeObj.width + "px";
		rangeObj.instance.style.height = rangeObj.height + "px";
		
		rangeObj.hide();
	},
	setBar:function(rangeObj){
		rangeObj.bar = new Object();
		rangeObj.bar.instance = document.createElement("div");
		rangeObj.bar.height = rangeObj.height - 45;
		
		rangeObj.bar.instance.id = rangeObj.id + "Bar";
		rangeObj.bar.instance.style.border = "1px solid black";
		rangeObj.bar.instance.style.margin = "0px auto";
		rangeObj.bar.instance.style.marginTop = range.bar.offsetY + "px";
		rangeObj.bar.instance.style.width = range.bar.width + "px";
		rangeObj.bar.instance.style.height = rangeObj.bar.height + "px";
		rangeObj.bar.instance.style.backgroundColor = range.bar.backgroundColor;
		
		rangeObj.bar.eventMouseDown = function(e){
			rangeObj.ctrller.eventMouseMove(e);
			document.body.addEventListener("mousemove", rangeObj.ctrller.eventMouseMove);
			document.body.addEventListener("mouseup", rangeObj.ctrller.eventMouseUp);
		};
		rangeObj.bar.instance.addEventListener("mousedown", rangeObj.bar.eventMouseDown);
		
		rangeObj.instance.appendChild(rangeObj.bar.instance);
	},
	setCtrller:function(rangeObj){
		rangeObj.ctrller = new Object();
		rangeObj.ctrller.instance = document.createElement("button");
		rangeObj.ctrller.height = range.ctrller.height;
		rangeObj.ctrller.topMin = range.bar.offsetY - rangeObj.ctrller.height / 2;
		rangeObj.ctrller.topMax = rangeObj.bar.height + rangeObj.ctrller.topMin;
		
		rangeObj.ctrller.instance.id = rangeObj.id + "Ctrller";
		rangeObj.ctrller.instance.style.position = "absolute";
		rangeObj.ctrller.instance.style.left = (rangeObj.width - range.ctrller.width) / 2 + "px";
		rangeObj.ctrller.instance.style.top = rangeObj.ctrller.topMin + "px";
		rangeObj.ctrller.instance.style.width = range.ctrller.width + "px";
		rangeObj.ctrller.instance.style.height = rangeObj.ctrller.height + "px";
		rangeObj.ctrller.instance.style.zIndex = rangeObj.zIndex + 1;
		
		rangeObj.ctrller.setValue = function(value){
			rangeObj.value = value;
			rangeObj.ctrller.instance.style.top = (value - rangeObj.min + 1) / rangeObj.diff * rangeObj.bar.height + rangeObj.ctrller.topMin + "px";
		};
		rangeObj.ctrller.eventMouseDown = function(){
			document.body.addEventListener("mousemove", rangeObj.ctrller.eventMouseMove);
			document.body.addEventListener("mouseup", rangeObj.ctrller.eventMouseUp);
		};
		rangeObj.ctrller.eventMouseMove = function(e){
			var offsetY = e.clientY - rangeObj.offsetY - rangeObj.ctrller.height / 2;
			offsetY = offsetY < rangeObj.ctrller.topMin 
				? rangeObj.ctrller.topMin 
				: (offsetY > rangeObj.ctrller.topMax ? rangeObj.ctrller.topMax : offsetY);
			rangeObj.ctrller.instance.style.top = offsetY + "px";
			
			var value = Math.ceil((offsetY - rangeObj.ctrller.topMin + rangeObj.min) / rangeObj.bar.height * rangeObj.diff);
			rangeObj.text.setValue(value > rangeObj.max ? rangeObj.max : value);
		};
		rangeObj.ctrller.eventMouseUp = function(){
			document.body.removeEventListener("mousemove", rangeObj.ctrller.eventMouseMove);
			document.body.removeEventListener("mouseup", rangeObj.ctrller.eventMouseUp);
		};
		rangeObj.ctrller.instance.addEventListener("mousedown", rangeObj.ctrller.eventMouseDown);
		
		rangeObj.instance.appendChild(rangeObj.ctrller.instance);
	},
	setText:function(rangeObj){
		rangeObj.text = new Object();
		rangeObj.text.instance = document.createElement("input");
		rangeObj.text.instance.type = "text";
		rangeObj.text.instance.value = rangeObj.value + "";
		rangeObj.text.instance.id = rangeObj.id + "Text";
		rangeObj.text.instance.style.width = range.text.width + "px";
		rangeObj.text.instance.style.marginLeft = (rangeObj.width - range.text.width) / 2 - 2 + "px";
		rangeObj.text.instance.style.marginTop = "5px";
		rangeObj.text.instance.style.textAlign = "center";
		
		rangeObj.text.eventChange = function(){
			var value = parseInt(rangeObj.text.instance.value);
			if(value < rangeObj.min){
				value = rangeObj.min;
				rangeObj.text.instance.value = value + "";
			}else if(value > rangeObj.max){
				value = rangeObj.max;
				rangeObj.text.instance.value = value + "";
			}
			rangeObj.ctrller.setValue(value);
		};
		rangeObj.text.setValue = function(value){
			rangeObj.value = value;
			rangeObj.text.instance.value = value + "";
		};
		rangeObj.text.instance.addEventListener("click", function(){this.focus();});
		rangeObj.text.instance.addEventListener("change", rangeObj.text.eventChange);
		
		rangeObj.instance.appendChild(rangeObj.text.instance);
	},
	createRange:function(id, zIndex, min, max, value, offsetX, offsetY, width, height){
		var rangeObj = new Object();
		rangeObj.id = id;
		rangeObj.zIndex = zIndex;
		rangeObj.min = min;
		rangeObj.max = max;
		rangeObj.value = value;
		rangeObj.offsetX = offsetX;
		rangeObj.offsetY = offsetY;
		rangeObj.width = width;
		rangeObj.height = height;
		
		range.init(rangeObj);
		
		return rangeObj;
	},
	bar:{
		width:2,
		offsetY:10,
		backgroundColor:"#AAAAAA"
	},
	ctrller:{
		width:25,
		height:15
	},
	text:{
		width:25
	},
	id:"range",
	zIndex:1,
	offsetX:0,
	offsetY:0,
	width:50,
	height:200,
	min:1,
	max:100,
	value:1,
	display:false,
	backgroundColor:"white"
};