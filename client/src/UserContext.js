import { createContext, useContext, useReducer } from 'react';

const UserContext = createContext(null);
const UserDispatchContext = createContext(null);

export function UserProvider({ children }) {
  const [userCont, dispatch] = useReducer(
    userReducer,
    initialUser
  );

    return (
    <UserContext.Provider value={userCont}>
    	<UserDispatchContext.Provider value={dispatch}>
        	{children}
        </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};

function userReducer(userCont, action) {
  switch (action.type) {
    case 'changed': {
    	console.log(action.user);
      return action.user
  		}
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
};

export function useUser() {
  return useContext(UserContext);
};

export function useUserDispatch() {
  return useContext(UserDispatchContext);
};

const initialUser = null;