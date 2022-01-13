function memsubscribe(session,memkey,callback){
    session.service("ALMemory").then(
    function (mem) {
       	mem.subscriber(memkey).then(
        function (sub) {
           	sub.signal.connect(
            function(s){
                callback(s);
            },
            function (error) {
                console.log("error memsubscribe connect");
            });
       	},
        function (error) {
            console.log("error memsubscribe subscriber");
        });
    },
    function (error) {
        console.log("error memsubscribe outer");
    });
}

function memraise(session,memkey,s) { 
    console.log("memraise1: " + memkey + " " + s);
    session.service("ALMemory").then(
    function (mem) {
        mem.raiseEvent(memkey, s).then(
        function(){
            console.log("memraise2: " + memkey + " " + s);
            // do nothing
        },
        function(error){
            console.log("error memwrite inner");
        });
    },
    function (error) {
        console.log("error memwrite");
    });
}

function memread(session,memkey,callback){
    session.service("ALMemory").then(
    function (mem) {
        mem.getData(memkey).then(
        function(s){
            callback(s);
        },
        function (error) {
            console.log(" QiFunctions - memread failed: memread inner: " + error);
        });
    },function (error) {
        console.log("error memread outer");
    });
}

function ttssay(session,text){
    session.service("ALTextToSpeech").then(
    function(tts) {
		tts.say(text).then(
        function(){
			// ok do nothing
		},
        function(error){
			console.log("QiFunctions - tts.say inner failed");
		});
	},
    function(error){
		console.log("QiFunctions - tts service could not be created");
	});
}

function dialogforce(session,text){
    session.service("ALDialog").then(
    function(ald) {
		ald.forceInput(text).then(
        function(){
				// ok do nothing
		},
        function(error){
			console.log("QiFunctions - ald.forceInput inner failed");
		});		
	},
    function(error){
		console.log("QiFunctions - dialog service could not be created");
	});
}
