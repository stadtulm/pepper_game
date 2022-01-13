var tools= {
	
	randInt: function (min,max){
		return Math.floor(Math.random()*(max-min+1)+min);
	},
	
	showMessage: function (text,fading){
		
		var id = "msg"+tools.randInt(1000,9999);	
		$('body').append("<div class='message' id='"+id+"'>"+text+"</div><div id='veil' class='grey'></div>");
		var msgobj = $('#'+id);
		if (fading == true){
			msgobj.animate({"top":"33vh","left":"33vw","height":"20vh","width":"100vw","font-size":"12vh","opacity":"0.0"},2000,function(){
					$('#veil').remove();
			});
		}
		else {
			msgobj.animate({"top":"2vh","left":"10vw","height":"20vh","width":"100vw","font-size":"12vh"},2000);
		}
	}
}

var vgwKI={
	
	kiInterval: null,
	done: false,
	lastCol: 0,
	failedTries: 0,
	
	init: function(){
		
		if (vgwKI.kiInterval !=null){
			return;
		}
		
		vgwKI.kiInterval = setInterval(function(){
			if (viergw.onTurn =="pepper" && vgwKI.done==false){
				vgwKI.doTurn();
			}
			
		},1000);
	},
	
	stop: function(){
		if (vgwKI.kiInterval !=null){
			clearInterval(vgwKI.kiInterval);
		}
		
	},
	
	getMatrix: function(){
		
		return JSON.parse(JSON.stringify(viergw.matrix));
	},
	
	getRandomTurn: function(){
		var rcol =  tools.randInt(1,7);
		console.log("random");
		return $(".spalte4g[col='"+rcol+"']");
		
	},
	
	getAdjacentTurn: function(){
		var lower =0;
		var upper=0;
		if (vgwKI.lastCol >0){
			
			lower = Math.max(vgwKI.lastCol-1,1);
			upper = Math.min(vgwKI.lastCol+1,6);
			var rcol = tools.randInt(lower,upper);
		}
		console.log("adjacent");
		return $(".spalte4g[col='"+rcol+"']");
	},
	
	getPreventWinningTurn: function(){
		
		var obj= null;
		for (var n=1;n<7;n++){
			var m = viergw.getNextFreeRow(n);
			if(m>0 && obj == null){
				
				var mx = vgwKI.getMatrix();
				mx[n-1][m-1] = 1;
				
				var probe = viergw.analyzeFromPosition(n,m,mx,true);
				
				if (probe.win == true){
					obj = $(".spalte4g[col='"+n+"']");
					console.log("prev winning");
					
				}
				
			}
		}
		return obj;
		
		
	},
	
	getWinningTurn: function(){
		
		var obj= null;
		for (var n=1;n<7;n++){
			var m = viergw.getNextFreeRow(n);
			if(m>0 && obj == null){
				var mx = vgwKI.getMatrix();
				mx[n-1][m-1] = 10;
				var probe = viergw.analyzeFromPosition(n,m,mx,false);
				if (probe.win == true){
					obj = $(".spalte4g[col='"+n+"']");
					console.log("winning");
				}
			}
		}
		return obj;
		
	},
	
	isPossible: function(obj){
		
		var col = obj.attr("col");
		var tmp1 = viergw.getNextFreeRow(col);
		if (tmp1 >0) {
			return true;
		}
		else{
			return false;
		}
		
	},
	
	doTurn: function(){
		
		var obj= null;
		obj = vgwKI.getWinningTurn();
		if(obj != null && vgwKI.isPossible(obj)){
			vgwKI.done = true;
			obj.trigger('click');
			return;
		}
		else if (obj != null && vgwKI.isPossible(obj) ==false){
			
		}
		
		obj = vgwKI.getPreventWinningTurn();
		
		if(obj != null && vgwKI.isPossible(obj)){
			vgwKI.done = true;
			obj.trigger('click');
			return;
		}
		else if (obj != null && vgwKI.isPossible(obj) ==false){
			
		}
		
		if (vgwKI.lastCol>0){
			
			var obj = vgwKI.getAdjacentTurn();
			if(obj != null && vgwKI.isPossible(obj)){
				vgwKI.done = true;
				obj.trigger('click');
				return;
			}
			else if (obj != null && vgwKI.isPossible(obj) ==false){
				
			}	
		}
		else{
			
			obj = vgwKI.getRandomTurn();
		}
		
		if (obj == null || (obj != null && vgwKI.isPossible(obj) == false)){
			obj = vgwKI.getRandomTurn();
		}
		
		
		if (obj.length > 0 && vgwKI.isPossible(obj)){
			vgwKI.done = true;
			vgwKI.failedTries=0;
			vgwKI.lastCol = parseInt(obj.attr("col"));
			obj.trigger('click');
			QiSession(function(session){
					memraise(session,"viergw/randSay",1);
			});
		}
		else {
			vgwKI.failedTries++;
			if (vgwKI.failedTries >6){
				viergw.block();
				vgwKI.stop();
			
				QiSession(function(session){
					memraise(session,"viergw/complete","pepperconcede");
					setTimeout(function(){
						window.location.reload(true);
					},8000);
				});
				
			}
		}
	}
	
}

