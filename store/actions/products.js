import Product from '../../models/product';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        'https://rn-shop-application.firebaseio.com/products.json'
      );

      // response.ok status range 200-300
      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const resData = await response.json();
      // returns an object with the products id-s as keys

      const loadedProducts = [];
      for (const key in resData) {
        const product = resData[key];
        loadedProducts.push(
          new Product(
            key,
            product.ownerId,
            product.title,
            product.imageUrl,
            product.description,
            product.price
          )
        );
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-shop-application.firebaseio.com/products/${productId}.json`,
      {
        method: 'DELETE'
      }
    );
    dispatch({ type: DELETE_PRODUCT, pid: productId });

    if (!response.ok) {
      throw Error('Something went wrong!');
    }
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  // redux thunk will call this function and dispatches new action
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const ownerId = getState().auth.userId;

    const response = await fetch(
      `https://rn-shop-application.firebaseio.com/products.json`,
      {
        method: 'POST',
        headers: {
          // telling the server that we are sending json
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId
        })
      }
    );

    const resData = await response.json();
    // returns { name: id }

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        price,
        ownerId
      }
    });
    // redux thunk enables us to make async calls before dispatching an action
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-shop-application.firebaseio.com/products/${id}.json`,
      {
        method: 'PATCH',
        headers: {
          // telling the server that we are sending json
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, imageUrl })
      }
    );

    if (!response.ok) {
      throw Error('Something went wrong!');
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl
      }
    });
  };
};
