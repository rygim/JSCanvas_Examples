var fpsProfiler = function(){
    
    var data = {
        fps: 0,
        averageUpdateTime: 0,
        averageDrawTime: 0
    };
    
    var profiler = {
        
        isStarted: false,
        
        handlers: [],
        
        interval: 1000,
        
        averageDrawTime: 0,
        
        drawSamples: 0,
        
        lastDrawStartTime: 0,
        
        averageUpdateTime: 0,
        
        updateSamples: 0,
        
        lastUpdateStartTime: 0,
        
        start: function(){
            if (!profiler.isStarted){
                setTimeout(profiler.updateHandlers, profiler.interval);
                profiler.isStarted = true;
            }
        },
        
        stop: function(){
            if (profiler.isStarted){
                profiler.isStarted = false;
            }
        },
        
        updateHandlers: function(){
            if (profiler.isStarted){
                var fps = profiler.drawSamples;

                for (var i = 0; i < profiler.handlers.length; i++){
                    profiler.handlers[i](fps, profiler.averageUpdateTime, profiler.averageDrawTime);
                }
                
                setTimeout(profiler.updateHandlers, profiler.interval);
                
                profiler.averageUpdateTime = 0;
                profiler.averageDrawTime = 0;
                profiler.drawSamples = 0;
                profiler.updateSamples = 0;
            }
        },
        
        addFpsCalculationHandler: function(handler){
          profiler.handlers.push(handler);  
        },
        
        beginDraw: function(){
            profiler.lastDrawStartTime = new Date();
        },
        
        endDraw: function(){
            profiler.drawSamples++;
            
            var avg = (profiler.drawSamples - 1) / profiler.drawSamples;
            
            var newAvgDrawTime = profiler.averageDrawTime * avg;
            
            var drawTime = (new Date()).getTime() - profiler.lastDrawStartTime.getTime();
            
            profiler.averageDrawTime = newAvgDrawTime + drawTime / profiler.drawSamples;            
        },
        
        beginUpdate: function(){
            profiler.lastUpdateStartTime = new Date();
        },
        
        endUpdate: function(){
            profiler.updateSamples++;
            
            var avg = (profiler.updateSamples - 1) / profiler.updateSamples;
            
            var newAvgUpdateTime = profiler.averageUpdateTime * avg;
            
            var updateTime = (new Date()).getTime() - profiler.lastUpdateStartTime.getTime();
                       
            profiler.averageUpdateTime = newAvgUpdateTime + updateTime / profiler.updateSamples;
        },

        defaultDraw: function(ctx){
            ctx.fillStyle = "yellow";
            ctx.font = "bold 15px sans-serif";
            ctx.fillText("FPS: " + data.fps, 5, 25);
            ctx.fillText("Avg. update time: " + data.averageUpdateTime, 5, 45);
            ctx.fillText("Avg. draw time: " + data.averageDrawTime, 5, 65);
            var totalTime = data.averageDrawTime + data.averageUpdateTime;
            var possibleFps = 1000 / totalTime;
            ctx.fillText("Avg. total time: " + totalTime, 5, 85);
            ctx.fillText("Ideal FPS: " + possibleFps, 5, 105);
        }
    };
        
    var updateFpsData = function(fps, avgUpdateTime, avgDrawTime){
        data.fps = fps;
        data.averageDrawTime = avgDrawTime;
        data.averageUpdateTime = avgUpdateTime;
    };
     
    profiler.addFpsCalculationHandler(updateFpsData);

    return profiler;
};