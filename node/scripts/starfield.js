var starfield = function(){
    var stars = [],
          bgStars = [],
          currentNumberOfStars = 0;
          
    var newStar = function(ctx){
        var x = ctx.canvas.width / 2,
        y = ctx.canvas.height / 2,
        radius = Math.random(),
        alpha = Math.random(),
        direction = Math.random() * Math.PI * 2,
        speed = Math.random() / 15;
	
        return {
            x:x, 
            y:y, 
            radius:radius, 
            alpha:alpha, 
            direction:direction, 
            speed:speed
        };
    };
    
    var newBgStar = function(ctx) {
        var star = newStar(ctx);
        star.x = Math.random() * ctx.canvas.width;
        star.y = Math.random() * ctx.canvas.height;
        return star;
    };
    
    var drawStar = function(star, ctx){
        //var rgb = Math.floor(255 * star.alpha);
        ctx.fillStyle = "rgba(255, 255, 255," + star.alpha + ")";
        //ctx.fillStyle = "rgb(" + rgb + ", " + rgb + ", " + rgb + ")";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill(); 
    };
   
    var drawStars = function(stars, ctx) {
        for(var i = 0; i < stars.length; i++){
            drawStar(stars[i], ctx);
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
            stars[i].speed += 0.002;
            stars[i].radius += 0.02;
		
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
        
        for (var i = 0; i < bgStars.length; i++){
            drawStar(bgStars[i], ctx);
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
    
    var drawStats = function(profiler, numActualStars, ctx){
        profiler.defaultDraw(ctx);  
        ctx.fillText("Number of stars: " + numActualStars, 5, 125);
    };
    
    return {
        draw: function(ctx){
            drawBackground(bgStars, ctx);
            drawStars(stars, ctx);     
        },
        update: function(ctx, elapsedTime){  
            updateStars(stars, currentNumberOfStars, elapsedTime, ctx);
        },
        init: function(ctx){
            stars = [],
            bgStars = initBgStars(ctx),
            currentNumberOfStars = 100;
        }
    };
}();


