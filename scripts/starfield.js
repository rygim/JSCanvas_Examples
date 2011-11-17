var starfield = function(){
    var stars = [],
    bgStars = [],
    currentNumberOfStars = 0,
    showChart = false,
    starImg = new Image();
    starImg.src = "/images/star.png";
          
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

        if(useImage){
            ctx.drawImage(starImg, star.x, star.y);
        }
        else {
            if(useAlpha){
                ctx.fillStyle = star.alphaFillStyle;    
            }
            else if(!useAlpha){
                ctx.fillStyle = star.colorFillStyle;
            }    
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill(); 
        }        
    };
   
    var drawStars = function(stars, ctx, useAlpha, useImage) {
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
            stars[i].radius += 0.002 * elapsedTime;
		
            if (stars[i].y > ctx.canvas.height || stars[i].x > ctx.canvas.width || stars[i].y < 0 || stars[i].x < 0){
                delete stars[i];	
                if(curNumStars < stars.length && i != stars.length - 1 && curNumStars !== 0){
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
    
    return {
        draw: function(ctx){
            var numStars = numStarsFn();
            var start = +new Date();
            drawBackground(bgStars, ctx);
            var useAlpha = useAlphaFn();
            var useImage = useImageFn();
            drawStars(stars, ctx, useAlpha, useImage);     
            if(showChart){
                var index = (useAlpha ? 1 : 0) + (useImage ? 2 : 0);
                var end = +new Date();
                starfieldGraph.addChartData(index, stars.length, end - start);
                starfieldGraph.draw(ctx);
                start = end;
                
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
        },
        numStars: function(){
            return stars.length;
        }
    };
}();


