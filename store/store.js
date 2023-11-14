import { createContext, useReducer } from 'react'

const initialState = {
  selectedAddress: null,
  betLogs: [],
  winLogs: [],
  betAction: null,
}

const store = createContext(initialState)
const { Provider } = store

export const SET_SELECTED_ADDR = 'SET_SELECTED_ADDR'
export const SET_LOG_CHANGE = 'SET_LOG_CHANGE'
export const SET_ACTION = 'SET_ACTION'
export const SET_WIN_LOGS = 'SET_WIN_LOGS'

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case SET_SELECTED_ADDR:
        console.log(`push ${action.payload}, type ${SET_SELECTED_ADDR}`);
        return { ...state, selectedAddress: action.payload }
      case SET_LOG_CHANGE:
        // console.log(`push ${JSON.stringify(action.payload)}, type ${SET_LOG_CHANGE}`);
        return { ...state, betLogs: action.payload }
      case SET_ACTION:
        console.log(`push ${action.payload}, type ${SET_ACTION}`);
        return { ...state, betAction: action.payload }
      case SET_WIN_LOGS:
        // console.log(`push ${action.payload}, type ${SET_WIN_LOGS}`);
        return { ...state, winLogs: action.payload }
      default:
        throw new Error("")
    }
  }, initialState)

  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { store, StateProvider }
