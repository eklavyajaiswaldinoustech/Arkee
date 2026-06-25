import React, { createContext, useReducer, useCallback } from 'react';

export const CartContext = createContext();

const MAX_CART_QTY = 4;

const getProductId = (item) =>
  item?.productId?._id ||
  item?.productId ||
  item?.productid?._id ||
  item?.productid ||
  item?.id ||
  item?._id ||
  null;

const getItemPrice = (item) =>
  Number(
    item?.productId?.discountPrice ??
      item?.productId?.price ??
      item?.discountPrice ??
      item?.price ??
      item?.current_price ??
      item?.price_at_addition ??
      0
  );

const normalizeItem = (item) => {
  const productId = getProductId(item);
  const price = getItemPrice(item);

  return {
    ...item,
    id: item?.id || productId,
    productId:
      typeof item?.productId === 'object'
        ? {
            ...item.productId,
            _id: productId,
          }
        : {
            _id: productId,
            name: item?.name || '',
            images: item?.images || [],
            price: Number(item?.current_price ?? item?.price_at_addition ?? price),
            discountPrice: Number(item?.price_at_addition ?? item?.current_price ?? price),
            category: item?.category || '',
          },
    quantity: Math.min(Number(item?.quantity || 1), MAX_CART_QTY),
    price,
    unitPrice: price,
  };
};

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const payload = normalizeItem(action.payload);
      const existingItem = state.items.find(
        (item) => getProductId(item)?.toString() === getProductId(payload)?.toString()
      );
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            getProductId(item)?.toString() === getProductId(payload)?.toString()
              ? {
                  ...item,
                  quantity: Math.min(
                    MAX_CART_QTY,
                    Number(item.quantity || 0) + Number(payload.quantity || 1)
                  ),
                }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, payload],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => getProductId(item)?.toString() !== action.payload?.toString()),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          getProductId(item)?.toString() === action.payload.id?.toString()
            ? {
                ...item,
                quantity: Math.min(MAX_CART_QTY, Math.max(1, action.payload.quantity)),
              }
            : item
        ),
      };

    case 'CLEAR_CART':
      return initialState;

    case 'SET_CART':
      return {
        ...state,
        items: (action.payload?.items || action.payload || []).map(normalizeItem),
        total: action.payload?.total || 0,
        itemCount:
          action.payload?.itemCount ||
          (action.payload?.items || action.payload || []).reduce(
            (count, item) => count + Number(item?.quantity || 0),
            0
          ),
      };

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
    return state.items.reduce(
      (total, item) => total + getItemPrice(item) * Number(item.quantity || 0),
      0
    );
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + Number(item.quantity || 0), 0);
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
