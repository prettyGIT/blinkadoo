import {
    ADD_PENDING_SESSION,
    SELECT_OPPONENT,
    REMOVE_SESSION,
} from './ActionTypes'

export function reduxAddPendingSession(sessionInfo) {
    return {
        type: ADD_PENDING_SESSION,
        payload: sessionInfo,
    };
}

export function reduxSelectOpponent(opponentEmail) {
    return {
        type: SELECT_OPPONENT,
        payload: opponentEmail
    }
}

export function reduxRemoveSession(index) {
    return {
        type: REMOVE_SESSION,
        payload: index
    }
}
