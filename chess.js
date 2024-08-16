class ChessGame {
    constructor() {
        this.squares = document.querySelectorAll('.square');
        this.topPlayerImage = document.querySelector('.cartoon-box.top img');
        this.bottomPlayerImage = document.querySelector('.cartoon-box.bottom img');
        this.selectedPiece = null;
        this.selectedId = null;
        this.validMoves = {};
        this.winer = 'typing...';
        this.playeronecount = 0;
        this.playertowcount = 0;
        this.isPlayerOneTurn = true;
        this.checkmate = false; // Flag for checkmate state
        this.initialize();
    }

    initialize() {
        this.squares.forEach(square => {
            square.addEventListener('click', () => this.handleSquareClick(square));
        });

        document.getElementsByClassName("interactive-button")[0].addEventListener("click", function () {
            window.location.reload();
        });
    }

    handleSquareClick(square) {
        if (this.checkmate) return; // Prevent moves if the game is in checkmate state

        const span = square.querySelector('span');
        const id = square.id;

        if (span && this.isPieceOfCurrentTurn(span.className)) {
            this.selectedPiece = span;
            this.selectedId = id;
            this.spanclass = span.className;

            if (this.spanclass.includes('pawn')) {
                this.pawnmove();
            } else if (this.spanclass.includes('rook')) {
                this.Elephant();
            } else if (this.spanclass.includes('knight')) {
                this.knightMove();
            } else if (this.spanclass.includes('bishop')) {
                this.bishopMove();
            } else if (this.spanclass.includes('queen')) {
                this.queenMove();
            } else if (this.spanclass.includes('king')) {
                this.kingMove();
            }
        } else if (this.selectedPiece) {
            const destinationId = id;
            this.movePiece(destinationId);
            this.selectedPiece = null;
            this.selectedId = null;

            this.checkForCheckmate(); // Check for checkmate after each move
        }
    }

    isPieceOfCurrentTurn(pieceClass) {
        return (this.isPlayerOneTurn && !pieceClass.includes('-ene')) ||
            (!this.isPlayerOneTurn && pieceClass.includes('-ene'));
    }
    pawnmove() {
        if (!this.selectedPiece) return;

        const selectedId = parseInt(this.selectedId);
        const pieceClass = this.selectedPiece.className;
        const direction = pieceClass === 'pawn-ene' ? 10 : -10;
        const moves = [];
        const startRow = Math.floor((selectedId - 1) / 10) + 1;

        if (startRow === 3 || startRow === 8) {
            const forwardId1 = selectedId + direction;
            const forwardId2 = selectedId + direction * 2;

            const forwardSquare1 = document.getElementById(forwardId1);
            const forwardSquare2 = document.getElementById(forwardId2);

            if (forwardSquare1 && !forwardSquare1.querySelector('span')) {
                moves.push(forwardId1);
            }

            if (forwardSquare1 && forwardSquare2 && !forwardSquare1.querySelector('span') && !forwardSquare2.querySelector('span')) {
                moves.push(forwardId2);
            }
        } else {
            const forwardId = selectedId + direction;
            if (forwardId >= 11 && forwardId <= 88) {
                const forwardSquare = document.getElementById(forwardId);
                if (forwardSquare && !forwardSquare.querySelector('span')) {
                    moves.push(forwardId);
                }
            }
        }

        const leftDiagonalId = selectedId + direction - 1;
        const rightDiagonalId = selectedId + direction + 1;

        if (leftDiagonalId >= 11 && leftDiagonalId <= 88) {
            const leftDiagonalSquare = document.getElementById(leftDiagonalId);
            if (leftDiagonalSquare && leftDiagonalSquare.querySelector('span') &&
                leftDiagonalSquare.querySelector('span').className !== pieceClass) {
                moves.push(leftDiagonalId);
            }
        }

        if (rightDiagonalId >= 11 && rightDiagonalId <= 88) {
            const rightDiagonalSquare = document.getElementById(rightDiagonalId);
            if (rightDiagonalSquare && rightDiagonalSquare.querySelector('span') &&
                rightDiagonalSquare.querySelector('span').className !== pieceClass) {
                moves.push(rightDiagonalId);
            }
        }

        this.validMoves = moves;
        this.highlightValidMoves();
    }

    Elephant() {
        if (!this.selectedPiece) return;

        const selectedId = parseInt(this.selectedId);
        const moves = [];

        const directions = [
            { x: 1, y: 0 }, { x: -1, y: 0 },
            { x: 0, y: 1 }, { x: 0, y: -1 }
        ];

        directions.forEach(direction => {
            let x = selectedId % 10;
            let y = Math.floor(selectedId / 10);

            x += direction.x;
            y += direction.y;
            const moveId = y * 10 + x;
            if (moveId < 11 || moveId > 88) return;
            const moveSquare = document.getElementById(moveId);
            if (!moveSquare) return;
            if (moveSquare.querySelector('span')) {
                if (moveSquare.querySelector('span').className !== this.selectedPiece.className) {
                    moves.push(moveId);
                }
            } else {
                moves.push(moveId);
            }
        });

        this.validMoves = moves;
        this.highlightValidMoves();
    }

    knightMove() {
        if (!this.selectedPiece) return;

        const selectedId = parseInt(this.selectedId);
        const moves = [];

        const possibleMoves = [
            selectedId + 21, selectedId + 19,
            selectedId + 12, selectedId + 8,
            selectedId - 21, selectedId - 19,
            selectedId - 12, selectedId - 8
        ];

        possibleMoves.forEach(moveId => {
            if (moveId >= 11 && moveId <= 88) {
                const moveSquare = document.getElementById(moveId);
                if (moveSquare && (!moveSquare.querySelector('span') || moveSquare.querySelector('span').className !== this.selectedPiece.className)) {
                    moves.push(moveId);
                }
            }
        });

        this.validMoves = moves;
        this.highlightValidMoves();
    }

    bishopMove() {
        if (!this.selectedPiece) return;

        const selectedId = parseInt(this.selectedId);
        const moves = [];

        const directions = [
            { x: 1, y: 1 }, { x: 1, y: -1 },
            { x: -1, y: 1 }, { x: -1, y: -1 }
        ];

        directions.forEach(direction => {
            let x = selectedId % 10;
            let y = Math.floor(selectedId / 10);

            while (true) {
                x += direction.x;
                y += direction.y;
                const moveId = y * 10 + x;
                if (moveId < 11 || moveId > 88) break;
                const moveSquare = document.getElementById(moveId);
                if (!moveSquare) break;
                if (moveSquare.querySelector('span')) {
                    if (moveSquare.querySelector('span').className !== this.selectedPiece.className) {
                        moves.push(moveId);
                    }
                    break;
                }
                moves.push(moveId);
            }
        });

        this.validMoves = moves;
        this.highlightValidMoves();
    }

    queenMove() {
        if (!this.selectedPiece) return;

        const selectedId = parseInt(this.selectedId);
        const moves = [];

        const directions = [
            { x: 1, y: 1 }, { x: 1, y: -1 },
            { x: -1, y: 1 }, { x: -1, y: -1 },
            { x: 1, y: 0 }, { x: -1, y: 0 },
            { x: 0, y: 1 }, { x: 0, y: -1 }
        ];

        directions.forEach(direction => {
            let x = selectedId % 10;
            let y = Math.floor(selectedId / 10);
            while (true) {
                x += direction.x;
                y += direction.y;
                const moveId = y * 10 + x;
                if (moveId < 11 || moveId > 88) break;
                const moveSquare = document.getElementById(moveId);
                if (!moveSquare) break;
                if (moveSquare.querySelector('span')) {
                    if (moveSquare.querySelector('span').className !== this.selectedPiece.className) {
                        moves.push(moveId);
                    }
                    break;
                }
                moves.push(moveId);
            }
        });

        this.validMoves = moves;
        this.highlightValidMoves();
    }

    kingMove() {
        if (!this.selectedPiece) return;

        const selectedId = parseInt(this.selectedId);
        const moves = [];

        const directions = [
            { x: 1, y: 0 }, { x: -1, y: 0 },
            { x: 0, y: 1 }, { x: 0, y: -1 },
            { x: 1, y: 1 }, { x: 1, y: -1 },
            { x: -1, y: 1 }, { x: -1, y: -1 }
        ];

        directions.forEach(direction => {
            const x = selectedId % 10 + direction.x;
            const y = Math.floor(selectedId / 10) + direction.y;
            const moveId = y * 10 + x;
            if (moveId < 11 || moveId > 88) return;
            const moveSquare = document.getElementById(moveId);
            if (!moveSquare) return;
            if (moveSquare.querySelector('span')) {
                if (moveSquare.querySelector('span').className !== this.selectedPiece.className) {
                    moves.push(moveId);
                }
                return;
            }
            moves.push(moveId);
        });

        this.validMoves = moves;
        this.highlightValidMoves();
    }

    highlightValidMoves() {
        this.squares.forEach(square => {
            square.classList.remove('valid-move');
        });

        this.validMoves.forEach(id => {
            const square = document.getElementById(id);
            if (square) {
                square.classList.add('valid-move');
            }
        });
    }

    movePiece(destinationId) {
        const destinationSquare = document.getElementById(destinationId);
        if (destinationSquare && this.selectedPiece && destinationSquare.classList.contains('valid-move')) {
            this.capturePiece(destinationSquare);
            destinationSquare.appendChild(this.selectedPiece);
            this.clearValidMoves();
            this.setTurn();
        }
    }

    capturePiece(destinationSquare) {
        const capturedPiece = destinationSquare.querySelector('span');

        if (capturedPiece) {
            capturedPiece.remove();

            if (this.isPlayerOneTurn) {
                this.playertowcount++;
            } else {
                this.playeronecount++;
            }

            if (capturedPiece.className == 'king') {
                this.winer = 'Second player';
            } else if (capturedPiece.className == 'king-ene') {
                this.winer = 'First player';
            }

            if (capturedPiece.className == 'king' || capturedPiece.className == 'king-ene') {
                this.showCapturedPieces();
            }
        }

        document.querySelector('.playerone').textContent = this.playeronecount;
        document.querySelector('.playertow').textContent = this.playertowcount;
        document.querySelector('.winer').textContent = this.winer;
    }

    setTurn() {
        this.isPlayerOneTurn = !this.isPlayerOneTurn;
        console.log(this.isPlayerOneTurn);
        this.topPlayerImage.classList.remove('player-turn');
        this.bottomPlayerImage.classList.remove('player-turn');

        if (this.isPlayerOneTurn) {
            this.bottomPlayerImage.classList.add('player-turn');
        } else {
            this.topPlayerImage.classList.add('player-turn');
        }
    }

    

    clearValidMoves() {
        this.squares.forEach(square => {
            square.classList.remove('valid-move');
        });
    }

    showCapturedPieces() {
        document.querySelector('.board').style.display = 'none';

        const counterBoxes = document.getElementsByClassName('counter-box');
        Array.from(counterBoxes).forEach(box => {
            box.classList.add('capture-container');
        });
    }
    
}




document.addEventListener('DOMContentLoaded', () => {
    new ChessGame();
});
