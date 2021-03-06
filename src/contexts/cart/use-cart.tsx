import React, { useReducer, useContext, createContext } from 'react';
import { reducer, cartItemsTotalPrice } from './cart.reducer';
import { useStorage } from 'utils/use-storage';
const CartContext = createContext({} as any);
const INITIAL_STATE = {
  isOpen: false,
  items: [],
  isRestaurant: false,
  coupon: null,
};

const useCartActions = (initialCart = INITIAL_STATE) => {
  const [state, dispatch] = useReducer(reducer, initialCart);

  const addItemHandler = (item, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity } });
  };

  const removeItemHandler = (item, quantity = 1) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { ...item, quantity } });
  };

  const clearItemFromCartHandler = (item) => {
    dispatch({ type: 'CLEAR_ITEM_FROM_CART', payload: item });
  };

  const clearCartHandler = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  const toggleCartHandler = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };
  const couponHandler = (coupon) => {
    dispatch({ type: 'APPLY_COUPON', payload: coupon });
  };
  const removeCouponHandler = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };
  const rehydrateLocalState = (payload) => {
    dispatch({ type: 'REHYDRATE', payload });
  };
  const toggleRestaurant = () => {
    dispatch({ type: 'TOGGLE_RESTAURANT' });
  };
  const isInCartHandler = (id) => {
    return state.items?.some((item) => item.id === id);
  };
  const getItemHandler = (id) => {
    return state.items?.find((item) => item.id === id);
  };
  const getCartItemsPrice = () => cartItemsTotalPrice(state.items).toLocaleString('en-US');
  const getCartItemsTotalPrice = () =>
    cartItemsTotalPrice(state.items, state.coupon).toLocaleString('en-US');
    const getCartItemsTotalPriceInt = () =>
    cartItemsTotalPrice(state.items, state.coupon).toFixed(2);
  const getCartItemsTotalPricePlusShip = () =>{
    let product = cartItemsTotalPrice(state.items, state.coupon);
    let totalPrice = product + Number(2500)
    return totalPrice.toLocaleString('en-US')
  }
  const getCartItemsTotalPricePlusShipInt = () =>{
    let product = cartItemsTotalPrice(state.items, state.coupon);
    let totalPrice = product + Number(2500)
    return totalPrice.toFixed(2)
  }

  const getDiscount = () => {
    const total = cartItemsTotalPrice(state.items);
    const discount = state.coupon
      ? (total * Number(state.coupon?.discountInPercent)) / 100
      : 0;
    return discount.toLocaleString('en-US')
  };

  const getExpressPrice = () => {
    const total = cartItemsTotalPrice(state.items);
    const discount = total + Number(4500)
    return discount.toLocaleString('en-US')
  };
  const getItemsCount = state.items?.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  return {
    state,
    getItemsCount,
    rehydrateLocalState,
    addItemHandler,
    removeItemHandler,
    clearItemFromCartHandler,
    clearCartHandler,
    isInCartHandler,
    getItemHandler,
    toggleCartHandler,
    getCartItemsTotalPrice,
    getCartItemsTotalPriceInt,
    getExpressPrice,
    getCartItemsPrice,
    couponHandler,
    removeCouponHandler,
    getDiscount,
    toggleRestaurant,
    getCartItemsTotalPricePlusShipInt,
    getCartItemsTotalPricePlusShip
  };
};

export const CartProvider = ({ children }) => {
  const {
    state,
    rehydrateLocalState,
    getItemsCount,
    addItemHandler,
    removeItemHandler,
    clearItemFromCartHandler,
    clearCartHandler,
    isInCartHandler,
    getItemHandler,
    toggleCartHandler,
    getCartItemsTotalPrice,
    getCartItemsTotalPriceInt,
    couponHandler,
    getExpressPrice,
    removeCouponHandler,
    getCartItemsPrice,
    getDiscount,
    toggleRestaurant,
    getCartItemsTotalPricePlusShip,
    getCartItemsTotalPricePlusShipInt
  } = useCartActions();
  const { rehydrated, error } = useStorage(state, rehydrateLocalState);

  return (
    <CartContext.Provider
      value={{
        state:state,
        isOpen: state.isOpen,
        items: state.items,
        coupon: state.coupon,
        isRestaurant: state.isRestaurant,
        cartItemsCount: state.items?.length,
        itemsCount: getItemsCount,
        addItem: addItemHandler,
        removeItem: removeItemHandler,
        removeItemFromCart: clearItemFromCartHandler,
        clearCart: clearCartHandler,
        isInCart: isInCartHandler,
        getExpressPrice: getExpressPrice,
        getItem: getItemHandler,
        getCartItemsTotalPricePlusShipInt:getCartItemsTotalPricePlusShipInt,
        toggleCart: toggleCartHandler,
        calculatePrice: getCartItemsTotalPrice,
        getCartItemsTotalPriceInt:getCartItemsTotalPriceInt,
        calculateSubTotalPrice: getCartItemsPrice,
        applyCoupon: couponHandler,
        removeCoupon: removeCouponHandler,
        calculateDiscount: getDiscount,
        toggleRestaurant,
        getCartItemsTotalPricePlusShip:getCartItemsTotalPricePlusShip
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
