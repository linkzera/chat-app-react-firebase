import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext<any>({});

export const ChatContextProvider = ({ children }: any) => {
  const { currentUser }: any = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  /**
   * The chatReducer function takes in a state and an action and returns a new state based on the
   * action type.
   * @param {any} state - any - The state of the reducer.
   * @param {any} action - {type: "CHANGE_USER", payload: {uid: "123", name: "John"}}
   * @returns The state is being returned.
   */
  const chatReducer = (state: any, action: any) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
