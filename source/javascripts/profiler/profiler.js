

var fpsProfiler = function(){

	var handlers = []; 

	var profiler = {
	
		handlers: handlers,
		
		lastDrawTime: 0,
		
		totalTime: 0,
		
		totalDrawTime: 0,
		
		lastUpdateTime: 0,
		
		totalUpdateTime: 0,
		
		updateTime: 1000,
		
		isStarted: false,
		
		start: function(){
			if (!profiler.isStarted){
				profiler.isStarted = true;
				setTimeout(profiler.doUpdate, profiler.updateTime);
				console.log("started");
			}
		},
		
		stop: function() {
			if (profiler.isStarted) {
				profiler.isStarted = false;
			}
		},
		
		doUpdate: function(){
		console.log("update");
			if (profiler.isStarted){
				profiler.notifyOfFps();
				setTimeout(profiler.doUpdate, profiler.updateTime);
			}
		},
			
		notifyOfFps: function() {
			var fps = profiler.calculateFps();
			
			for (var i = 0; i < profiler.handlers.length; i++){
				profiler.handlers[i](fps);
			}
		},
		
		addEventHandler: function(handler){
			profiler.handlers.push(handler);
		},
		
		calculateFps: function(){
					return "hawt";
			
		},
		
		startUpdate: function(){
			profiler.startUpdateTime = new Date();		
		},
		
		endUpdate: function(){
			if (profiler.startUpdateTime === undefined){
				return;
			}
		
			var totalUpdateTime = new Date() - profiler.startUpdateTime
			
			profiler.lastUpdateTime = totalUpdateTime;
			profiler.totalUpdateTime += totalUpdateTime;
			profiler.totalTime += totalUpdateTime;
		},
		
		startDraw: function(){
			profiler.startDrawTime = new Date();
		},
		
		endDraw: function(){
			if (profiler.startUpdateTime == undefined){
				return;
			}		
			
			var totalDrawTime = new Date() - profiler.startDrawTime;
			
			profiler.lastDrawTime = totalDrawTime;
			profiler.totalTime += totalDrawTime;
			profiler.totalDrawTime += totalDrawTime;
		}
	};

	return profiler;
};