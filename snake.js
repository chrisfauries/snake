var gameContainer = document.getElementById("game-container");

//Game Grid

gameGrid(20,20);

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
			blockLine.children[j].setAttribute("position",(j + 1));
		}
	}
}


//Snake & Apple Start Position

var snakeStart = document.getElementById("block-number-1505");
var appleStart = document.getElementById("block-number-1215");

snakeStart.classList.add("snake");
appleStart.classList.add("apple");

//Snake Initial Movement

//Snake Length

//Grid Boundries

//Game Over