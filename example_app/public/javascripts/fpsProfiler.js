var fpsProfiler = function(){

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
                var fps = profiler.updateSamples;

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
        }        
    };

    return profiler;
};