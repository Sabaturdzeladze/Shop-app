import Order from '../../models/orders';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
  return async dispatch => {
    try {
      const response = await fetch(
        'https://rn-shop-application.firebaseio.com/orders/u1.json'
      );

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const resData = await response.json();
      // returns an object with the products id-s as keys

      const orders = [];
      for (const key in resData) {
        const order = resData[key];
        orders.push(
          new Order(
            key,
            order.cartItems,
            order.totalAmount,
            new Date(order.date)
          )
        );
      }
      dispatch({ type: SET_ORDERS, orders });
    } catch (err) {
      throw err;
    }

  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async dispatch => {
    const date = new Date();
    const response = await fetch(
      'https://rn-shop-application.firebaseio.com/orders/u1.json',
      {
        method: 'POST',
        headers: {
          // telling the server that we are sending json
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString()
        })
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong');
    }

    const resData = await response.json();

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        items: cartItems,
        amount: totalAmount,
        date
      }
    });
  };
};
