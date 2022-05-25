let pieces = [
    {
        name: "T",
        color: "#19635c",
        rotations: [
            [
                {x: 0, y: 0},
                {x: -1, y: 0},
                {x: 1, y: 0},
                {x: 0, y: 1},
            ],
            [
                {x: 0, y: 0},
                {x: 0, y: -1},
                {x: 0, y: 1},
                {x: 1, y: 0},
            ],
            [
                {x: 0, y: 0},
                {x: -1, y: 0},
                {x: 1, y: 0},
                {x: 0, y: -1},
            ],
            [
                {x: 0, y: 0},
                {x: 0, y: -1},
                {x: 0, y: 1},
                {x: -1, y: 0},
            ]
        ]
    },
    {
        name: "I",
        color: "#632f19",
        rotations: [
            [
                {x: 0, y: 1},
                {x: -1, y: 1},
                {x: 1, y: 1},
                {x: 2, y: 1},
            ],
            [
                {x: 1, y: 0},
                {x: 1, y: -1},
                {x: 1, y: 1},
                {x: 1, y: 2},
            ],
            [
                {x: 0, y: 0},
                {x: -1, y: 0},
                {x: 1, y: 0},
                {x: 2, y: 0},
            ],
            [
                {x: 0, y: 0},
                {x: 0, y: -1},
                {x: 0, y: 1},
                {x: 0, y: 2},
            ]
        ]
    },
    {
        name: "L",
        color: "#1a6319",
        rotations: [
            [
                {x: 2, y: 1},
                {x: 2, y: 0},
                {x: 1, y: 1},
                {x: 0, y: 1},
            ],
            [
                {x: 1, y: 0},
                {x: 2, y: 2},
                {x: 1, y: 1},
                {x: 1, y: 2},
            ],
            [
                {x: 2, y: 0},
                {x: 0, y: 1},
                {x: 1, y: 0},
                {x: 0, y: 0},
            ],
            [
                {x: 1, y: 0},
                {x: 0, y: 0},
                {x: 1, y: 1},
                {x: 1, y: 2},
            ]
        ]
    },
    {
        name: "J",
        color: "#635c19",
        rotations: [
            [
                {x: 2, y: 1},
                {x: 0, y: 0},
                {x: 1, y: 1},
                {x: 0, y: 1},
            ],
            [
                {x: 1, y: 0},
                {x: 0, y: 2},
                {x: 1, y: 1},
                {x: 1, y: 2},
            ],
            [
                {x: 2, y: 0},
                {x: 2, y: 1},
                {x: 1, y: 0},
                {x: 0, y: 0},
            ],
            [
                {x: 1, y: 0},
                {x: 2, y: 0},
                {x: 1, y: 1},
                {x: 1, y: 2},
            ]
        ]
    },
    {
        name: "O",
        color: "#3e1963",
        rotations: [
            [
                {x: 1, y: 1},
                {x: 1, y: 2},
                {x: 2, y: 1},
                {x: 2, y: 2},
            ],
            [
                {x: 1, y: 1},
                {x: 1, y: 2},
                {x: 2, y: 1},
                {x: 2, y: 2},
            ],
            [
                {x: 1, y: 1},
                {x: 1, y: 2},
                {x: 2, y: 1},
                {x: 2, y: 2},
            ],
            [
                {x: 1, y: 1},
                {x: 1, y: 2},
                {x: 2, y: 1},
                {x: 2, y: 2},
            ]
        ]
    },
    {
        name: "S",
        color: "#541963",
        rotations: [
            [
                {x: 0, y: 1},
                {x: 1, y: 1},
                {x: 1, y: 0},
                {x: 2, y: 0},
            ],
            [
                {x: 1, y: 0},
                {x: 1, y: 1},
                {x: 2, y: 1},
                {x: 2, y: 2},
            ],
            [
                {x: 0, y: 2},
                {x: 1, y: 2},
                {x: 1, y: 1},
                {x: 2, y: 1},
            ],
            [
                {x: 0, y: 0},
                {x: 0, y: 1},
                {x: 1, y: 1},
                {x: 1, y: 2},
            ]
        ]
    },
    {
        name: "Z",
        color: "#191e63",
        rotations: [
            [
                {x: 0, y: 0},
                {x: 1, y: 0},
                {x: 1, y: 1},
                {x: 2, y: 1},
            ],
            [
                {x: 2, y: 0},
                {x: 2, y: 1},
                {x: 1, y: 1},
                {x: 1, y: 2},
            ],
            [
                {x: 0, y: 1},
                {x: 1, y: 1},
                {x: 1, y: 2},
                {x: 2, y: 2},
            ],
            [
                {x: 1, y: 0},
                {x: 1, y: 1},
                {x: 0, y: 1},
                {x: 0, y: 2},
            ]
        ]
    }
];

