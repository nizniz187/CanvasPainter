var editPanel = {
	init:function(parent){
		main.setAttr(editPanel, setting.value.editPanel);
		
		editPanel.instance = main.createElement("div", {id:editPanel.id}, null, null, parent);
		editPanel.frame.init();
		editPanel.cp.init();
		editPanel.block.init();
	},
	show:function(){
		canvas.glass.cursor.hide(true);
		canvas.tool.undo.button.disabled = "disabled";
		canvas.tool.redo.button.disabled = "disabled";
		
		editPanel.setPanel(
			canvas.tool.current.region.minX, canvas.tool.current.region.minY, 
			canvas.tool.current.region.width, canvas.tool.current.region.height
		);
		if(canvas.tool.current.id != canvas.tool.line.id){
			editPanel.frame.show();
		}
		else{
			editPanel.frame.hide();
		}
		editPanel.cp.show();
		
		main.setAttr(editPanel.instance.style, {display:"block"});
	},
	hide:function(){
		canvas.glass.cursor.show(true);
		canvas.tool.undo.button.disabled = "";
		canvas.tool.redo.button.disabled = "";
		
		editPanel.instance.style.display = "none";
		editPanel.cp.hide();
	},
	reset:function(){
		if(editPanel.instance){
			editPanel.hide();
			editPanel.cp.rotate.rotateCP(0);
			editPanel.cp.rotate.radian = 0;
		}
		canvas.update();
	},
	setBounds:function(x, y, w, h){
		main.setAttr(editPanel.instance.style, {left:x + "px", top:y + "px", width:w + "px", height:h + "px"});
	},
	setPanel:function(x, y, w, h){
		editPanel.setBounds(
			x - editPanel.frame.offset + canvas.offsetX, y - editPanel.frame.offset + canvas.offsetY,
			w + editPanel.frame.offset * 2, h + editPanel.frame.offset * 2
		);
		editPanel.frame.setSize(w, h);
		editPanel.cp.position(x, y, w, h);
		editPanel.block.setSize(w, h);
	},
	bounds:{},
};