import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';
import { getItem, setItem } from './utils/localStorage';
import { todayAsString } from './utils/date';

export interface State {
  startOnDate: string;
  startWeekOn: string;
  weeksPerPage: number;
  pageCount: number;
  pageSize: 'A4' | 'Letter';
  showYearFooter: boolean;
  margin: number;
  edgeLines: boolean;
  timestamp?: number;
}

const initialState = (reset: boolean = false): State => {
  const defaultState: State = {
    startOnDate: todayAsString(),
    startWeekOn: '',
    weeksPerPage: 12,
    pageCount: 1,
    pageSize: 'A4',
    showYearFooter: true,
    margin: 1.5,
    edgeLines: true,
  };

  const state: State = {
    ...defaultState,
    ...(!reset ? getItem('state') : {}),
    timestamp: Date.now().valueOf(),
  };

  return state;
};

type Action =
  | { type: 'RESET' }
  | { type: 'SET_START_ON_DATE'; payload: string }
  | { type: 'SET_START_WEEK_ON'; payload: string }
  | { type: 'SET_WEEKS_PER_PAGE'; payload: number }
  | { type: 'SET_PAGE_COUNT'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: 'A4' | 'Letter' }
  | { type: 'SET_YEAR_FOOTER'; payload: boolean }
  | { type: 'SET_MARGIN'; payload: number }
  | { type: 'SET_EDGE_LINES'; payload: boolean };

const reducer = (state: State, action: Action): State => {
  const newState = (() => {
    switch (action.type) {
      case 'RESET':
        return initialState(true);
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
      case 'SET_EDGE_LINES':
        return { ...state, edgeLines: action.payload };
      default:
        return state;
    }
  })();

  newState.timestamp = Date.now().valueOf();

  setItem('state', newState);

  return newState;
};

interface StateContextProps {
  state: State;
  dispatch: Dispatch<Action>;
}

export const AppStateContext = createContext<StateContextProps | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState());

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};
