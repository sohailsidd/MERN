import { USER_REQUEST,LOGIN_FAIL ,  USER_SUCCESS, USER_FAIL, CLEAR_ERROR, SINGUP_REQUEST, SINGUP_SUCCESS, SINGUP_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_SUCCESS, LOGOUT_FAIL, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_FAIL, UPDATE_PROFILE_RESET, UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_SUCCESS, UPDATE_PASSWORD_FAIL, UPDATE_PASSWORD_RESET, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAIL, RESET_PASSWORD_REQUEST, RESET_PASSWORD_FAIL, RESET_PASSWORD_SUCCESS 
,ALL_USERS_REQUEST,
ALL_USERS_SUCCESS,
ALL_USERS_FAIL,
DELETE_USER_REQUEST,
DELETE_USER_SUCCESS,
DELETE_USER_FAIL,
DELETE_USER_RESET,
UPDATE_USER_REQUEST,
UPDATE_USER_SUCCESS,
UPDATE_USER_FAIL,
UPDATE_USER_RESET,
USER_DETAILS_REQUEST,
USER_DETAILS_SUCCESS,
USER_DETAILS_FAIL,} from "../constants/userConstants";

export const userReducer = (state = {user: {}}, action) => {
    switch (action.type) {
        case USER_REQUEST:
        case SINGUP_REQUEST:
        case LOGIN_REQUEST:
            return {
                loading: true,
                isAuthenticated : false
            };
        case USER_SUCCESS:
        case SINGUP_SUCCESS:
        case LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated : true,
                user: action.payload
            };
        case USER_FAIL:
        case SINGUP_FAIL:
        return {
            loading: false,
            isAuthenticated : false,
            user: null,
            error : action.payload
        };
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
            return {
                loading: false,
                isAuthenticated : false,
                user: null,
            };
        case LOGOUT_FAIL:
            return {
                ...state,
                error : action.payload
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

export const updateProfile = (state = { }, action) => {
    switch (action.type) {
        case UPDATE_PROFILE_REQUEST:
        case UPDATE_PASSWORD_REQUEST:
        case DELETE_USER_REQUEST:
        case UPDATE_USER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case UPDATE_PROFILE_SUCCESS:
        case UPDATE_PASSWORD_SUCCESS:
        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }
        case UPDATE_PROFILE_FAIL:
        case UPDATE_PASSWORD_FAIL:
        case UPDATE_USER_FAIL:
        case DELETE_USER_FAIL:
            return {
                ...state,
                loading: false,
                isUpdated: false,
                error: action.payload
            }
        case DELETE_USER_SUCCESS:
            return  {
                ...state,
                loading: false,
                isDeleted: action.payload.success,
                message: action.payload.message
            }
        case UPDATE_PROFILE_RESET:
        case UPDATE_PASSWORD_RESET:
        case UPDATE_USER_RESET:
            return {
                ...state,
                isUpdated: false
            }
        case DELETE_USER_RESET:
            return {
                ...state,
                isDeleted: false
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

export const forgotPasswordReducer = (state = { }, action) => {
    switch (action.type) {
        case FORGOT_PASSWORD_REQUEST:
        case RESET_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }
        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload
            }
        case RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload
            }
        case FORGOT_PASSWORD_FAIL:
        case RESET_PASSWORD_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
};

export const allUsersReducer = (state = { users: [] }, action) => {
switch (action.type) {
    case ALL_USERS_REQUEST:
    return {
        ...state,
        loading: true,
    };
    case ALL_USERS_SUCCESS:
    return {
        ...state,
        loading: false,
        users: action.payload,
    };

    case ALL_USERS_FAIL:
    return {
        ...state,
        loading: false,
        error: action.payload,
    };

    case CLEAR_ERROR:
    return {
        ...state,
        error: null,
    };

    default:
    return state;
}
};

export const userDetailsReducer = (state = { user: {} }, action) => {
switch (action.type) {
    case USER_DETAILS_REQUEST:
    return {
        ...state,
        loading: true,
    };
    case USER_DETAILS_SUCCESS:
    return {
        ...state,
        loading: false,
        user: action.payload,
    };

    case USER_DETAILS_FAIL:
    return {
        ...state,
        loading: false,
        error: action.payload,
    };

    case CLEAR_ERROR:
    return {
        ...state,
        error: null,
    };

    default:
    return state;
}
};