var viergw={
	
	onTurn: "human",	
	matrix: [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
	dropPos: {"1":"2%","2":"16%","3":"30%","4":"44%","5":"58%","6":"72%","7":"86%"},
	active: "red", 
	
	block: function(){
		
		if($('#veil').length < 1){
			$('body').append("<div id='veil'></div>");
		}
	},
	
	buildMatrix: function(){
		
		for (var j=0;j<6;j++){
			
			for (var i =0;i<7;i++){
				
				viergw.matrix[j][i]=0;
			}
		}
		
	},

	
	getNextFreeRow: function(col){

		var colFromMatrix = viergw.matrix[col-1];
		
		for (var j=colFromMatrix.length;j>-1;j--){
			
			if (colFromMatrix[j] == 0){
				return (j+1);
			}
		}
		return 0;
				
	},
	
	getRowStart: function(col,row,matrix,direction){
		
		var ret = {"col":0,"row":0};
		
		
		if (direction=="vertical"){
			ret.col = col
			ret.row = 1;

		}
		else if (direction=="horizontal"){
			
			ret.row = row;
			ret.col=1;
		}
		else if (direction=="diagtr"){
			ret.row = row;
			ret.col = col;
			while(ret.row < 7 && ret.col > 1){
				ret.row++;
				ret.col--;
			}
			
		}
		else if (direction=="diagbr"){
			ret.row = row;
			ret.col = col;
			while(ret.row > 1 && ret.col > 1){
				ret.row--;
				ret.col--;
			}
		}
		
		
		return ret;
		
		
		
	},
	
	checkrow: function(rowdata,probe){
		
		var value=1;
		var hits=0;
		
		if (viergw.onTurn == "pepper" && probe == false){
			value=10;
		}
		for (var n=0;n<rowdata.length;n++){
			if (rowdata[n] == value){
				hits++;
				
			}
			else if(hits <4){
				hits=0;
				
			}
		}
		if (hits>3) {
			return true;
		}
		else {
			return false;
		}
		
	},
	
	analyzeFromPosition: function(col,row,matrix,probe){
		
		
		var value = matrix[col-1][row-1];
		var win= false;
		var winhow="";
		
		if (value==0){
			var retx = {"win":false};
			return retx;
		}
		var ycol = parseInt(col)
		var xrow = row
		// senkrecht
		
		var rowdata = [0,0,0,0,0,0,0]
		var pos1 = viergw.getRowStart(ycol,xrow,matrix,"vertical")
		for (var m=0;m<7;m++){
			
			rowdata[m] = matrix[(pos1.col-1)][(pos1.row+m-1)]
			
		}
		if (viergw.checkrow(rowdata,probe) == true){
			win= true
			winhow= "vertical"
		}
		
		//waagerecht
		
		rowdata = [0,0,0,0,0,0,0]
		var pos2 = viergw.getRowStart(ycol,xrow,matrix,"horizontal")
		for (var m=0;m<6;m++){
			
			rowdata[m] = matrix[(pos2.col+m-1)][(pos2.row-1)]
			
		}
		if (viergw.checkrow(rowdata,probe) == true){
			win= true
			winhow= "horizontal"
		}
		
		//diagonal unten links nach oben rechts
		
		rowdata = [0,0,0,0,0,0,0]
		var pos3 = viergw.getRowStart(ycol,xrow,matrix,"diagtr")
		var m=0;
		while(pos3.col+m < 7 && pos3.row-m > 0){
			
			rowdata[m] = matrix[(pos3.col+m-1)][(pos3.row-m-1)]
			m++;
		}
		
		if (viergw.checkrow(rowdata,probe) == true){
			win= true
			winhow= "diagtr"
		}
		
		//diagonal oben links nach unten rechts
		
		rowdata = [0,0,0,0,0,0,0]
		var pos4 = viergw.getRowStart(ycol,xrow,matrix,"diagbr")
		var m=0;
		while(pos4.col+m < 7 && pos4.row+m < 8){
			
			rowdata[m] = matrix[(pos4.col+m-1)][(pos4.row+m-1)]
			m++;
		}
		
		if (viergw.checkrow(rowdata,probe) == true){
			win= true
			winhow= "diagbr"
		}
		
		
		if (win == false){
			
			var draw = true;
			var col =1;
			while(draw == true  &&col<7){
				var tmp1 = viergw.getNextFreeRow(col);
				
				col++;
				if (tmp1> 0){
					draw=false;
				}
			}
			
			if (draw==true){
				console.log("draw");
			}
			
		}
		
		var ret = {"win":win,"how":winhow,"pos":{"col":parseInt(col),"row":row}};
		return ret;
		
	},
	
	handleWin: function(data){
		
		var win = data.win;
		var winhow = data.how;
		
		var col = data.pos.col;
		var row = data.pos.row;
		
		if (win == false && winhow == "draw"){
			QiSession(function(session){
					memraise(session,"viergw/complete","draw");
					setTimeout(function(){
						
						window.location.reload(true);
					},8000);
			});
		}
		
		if (win == true){
			
			/*console.log("win");
			var objs = new Array(4);
			objs[0] = $(".spalte4g[col='"+col+"']").find(".row"+row);
			
			if(winhow=="vertical"){
				objs[1] = $(".spalte4g[col='"+col+"']").find(".row"+(row+1));
				objs[2] = $(".spalte4g[col='"+col+"']").find(".row"+(row+2));
				objs[3] = $(".spalte4g[col='"+col+"']").find(".row"+(row+3));
			}
			if(winhow=="horizontal"){
				objs[1] = $(".spalte4g[col='"+(col+1)+"']").find(".row"+row);
				objs[2] = $(".spalte4g[col='"+(col+2)+"']").find(".row"+row);
				objs[3] = $(".spalte4g[col='"+(col+3)+"']").find(".row"+row);
			}
			
			
			
			if(winhow=="diagtr"){
				objs[1] = $(".spalte4g[col='"+(col+1)+"']").find(".row"+(row-1));
				objs[2] = $(".spalte4g[col='"+(col+2)+"']").find(".row"+(row-2));
				objs[3] = $(".spalte4g[col='"+(col+3)+"']").find(".row"+(row-3));
			}
			
			
			
			if(winhow=="diagbr"){
				objs[1] = $(".spalte4g[col='"+(col+1)+"']").find(".row"+(row+1));
				objs[2] = $(".spalte4g[col='"+(col+2)+"']").find(".row"+(row+2));
				objs[3] = $(".spalte4g[col='"+(col+3)+"']").find(".row"+(row+3));
			}
			
			$.each(objs,function(index,value){
				value.append("<div class='glow'></div>");
			});
			
			$('.glow').animate({"opacity":"1.0"},3000);
			*/
			viergw.block();
			vgwKI.stop();
			var trig = "draw";
			if (viergw.onTurn =="human"){
				trig ="humanwins";
			}
			else{
				trig ="pepperwins";
			}
			console.log(trig);
			QiSession(function(session){
					memraise(session,"viergw/complete",trig);
					setTimeout(function(){
						
						window.location.reload(true);
					},8000);
			});
			// TO DO : einzelne fälle durchgehen und glow effect auf den siegreichen vierer
		}
		
	},
	
	bindeSpalten: function(){
		
		var spalten = $('.spalte4g');
		spalten.off('click');
		spalten.on('click',function(){
				
				viergw.block();
				$('#redkreis').remove();
				$('#greenkreis').remove();
				var obj = $(this);
				
				obj.append("<div id='"+viergw.active+"kreis'></diV>");
				var xpos = obj.position().left;
				$('#'+viergw.active+'kreis').css({"left":"23%","top":"-13%"});
				
				var colnr = obj.attr("col");
				var dropTo = viergw.getNextFreeRow(colnr);
				if (dropTo >0){
					
					
					if (viergw.active =="red"){
						viergw.matrix[colnr-1][dropTo-1]=1;
					}
					else{
						viergw.matrix[colnr-1][dropTo-1]=10;
					}
					
					
					setTimeout(function(){
						$('#'+viergw.active+'kreis').animate({"top":viergw.dropPos[dropTo]},800,function(){
							obj.find(".row"+dropTo).addClass(viergw.active);
							$('#'+viergw.active+'kreis').remove();
							var erg = viergw.analyzeFromPosition(colnr,dropTo,Object.create(viergw.matrix),false);
							if (erg.win == true){
								viergw.handleWin(erg);
							}
							
							if (viergw.onTurn == "human"){
								
								vgwKI.done=false;
								viergw.onTurn = "pepper";
							}
							else {
								viergw.onTurn = "human";
								
								$('#veil').remove();                                            
							}
							
							if(viergw.active =="green"){
								viergw.active="red";
							}
							else {
								viergw.active="green";
							}
						});
						
					},500);
				}
				else {
					$('#'+viergw.active+'kreis').animate({"top":"-10%"},300,function(){
						$('#'+viergw.active+'kreis').animate({"top":"-13%"},300,function(){
								$('#'+viergw.active+'kreis').fadeOut(300,function(){
										$('#'+viergw.active+'kreis').remove();
										$('#veil').remove();
								});
						});
					})
					
				}
				
		});
		
	}
	
}

$(document).ready(function(){
		
	
		viergw.buildMatrix();
		viergw.bindeSpalten();
		vgwKI.init();
		QiSession(function(session){

	        session.service("ALBehaviorManager").then(function (bm) {
	            bm.getRunningBehaviors().then(function (rbs) {
	                if ($.inArray('games_2/viergw', rbs) == -1){
	                    bm.startBehavior("games_2/viergw").then(function(){
	                    	memraise(session,"viergw/explain",1);
	                    });
	                }
	            });
	            //if (bm.getRunningBehaviors().indexOf("fotoapp/reconfigure") > -1){
	        });
		});
		
		games.bindClose();
		
});