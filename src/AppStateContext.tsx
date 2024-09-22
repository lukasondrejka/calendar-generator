import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';
import { getItem, setItem } from './utils/localStorage';

export interface State {
  startOnDate: string;
  startWeekOn: string;
  weeksPerPage: number;
  pageCount: number;
  pageSize: 'A4' | 'Letter';
  showYearFooter: boolean;
  margin: number;
}

const initialState: State = {
  startOnDate: '',
  startWeekOn: '',
  weeksPerPage: 4,
  pageCount: 1,
  pageSize: 'A4',
  showYearFooter: true,
  margin: 10,
};

type Action =
  | { type: 'SET_START_ON_DATE'; payload: string }
  | { type: 'SET_START_WEEK_ON'; payload: string }
  | { type: 'SET_WEEKS_PER_PAGE'; payload: number }
  | { type: 'SET_PAGE_COUNT'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: 'A4' | 'Letter' }
  | { type: 'SET_YEAR_FOOTER'; payload: boolean }
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
        case 'SET_PAGE_COUNT':
          return { ...state, pageCount: action.payload };
        case 'SET_PAGE_SIZE':
          return { ...state, pageSize: action.payload };
        case 'SET_YEAR_FOOTER':
          return { ...state, showYearFooter: action.payload };
        case 'SET_MARGIN':
          return { ...state, margin: action.payload };
        default:
          return state;
      }
    })();

    setItem('state', newState);

    return newState;
};

interface StateContextProps {
  state: State;
  dispatch: Dispatch<Action>;
}

export const AppStateContext = createContext<StateContextProps | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initState = getItem('state') || initialState;
  initState.startOnDate = new Date().toISOString().split('T')[0];

  const [state, dispatch] = useReducer(stateReducer, initState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};
