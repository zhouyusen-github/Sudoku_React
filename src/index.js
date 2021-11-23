import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const pureArr = [0,1,2,3,4,5,6,7,8]
const matrix = getSudokuMatrix();
const emptyNum = 10;
const blankLocation = getBlankLocation(emptyNum)


class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matrixWithBlank: getMatrixWithBlank(matrix,blankLocation),
            blankLocation: blankLocation
        };
    }

    showAnswer() {
        this.setState({
            matrixWithBlank: matrix,
            blankLocation: getBlankLocation(0)
        });
    }

    showIsCorrect() {
        alert('Your answer is '+ (isSudokuRight(this.state.matrixWithBlank)? 'true' : 'false'));
    }

    handleClick(x,y,e) {
        const matrixWithBlank = this.state.matrixWithBlank.slice();
        matrixWithBlank[x][y] = e.target.value;
        this.setState({
            matrixWithBlank: matrixWithBlank,
        });
    }

    renderSquare(x,y) {
        return (
            <Square
                msg= {this.state.matrixWithBlank[x][y]}
                readonly ={!this.state.blankLocation[x][y]}
                onChange={(e) => this.handleClick(x,y,e)}
            />
        );
    }

    render() {
        return (
            <div>
                {pureArr.map(x => (
                    <div>
                        {pureArr.map(y => (
                            this.renderSquare(x,y)
                        ))}
                    </div>
                ))}
                <button onClick={() => this.showIsCorrect()}>check your answer</button>
                <button onClick={() => this.showAnswer()}>get answer</button>
            </div>
        );
    }
}

function Square(props) {
    return (
        <span>
            <input
                maxLength={1}
                className="text"
                readOnly={props.readonly}
                onChange={(e) => props.onChange(e)}
                value={props.msg}
            />
        </span>
    );
}

// ========================================

ReactDOM.render(
    <Board />,
    document.getElementById('root')
);

function getSize() {
    return 9;
}

function getSqrtSize() {
    return Math.sqrt(getSize());
}


function getSudokuMatrix() {
    const size = getSize();
    const sqrtSize = getSqrtSize();
    let initSudokuMatrix = [
        ["1","2","3","4","5","6","7","8","9"],
        ["4","5","6","7","8","9","1","2","3"],
        ["7","8","9","1","2","3","4","5","6"],
        ["2","3","1","5","6","4","8","9","7"],
        ["5","6","4","8","9","7","2","3","1"],
        ["8","9","7","2","3","1","5","6","4"],
        ["3","1","2","6","4","5","9","7","8"],
        ["6","4","5","9","7","8","3","1","2"],
        ["9","7","8","3","1","2","6","4","5"]
    ];

    function switchPoint(Matrix, x1,y1,x2,y2) {
        let temp = Matrix[x1][y1];
        Matrix[x1][y1] = Matrix[x2][y2];
        Matrix[x2][y2] = temp;
    }

    function switchLine(Matrix, line1, line2) {
        for (let i = 0; i < size; i++) {
            switchPoint(Matrix,line1,i,line2,i);
        }
    }

    function switchRow(Matrix, row1, row2) {
        for (let i = 0; i < size; i++) {
            switchPoint(Matrix,i,row1,i,row2);
        }
    }

    function switchBlockInLine(Matrix, block1, block2) {
        for (let i = 0; i < sqrtSize; i++) {
            switchLine(Matrix, block1*3+i, block2*3+i);
        }
    }

    function switchBlockInRow(Matrix, block1, block2) {
        for (let i = 0; i < sqrtSize; i++) {
            switchRow(Matrix, block1*3+i, block2*3+i);
        }
    }

    function ramdomMatrix(Matrix) {
        for (let i = 0; i < sqrtSize; i++) {
            let switchIndex = Math.floor(Math.random() * sqrtSize);
            switchBlockInLine(Matrix, switchIndex, (switchIndex + 1) % 3);
            switchBlockInRow(Matrix, switchIndex, (switchIndex + 1) % 3);
        }
    }
    ramdomMatrix(initSudokuMatrix);
    return initSudokuMatrix;
}


function isSudokuRight(matrix) {
    const size = getSize();
    const sqrtSize = getSqrtSize();
    if (matrix==null) {
        return false;
    };

    function isLineRight(matrix,index) {
        let store = Array(size+1).fill(false);
        for (let i = 0; i < size; i++) {
            let value = matrix[index][i]
            if (value===""||value===null||store[parseInt(value)]) {
                return false;
            } else {
                store[value] = true;
            }
        }
        return true;
    }

    function isRowRight(matrix,index) {
        let store = Array(size+1).fill(false);
        for (let i = 0; i < size; i++) {
            let value = matrix[i][index]
            if (value===""||value===null||store[parseInt(value)]) {
                return false;
            } else {
                store[value] = true;
            }
        }
        return true;
    }

    function isBlockRight(matrix,xIndex,yIndex) {
        let store = Array(size+1).fill(false);
        for (let i = 0; i < sqrtSize; i++) {
            for (let j = 0; j < sqrtSize; j++) {
                let value = matrix[i+xIndex][j+yIndex]
                if (value===""||value===null||store[parseInt(value)]) {
                    return false;
                } else {
                    store[value] = true;
                }
            }
        }
        return true;
    }

    let ans = true
    for (let i = 0; i < size; i++) {
        ans = ans&isLineRight(matrix,i)
        ans = ans&isRowRight(matrix,i)
    }
    for (let i = 0; i < sqrtSize; i++) {
        for (let j = 0; j < sqrtSize; j++) {
            ans = ans&isBlockRight(matrix,i*3,j*3)
        }
    }
    return ans;
}

function getBlankLocation(count) {
    const size = getSize();
    let blankLocation = Array.from(Array(size)).map(() => Array(size).fill(false));
    let i = 0;
    while (i < count) {
        let xIn = Math.floor(Math.random() * size);
        let yIn = Math.floor(Math.random() * size);
        if (!blankLocation[xIn][yIn]) {
            blankLocation[xIn][yIn] = true;
            i++;
        }
    }
    return blankLocation;
}

function getMatrixWithBlank(matrix,blankLocation) {
    const size = getSize();
    let BlankMatrix = Array.from(Array(9)).map(() => Array(9).fill(0));
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            BlankMatrix[i][j] = blankLocation[i][j]?null:matrix[i][j];
        }
    }
    return BlankMatrix;
}
