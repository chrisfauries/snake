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
var snakeSpeed;

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
    saveScore();
    sortLeaderboard();
    leaderboardBuild();
    alert("Your Score was: " + points.innerHTML + "\n press 'OK' to restart");
    setTimeout(function(){ location.reload(); },1000);
   
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

var inpInt = document.getElementById("inpInt");
var btnSave = document.getElementById("btnSave");
var userInitials;
var topScoresArray = [];

btnSave.onclick = function(){
    userInitials = inpInt.value.toUpperCase();
    var status = document.getElementById("status");
    status.innerHTML = "Thanks, " + userInitials + ". Your Initials have been Saved!";
    console.log(userInitials.toUpperCase());
    setTimeout(function(){snakeSpeed = setInterval(snakeMotion, snakeSpeedValue);},4000);
    btnSave.disabled = true;
    setInterval(function(){ctdn.next();},1000);
}

function* countdown(){
    for(k=3;k>=0;k--){
       yield btnSave.innerHTML= k;
    }
}

var ctdn = countdown();

function sortLeaderboard(){
    for(i=0;i<localStorage.length;i++){
        var scoreName = localStorage.key(i);
        var scoreValue = localStorage.getItem(scoreName);
        topScoresArray[i] = [scoreName, Number(scoreValue)];
        topScoresArray.sort(Comparator);
    }
}
function Comparator(a, b) {
   if (b[1] < a[1]) return -1;
   if (b[1] > a[1]) return 1;
   return 0;
 }

function leaderboardBuild(){
    var leaderboard = document.getElementById("leaderboard");
    for(i=0; i<topScoresArray.length;i++){
        var columnDiv = document.createElement("div");
        leaderboard.append(columnDiv);
        leaderboard.children[i].setAttribute("id","column-" + (i+1));
        for(j=0; j<topScoresArray[i].length; j++){
            var rowSpan = document.createElement("Span");
            var columnSet = document.getElementById("column-" + (i+1));
            columnSet.append(rowSpan);
            columnSet.children[j].setAttribute("id", "span" + (((i+1)*10) + (j+1)));
            var rowSet = document.getElementById("span" + (((i+1)*10) + (j+1)));
            rowSet.innerHTML = topScoresArray[i][j];
            rowSet.classList.add("score-block");
        }
    }  
}

function saveScore(){
    if(Number(points.innerHTML) > Number(localStorage.getItem(userInitials))){
        localStorage.setItem(userInitials,points.innerHTML);
    }
}

sortLeaderboard();
leaderboardBuild();