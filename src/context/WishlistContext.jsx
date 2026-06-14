import React, { createContext, useReducer, useCallback } from 'react';

export const WishlistContext = createContext();

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        items: action.payload,
        loading: false,
        error: null,
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case 'CLEAR':
      return initialState;

    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  const addItem = useCallback((item) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: item,
    });
  }, []);

  const removeItem = useCallback((itemId) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: itemId,
    });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({
      type: loading ? 'FETCH_START' : 'FETCH_SUCCESS',
      payload: loading ? undefined : state.items,
    });
  }, [state.items]);

  const fetchWishlist = useCallback((items) => {
    dispatch({
      type: 'FETCH_SUCCESS',
      payload: items,
    });
  }, []);

  const setError = useCallback((error) => {
    dispatch({
      type: 'FETCH_ERROR',
      payload: error,
    });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const isInWishlist = (itemId) => {
    return state.items.some((item) => item.id === itemId);
  };

  const value = {
    items: state.items,
    loading: state.loading,
    error: state.error,
    addItem,
    removeItem,
    fetchWishlist,
    setError,
    clear,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};