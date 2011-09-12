
var newStar = function(ctx) {
	var x = ctx.canvas.width / 2,
		y = ctx.canvas.height / 2,
		radius = Math.random(),
		color = Math.round(Math.random() * 255),
		direction = Math.random() * Math.PI * 2,
		speed = Math.random() / 5;
	
	return { x:x, y:y, radius:radius, color:color, direction:direction, speed:speed };
};

var drawStars = function(stars, ctx) {
	for(var i = 0; i < stars.length; i++){
		ctx.beginPath();
		ctx.fillStyle = "rgb(" + stars[i].color + ", " + stars[i].color + ", " + stars[i].color + ")";
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

	var ctx = $canvas[0].getContext("2d"),
		stars = [];

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
	
	(function(){
		setInterval(function(){
			update();
			draw();
		}, 30);
	}).call(this);	
};





