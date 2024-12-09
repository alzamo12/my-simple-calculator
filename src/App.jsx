import { useReducer } from "react";
import DigitBtn from "./DigitBtn";
import OperationBtn from "./OperationBtn";
import './app.css'

export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate'
}

const reducer = (state, { type, payload }) => {

    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if (state?.overwrite) {
                return {
                    ...state,
                    currentOperand: payload?.digit,
                    overwrite: false
                }
            }
            if (payload?.digit === "0" && state?.currentOperand === "0") {
                return state
            }
            if (payload?.digit === "." && state?.currentOperand.includes(".")) {
                return state
            }
            return {
                ...state,
                currentOperand: `${state.currentOperand || ""}${payload.digit}`,
            }
        case ACTIONS.CHOOSE_OPERATION:
            if (state?.currentOperand == null && state.previousOperand == null) {
                return state
            }

            if (state?.currentOperand == null) {
                return {
                    ...state,
                    operation: payload.operation
                }
            }

            if (state.previousOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null
                }
            }

            return {
                ...state,
                previousOperand: evaluate(state),
                operation: payload.operation,
                currentOperand: null
            }

        case ACTIONS.CLEAR:
            return {}
        case ACTIONS.DELETE_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    currentOperand: null
                }
            }
            if (state.currentOperand == null) return null
            if (state.currentOperand.length === 1) {
                return { ...state, currentOperand: null }
            }

            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1)
            }
        case ACTIONS.EVALUATE:
            if (
                state.operation == null ||
                state.currentOperand == null ||
                state.previousOperand == null
            ) {
                return state
            }
            return {
                ...state,
                overwrite: true,
                previousOperand: null,
                operation: null,
                currentOperand: evaluate(state)
            }
    }
}

const evaluate = ({ currentOperand, previousOperand, operation }) => {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) {
        return ""
    }
    let computation = "";
    switch (operation) {
        case "+":
            computation = prev + current
            break
        case "-":
            computation = prev - current
            break
        case "*":
            computation = prev * current
            break
        case "/":
            computation = prev / current
            break
    }
    return computation.toString()
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0,

});

const formatOperand = operand => {
    if (operand == null) return

    const [integer, decimal] = operand.split('.')

    if (decimal == null) {
        return INTEGER_FORMATTER.format(integer)
    }
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

const calculator = () => {
    const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer,
        {
            currentOperand: null,
            previousOperand: null,
            operation: null,
            overwrite: false,
        });
    // dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "1" } });

    return (
       
            <div className="calculator-grid h-[700px] lg:h-[640px] grid ">
                <div className="output">
                    <div className="previous-operand">{formatOperand(previousOperand)} {operation}  </div>
                    <div className="current-operand">{formatOperand(currentOperand)}</div>
                </div>
                <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
                <button className="" onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
                <OperationBtn operation="/" dispatch={dispatch}>/</OperationBtn>
                <DigitBtn digit='1' dispatch={dispatch}>1</DigitBtn>
                <DigitBtn digit='2' dispatch={dispatch}>2</DigitBtn>
                <DigitBtn digit='3' dispatch={dispatch}>3</DigitBtn>
                <OperationBtn operation="*" dispatch={dispatch}>x</OperationBtn>
                <DigitBtn digit='4' dispatch={dispatch}>4</DigitBtn>
                <DigitBtn digit='5' dispatch={dispatch}>5</DigitBtn>
                <DigitBtn digit='6' dispatch={dispatch}>6</DigitBtn>
                <OperationBtn operation="+" dispatch={dispatch}>+</OperationBtn>
                <DigitBtn digit='7' dispatch={dispatch}>7</DigitBtn>
                <DigitBtn digit='8' dispatch={dispatch}>8</DigitBtn>
                <DigitBtn digit='9' dispatch={dispatch}>9</DigitBtn>
                <OperationBtn operation="-" dispatch={dispatch}>-</OperationBtn>
                <DigitBtn digit='.' dispatch={dispatch}>.</DigitBtn>
                <DigitBtn digit='0' dispatch={dispatch}>0</DigitBtn>
                <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
                    =
                </button>
            </div>
    );
};

export default calculator;