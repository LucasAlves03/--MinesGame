    // Configurações do jogo
      //aumente a dificuldade do jogo
      const boardSize = 10;
      const totalMines = 3;

        // Variáveis do jogo
        let board = [];
        let mines = [];
        let revealedCells = 0;

        // Elementos do DOM
        const bestScoreElement = document.getElementById('best');
        const scoreElement = document.getElementById('score');
        const gameOverModal = document.getElementById('gameOverModal');
        const victoryModal = document.getElementById('victoryModal');
        const finalScoreElement = document.getElementById('finalScore');
        const finalScoreVictoryElement = document.getElementById('finalScoreVictory');

        let currentScore = 0;
        let bestScore = 0;

        // Função para criar o tabuleiro
        function createBoard() {
            for (let i = 0; i < boardSize; i++) {
                board[i] = [];
                for (let j = 0; j < boardSize; j++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.dataset.row = i;
                    cell.dataset.col = j;
                    cell.addEventListener('click', handleClick);
                    cell.addEventListener('contextmenu', handleRightClick);
                    document.getElementById('board').appendChild(cell);
                    board[i][j] = {
                        element: cell,
                        hasMine: false,
                        revealed: false,
                        neighborMines: 0,
                        flagged: false
                    };
                }
            }
        }

        // Função para colocar as minas no tabuleiro
        function placeMines() {
            let minesPlaced = 0;
            while (minesPlaced < totalMines) {
                const row = Math.floor(Math.random() * boardSize);
                const col = Math.floor(Math.random() * boardSize);
                if (!board[row][col].hasMine) {
                    board[row][col].hasMine = true;
                    mines.push({ row, col });
                    minesPlaced++;
                }
            }
        }

        // Função para contar as minas vizinhas de uma célula
        function countNeighborMines(row, col) {
            let count = 0;
            for (let i = row - 1; i <= row + 1; i++) {
                for (let j = col - 1; j <= col + 1; j++) {
                    if (i >= 0 && i < boardSize && j >= 0 && j < boardSize && board[i][j].hasMine) {
                        if (i !== row || j !== col) {
                            count++;
                        }
                    }
                }
            }
            return count;
        }

        // Função para revelar uma célula
        function revealCell(row, col) {
            const cell = board[row][col];
            if (cell.revealed || cell.flagged) {
                return;
            }

            cell.revealed = true;
            revealedCells++;
            cell.element.classList.remove('hidden');

            if (cell.hasMine) {
                cell.element.classList.add('bomb');
                // Game over
                setTimeout(function() {
                    gameOver();
                }, 2000);
            } else {
                const neighborMines = countNeighborMines(row, col);
                if (neighborMines === 0) {
                    cell.element.classList.add('check');
                    cell.element.textContent = '';
                } else {
                    cell.element.textContent = neighborMines;
                    cell.element.classList.add('check');
                }
                currentScore++;
                scoreElement.textContent = 'Score: ' + currentScore;

                if (revealedCells === (boardSize * boardSize) - totalMines) {
                    // Vitória
                    setTimeout(function() {
                        victory();
                    }, 500);
                }
            }
        }

        // Função para lidar com cliques nas células
        function handleClick(event) {
            const row = parseInt(event.target.dataset.row);
            const col = parseInt(event.target.dataset.col);
            const cell = board[row][col];

            if (cell.hasMine) {
                cell.element.classList.add('bomb');
                // Game over
                setTimeout(function() {
                    gameOver();
                }, 2000);
            } else {
                revealCell(row, col);
            }
        }

        // Função para lidar com cliques com botão direito nas células (marcar/desmarcar célula)
        function handleRightClick(event) {
            event.preventDefault();
            const row = parseInt(event.target.dataset.row);
            const col = parseInt(event.target.dataset.col);
            const cell = board[row][col];
            if (!cell.revealed) {
                cell.flagged = !cell.flagged;
                event.target.classList.toggle('marked');
            }
        }

        // Função para lidar com o fim do jogo (derrota)
        function gameOver() {
            finalScoreElement.textContent = currentScore;
            gameOverModal.style.display = 'block';

            // Fecha o modal quando o botão "x" é clicado
            const closeButton = document.getElementsByClassName('close')[0];
            closeButton.addEventListener('click', function() {
                gameOverModal.style.display = 'none';
            });

            // Atualiza a melhor pontuação se necessário
            if (currentScore > bestScore) {
                bestScore = currentScore;
                bestScoreElement.textContent = 'Best Score: ' + bestScore;
            }

            resetGame();
        }

        // Função para lidar com a vitória no jogo
        function victory() {
            finalScoreVictoryElement.textContent = currentScore;
            victoryModal.style.display = 'block';

            // Fecha o modal quando o botão "x" é clicado
            const closeButton = document.getElementsByClassName('close')[1];
            closeButton.addEventListener('click', function() {
                victoryModal.style.display = 'none';
            });

            // Atualiza a melhor pontuação se necessário
            if (currentScore > bestScore) {
                bestScore = currentScore;
                bestScoreElement.textContent = 'Best Score: ' + bestScore;
            }

            resetGame();
        }

        // Função para reiniciar o jogo
        function resetGame() {
            board = [];
            mines = [];
            revealedCells = 0;
            currentScore = 0;
            scoreElement.textContent = 'Score: ' + currentScore;

            // Remove as células do tabuleiro
            const boardElement = document.getElementById('board');
            while (boardElement.firstChild) {
                boardElement.firstChild.remove();
            }

            // Cria um novo tabuleiro e coloca as minas
            createBoard();
            placeMines();
        }

        // Cria o tabuleiro e coloca as minas ao carregar a página
        document.addEventListener('DOMContentLoaded', function() {
            createBoard();
            placeMines();
        });
