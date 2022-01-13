$.fn.extend({
		
		canvasDraw: function(onDraw){
			var obj = $(this);
			var ph = obj.parent().height();
			var pw = obj.parent().width();
			var idle = true;
			obj.attr("height",ph*0.21);
			obj.attr("width",pw*0.21);
			
			
			obj.attr("lastX",0);
			obj.attr("lastY",0);
			
			obj.on('touchmove touchstart',function(event){
					
					idle=false;
					var contObj = $(this);
					if (contObj.hasClass("cactive") == false){
												
						if ($('.cactive').length > 0){
							return;
						}
						else {
							contObj.addClass("cactive");
						}
						
					}
					var lx = contObj.attr("lastX");
					var ly = contObj.attr("lastY");
					var x=0;
					var y=0;
					try{
						x = event.originalEvent.touches[0].clientX-$(this).offset().left;
						y = event.originalEvent.touches[0].clientY-$(this).offset().top;
					}
					catch (e){
						console.log(e);
					}
					
					if(lx == 0){
						lx = x;
						
					}
					if(ly == 0){
						ly = y;
						
					}
					contObj.attr("lastX",x);
					contObj.attr("lastY",y);
					var ctx = $(this)[0].getContext("2d");
					ctx.lineWidth=4;
					ctx.fillStyle="#000000";
					ctx.beginPath();
					ctx.moveTo(lx,ly);
					ctx.lineTo(x,y);
					ctx.stroke();
					ctx.fill();
			});
			
			obj.on('touchend',function(){
					console.log("touchend");
					var contObj = $(this);
					contObj.attr("lastX",0);
					contObj.attr("lastY",0);
					if (contObj.hasClass("cactive") == false){
												
						return;
					}
				
					
					idle = true;
					setTimeout(function(){
							
						if (idle == true){
							idle = false;
							contObj.removeClass("cactive");
							onDraw();
							return;
						}
					},2000);
					
			});
			
			
		}
		
		
});