let gameBoard = [];

window.onload = function() {
    loadPieces();
    loadGame();
    updateLevel();
    updatePoints();
}

function loadPieces() {
    const piecesElem = document.getElementById("pieces");
    piecesElem.innerHTML = "";
    for(var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        piecesElem.innerHTML += `
            ${createPieceHTML(piece, 0)}
            <span class="piece-score">${String(statistics[piece.name].amount).padStart(6, '0')}</span>
        `;
    }
}

function createPieceHTML(piece, rotation) {
    let pieceHTML = "";

    let lowestX = 100, highestX = -100, lowestY = 100, highestY = -100;

    for(var i = 0; i < piece.rotations[rotation].length; i++) {
        let position = piece.rotations[rotation][i];
        if(position.x > highestX) highestX = position.x;
        if(position.x < lowestX) lowestX = position.x;
        if(position.y > highestY) highestY = position.y;
        if(position.y < lowestY) lowestY = position.y;
    }

    pieceHTML += `<div class="piece-display" style="--rows: ${highestY - lowestY + 1}; --columns: ${highestX - lowestX + 1};">`;
    for(var i = 0; i < piece.rotations[rotation].length; i++) {
        let position = piece.rotations[rotation][i];
        pieceHTML += `
            <div class="piece-square" style="--color: ${piece.color}; --color-light: ${pSBC(0.2, piece.color)}; --color-dark: ${pSBC(-0.5, piece.color)}; grid-row: ${position.y - lowestY + 1}; grid-column: ${position.x - lowestX + 1};"></div>
        `;
    }
    pieceHTML += `</div>`;

    return pieceHTML;
}

var canvas, ctx;

const gameWidth = 10, gameHeight = 16;

var statistics = {};

var nextPiece = false;

var level = 0;
var points = 0;
var mostPoints = 0;

const linesPerLevel = 12;
let linesSinceLevel = 0;

let totalLinesCleared = 0;

for(var i = 0; i < pieces.length; i++) {
    statistics[pieces[i].name] = {amount: 0};
}

for(var i = 0; i < gameWidth; i++) {
    gameBoard.push([]);
    for(var j = 0; j < gameHeight; j++) {
        gameBoard[i].push({piece: false, color: "#000000"});
    }
}

let fallingPiece = false;

function loadGame() {
    game = document.getElementById("game");

    game.style.setProperty('--width', 17);
    game.style.setProperty('--height', 17 * (gameHeight / gameWidth));
    game.style.setProperty('--columns', gameWidth);
    game.style.setProperty('--rows', gameHeight);

    updateBoard();

    generatePiece();
}

function updateBoard() {
    const game = document.getElementById("game");
    game.innerHTML = ``;
    let addHTML = ``;
    for(var i = 0; i < gameBoard.length; i++) {
        for(var j = 0; j < gameBoard[i].length; j++) {
            if(gameBoard[i][j].piece) {
                addHTML += `
                    <div class="piece-square" style="--color: ${gameBoard[i][j].color}; --color-light: ${pSBC(0.2, gameBoard[i][j].color)}; --color-dark: ${pSBC(-0.5, gameBoard[i][j].color)}; grid-row: ${j + 1}; grid-column: ${i + 1};"></div>
                `;
            }
        }
    }

    if(fallingPiece !== false) {
        for(var i = 0; i < fallingPiece.rotations[fallingPiece.rotation].length; i++) {
            let position = fallingPiece.rotations[fallingPiece.rotation][i];
            addHTML += `
                <div class="piece-square" style="--color: ${fallingPiece.color}; --color-light: ${pSBC(0.2, fallingPiece.color)}; --color-dark: ${pSBC(-0.5, fallingPiece.color)}; grid-row: ${position.y + fallingPiece.y + 1}; grid-column: ${position.x + fallingPiece.x + 1};"></div>
            `;
        }
    }
    game.innerHTML += addHTML;
}

