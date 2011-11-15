var starfieldGraph = function(){
    var chartData = [[],[],[],[]],
        chartSamples = [[],[],[],[]],
        maxTime = 0,
        maxNumStars = 0,
        colorData = ["red", "yellow", "green", "orange"];
    
    var drawChart = function(ctx, chartDataLine, color, textY){
        var isMoved = false, 
            xPixelOffset = ctx.canvas.width / maxNumStars, 
            yPixelOffset = ctx.canvas.height / maxTime;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.font = "30px Verdana bold";            
        ctx.fillStyle = color;
        for(var i = chartDataLine.length; i--;){
            var data = chartDataLine[i];
            if(data === undefined){
                continue;
            }
                        
            var x = i * xPixelOffset,
                y = ctx.canvas.height - data * yPixelOffset;

            if(!isMoved){
               ctx.moveTo(x, y);
               ctx.fillText("max stars: " + i + ", time: " + chartDataLine[i] + " ms", 15, textY);
            }
            else{
                ctx.lineTo(x, y);
            }
            
            isMoved = true;
        }
        ctx.stroke();
    };
    
    return {
      addChartData: function(index, numStars, time){
          var numSamples = chartSamples[index][numStars];
          
          if(numSamples === undefined){
              chartSamples[index][numStars] = 0;
              chartData[index][numStars] = time;
          }
          else{
              chartSamples[index][numStars] = numSamples + 1;
              chartData[index][numStars] = (numSamples * chartData[index][numStars] + time) / (numSamples + 1);     
          }
          
          maxTime = Math.max(maxTime, chartData[index][numStars]);
          maxNumStars = Math.max(maxNumStars, numStars);
      },
      draw: function(ctx){
        for(var i = 0; i < chartData.length; i++){
            drawChart(ctx, chartData[i], colorData[i], i * 30 + 50);
        }
      }  
    };
}();