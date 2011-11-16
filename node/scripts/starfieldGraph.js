var starfieldGraph = function(){
    var chartData = [[],[],[],[]],
        chartSamples = [[],[],[],[]],
        maxTime = 0,
        maxNumStars = 0,
        colorData = ["red", "yellow", "green", "orange"];
    
    var drawChart = function(ctx, chartDataLine, color){
        var isMoved = false, 
            xPixelOffset = ctx.canvas.width / maxNumStars, 
            yPixelOffset = ctx.canvas.height / maxTime;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.font = "20px Verdana";            
        ctx.fillStyle = "yellow";
        var showData = 0, text = "", textX = 0, textY = 0;
        for(var i = chartDataLine.length; i--;){
            var data = chartDataLine[i];
            if(data === undefined){
                continue;
            }
            showData++;
                        
            var x = i * xPixelOffset,
                y = ctx.canvas.height - data * yPixelOffset;

            if(!isMoved){
               ctx.moveTo(x, y);
            }
            else{
                ctx.lineTo(x, y);
            }
            
            if(showData === 10){
                text = "stars: " + i + ", time: " + chartDataLine[i] + " ms";
                var dimensions = ctx.measureText(text);
                textX = Math.min(x, ctx.canvas.width - dimensions.width);
                textY = y - 30;
            }  
            
            isMoved = true;
        }
        ctx.stroke();
        

        ctx.fillText(text, textX, textY);
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
        for(var i = chartData.length; i--;){
            drawChart(ctx, chartData[i], colorData[i]);
        }
      }  
    };
}();