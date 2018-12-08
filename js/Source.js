var source = {
	load:function(){
		source.image.init();
	},
	image:{
		init:function(){
			main.setAttr(source.image, {amount:setting.source.img.amount});
			source.image.canvas.init();
			source.image.toolbar.init();
			source.image.colorChooser.init();
			source.image.editPanel.init();
		},
		eventOnLoad:function(){
			source.image.amount--;
			if(source.image.amount == 0){
				main.init();
			}
		},
		setImage:function(img, src){
			img.instance = main.createElement("img", {src:src}, null, {load:source.image.eventOnLoad});
			img.src = src;
		},
		canvas:{
			init:function(){
				source.image.setImage(source.image.canvas.tool.colorPicker.cursor, setting.source.img.canvas.tool.colorPicker.cursor);
			},
			tool:{
				colorPicker:{
					cursor:{},
				},
			},
		},
		toolbar:{
			init:function(){
				source.image.setImage(source.image.toolbar.lineWidth, setting.source.img.toolbar.button.lineWidth);
				source.image.setImage(source.image.toolbar.path, setting.source.img.toolbar.button.path);
				source.image.setImage(source.image.toolbar.eraser, setting.source.img.toolbar.button.eraser);
				source.image.setImage(source.image.toolbar.line, setting.source.img.toolbar.button.line);
				source.image.setImage(source.image.toolbar.rect, setting.source.img.toolbar.button.rect);
				source.image.setImage(source.image.toolbar.circle, setting.source.img.toolbar.button.circle);
				source.image.setImage(source.image.toolbar.select, setting.source.img.toolbar.button.select);
				source.image.setImage(source.image.toolbar.colorChooser, setting.source.img.toolbar.button.colorChooser);
				source.image.setImage(source.image.toolbar.colorPicker, setting.source.img.toolbar.button.colorPicker);
				source.image.setImage(source.image.toolbar.undo, setting.source.img.toolbar.button.undo);
				source.image.setImage(source.image.toolbar.redo, setting.source.img.toolbar.button.redo);
			},
			lineWidth:{},
			path:{},
			eraser:{},
			line:{},
			rect:{},
			circle:{},
			select:{},
			colorChooser:{},
			colorPicker:{},
			undo:{},
			redo:{},
		},
		colorChooser:{
			init:function(){
				source.image.setImage(source.image.colorChooser.panel.plate.cursor, setting.source.img.colorChooser.panel.plate.cursor);
				source.image.setImage(source.image.colorChooser.panel.bright.cursor, setting.source.img.colorChooser.panel.bright.cursor);
				source.image.setImage(source.image.colorChooser.panel.opacity.cursor, setting.source.img.colorChooser.panel.opacity.cursor);
				source.image.setImage(source.image.colorChooser.opacity, setting.source.img.colorChooser.opacity);
			},
			panel:{
				plate:{
					gradient:{},
					cursor:{},
				},
				bright:{
					cursor:{},
				},
				opacity:{
					cursor:{},
				},
			},
			opacity:{},
		},
		editPanel:{
			init:function(){
				source.image.setImage(source.image.editPanel.cp.rotate.bg, setting.source.img.editPanel.cp.rotate.bg);
				source.image.setImage(source.image.editPanel.cp.rotate.cursor, setting.source.img.editPanel.cp.rotate.cursor);
			},
			cp:{
				rotate:{
					bg:{},
					cursor:{},
				},
			},
		},
	},
};