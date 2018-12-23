var gameContainer = document.getElementById("game-container");
var allBlocksArray = [];

//Game Grid
gameGrid(40,40);

function gameGrid(height,width){
	for(i=0; i<height; i++){
		var gameLine = document.createElement("div");
		gameContainer.append(gameLine);
		gameContainer.children[i].classList.add("block-line");
		gameContainer.children[i].setAttribute("id","block-line-" +(i+1));
		for(j=0; j<width; j++){
			var blockLine = document.getElementById("block-line-" +(i+1));
			var gameBlock = document.createElement("div");
			blockLine.append(gameBlock);
			blockLine.children[j].classList.add("game-block");
			blockLine.children[j].setAttribute("id","block-number-" + (((i + 1) *100) + (j + 1)));
            document.getElementById("block-number-" + (((i + 1) *100) + (j + 1))).style.width = (1000 / width) + "px";
            document.getElementById("block-number-" + (((i + 1) *100) + (j + 1))).style.height = (1000 / height) + "px";
            allBlocksArray.push(((i + 1) *100) + (j + 1));
		}
	}
}

//Snake & Apple Start Position and Render
var appleLocation = document.getElementById("block-number-3030");
var snakeLengthArray = [3510,3511,3512,3513,3514,3515,3516,3517];

snakeShading();

appleLocation.classList.add("apple");

function snakeShading(){
    for(i=0; i<snakeLengthArray.length;i++){
        snakeSegment = document.getElementById("block-number-" + snakeLengthArray[i]);
        snakeSegment.classList.add("snake");
    }
}

snakeShading();

//Apple Position Randomizer
function scrambleBlockArray(){
    allBlocksArray.sort(function(a, b){
        return 0.5 - Math.random()});
}

function appleCheckandReassign(){
    scrambleBlockArray();
    for(i=0; i<allBlocksArray.length;i++){
        var potentialNewApplePosition = document.getElementById("block-number-" + allBlocksArray[i]);
        if(potentialNewApplePosition.classList.contains("snake")){
            continue;
        }else{
            appleLocation = document.getElementById("block-number-" + allBlocksArray[i]);
            appleLocation.classList.add("apple");
            break;
        }
    }
}

//Snake Speed and Direction
var currentDirection = 2;
var bufferedDirection = 2;
var snakeSpeedValue = 120;
var snakeSpeed = setInterval(snakeMotion, snakeSpeedValue);

//Key Input and Direction Change
window.addEventListener("keydown", function(e){
    key = e.which;
    switch(key){
        case 37:
            e.preventDefault();
            bufferedDirection = 0;
            break;
        case 38:
            e.preventDefault();
            bufferedDirection = 1;
            break;
        case 39:
            e.preventDefault();
            bufferedDirection = 2;
            break;
        case 40:
            e.preventDefault();
            bufferedDirection = 3;
            break;
    }
});

function directionChange(){
    switch(currentDirection){
        case 0:
        case 2:
            if(bufferedDirection === 1 || bufferedDirection === 3){
                currentDirection = bufferedDirection;
            }
            break;
        case 1:
        case 3:
            if(bufferedDirection === 0 || bufferedDirection === 2){
                currentDirection = bufferedDirection;
            }
            break;
    }
}


function snakeMotion(){
    directionChange();
    if(currentDirection == 2){
        snakeLengthArray.push(snakeLengthArray[snakeLengthArray.length -1] +1);
        snakeCheckandUpdate();
    }
    if(currentDirection == 3){
        snakeLengthArray.push(snakeLengthArray[snakeLengthArray.length -1] +100);
        snakeCheckandUpdate();
    }
    if(currentDirection == 1){
        snakeLengthArray.push(snakeLengthArray[snakeLengthArray.length -1] -100);
        snakeCheckandUpdate();
    }
    if(currentDirection == 0){
        snakeLengthArray.push(snakeLengthArray[snakeLengthArray.length -1] -1);
        snakeCheckandUpdate();
    }
    snakeShading();
}

function snakeCheckandUpdate(){
    var testValid = document.getElementById("block-number-" + snakeLengthArray[snakeLengthArray.length -1]);
        if(testValid == null || testValid.classList.contains("snake")){
            gameOver();
        }else if(testValid.classList.contains("apple")){
            appleLocation.classList.remove("apple");
            appleLocation.classList.add("snake");
            appleCheckandReassign();
            newSnakeSpeed();
            scoreUpdate();
        }else{
        var snakeSegment = document.getElementById("block-number-" + snakeLengthArray[0]);
        snakeSegment.classList.remove("snake");
        snakeLengthArray.shift();
        }
}

function newSnakeSpeed(){
    snakeSpeedValue -= .015 * snakeSpeedValue;
    clearInterval(snakeSpeed);
    snakeSpeed = setInterval(snakeMotion, snakeSpeedValue);
}

//Game Over
function gameOver(){
    clearInterval(snakeSpeed);
    setTimeout(reloadGame(), 3000);   //not working
    /*for(i=0; i<allBlocksArray.length;i++){
        var blockSegment = document.getElementById("block-number-" + allBlocksArray[0]);
        if(blockSegment.classList == "snake")
        blockSegment.classList.remove("snake");
        blockSegment.classList.remove("apple");
    }*/
}

function reloadGame(){
    location.reload();
}

//Points
var points = document.getElementById("points");
var lastTime = timeStamp();

function scoreUpdate(){
    currentScore = Number(points.innerHTML);
    valueAddedSnake = Math.pow(snakeLengthArray.length, 2);
    valueAddedSpeed = Math.pow((120 / snakeSpeedValue), 3);
    valueAddedTime = 5000 / (timeStamp() - lastTime);
    lastTime = timeStamp();
    currentScore += Math.round(valueAddedSnake * valueAddedSpeed * valueAddedTime);
    points.innerHTML = currentScore;
}

function timeStamp(){
    var d = new Date();
    var n = d.getTime();
    return n;
}


/* Things to add to the game


-enhance the game over experience

-sound effects???

-top 10 score board???
*/