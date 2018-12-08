var colorChooser = {
	init:function(parent){		
		//Initialize color chooser div.
		main.setAttr(colorChooser, setting.value.colorChooser);
		colorChooser.zIndex = ++main.zIndex;
		
		colorChooser.offsetX = toolbar.colorChooser.offsetX + toolbar.buttonWidth / 2 - colorChooser.width / 2;
		colorChooser.offsetY = toolbar.offsetY - colorChooser.height;
		colorChooser.instance = main.createElement(
			"div",
			{id:setting.value.colorChooser.id}, 
			{width:colorChooser.width + "px", height:colorChooser.height + "px", 
				left:colorChooser.offsetX + "px", top:colorChooser.offsetY + "px", zIndex:colorChooser.zIndex + ""},
			null,
			parent
		);
		
		//Intialize color.
		colorChooser.color.setColorString(canvas.color);
		
		//Intialize color chooser elements.
		colorChooser.panel.init();
		colorChooser.info.init();
		colorChooser.preview.init();
		colorChooser.button.init()
	},
	show:function(){
		colorChooser.instance.style.display = "block";
		colorChooser.color.setColorString(canvas.color);
		colorChooser.panel.position(colorChooser.color.r, colorChooser.color.g, colorChooser.color.b, colorChooser.color.a);
		colorChooser.preview.setColor(colorChooser.preview.chosen);
		colorChooser.preview.setColor(colorChooser.preview.current);
	},
	hide:function(){
		colorChooser.instance.style.display = "none";
	},
	color:{
		setColor:function(r, g, b, a){
			if(r == 0 || r){
				colorChooser.color.r = r;
			}
			if(g == 0 || g){
				colorChooser.color.g = g;
			}
			if(b == 0 || b){
				colorChooser.color.b = b;
			}
			if(a == 0 || a){
				colorChooser.color.a = a;
			}
			
			var hsl = colorChooser.color.rgbToHsl(colorChooser.color.r, colorChooser.color.g, colorChooser.color.b);
			colorChooser.color.h = hsl.h;
			colorChooser.color.s = hsl.s;
			colorChooser.color.l = hsl.l;
		},
		getColorString:function(rgb){
			if(rgb){
				return "rgb(" + colorChooser.color.r + ", " + colorChooser.color.g + ", " + colorChooser.color.b + ")";
			}else{
				return "rgba(" + colorChooser.color.r + ", " + colorChooser.color.g + ", " + colorChooser.color.b + ", " + 
					colorChooser.color.a + ")";
			}
		},
		setColorString:function(rgba){
			if(rgba.indexOf("rgba") == -1){
				rgba = rgba.replace("rgb(", "").replace(")", "") + ",1";
			}
			rgba = rgba.replace("rgba(", "").replace(")", "");
			while(rgba.indexOf(" ") > 0){
				rgba = rgba.replace(" ", "");
			}
			var color = rgba.split(",");
			colorChooser.color.r = color[0];
			colorChooser.color.g = color[1];
			colorChooser.color.b = color[2];
			colorChooser.color.a = color[3];
			
			var hsl = colorChooser.color.rgbToHsl(color[0], color[1], color[2]);
			colorChooser.color.h = hsl.h;
			colorChooser.color.s = hsl.s;
			colorChooser.color.l = hsl.l;
		},
		hslToRgb:function(h, s, l){
			h = h / 360;
			s = s / 100;
			l = l / 100;
			var r, g, b;
			
			if(s == 0){
				r = g = b = l * 255;
			}else{
				var q = (l < 0.5) ? (l * (s + 1)) : (l + s - (l * s));
				var p = (l * 2) - q;
				
				var t = new Array(3);
				t[0] = h + (1 / 3);
				t[1] = h;
				t[2] = h - (1 / 3);
				
				for(var i = 0; i < t.length; i++){
					if(t[i] < 0){
						t[i] += 1;
					}
					if(t[i] > 1){
						t[i] -= 1;
					}
					
					if(t[i] * 6 < 1){
						t[i] = p + ((q - p) * 6 * t[i]);
					}else if(t[i] * 2 < 1){
						t[i] = q;
					}else if(t[i] * 3 < 2){
						t[i] = p + (q - p) * (2 / 3 - t[i]) * 6;
					}else{
						t[i] = p;
					}
				}
				r = t[0] * 255;
				g = t[1] * 255;
				b = t[2] * 255;
			}
			r = (r > 255) ? 255 : ((r < 0) ? 0 : r);
			g = (g > 255) ? 255 : ((g < 0) ? 0 : g);
			b = (b > 255) ? 255 : ((b < 0) ? 0 : b);
			
			return {r:r, g:g, b:b};
		},
		rgbToHsl:function(r, g, b){
			var h = s = l = 0;
			r /= 255;
			g /= 255;
			b /= 255;
			var max = Math.max(r, g, b);
			var min = Math.min(r, g, b);
			var sum = max + min;
			var dif = max - min;
			
			//Calculate hue value.
			if(max == min){
				h = 0;
			}else if(max == r && g >= b){
				h = 60 * (g - b) / dif;
			}else if(max == r && g < b){
				h = 60 * (g - b) / dif + 360;
			}else if(max == g){
				h = 60 * (b - r) / dif + 120;
			}else if(max == b){
				h = 60 * (r - g) / dif + 240;
			}
			
			//Calculate luminance value.
			l = sum / 2;
			
			//Calculate saturation value.
			if(l == 0 || max == min){
				s = 0;
			}else if(l > 0 && l <= 0.5){
				s = dif / sum;
			}else if(l > 0.5){
				s = dif / (2 - sum);
			}

			h = (h > 360) ? 360 : ((h < 0) ? 0 : h);
			s = ((s > 1) ? 1 : ((s < 0) ? 0 : s)) * 100;
			l = ((l > 1) ? 1 : ((l < 0) ? 0 : l)) * 100;
			
			return {h:h, s:s, l:l};
		},
	},
};