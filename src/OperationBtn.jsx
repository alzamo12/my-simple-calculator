import { ACTIONS } from "./App";

const OperationBtn = ({ dispatch, operation }) => {
    return (
        <button onClick={() => dispatch({
            type: ACTIONS.CHOOSE_OPERATION,
            payload: { operation }
        })}>
            {operation}</button>
    );
};

export default OperationBtn;