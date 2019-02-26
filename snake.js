var gameContainer = document.getElementById("game-container");
var allBlocksArray = [];

//Game Grid
gameGrid(30,30);

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

function Snake(lengthArr, currentDirection, bufferedDirection,speedValue) {
	
	this.lengthArr = lengthArr;
	
	this.currentDirection = currentDirection;
	this.bufferedDirection = bufferedDirection;
	this.speed;
	this.speedValue = speedValue;
	
	this.shading = () =>{
    for(i=0; i<this.lengthArr.length;i++){
        snakeSegment = document.getElementById("block-number-" + this.lengthArr[i]);
        snakeSegment.classList.add("snake");
    }
	}
	
	this.updateSpeed =() => {
    this.speedValue -= .015 * this.speedValue;
    clearInterval(this.speed);
    this.speed = setInterval(this.motion, this.speedValue);
	}
	
	this.motion = () => {
    this.directionChange();
    if(this.currentDirection == 2){
        this.lengthArr.push(this.lengthArr[this.lengthArr.length -1] +1);
        this.checkAndUpdate();
    }
    if(this.currentDirection == 3){
        this.lengthArr.push(this.lengthArr[this.lengthArr.length -1] +100);
        this.checkAndUpdate();
    }
    if(this.currentDirection == 1){
        this.lengthArr.push(this.lengthArr[this.lengthArr.length -1] -100);
        this.checkAndUpdate();
    }
    if(this.currentDirection == 0){
        this.lengthArr.push(this.lengthArr[this.lengthArr.length -1] -1);
        this.checkAndUpdate();
		}
    this.shading();
	}
	
	this.directionChange = () =>{
			switch(this.currentDirection){
					case 0:
					case 2:
							if(this.bufferedDirection === 1 || this.bufferedDirection === 3){
									this.currentDirection = this.bufferedDirection;
									soundChangeDirection.play();
							}
							break;
					case 1:
					case 3:
							if(this.bufferedDirection === 0 || this.bufferedDirection === 2){
									this.currentDirection = this.bufferedDirection;
									soundChangeDirection.play();
							}
							break;
			}
	}
	
	this.checkAndUpdate = () => {
    var testValid = document.getElementById("block-number-" + this.lengthArr[this.lengthArr.length -1]);
        if(testValid == null || testValid.classList.contains("snake")){
            gameOver.call(this); 
        }else if(testValid.classList.contains("apple")){
            gameApple.location.classList.remove("apple");
						gameApple.location.classList.add("snake");
            gameApple.reassign();
						soundGrabApple.play();
						soundBackgoundMusic.sound.playbackRate = (soundBackgoundMusic.sound.playbackRate + .005).toFixed(4);
            this.updateSpeed();
            scoreUpdate.call(this);
        }else{
        var snakeSegment = document.getElementById("block-number-" + this.lengthArr[0]);
        snakeSegment.classList.remove("snake");
        this.lengthArr.shift();
        }
	}
}


function Apple(location) {
  this.location = document.getElementById('block-number-' + location);
	
	this.shade = () => {this.location.classList.add('apple')}

	this.reassign = () => {
    scramble();
    for(i=0; i<allBlocksArray.length;i++){
        var potentialNewApplePosition = document.getElementById("block-number-" + allBlocksArray[i]);
        if(potentialNewApplePosition.classList.contains("snake")){
            continue;
        }else{
            this.location = document.getElementById("block-number-" + allBlocksArray[i]);
            this.location.classList.add("apple");
            break;
        }
    }
		function scramble(){
    allBlocksArray.sort(function(a, b){
        return 0.5 - Math.random()});
		}
	}
	
}

var gameSnake = new Snake([2210,2211,2212,2213,2214,2215,2216,2217],2,2,120);
var gameApple = new Apple(2020);

gameSnake.shading();

gameApple.shade();

//Key Input and Direction Change
window.addEventListener("keydown", function(e){
    key = e.which;
    switch(key){
        case 37:
            e.preventDefault();
            gameSnake.bufferedDirection = 0;
            break;
        case 38:
            e.preventDefault();
            gameSnake.bufferedDirection = 1;
            break;
        case 39:
            e.preventDefault();
            gameSnake.bufferedDirection = 2;
            break;
        case 40:
            e.preventDefault();
            gameSnake.bufferedDirection = 3;
            break;
    }
});

//Game Over
function gameOver(){
    clearInterval(this.speed);
		soundDeath.play();
		soundBackgoundMusic.stop();
		var num15 = document.getElementById('span152');
		if(Number(points.innerHTML) >= (Number(num15.innerHTML) /2)) {
			db.collection('Scores').add({
				init: userInitials,
				time: Date().valueOf(),
				score: points.innerHTML
			});
		}
		getScores();
    alert("Your Score was: " + points.innerHTML + "\n press 'OK' to restart");
    setTimeout(function(){ location.reload(); },1000);
   
}


