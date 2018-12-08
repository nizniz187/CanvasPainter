editPanel.frame = {
	init:function(){
		main.setAttr(editPanel.frame, setting.value.editPanel.frame);
		main.setAttr(
			editPanel.frame, 
			{offset:setting.value.editPanel.cp.scale.width / 2, zIndex:++main.zIndex}
		);
		
		editPanel.frame.instance = main.createElement(
			"div", 
			{id:editPanel.frame.id}, 
			{left:editPanel.frame.offset + "px", top:editPanel.frame.offset + "px", zIndex:editPanel.frame.zIndex + ""}, 
			null, 
			editPanel.instance
		);
	},
	setSize:function(w, h){
		main.setAttr(editPanel.frame.instance.style, {width:w + "px", height:h + "px"});
	},
	show:function(){
		editPanel.frame.instance.style.display = "block";
	},
	hide:function(){
		editPanel.frame.instance.style.display = "none";
	},
};