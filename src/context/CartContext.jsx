import React, { createContext, useReducer, useCallback } from 'react';

export const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'CLEAR_CART':
      return initialState;

    case 'SET_CART':
      return action.payload;

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

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

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: itemId, quantity },
      });
    }
  }, [removeItem]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const setCart = useCallback((cart) => {
    dispatch({
      type: 'SET_CART',
      payload: cart,
    });
  }, []);

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setCart,
    total: getCartTotal(),
    itemCount: getItemCount(),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};