import React from "react";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem('account'),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, loginPhyUser, signOut };

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);

  if (!!login && !!password) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: login, password: password })
    };
    fetch('http://localhost:3001/login', requestOptions)
      .then(response => response.json())
      .then(data => {
        if(data.status === 200){
          localStorage.setItem("id", data.data.id);
          localStorage.setItem("account", data.data.account);
          localStorage.setItem("displayName", data.data.displayName);

          setError(null)
          setIsLoading(false)
          dispatch({ type: 'LOGIN_SUCCESS' })
          history.push('/app/appointment')
        }
        else{
          setError(true);
          setIsLoading(false);
        }
      });
  } else {
    setError(true);
    setIsLoading(false);
  }
}

function loginPhyUser(dispatch, login, password, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);

  if (!!login && !!password) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: login, password: password })
    };
    fetch('http://localhost:3001/phyLogin', requestOptions)
      .then(response => response.json())
      .then(data => {
        if(data.status === 200){
          localStorage.setItem("id", data.data.id);
          localStorage.setItem("account", data.data.account);
          localStorage.setItem("displayName", data.data.displayName);
          localStorage.setItem("type", 'physiotherapists');

          setError(null)
          setIsLoading(false)
          dispatch({ type: 'LOGIN_SUCCESS' })
          history.push('/app/appointment')
        }
        else{
          setError(true);
          setIsLoading(false);
        }
      });
  } else {
    setError(true);
    setIsLoading(false);
  }
}

function signOut(dispatch, history) {
  localStorage.removeItem("account");
  localStorage.removeItem("displayName");
  localStorage.removeItem("type");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