function generatePiece() {
    let pieceIndex = Math.floor(Math.random() * pieces.length);
    let piece = pieces[pieceIndex];


    if(nextPiece === false) {
        nextPiece = piece;

        pieceIndex = Math.floor(Math.random() * pieces.length);
        piece = pieces[pieceIndex];
    } else {
        const tempPiece = piece;
        piece = nextPiece;
        nextPiece = tempPiece;
    }
    updateNextPiece(nextPiece);


    fallingPiece = piece;
    fallingPiece.rotation = 0;
    fallingPiece.x = gameWidth / 2 - 2;
    fallingPiece.y = 0;

    if(fallingTimeout !== false) clearTimeout(fallingTimeout);

    updateBoard();
    updateFallingPiece();
}

let fallingTimeout = false;

function updateFallingPiece() {
    fallingTimeout = setTimeout(function() {
        let oldX = fallingPiece.x;
        let oldY = fallingPiece.y;

        fallingPiece.y++;

        if(checkCollision(fallingPiece) === true) {
            fallingPiece.x = oldX;
            fallingPiece.y = oldY;
            placeOnBoard(fallingPiece);

            updateBoard();

            generatePiece();

            return;
        }

        if(checkY(fallingPiece) === false) return;
    
        updateBoard();

        updateFallingPiece();
    }, 500);
}

function updateNextPiece(piece) {
    const nextPieceElem = document.getElementById("nextPiece");
    nextPieceElem.innerHTML = createPieceHTML(piece, 0);
}

function checkY(fallingPiece) {
    let lowestX = 100, highestX = -100, lowestY = 100, highestY = -100;

    for(var i = 0; i < fallingPiece.rotations[fallingPiece.rotation].length; i++) {
        let position = fallingPiece.rotations[fallingPiece.rotation][i];
        if(position.x > highestX) highestX = position.x;
        if(position.x < lowestX) lowestX = position.x;
        if(position.y > highestY) highestY = position.y;
        if(position.y < lowestY) lowestY = position.y;
    }

    if(fallingPiece.y >= gameHeight - highestY - 1) {
        placeOnBoard(fallingPiece);

        generatePiece();
        return false;
    }

    return true;
}

function placeOnBoard(fallingPiece) {
    const pieceName = pieces.find((piece) => piece.name === fallingPiece.name).name;
    const statistic = statistics[pieceName];
    statistic.amount++;
    loadPieces();

    for(var i = 0; i < fallingPiece.rotations[fallingPiece.rotation].length; i++) {
        let position = fallingPiece.rotations[fallingPiece.rotation][i];
        let x = position.x + fallingPiece.x;
        let y = position.y + fallingPiece.y;

        if(y <= 1) {
            restartGame();
            return;
        }

        gameBoard[x][y] = {piece: true, color: fallingPiece.color};
    }

    let linesCleared = 0;
    for(var i = 0; i < gameHeight; i++) {
        let filledSquares = 0;
        for(var j = 0; j < gameWidth; j++) {
            let square = gameBoard[j][i];
            if(square.piece) filledSquares++;
        }
        if(filledSquares === gameWidth) {
            for(var j = 0; j < gameWidth; j++) {
                gameBoard[j].unshift({piece: false, color: "#000000"});
                gameBoard[j].splice(i + 1, 1);
                updateBoard();
            }
            linesCleared++;
        }
    }

    if(linesCleared === 1) {
        points += 40 * (level + 1);
    } else if(linesCleared === 2) {
        points += 100 * (level + 1);
    } else if(linesCleared === 3) {
        points += 300 * (level + 1);
    } else if(linesCleared === 4) {
        points += 1200 * (level + 1);
    }

    linesSinceLevel += linesCleared;
    if(linesSinceLevel >= linesPerLevel) {
        linesSinceLevel = linesSinceLevel - linesPerLevel;
        level++;
        updateLevel();
    }

    totalLinesCleared += linesCleared;

    updateLinesCleared();
    updatePoints();
}

