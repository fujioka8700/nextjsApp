'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './Othello.module.css';
import Link from 'next/link';

type Player = 'black' | 'white';
type CellState = Player | null;
type BoardState = CellState[][];
type Difficulty = 'easy' | 'normal' | 'hard';

const BOARD_SIZE = 8;
const PLAYER: Player = 'black';
const COMPUTER: Player = 'white';

// 「強い」AIのための評価値テーブル
const positionalValue = [
    [120, -20, 20,  5,  5, 20, -20, 120],
    [-20, -40, -5, -5, -5, -5, -40, -20],
    [ 20,  -5, 15,  3,  3, 15,  -5,  20],
    [  5,  -5,  3,  3,  3,  3,  -5,   5],
    [  5,  -5,  3,  3,  3,  3,  -5,   5],
    [ 20,  -5, 15,  3,  3, 15,  -5,  20],
    [-20, -40, -5, -5, -5, -5, -40, -20],
    [120, -20, 20,  5,  5, 20, -20, 120]
];

const OthelloPage: React.FC = () => {
    const [board, setBoard] = useState<BoardState>([]);
    const [currentPlayer, setCurrentPlayer] = useState<Player>(PLAYER);
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [status, setStatus] = useState('');
    const [scores, setScores] = useState({ black: 0, white: 0 });

    const getFlips = useCallback((row: number, col: number, player: Player, currentBoard: BoardState): number[][] => {
        if (currentBoard[row]?.[col] !== null) return [];

        const opponent: Player = player === PLAYER ? COMPUTER : PLAYER;
        const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
        let allFlips: number[][] = [];

        for (const [dr, dc] of directions) {
            let flipsInDir: number[][] = [];
            let r = row + dr, c = col + dc;

            while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && currentBoard[r][c] === opponent) {
                flipsInDir.push([r, c]);
                r += dr; c += dc;
            }

            if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && currentBoard[r][c] === player) {
                allFlips = allFlips.concat(flipsInDir);
            }
        }
        return allFlips;
    }, []);

    const getValidMoves = useCallback((player: Player, currentBoard: BoardState): number[][] => {
        const moves: number[][] = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (getFlips(r, c, player, currentBoard).length > 0) {
                    moves.push([r, c]);
                }
            }
        }
        return moves;
    }, [getFlips]);

    const updateScores = useCallback((currentBoard: BoardState) => {
        let black = 0, white = 0;
        currentBoard.flat().forEach(cell => {
            if (cell === PLAYER) black++;
            if (cell === COMPUTER) white++;
        });
        setScores({ black, white });
        return { black, white };
    }, []);

    const initGame = useCallback(() => {
        const initialBoard = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
        initialBoard[3][3] = COMPUTER; initialBoard[3][4] = PLAYER;
        initialBoard[4][3] = PLAYER;   initialBoard[4][4] = COMPUTER;
        setBoard(initialBoard);
        setCurrentPlayer(PLAYER);
        setGameOver(false);
        setStatus('あなたの番です');
        updateScores(initialBoard);
    }, [updateScores]);

    const startGame = (selectedDifficulty: Difficulty) => {
        setDifficulty(selectedDifficulty);
        initGame();
    };

    const handlePlayerMove = (row: number, col: number) => {
        if (gameOver || currentPlayer !== PLAYER) return;

        const flips = getFlips(row, col, PLAYER, board);
        if (flips.length === 0) return;

        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = PLAYER;
        flips.forEach(([r, c]) => { newBoard[r][c] = PLAYER; });

        setBoard(newBoard);
        updateScores(newBoard);
        setCurrentPlayer(COMPUTER);
        setStatus('コンピュータが考えています...');
    };

    const computerMove = useCallback(() => {
        if (gameOver) return;

        const validMoves = getValidMoves(COMPUTER, board);
        if (validMoves.length === 0) {
            setCurrentPlayer(PLAYER);
            setStatus('コンピュータはパスしました。あなたの番です。');
            return;
        }

        let bestMove: number[];
        if (difficulty === 'easy') {
            bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        } else if (difficulty === 'normal') {
            bestMove = validMoves.reduce((best, move) => {
                const flips = getFlips(move[0], move[1], COMPUTER, board).length;
                return flips > best.flips ? { move, flips } : best;
            }, { move: validMoves[0], flips: 0 }).move;
        } else { // hard
            bestMove = validMoves.reduce((best, move) => {
                const score = positionalValue[move[0]][move[1]];
                return score > best.score ? { move, score } : best;
            }, { move: validMoves[0], score: -Infinity }).move;
        }

        const [row, col] = bestMove;
        const flips = getFlips(row, col, COMPUTER, board);
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = COMPUTER;
        flips.forEach(([r, c]) => { newBoard[r][c] = COMPUTER; });

        setBoard(newBoard);
        updateScores(newBoard);
        setCurrentPlayer(PLAYER);
        setStatus('あなたの番です');

    }, [board, difficulty, gameOver, getFlips, getValidMoves, updateScores]);

    useEffect(() => {
        if (currentPlayer === COMPUTER && !gameOver) {
            const timer = setTimeout(() => computerMove(), 1000);
            return () => clearTimeout(timer);
        }
    }, [currentPlayer, gameOver, computerMove]);

    useEffect(() => {
        if (difficulty === null || board.length === 0) return;

        const playerHasMoves = getValidMoves(PLAYER, board).length > 0;
        const computerHasMoves = getValidMoves(COMPUTER, board).length > 0;

        if (!playerHasMoves && !computerHasMoves) {
            setGameOver(true);
            const { black, white } = scores;
            if (black > white) setStatus('あなたの勝ちです！');
            else if (white > black) setStatus('コンピュータの勝ちです');
            else setStatus('引き分けです');
        } else if (currentPlayer === PLAYER && !playerHasMoves) {
            setStatus('あなたはパスです。コンピュータの番...');
            setCurrentPlayer(COMPUTER);
        } else if (currentPlayer === COMPUTER && !computerHasMoves) {
            // This case is handled in computerMove, but as a fallback
            setStatus('コンピュータはパスしました。あなたの番です。');
            setCurrentPlayer(PLAYER);
        }
    }, [board, currentPlayer, difficulty, getValidMoves, scores]);

    const resetGame = () => {
        setDifficulty(null);
        setBoard([]);
    };

    if (!difficulty) {
        return (
            <div className={styles.container}>
                <div className={styles.difficultySelection}>
                    <h2>難易度を選んでください</h2>
                    <button className={styles.difficultyBtn} onClick={() => startGame('easy')}>弱い</button>
                    <button className={styles.difficultyBtn} onClick={() => startGame('normal')}>普通</button>
                    <button className={styles.difficultyBtn} onClick={() => startGame('hard')}>強い</button>
                </div>
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Link href="/" className={styles.difficultyBtn} style={{ textDecoration: 'none' }}>ホームへ戻る</Link>
                </div>
            </div>
        );
    }

    const validMoves = getValidMoves(PLAYER, board);

    return (
        <div className={styles.container}>
            <div className={styles.gameContainer}>
                <h1>オセロ</h1>
                <div className={styles.gameInfo}>
                    <div>黒 (あなた): {scores.black}</div>
                    <div>白 (CPU): {scores.white}</div>
                </div>
                <div className={styles.gameBoard}>
                    {board.map((row, r) =>
                        row.map((cell, c) => {
                            const isMovable = validMoves.some(m => m[0] === r && m[1] === c);
                            return (
                                <div
                                    key={`${r}-${c}`}
                                    className={`${styles.cell} ${isMovable ? styles.validMove : ''}`}
                                    onClick={() => isMovable && handlePlayerMove(r, c)}
                                >
                                    {cell && <div className={`${styles.disc} ${styles[cell]}`}></div>}
                                </div>
                            );
                        })
                    )}
                </div>
                <div className={styles.status}>{status}</div>
                <button className={styles.resetButton} onClick={resetGame}>新しいゲーム</button>
                <div style={{ marginTop: '20px' }}>
                    <Link href="/" className={styles.resetButton} style={{ textDecoration: 'none' }}>ホームへ戻る</Link>
                </div>
            </div>
        </div>
    );
};

export default OthelloPage;