//FireStore
function getScores (){
	db.collection('Scores').get().then((scores) => {
		var allScores = []
		for(i=0; i< scores.docs.length; i++) {
			allScores[i] = [scores.docs[i].data().init, scores.docs[i].data().score];
		}
		allScores.sort((a, b) => b[1] - a[1]);
		leaderboardBuild(allScores);
	});
}

getScores();




//Points
var points = document.getElementById("points");
var lastTime = timeStamp();

function scoreUpdate(){
    currentScore = Number(points.innerHTML);
    valueAddedSnake = Math.pow(this.lengthArr.length, 2);
    valueAddedSpeed = Math.pow((120 / this.speedValue), 3);
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





function leaderboardBuild(arr){
    var leaderboard = document.getElementById("leaderboard");
    for(i=0; i< 15;i++){
        var columnDiv = document.createElement("div");
        leaderboard.append(columnDiv);
        leaderboard.children[i].setAttribute("id","column-" + (i+1));
        for(j=0; j<arr[i].length; j++){
            var rowSpan = document.createElement("Span");
            var columnSet = document.getElementById("column-" + (i+1));
            columnSet.append(rowSpan);
            columnSet.children[j].setAttribute("id", "span" + (((i+1)*10) + (j+1)));
            var rowSet = document.getElementById("span" + (((i+1)*10) + (j+1)));
            rowSet.innerHTML = arr[i][j];
            rowSet.classList.add("score-block");
        }
    }  
}


function viewNoStart() {
	document.querySelector('#pop-up-bg').style.display = 'none';
	document.querySelector('#pop-up').style.display = 'none';
}

function startGame() {
	var init = document.querySelector('#inpInt');
	if(init.value.length === 3) {
		document.querySelector('#pop-up-bg').style.animation= 'fadeOut 3s ease forwards';
		document.querySelector('#pop-up').style.display = 'none';
		userInitials = inpInt.value.toUpperCase();
    setTimeout(function(){gameSnake.speed = setInterval(gameSnake.motion, gameSnake.speedValue);},5000);
		countdown();
	}
}

function countdown() {
	var countdownTimer = document.querySelector('#countdown');
	countdownTimer.style.display = 'block';
	var count = 3;
	var counter = setInterval(function(){								
								if(countdownTimer.innerHTML === 'Begin!') {
									countdownTimer.style.display = 'none';
									soundBackgoundMusic.play();
									clearInterval(counter);
								}else if(countdownTimer.innerHTML === '1') {
									soundCountdown.stop();
									countdownTimer.style.fontSize = '600px'
									countdownTimer.innerHTML = 'Begin!';
									soundCountdown.sound.currentTime = 0;
									soundCountdown.play();
								} else {
									soundCountdown.stop();
									countdownTimer.innerHTML = count;
									soundCountdown.sound.currentTime = 0;
									soundCountdown.play();
									count--;
								}
							}, 1000);
}


//Sound Effects

function Sound(src, loop, volume) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
	this.sound.loop = loop;
	this.sound.volume = volume;
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

var soundChangeDirection = new Sound('sound/changeDirection.wav', false, .3);
var soundGrabApple = new Sound('sound/grabApple.wav', false, .2);
var soundBackgoundMusic = new Sound('sound/background.mp3', true, .1);
var soundDeath = new Sound('sound/death.wav', false, .5);
var soundCountdown = new Sound('sound/countdown.mp3', false, .5);


//Mute Button

function mute() {
	var muteBtn = document.querySelector('#mute img');
	if(muteBtn.getAttribute('state') === 'unmuted') {
		soundChangeDirection.sound.muted = true;
		soundGrabApple.sound.muted = true;
		soundBackgoundMusic.sound.muted = true;
		soundDeath.sound.muted = true;
		soundCountdown.sound.muted = true;
		muteBtn.setAttribute('state', 'muted');
		muteBtn.setAttribute('src', 'img/noSound.png');
	} else {
		soundChangeDirection.sound.muted = false;
		soundGrabApple.sound.muted = false;
		soundBackgoundMusic.sound.muted = false;
		soundDeath.sound.muted = false;
		soundCountdown.sound.muted = false;
		muteBtn.setAttribute('state', 'unmuted');
		muteBtn.setAttribute('src', 'img/sound.png');
	}
}


//MobileControls

window.addEventListener('touchmove', function(e){
	e.preventDefault();
	console.log(e);
});


