editPanel.block = {
	init:function(){
		main.setAttr(editPanel.block, setting.value.editPanel.block);
		main.setAttr(
			editPanel.block, 
			{offsetX:editPanel.cp.scale.width * 1.5, offsetY:editPanel.cp.scale.width * 1.5, zIndex:main.zIndex}
		);
		
		editPanel.block.instance = main.createElement(
			"div",
			{id:editPanel.block.id},
			{left:editPanel.block.offsetX + "px", top:editPanel.block.offsetY + "px", zIndex:editPanel.block.zIndex + "", cursor:"move"},
			{mousedown:editPanel.block.eventMouseDown},
			editPanel.instance
		);
	},
	setSize:function(w, h){
		var width = w - editPanel.cp.scale.width * 2;
		var height = h - editPanel.cp.scale.width * 2;
		width = width < 0 ? 0 : width;
		height = height < 0 ? 0 : height;
		main.setAttr(editPanel.block.instance.style, {width:width + "px", height:height + "px"});
	},
	eventMouseDown:function(e){
		var offsetX = e.clientX - canvas.offsetX;
		var offsetY = e.clientY - canvas.offsetY;
		if(canvas.tool.current.id == canvas.tool.line.id){
			editPanel.moveOffsetSourceX = offsetX - canvas.tool.line.source.x;
			editPanel.moveOffsetSourceY = offsetY - canvas.tool.line.source.y;
			editPanel.moveOffsetDestX = offsetX - canvas.tool.line.dest.x;
			editPanel.moveOffsetDestY = offsetY - canvas.tool.line.dest.y;
		}else{
			editPanel.moveOffsetX = offsetX - canvas.tool.current.region.minX;
			editPanel.moveOffsetY = offsetY - canvas.tool.current.region.minY;
		}
		
		main.mask.show();
		main.addEvent(main.mask.instance, {mousemove:editPanel.block.eventMouseMove, mouseup:editPanel.block.eventMouseUp});
		main.setAttr(main.mask.instance.style, {cursor:editPanel.block.instance.style.cursor});
	},
	eventMouseMove:function(e){
		var x1, y1, x2, y2;
		if(canvas.tool.current.id == canvas.tool.line.id){
			x1 = e.clientX - canvas.offsetX - editPanel.moveOffsetSourceX;
			y1 = e.clientY - canvas.offsetY - editPanel.moveOffsetSourceY;
			x2 = e.clientX - canvas.offsetX - editPanel.moveOffsetDestX;
			y2 = e.clientY - canvas.offsetY - editPanel.moveOffsetDestY;
		}else{
			x1 = e.clientX - canvas.offsetX - editPanel.moveOffsetX;
			y1 = e.clientY - canvas.offsetY - editPanel.moveOffsetY;
			x2 = x1 + canvas.tool.current.region.width;
			y2 = y1 + canvas.tool.current.region.height;
		}
		editPanel.cp.scale.scale(x1, y1, x2, y2);
	},
	eventMouseUp:function(){
		main.mask.hide();
		main.removeEvent(main.mask.instance, {mousemove:editPanel.block.eventMouseMove, mouseup:editPanel.block.eventMouseUp});
		main.setAttr(main.mask.instance.style, {cursor:canvas.tool.current.cursor});
	},
};