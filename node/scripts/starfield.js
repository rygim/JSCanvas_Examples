var starfield = function(){
    var stars = [],
    bgStars = [],
    currentNumberOfStars = 0,
    showChart = false,
    chartData = [[],[],[],[]];
          
    var newStar = function(ctx){
        var x = ctx.canvas.width / 2,
        y = ctx.canvas.height / 2,
        radius = Math.random(),
        alpha = Math.random(),
        direction = Math.random() * Math.PI * 2,
        speed = Math.random() / 15,
        rgb = Math.round(alpha * 255);
	
        return {
            x:x, 
            y:y, 
            radius:radius, 
            direction:direction, 
            speed:speed,
            alphaFillStyle: "rgba(255, 255, 255," + alpha + ")",
            colorFillStyle: "rgb(" + rgb + "," + rgb + "," + rgb + ")"
        };
    };
    
    var newBgStar = function(ctx) {
        var star = newStar(ctx);
        star.x = Math.random() * ctx.canvas.width;
        star.y = Math.random() * ctx.canvas.height;
        return star;
    };
    
    var drawStar = function(star, ctx, useAlpha, useImage){
        useAlpha = useAlpha === undefined || useAlpha;
        useImage = useImage === undefined || useImage;
        //  console.log(useAlpha, useImage);
        if(useImage && useAlpha){
            ctx.fillStyle = "red";
        //     console.log("alpha + image");
        }
        else if(useImage && !useAlpha){
            ctx.fillStyle = "orange";
        //     console.log("no alpha + image");
        }
        else if(!useImage && useAlpha){
            ctx.fillStyle = star.alphaFillStyle;    
        //    console.log("alpha + no image");
        }
        else if(!useImage && !useAlpha){
            ctx.fillStyle = star.colorFillStyle;
        //    console.log("no alpha + no image");
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill(); 
    };
   
    var drawStars = function(stars, ctx, useAlpha, useImage) {
//        console.log(useAlpha, useImage);
        for(var i = 0; i < stars.length; i++){
            drawStar(stars[i], ctx, useAlpha, useImage);
        }
    };

    var updateStars = function(stars, curNumStars, elapsedTime, ctx) {
        elapsedTime = elapsedTime || 1;
        if(stars.length < curNumStars){
            var starsAdded = 0;
            while(stars.length <= curNumStars && starsAdded < 2){
                stars.push(newStar(ctx));
                starsAdded++;
            }
        }
        
        for (var i = 0; i < stars.length; i++){
            stars[i].y += Math.sin(stars[i].direction) * stars[i].speed * elapsedTime;
            stars[i].x += Math.cos(stars[i].direction) * stars[i].speed * elapsedTime;
            stars[i].speed += 0.0002 * elapsedTime;
            stars[i].radius += 0.002 *elapsedTime;
		
            if (stars[i].y > ctx.canvas.height || stars[i].x > ctx.canvas.width || stars[i].y < 0 || stars[i].x < 0){
                delete stars[i];	
                if(curNumStars < stars.length && i != stars.length - 1){
                    stars[i] = stars.pop();
                }
                else{
                    stars[i] = newStar(ctx);    
                }
            }
        }
    };
    
    var drawBackground = function(bgStars, ctx){
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "white";
        for (var i = 0; i < bgStars.length; i++){
            drawStar(bgStars[i], ctx, true, false);
        }
    };
    
    var initBgStars = function(ctx){
        var numBgStars = 50;
        var bgStars = [];
        for (var i = 0; i < numBgStars; i++){
            bgStars.push(newBgStar(ctx));
        }
    
        return bgStars;
    };
    
    var useAlphaFn = function(){
        return true;                
    };
    
    var useImageFn = function(){
        return false;
    };
    
    var numStarsFn = function(){
        return 100;
    };
    
    var drawChart = function(ctx, chartData){
        var lineColors = ["orange", "yellow", "red", "green"],
        xDataPixelDistance = .5,
        yDataPixelDistance = ctx.canvas.height,
        canvasWidth = ctx.canvas.width,
        max = 40;
              
        for(var i = chartData.length; i--;){
            for(var j = Math.min(chartData[i].length, xDataPixelDistance * ctx.canvas.width); j--; ){
                if(chartData[i][j] !== undefined && chartData[i][j][1] !== -1){
                    max = Math.max(chartData[i][j][1], max);
                    break;
                }
            }
        }    
        
        yDataPixelDistance = ctx.canvas.height / max;
        var drawChartLine = function(ctx, data, color){
            ctx.strokeStyle = color;
            ctx.beginPath();
            var isMoved = false;
            
            for(var i = Math.min(data.length, canvasWidth * xDataPixelDistance); i--; ){
                if(data[i] === undefined || data[i][1] === -1){
                    continue;
                }
                var x = Math.round(xDataPixelDistance * i),
                y = Math.round(ctx.canvas.height - (data[i][1] * yDataPixelDistance));
                      
                if(!isMoved){
                    ctx.moveTo(x, y);
                    isMoved = true;
                    continue;
                }
                
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
        };
        
        for(var i = chartData.length; i--; ){
            drawChartLine(ctx, chartData[i], lineColors[i]);
        }
    };
    
    return {
        draw: function(ctx){
            var numStars = numStarsFn();
            var start = new Date().getTime();
            drawBackground(bgStars, ctx);
            var useAlpha = useAlphaFn();
            var useImage = useImageFn();
            drawStars(stars, ctx, useAlpha, useImage);     
            if(showChart){
                if(Math.abs(stars.length - currentNumberOfStars) > 10){
                    return;
                }
                var index = (useAlpha ? 1 : 0) + (useImage ? 2 : 0);
                var end = new Date().getTime() - start;
                var currentChartData = chartData[index][currentNumberOfStars];
                if(currentChartData === undefined || currentChartData[1] === -1){
                    chartData[index][currentNumberOfStars] = [1, end];
                }
                else{
                    var newValue = (currentChartData[1] * currentChartData[0] + end) / (currentChartData[0] + 1);
                    chartData[index][currentNumberOfStars] = [currentChartData[0] + 1, newValue];
                    drawChart(ctx, chartData);
                }
            }
        },
        update: function(ctx, elapsedTime){  
            currentNumberOfStars = numStarsFn();
            updateStars(stars, currentNumberOfStars, elapsedTime, ctx);
        },
        init: function(ctx, _showChart, _numStarsFn, _useAlphaFn, _useImageFn){
            stars = [];
            bgStars = initBgStars(ctx);
            currentNumberOfStars = 100;
            useAlphaFn = _useAlphaFn || useAlphaFn;
            useImageFn = _useImageFn || useImageFn;
            numStarsFn =  _numStarsFn || numStarsFn;
            showChart = _showChart;
            chartData = [[],[],[],[]];
        }
    };
}();


