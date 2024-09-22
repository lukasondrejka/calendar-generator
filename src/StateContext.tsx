import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';
import { getItem, setItem } from './utils/localStorage';

export interface State {
    startOnDate: string;
    startWeekOn: string;
    weeksPerPage: number;
    pageSize: 'A4' | 'Letter';
    showYearFooter: boolean;
    margin: number;
  }

const initialState: State = {
  startOnDate: '',
  startWeekOn: '',
  weeksPerPage: 4,
  pageSize: 'A4',
  showYearFooter: true,
  margin: 10,
};


type Action =
  | { type: 'SET_START_ON_DATE'; payload: string }
  | { type: 'SET_START_WEEK_ON'; payload: string }
  | { type: 'SET_WEEKS_PER_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: 'A4' | 'Letter' }
  | { type: 'TOGGLE_YEAR_FOOTER' }
  | { type: 'SET_MARGIN'; payload: number };


  const stateReducer = (state: State, action: Action): State => {
    const newState = (() => {
        switch (action.type) {
            case 'SET_START_ON_DATE':
                return { ...state, startOnDate: action.payload };
            case 'SET_START_WEEK_ON':
                return { ...state, startWeekOn: action.payload };
            case 'SET_WEEKS_PER_PAGE':
                return { ...state, weeksPerPage: action.payload };
            case 'SET_PAGE_SIZE':
                return { ...state, pageSize: action.payload };
            case 'TOGGLE_YEAR_FOOTER':
                return { ...state, showYearFooter: !state.showYearFooter };
            case 'SET_MARGIN':
                return { ...state, margin: action.payload };
            default:
                return state;
        }
    })();

    setItem('state', newState);

    return newState;
};

// Create context
interface StateContextProps {
  state: State;
  dispatch: Dispatch<Action>;
}

export const StateContext = createContext<StateContextProps | undefined>(undefined);

// Create provider component
interface StateProviderProps {
  children: ReactNode;
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const initState = getItem('state') || initialState;
  initState.startOnDate = new Date().toISOString().split('T')[0];

  const [state, dispatch] = useReducer(stateReducer,initState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};