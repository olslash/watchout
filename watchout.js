var board = {
  width: 960,
  height: 500
};

var gameData = {
  numEnemies: 20,
  highScore: 0,
  score: 0,
  highscore: 0
};

var stadium = d3.select("body")
                .append("svg")
                .attr("class", "stadium")
                .attr("width", board.width)
                .attr("height", board.height);

var makeRandomEnemy = function() {
  stadium.append("circle")
          .attr("cx", function(){
            return Math.floor(Math.random() * (board.width - 60)) + 30;
          })
          .attr("cy", function(){
            return Math.floor(Math.random() * (board.height - 60)) + 30;
          })
          .attr("r", 15)
          .attr("fill", "purple")
          .attr("class", "enemy");
};

for(var i = 0; i < gameData.numEnemies; i++) {
  makeRandomEnemy();
}

var enemies = d3.selectAll('circle');

var heroCircle = {};

function onDragDrop(dragHandler) {
  var drag = d3.behavior.drag();
  drag.on("drag", dragHandler);
  return drag;
}

function dragmove(d) {
  //enemies.each(function(enemy) {return enemy;});
  d3.select(this)
  .attr("cx", d3.event.x)
  .attr("cy", d3.event.y);
}

var makeHero = function() {
  heroCircle = stadium.append("circle")
        .attr("cx", board.width/2)
        .attr("cy", board.height/2)
        .attr("r", 15)
        .attr("fill", "red")
        .attr("class", "hero")
        .call(onDragDrop(dragmove));
};



var checkCollision = function(enemy){
  if(distance(heroCircle, enemy) < 30) {
    heroCircle.attr("fill", "green");
    gameData.score = 0;
  }
};


var tweenWithCollisionDetection = function(){
  var enemy = d3.select(this);
  return function() {
    checkCollision(enemy);
  };
};

var moveEnemies = function() {
  heroCircle.attr("fill", "red");
  enemies.transition()
          .attr("cx", function(){
            return Math.floor(Math.random() * (board.width - 60)) + 30;
          })
          .attr("cy", function(){
            return Math.floor(Math.random() * (board.height - 60)) + 30;
          })
          .duration('3000')
          .tween('custom', tweenWithCollisionDetection);
};


var currentScore = function(text) {
  d3.selectAll(".scoreboard .current span")
    .text(text);
};

var highScore = function(text) {
  d3.selectAll(".scoreboard .high span")
    .text(text);
};

var updateScore = function(){
  if(gameData.score > gameData.highScore) {
    gameData.highScore = gameData.score;
    highScore(gameData.highScore);
  }
  currentScore(gameData.score)
  gameData.score++;
};


var distance = function(hero, enemy) {
  var dx = hero.attr('cx') - enemy.attr('cx');
  var dy = hero.attr('cy') - enemy.attr('cy');
  dx = dx * dx;
  dy = dy * dy;
  return Math.sqrt( dx + dy );
};

makeHero();
setInterval(moveEnemies, 3500);
setInterval(updateScore, 100);


/* To Do List
board setup
scoreboard setup
20 enemy nodes
we need to add hero node
we need to move enemy nodes randomly
  -> initate randomly - final destination randomly - move to that place
we need to drag our node
collision detection
  -> update score
*/
