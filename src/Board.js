import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';

class Board extends Component {

    constructor(props) {
        super(props);
        this.state = {hasWon: false, board: this.createBoard()};
        this.flipCellsAround = this.flipCellsAround.bind(this);
    }

    /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

    createBoard() {
        let board = [this.props.nrows];
        for (let i = 0; i < this.props.nrows; i++) {
            board[i] = [...Array(this.props.ncols)].map(() =>
                (Math.random()) < this.props.chanceLightStartsOn);
        }
        return board
    }

    /** handle changing a cell: update board & determine if winner */

    flipCellsAround(coord) {
        console.log(coord);
        let {ncols, nrows} = this.props;
        let board = this.state.board;
        let [y, x] = coord.split("-").map(Number);


        function flipCell(y, x) {
            // if this coord is actually on board, flip it
            if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
                board[y][x] = !board[y][x];
            }
        }

        // flip this cell and the cells around it
        flipCell(y, x);
        flipCell(y + 1, x);
        flipCell(y, x + 1);
        flipCell(y - 1, x);
        flipCell(y, x - 1);


        // win when every cell is turned off
        let didWin = this.state.board.every(row =>
            row.every(cell => !cell));

        console.log(didWin);
        this.setState({board: board, hasWon: didWin});
    }

    makeTable() {
        return <table className={"Board"}>
            <tbody>
            {this.state.board.map((arr, row) => {
                return <tr key={row}>
                    {arr.map((cell, col) => {
                        let coord = `${row}-${col}`;
                        return <Cell flipCellsAroundMe={() => this.flipCellsAround(coord)}
                                     key={coord} isLit={cell}/>
                    })}
                </tr>
            })}
            </tbody>
        </table>
    }

    /** Render game board or winning message. */
    render() {
        // if the game is won, just show a winning msg & render nothing else
        return (
            this.state.hasWon ? <div className='winner'>
                    <span className='neon-orange'>YOU</span>
                    <span className='neon-blue'>WIN!</span>
                </div> :
                <div>
                    <div className='Board-title'>
                        <div className='neon-orange'>Lights</div>
                        <div className='neon-blue'>Out</div>
                    </div>
                    {this.makeTable()}
                </div>
        )
    }
}

Board.defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: .25
};

export default Board;
