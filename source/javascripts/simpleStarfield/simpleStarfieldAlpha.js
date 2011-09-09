
var star = function(x, y, vy, alpha) {
	var star = {
		x: x,
		y: y, 
		vy: vy,
		alpha: alpha
	}
	
	return star;
};

var initStars = function(ctx, numStars){
	var stars = [];
	
	for (var i = 0; i < numStars; i++){
		var startX = Math.random() * ctx.canvas.width;
		var startY = Math.random() * ctx.canvas.height;
		var vy = Math.random() * 10;
		var alpha = Math.random();
		
		stars.push(star(startX, startY, vy, alpha));
	}
	
	return stars;
}

var simpleStarfield = function($canvas, numStars){
	
	//Get the drawing context
	var ctx = $canvas[0].getContext("2d");
	
	//initialize the stars	
	var stars = initStars(ctx, numStars);

	var draw = function(){
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		
		for (var i = 0; i < stars.length; i++)
		{
			ctx.beginPath();
			ctx.fillStyle = "rgba(255, 255, 255, " + stars[i].alpha + ")";
			ctx.arc(stars[i].x, stars[i].y, 1, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();
		}
	};

	var update = function(){
		for (var i = 0; i < stars.length; i++){
			stars[i].y += stars[i].vy;
			
			if (stars[i].y > ctx.canvas.height){
				stars[i].y = 0;
			}
		}	
	};
	
	
	/*(var gameLoop1 = function(numLoops){
		var time = 0;
		
		while(time < 5000){	
			update();
			draw();
			time++;
		}
	}).call(this);*/
	
	(function(numLoops){
		setInterval(function(){
			update();
			draw();
		}, 30);
	}).call(this);	
};





