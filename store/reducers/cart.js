import { ADD_TO_CART, DELETE_FROM_CART } from '../actions/cart';
import CartItem from '../../models/cart-item';
import { ADD_ORDER } from '../actions/orders';
import { DELETE_PRODUCT } from '../actions/products';

const initialState = {
  items: {},
  totalAmount: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;

      let updatedOrNewCartItem;
      if (state.items[addedProduct.id]) {
        // already have the item in the cart
        const currentProduct = state.items[addedProduct.id];
        updatedOrNewCartItem = new CartItem(
          currentProduct.quantity + 1,
          prodPrice,
          prodTitle,
          currentProduct.sum + prodPrice
        );
      } else {
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
      }

      return {
        ...state,
        items: {
          ...state.items,
          [addedProduct.id]: updatedOrNewCartItem
        },
        totalAmount: state.totalAmount + prodPrice
      };
    case DELETE_FROM_CART:
      const id = action.productId;
      const product = state.items[id];
      let updatedCartItems;
      if (product.quantity > 1) {
        // reduce the quantity of product added in cart
        updatedCartItems = {
          ...state.items,
          [id]: {
            ...product,
            sum: product.sum - product.productPrice,
            quantity: product.quantity - 1
          }
        };
      } else {
        let currentItems = { ...state.items };
        delete currentItems[id];
        updatedCartItems = currentItems;
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - product.productPrice
      };
    case ADD_ORDER:
      return initialState;
    case DELETE_PRODUCT:
      if (!state.items[action.pid]) {
        return state;
      }
      const updatedItems = { ...state.items };
      const itemTotal = state.items[action.pid].sum;
      delete updatedItems[action.pid];
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal
      };
  }

  return state;
};
