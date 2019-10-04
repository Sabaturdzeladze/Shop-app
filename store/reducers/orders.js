import { ADD_ORDER, SET_ORDERS } from '../actions/orders';
import Order from '../../models/orders';

const initialState = {
  orders: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ORDER:
      const { items, amount, id, date } = action.orderData;
      const newOrder = new Order(id, items, amount, date);
      return {
        ...state,
        orders: state.orders.concat(newOrder)
      };

    case SET_ORDERS:
      return {
        orders: action.orders
      };
  }

  return state;
};
