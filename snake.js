var gameContainer = document.getElementById("game-container");

//Game Grid

var allBlocksArray = [];

gameGrid(20,20);

function gameGrid(height,width){
	for(i=0; i<height; i++){
		var gameLine = document.createElement("div");
		gameContainer.append(gameLine);
		gameContainer.children[i].classList.add("block-line");
		gameContainer.children[i].setAttribute("id","block-line-" +(i+1));
        gameContainer.children[i].setAttribute("row", (i +1));
		for(j=0; j<width; j++){
			var blockLine = document.getElementById("block-line-" +(i+1));
			var gameBlock = document.createElement("div");
			blockLine.append(gameBlock);
			blockLine.children[j].classList.add("game-block");
			blockLine.children[j].setAttribute("id","block-number-" + (((i + 1) *100) + (j + 1)));
			blockLine.children[j].setAttribute("position",(j + 1));
            allBlocksArray.push(((i + 1) *100) + (j + 1));
		}
	}
}


//Snake & Apple Start Position

var appleLocation = document.getElementById("block-number-1215");
var snakeLengthArray = [1502,1503,1504,1505];

function snakeShading(){
    for(i=0; i<snakeLengthArray.length;i++){
        snakeSegment = document.getElementById("block-number-" + snakeLengthArray[i]);
        snakeSegment.classList.add("snake");
    }
}

// Initial Snake and Apple Render
snakeShading();

appleLocation.classList.add("apple");

var currentDirection = 0;
var bufferedDirection = 1;

var snakeSpeed = setInterval(snakeMotion, 1000);

function snakeMotion(){
    if(currentDirection == 1){
        snakeLengthArray.push(snakeLengthArray[snakeLengthArray.length -1] +1);
        snakeCheckandUpdate();
    }
    if(currentDirection == 2){
        snakeLengthArray.push(snakeLengthArray[snakeLengthArray.length -1] +100);
        snakeCheckandUpdate();
    }
    if(currentDirection == 0){
        snakeLengthArray.push(snakeLengthArray[snakeLengthArray.length -1] -100);
        snakeCheckandUpdate();
    }
    if(currentDirection == 3){
        snakeLengthArray.push(snakeLengthArray[snakeLengthArray.length -1] -1);
        snakeCheckandUpdate();
    }
    snakeShading();
}

function snakeCheckandUpdate(){
    var testValid = document.getElementById("block-number-" + snakeLengthArray[snakeLengthArray.length -1]);
        if(testValid == null){
            gameOver();
        }else if(testValid.classList.contains("apple")){
            appleLocation.classList.remove("apple");
            appleLocation.classList.add("snake");
        }else{
        var snakeSegment = document.getElementById("block-number-" + snakeLengthArray[0]);
        snakeSegment.classList.remove("snake");
        snakeLengthArray.shift();
        }
}




//Snake Initial Movement

//Snake Length

//Grid Boundries

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