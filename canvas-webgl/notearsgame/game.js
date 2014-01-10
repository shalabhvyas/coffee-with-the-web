var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 320;
var FPS = 30;
var canvasElement = document.createElement("canvas");
canvasElement.setAttribute('width', CANVAS_WIDTH + 'px')
canvasElement.setAttribute('height', CANVAS_HEIGHT + 'px');

var canvas = canvasElement.getContext('2d');

window.onload = function() {

	document.body.appendChild(canvasElement);

	setInterval(function() {
		update();
		draw();
	}, 1000 / FPS);

};

var textX = 50;
var textY = 50;


function update() {

	if (keydown.space)
		player.shoot();

	if (keydown.left)
		player.x -= 5;

	if (keydown.right)
		player.x += 5;

	player.x = Math.min(Math.max(0, player.x), CANVAS_WIDTH);

	playerBullets.forEach(function(bullet) {
		bullet.update();
	});

	playerBullets = playerBullets.filter(function(bullet) {
		return bullet.active;
	});

	enemies.forEach(function(enemy) {
		enemy.update();
	});

	enemies = enemies.filter(function(enemy) {
		return enemy.active;
	});

	if (Math.random() < 0.1) {
		enemies.push(Enemy());
	}

	handleCollisions();

}

function draw() {
	canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	player.draw();

	playerBullets.forEach(function(bullet) {
		bullet.draw();
	});

	enemies.forEach(function(enemy) {
		enemy.draw();
	});
}


var player = {
		
	x: 220,
	y: 270,
	width: 32,
	height: 32,
	sprite: Sprite('player'),

	draw: function() {
		this.sprite.draw(canvas, this.x, this.y);
	},

	shoot: function() {
		var bulletPosition = this.midpoint();
		playerBullets.push(Bullet({
			x: bulletPosition.x,
			y: bulletPosition.y,
			speed: 5
		}));
	},

	midpoint: function() {
		return {
			x: this.x + this.width / 2,
			y: this.y + this.height / 2
		};
	},

	explode: function() {
		this.active = false;
	}
};

var playerBullets = [];

function Bullet(I) {

	I.active = true;

	I.xVelocity = 0;
	I.yVelocity = -I.speed;
	I.width = 3;
	I.height = 3;
	I.color = '#000';

	I.inBounds = function() {
		return I.x >= 0 && I.x <= CANVAS_WIDTH &&
			I.y >= 0 && I.y <= CANVAS_HEIGHT;
	};

	I.draw = function() {
		canvas.fillStyle = this.color;
		canvas.fillRect(this.x, this.y, this.width, this.height);
	};

	I.update = function() {
		I.x += I.xVelocity;
		I.y += I.yVelocity;

		I.active = I.active && I.inBounds();
	};

	return I;
};

var enemies = [];

function Enemy(I) {

	I = I || {};

	I.active = true;
	I.age = Math.floor(Math.random() * 128);
	I.sprite = Sprite("enemy");
	
	I.x = CANVAS_WIDTH / 4 + Math.random() * CANVAS_WIDTH / 2;
	I.y = 0;
	I.xVelocity = 0;
	I.yVelocity = 2;

	I.width = 2;
	I.height = 2;

	I.inBounds = function() {
		return I.x >= 0 && I.x <= CANVAS_WIDTH &&
			I.y >= 0 && I.y <= CANVAS_HEIGHT;
	};

	I.draw = function() {
		this.sprite.draw(canvas, this.x, this.y);
	};

	I.update = function() {
		I.x += I.xVelocity;
		I.y += I.yVelocity;

		I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);

		I.age++;

		I.active = I.active && I.inBounds();
	};

	I.explode = function(){
		this.active = false;
	};

	return I;

};

function collides(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function handleCollisions(){
	playerBullets.forEach(function(bullet){
		enemies.forEach(function(enemy){
				if(collides(bullet,enemy)){
					enemy.explode();
					bullet.active = false;
				}
		});
	});

	enemies.forEach(function(enemy){
		if(collides(enemy,player)){
			enemy.explode();
			player.explode();
		}
	});
}