canvas.record = {
	init:function(){
		main.setAttr(canvas.record, setting.value.canvas.record);
		
		canvas.record.array = new Array(0);
		canvas.record.index = -1;
	},
	append:function(){
		var imageData = canvas.main.context.getImageData(0, 0, canvas.width, canvas.height);
		if(canvas.record.index == -1 || canvas.record.check(imageData)){
			if(canvas.record.index == canvas.record.size - 1){
				canvas.record.array.shift();
			}else if(canvas.record.index < canvas.record.array.length - 1){
				canvas.record.index++;
				canvas.record.array.splice(canvas.record.index, canvas.record.array.length - canvas.record.index);
			}else{
				canvas.record.index++;
			}
			canvas.record.array.push(imageData);
		}
	},
	undo:function(){
		if(canvas.record.index > 0){
			canvas.record.index--;
			canvas.main.context.putImageData(canvas.record.array[canvas.record.index], 0, 0);
		}
	},
	redo:function(){
		if(canvas.record.index < canvas.record.array.length - 1){
			canvas.record.index++;
			canvas.main.context.putImageData(canvas.record.array[canvas.record.index], 0, 0);
		}
	},
	check:function(imageData){
		for(var i = 0; i < imageData.data.length; i++){
			if(imageData.data[i] != canvas.record.array[canvas.record.index].data[i]){
				return true;
			}
		}
		return false;
	},
};