var tools= {
	
	randInt: function (min,max){
		return Math.floor(Math.random()*(max-min+1)+min);
	},
	
	showMessage: function (text,fading){
		
		return;
		var id = "msg"+tools.randInt(1000,9999);	
		$('body').append("<div class='message top' id='"+id+"'>"+text+"</div>");
		var msgobj = $('#'+id);
		if (fading == true){
			msgobj.animate({"top":"2vh","left":"15vw","height":"20vh","width":"100vw","font-size":"12vh","opacity":"0.0"},2000);
		}
		else {
			msgobj.animate({"top":"2vh","left":"10vw","height":"20vh","width":"100vw","font-size":"12vh"},2000);
		}
	}
}

var hats = {
	
	shuffleSpeed: 500,
	raiseSpeed: 500,
	shuffles: 10,
	ballHutid:"",
	geraten: false,
	difficulty:3,
	
	init: function(){
		
		QiSession(function(session){
				memread(session,"hts/difficulty",function(data){
						hats.difficulty=data;
						console.log(hats.difficulty);
						if (hats.difficulty == 3){
							hats.shuffleSpeed=400;
							hats.shuffles=16;
						}
						else if (hats.difficulty == 2){
							hats.shuffleSpeed=500;
							hats.shuffles=11;
						}
						else {
							hats.shuffleSpeed=700;
							hats.shuffles=6;
						}
				});

		        session.service("ALBehaviorManager").then(function (bm) {
		            bm.getRunningBehaviors().then(function (rbs) {
		                if ($.inArray('games_2/huetchen', rbs) == -1){
		                    bm.startBehavior("games_2/huetchen");
		                }
		            });
		            //if (bm.getRunningBehaviors().indexOf("fotoapp/reconfigure") > -1){
		        });
		});
	
		
	},
	
	placeBall: function(){
		var n = tools.randInt(1,3);
		$('#ball').removeClass();
		$('#ball').addClass("pos"+n);
		$('#ball').css({"opacity":1.0});
		hats.ballHutid = "hut"+n; 
	},
	
	bindeHuete: function(){
		
		$('.huetchen').off('click');
		$('.huetchen').on('click',function(){
				var myHat = $(this);	
				hats.raiseHat(myHat);
				if (hats.geraten==false){
					if (myHat.attr("id") == hats.ballHutid){
						QiSession(function(session){
							memraise(session,"hts/done","humanwins");
						});
					}
					else{
						QiSession(function(session){
							memraise(session,"hts/done","humanloses");
						});
					}
					hats.geraten=true;
					
					
					setTimeout(function(){
						
						window.location.reload(true);
					},8000);
					
				}
				setTimeout(function(){
						hats.dropHat(myHat);
				},1500);
		});
		
	},
	
	raiseHat: function(obj){
		
		obj.animate({"top":"20%"},hats.raiseSpeed);
	},
	
	dropHat: function(obj){
		
		obj.animate({"top":"50%"},hats.raiseSpeed);
	},
	
	showBall: function(){
		
		var hut = $('#'+hats.ballHutid);
		hats.raiseHat(hut);
		setTimeout(function(){
				hats.dropHat(hut);
		},(hats.raiseSpeed*3));
		
	},
	
	switchHats: function(obj1,obj2,callback){
		var left1 = obj1.position().left;
		var left2 = obj2.position().left;
		var pos1 = obj1.attr("pos");
		var pos2 = obj2.attr("pos");
		obj1.attr("pos",pos2);
		obj2.attr("pos",pos1);
		obj1.animate({"left":left2},hats.shuffleSpeed);
		obj2.animate({"left":left1},hats.shuffleSpeed);
		
		var pos4ball = $('#'+hats.ballHutid).attr("pos");
		$('#ball').removeClass();
		$('#ball').addClass("pos"+pos4ball);
		
	},
	
	shuffle: function(times){
		
		if(times < 1 ){
			$('#ball').css({"opacity":"1.0"});
			
			hats.bindeHuete();
			return;
		}
		else{
			$('#ball').css({"opacity":"0.0"});
		}
		if (times%5 ==0){
			QiSession(function(session){
				memraise(session,"hts/randSay",1);
			});
		}
		
		var which = tools.randInt(1,3);
		var wHut = $('#hut'+which);
		var wHutx = null;
		if (which == 1 || which == 3){
			wHutx = $('#hut2');
		}
		else{
			var to = tools.randInt(1,2);
			if (to ==1){
				wHutx = $('#hut1');
			}
			else {
				wHutx = $('#hut3');
			}
		}
		
		hats.switchHats(wHut,wHutx);
		
		setTimeout(function(){
			hats.shuffle(times-1);
		},(hats.shuffleSpeed*2));
			
	}
	
}
$(document).ready(function(){
	hats.init();
	setTimeout(function(){
			
			hats.placeBall();
			hats.showBall();
			setTimeout(function(){
				hats.shuffle(hats.shuffles);
			},4000);
	},30);
	games.bindClose();
	
});