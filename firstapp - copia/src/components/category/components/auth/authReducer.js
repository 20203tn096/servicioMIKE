export const authReducer = (state = {}, action) => {
  switch (action.type) {
    case "LOGIN":
        return {
            ...action.payload,
                logged: true,
        }
      break;
    case "LOGOUT":
        return {
            ...action.payload,
                logged: false,
        }
      break;
    default:
      return state;
  }
};