function restartGame() {
    for(var i = 0; i < pieces.length; i++) {
        statistics[pieces[i].name] = {amount: 0};
    }

    gameBoard = [];
    for(var i = 0; i < gameWidth; i++) {
        gameBoard.push([]);
        for(var j = 0; j < gameHeight; j++) {
            gameBoard[i].push({piece: false, color: "#000000"});
        }
    }
    
    let fallingPiece = false;

    level = 0;
    points = 0;

    linesSinceLevel = 0;
    totalLinesCleared = 0;

    loadPieces();
    loadGame();
    updateLevel();
    updatePoints();
    updateLinesCleared();
}

function checkX(fallingPiece) {
    let lowestX = 100, highestX = -100, lowestY = 100, highestY = -100;

    for(var i = 0; i < fallingPiece.rotations[fallingPiece.rotation].length; i++) {
        let position = fallingPiece.rotations[fallingPiece.rotation][i];
        if(position.x > highestX) highestX = position.x;
        if(position.x < lowestX) lowestX = position.x;
        if(position.y > highestY) highestY = position.y;
        if(position.y < lowestY) lowestY = position.y;
    }

    if(fallingPiece.x < -lowestX) {
        return false;
    }
    if(fallingPiece.x >= gameWidth - highestX) {
        return false;
    }
    return true;
}

function checkCollision(fallingPiece) {
    for(var i = 0; i < gameBoard.length; i++) {
        for(var j = 0; j < gameBoard[i].length; j++) {
            const piece = gameBoard[i][j];
            if(!piece.piece) continue;
            for(var k = 0; k < fallingPiece.rotations[fallingPiece.rotation].length; k++) {
                const position = fallingPiece.rotations[fallingPiece.rotation][k];
                if((fallingPiece.x + position.x) === i && (fallingPiece.y + position.y) === j) {
                    return true;
                }
            }
        }
    }
    return false;
 }

document.addEventListener("keydown", function(event) {
    switch(event.key) {
        case "r":
        case " ":
        case "ArrowUp":
        case "w":
            let oldRotation = fallingPiece.rotation;
            fallingPiece.rotation++;
            if(fallingPiece.rotation > 3) fallingPiece.rotation = 0;
            if(checkCollision(fallingPiece)) {
                fallingPiece.rotation = oldRotation;
                return;
            }
            if(!checkX(fallingPiece)) {
                fallingPiece.rotation = oldRotation;
                return;
            }
            if(!checkY(fallingPiece)) {
                fallingPiece.rotation = oldRotation;
                return;
            }
            updateBoard();
            break;
        case "a":
        case "ArrowLeft":
            let oldXA = fallingPiece.x;
            let oldYA = fallingPiece.y;
            fallingPiece.x--;
            if(!checkX(fallingPiece)) {
                fallingPiece.x = oldXA;
                return;
            }
            if(checkCollision(fallingPiece)) {
                fallingPiece.x = oldXA;
                fallingPiece.y = oldYA;
                return;
            }
            updateBoard();
            break;
        case "d":
        case "ArrowRight":
            let oldXD = fallingPiece.x;
            let oldYD = fallingPiece.y;
            fallingPiece.x++;
            if(!checkX(fallingPiece)) {
                fallingPiece.x = oldXD;
                return;
            }
            if(checkCollision(fallingPiece)) {
                fallingPiece.x = oldXD;
                fallingPiece.y = oldYD;
                return;
            }
            updateBoard();
            break;
        case "s":
        case "ArrowDown":
            let oldXS = fallingPiece.x;
            let oldYS = fallingPiece.y;
            fallingPiece.y++;
            if(checkCollision(fallingPiece)) {
                fallingPiece.x = oldXS;
                fallingPiece.y = oldYS;
                return;
            }
            if(!checkY(fallingPiece)) return;
            updateBoard();
            break;
    }
})

function updatePoints() {
    let scoreElem = document.getElementById("score");
    let highScoreElem = document.getElementById("highScore");

    if(points > mostPoints) {
        mostPoints = points;
    }

    scoreElem.innerHTML = String(points).padStart(6, '0');
    highScoreElem.innerHTML = String(mostPoints).padStart(6, '0');
}
function updateLevel() {
    let levelElem = document.getElementById("level");
    levelElem.innerHTML = level;
}
function updateLinesCleared() {
    let linesClearedElem = document.getElementById("lines");
    linesClearedElem.innerHTML = String(totalLinesCleared).padStart(3, '0');
}

const pSBC=(p,c0,c1,l)=>{
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this.pSBCr)this.pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}