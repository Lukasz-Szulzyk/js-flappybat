window.onload = () => {
    game.init();
}

class Game {
    // bat starting position
    startingGap = 180;
    startingPosX = 30;
    startingPosY = 240;

    posX = this.startingPosX;
    posY = this.startingPosY;
    gravity = 1.5;
    score = 0;
    pipesGap = this.startingGap;

    pipes = [];

    init = () => {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");

        this.bat = new Image();
        this.bat.src = "images/bat1.png";

        this.bg = new Image();
        this.bg.src = "images/bg.jpg";

        this.pipeTop = new Image();
        this.pipeTop.src = "images/pipeTop.png";

        this.pipeBottom = new Image();
        this.pipeBottom.src = "images/pipeBottom.png";

        document.addEventListener("click", this.moveUp);
        document.addEventListener("keydown", (e) => {
            if (e.key == " ") {
                this.moveUp();
            }
        });
        this.startGame();
    }

    startGame = () => {
        const fps = 60;
        setInterval(this.updateGame, 1000 / 60);
        
        this.addPipe();      
    }

    addPipe = () => {
        let x = this.canvas.width;
        let y = Math.floor(Math.random() * this.pipeTop.height) - this.pipeTop.height;

        // size and position of pipes
        this.pipes.push({
            top: {
                img: this.pipeTop,
                x: x,
                y: y,
                width: this. pipeTop.width,
                height: this.pipeTop.height
            },
            bottom: {
                img: this.pipeBottom,
                x: x,
                y: y + this.pipeTop.height + this.pipesGap,
                width: this. pipeBottom.width,
                height: this.pipeBottom.height
            }
        });
    }

    updateGame = () => {

        this.addGravity();
        this.checkCollision();

        this.render();
    }

    addGravity = () => {
        this.posY += this.gravity;
    }

    checkCollision = () => {
        //bottom screen border
        if (this.posY > this.canvas.height - this.bat.height) {
            this.moveUp();
        }

        //top screen border
        if (this.posY < 0) {
            this.posY = 0;
        }

        const pipesToCheck = [...this.pipes];
        //bat position
        const bX = this.posX;
        const bY = this.posY;
        //bat size
        const bW = this.bat.width;
        const bH = this.bat.height;

        pipesToCheck.forEach( pipe => {
            //check if the bat is in range on X axis
            if(bX + bW > pipe.top.x
                && bX <= pipe.top.x + pipe.top.width) {
                // bat is on x axis inside pipe

                // bat is exceeding on Y axis above top pipe
                if ( bY < pipe.top.y + pipe.top.height
                    //collision on Y axis with bottom pipe
                    || bY + bH > pipe.bottom.y ) {
                        // collision
                        this.restart();
                    
                }
            }

            //playes gained a point
            if (pipe.top.x == -1) {
                this.score++;

                //descreasing the pipes gap for more challenge
                if(this.score % 2 == 0) {
                    this.pipesGap--;

                    if (this.pipesGap < 110) {
                        this.pipesGap == 110;
                    }
                }
            }
        } );

    }

    restart = () => {
        this.posX = this.startingPosX;
        this.posY = this.startingPosY;
        this.score = 0;

        this.pipes = [];
        this.pipesGap = this.startingGap;

        this.addPipe();
    }

    render = () => {
        this.context.drawImage(this.bg, 0, 0 );

        this.drawPipes();

        this.context.drawImage(this.bat, this.posX, this.posY);

        this.context.fillStyle = "#FFF";
        this.context.font = "20px Verdana";
        this.context.fillText("Points: " + this.score, 15, 30);
    }

    drawPipes = () => {
        const pipesToDraw = [...this.pipes];

        pipesToDraw.forEach ( pipe => {

            //draw top pipe
            this.context.drawImage( pipe.top.img, pipe.top.x, pipe.top.y );
            pipe.top.x--;

            //draw pottom pipe
            this.context.drawImage( pipe.bottom.img, pipe.bottom.x, pipe.bottom.y );
            pipe.bottom.x--;

            //add another pipe
            if (pipe.top.x == 150) {
                this.addPipe();

            }

            //remove pipe
            if (pipe.top.x + pipe.top.width < -100) {
                this.pipes.shift();
            }
        });
    }

    moveUp = () => {
        this.posY -= 35;

        this.bat.src = "images/bat2.png";
        setTimeout( () => { this.bat.src = "images/bat1.png" },100);
    }
}

const game = new Game();