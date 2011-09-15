
var newStar = function(ctx) {
	var x = ctx.canvas.width / 2,
		y = ctx.canvas.height / 2,
		radius = Math.random(),
		alpha = Math.random(),
		direction = Math.random() * Math.PI * 2,
		speed = Math.random() / 5;
	
	return {x:x, y:y, radius:radius, alpha:alpha, direction:direction, speed:speed};
};

var newBgStar = function(ctx) {
    
    var star = newStar(ctx);
    star.x = Math.random() * ctx.canvas.width;
    star.y = Math.random() * ctx.canvas.height;
    return star;
};

var drawStar = function(star, ctx){
    ctx.fillStyle = "rgba(255, 255, 255," + star.alpha + ")";
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

var updateStars = function(stars, curNumStars, ctx) {
	for (var i = 0; i < stars.length; i++){
		stars[i].y += Math.sin(stars[i].direction) * stars[i].speed;
		stars[i].x += Math.cos(stars[i].direction) * stars[i].speed;
		stars[i].speed += 0.04;
		stars[i].radius += 0.02;
		
		if (stars[i].y > ctx.canvas.height || stars[i].x > ctx.canvas.width ||
			stars[i].y < 0 || stars[i].x < 0){
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
	ctx.fillStyle = "rgb(0, 0, 0)";
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

var simpleStarfield = function($canvas, numStars, incrementBy){

        var profiler = fpsProfiler();
	//Get the drawing context
	var ctx = $canvas[0].getContext("2d");
	
	//initialize the stars	
	var stars = [],
            bgStars = initBgStars(ctx),
            curNumStars = numStars();

	var draw = function(){
            drawBackground(bgStars, ctx);
            drawStars(stars, ctx);
            drawStats(profiler, stars.length, ctx);
	};

	var update = function(){
                var curNumStars = numStars();
                var incrementNum = incrementBy();
		if (stars.length < curNumStars){
                    for(var i = 0; i < incrementNum; i++){
                        stars.push(newStar(ctx));
                    }
		}
		
		updateStars(stars, curNumStars, ctx);
	};
	
	/*(var gameLoop1 = function(numLoops){
		var time = 0;
		
		while(time < 5000){	
			update();
			draw();
			time++;
		}
	}).call(this);*/
	
	(function(){
		setInterval(function(){
                    profiler.beginUpdate();
                    update();
                    profiler.endUpdate();
                    profiler.beginDraw();
                    draw();
                    profiler.endDraw();
		}, 30);
	}).call(this);	
        
        profiler.start();
};





