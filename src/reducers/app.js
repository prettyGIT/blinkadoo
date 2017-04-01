import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    pendingSessions: [],
    opponentEmail: null,
    gameStarted: false,
    gameOption: null,
}

export default function app(state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }

    switch (action.type) {
        case types.ADD_PENDING_SESSION:
            return update(state, {
                pendingSessions: { $push:[action.payload] }
            })
            break;

        case types.SELECT_OPPONENT:
            return update(state, {
                opponentEmail: { $set: action.payload }
            })
            break;

        case types.REMOVE_SESSION:
            return update(state, {
                pendingSessions: { $splice: [[action.payload, 1]] }
            })
            break;

        default:
            return state
    }
}