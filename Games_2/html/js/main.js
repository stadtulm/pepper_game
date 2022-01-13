var senso = {
	
	folge: "",
	eingabe: "",
	speed: 1000,
	language: "German",
	
	init: function(){
		senso.folge = "";
		senso.appendToSequence();
		senso.appendToSequence();
		senso.appendToSequence();
		senso.appendToSequence();
		senso.playSequence(senso.folge);
		
	},
	
	setInput: function(enable){
		
		senso.eingabe = "";
		$('.sensor').off('click');
		if(enable){
			$('.sensor').on('click',function(){
					senso.blink($(this));
					senso.eingabe = senso.eingabe+$(this).attr('value');
					senso.checkInput();
			});
		}
	},
	
	sprechblase: function(text){
		
		/*$('#sprechblase').fadeIn(500);
		if(text.length>15){
			$('#sprechblase-msg').css({'font-size':'48px'});
		}
		else{
			$('#sprechblase-msg').css({'font-size':'64px'});
		}
		$('#sprechblase-msg').html(text);*/
		senso.sayText(text);
		/*setTimeout(function(){
				$('#sprechblase').fadeOut(500);
		},1000)*/
	},
	
	checkInput: function (){
		
		var allesOk=true;
		
		if(senso.eingabe.length == senso.folge.length){
			if(senso.eingabe != senso.folge){
				allesOk=false;
			}
		}
		else{
			var test= senso.folge.substring(0,senso.eingabe.length);
			if(test!=senso.eingabe){
				allesOk=false;
			}
		}
		
		if(allesOk && senso.eingabe.length == senso.folge.length){
			
			senso.sprechblase(senso.loben())
			senso.setInput(false);
			setTimeout(function(){
					senso.appendToSequence();
					senso.playSequence(senso.folge);
			},1000);
		}
		if(!allesOk){
			if (senso.language=="English"){
				senso.sprechblase("That was not correct! Come on, we'll try it again!")
			}
			else{
				senso.sprechblase("Das war wohl nichts! Komm wir versuchen es nochmal!")	
			}
			
			setTimeout(function(){
					senso.init();
					
			},4000);
			
		}
		
	},
	
	loben: function(){
		
		var feedbacks=["Super!","Topp!","Perfekt!","Nicht schlecht!","Richtig!","Hervorragend!","Ausgezeichnet","Weiter so!","Beeindruckend!","Du bist wirklich gut!"];
		if (senso.language=="English"){
			feedbacks=["Super!","Top!","Perfect!","Not bad!","Correct!","Extraordinary!","Keep it up!","Impressive!","You're really good!"];
		}
		var m = senso.folge.length;
		c = Math.floor((Math.random() * 10));
		if(m==8){
			return "Super! Acht mal schon!";
		}
		if(m==10){
			return "Zehn hast du schon. Weiter so!";
		}
		if(m==15){
			return "Super! Ich glaube so weit war heute noch keiner!";
		}
		
		return feedbacks[c];
		
	},
	
	
	blink: function(obj){
		
		obj.addClass("blink");
		setTimeout(function(){
			obj.removeClass("blink");	
		},500);
	},
	
	playSequence: function(str){
		
			if(str==""){
				senso.setInput(true);
				return;
			}
			
			var c = str.charAt(0)
			if(str.length>1){
				str = str.substring(1);
			}
			else{
				str=""
			}
			obj= $('[value="'+c+'"]');
			setTimeout(function(){
				senso.blink(obj);
				senso.playSequence(str);
			},senso.speed);
	},
	
	appendToSequence: function(){
		
		var n =  Math.floor(Math.random() * (4 - 1 + 1)) + 1;
		senso.folge = senso.folge+n;
	},
	
	sayText: function(text){
		
		QiSession(function (session) {
							session.service("ALTextToSpeech").then(function (tts) {
									tts.say(text).then(function () {
										// do nothing
									}, function (error) {
										// do nothing
									});
		
							}, function (error) {
								// do nothing
							});
		
						}, function () {
							// do nothing
						});
		
	},
	
	setLanguage: function(){
		QiSession(function (session) {
							session.service("ALTextToSpeech").then(function (tts) {
									tts.getLanguage().then(function (lang) {
										senso.language=lang
									}, function (error) {
										// do nothing
									});
		
							}, function (error) {
								// do nothing
							});
		
						}, function () {
							// do nothing
						});
	}
	
	
}


$(document).ready(function(){
			
	senso.init();
	senso.setLanguage();
});