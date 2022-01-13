var games={
	
	bindClose: function (){
		
		var closeB = $('.x-close');
		closeB.css({"opacity":0.1});
		closeB.off("click");
		setTimeout(function(){
			closeB.css({"opacity":1.0});
			
			closeB.on("click",function(){
				QiSession(function(session){
					
					memraise(session,"games_2/forceStop",1);
					closeB.css({"opacity":0.1});
				});
			
			});		
		},8000);
		
	}
}
