
var newStar = function(ctx) {
	var x = ctx.canvas.width / 2,
		y = ctx.canvas.height / 2,
		radius = Math.random(),
		alpha = Math.random(),
		direction = Math.random() * Math.PI * 2,
		speed = Math.random() / 5;
	
	return { x:x, y:y, radius:radius, alpha:alpha, direction:direction, speed:speed };
};

var drawStars = function(stars, ctx) {
	for(var i = 0; i < stars.length; i++){
		ctx.beginPath();
		ctx.fillStyle = "rgba(255, 255, 255, " + stars[i].alpha + ")";
		ctx.arc(stars[i].x, stars[i].y, stars[i].radius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
	}
};

var updateStars = function(stars, ctx) {
	for (var i = 0; i < stars.length; i++){
		stars[i].y += Math.sin(stars[i].direction) * stars[i].speed;
		stars[i].x += Math.cos(stars[i].direction) * stars[i].speed;
		stars[i].speed += 0.04;
		stars[i].radius += 0.02;
		
		if (stars[i].y > ctx.canvas.height || stars[i].x > ctx.canvas.width ||
			stars[i].y < 0 || stars[i].x < 0){
			delete stars[i];	
			stars[i] = newStar(ctx);
		}
	}
}

var drawBackground = function(ctx){
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

var simpleStarfield = function($canvas, numStars){

	//Get the drawing context
	var ctx = $canvas[0].getContext("2d");
	
	//initialize the stars	
	var stars = [];

	var draw = function(){
		drawBackground(ctx);
		drawStars(stars, ctx);
	};

	var update = function(){
		if (stars.length < numStars){
			stars.push(newStar(ctx));
		}
		
		updateStars(stars, ctx);
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





