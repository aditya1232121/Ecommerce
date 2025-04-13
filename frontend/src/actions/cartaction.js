import { ADD_TO_CART  , REMOVE_CART_ITEM} from "../constants/cartconstant";
import axios from "axios";

export const additem = (id, quantity) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`http://localhost:4000/api/v1/products/${id}`);

    dispatch({
      type: ADD_TO_CART,
      payload: {
        product: data.product._id,
        name: data.product.name,
        image: data.product.images[0].url,
        price: data.product.price,
        stock: data.product.stock,
        quantity,
      },
    });

    // 💾 Save updated cart to localStorage
    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems) // Save cart items to localStorage
      //cart is store and cartitem is array
    );
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};


export const removeItem = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: REMOVE_CART_ITEM,
      payload: id,
    });
    // 💾 Save updated cart to localStorag
    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems) // Save cart items to localStorage
    );
  }
  catch (error) {
    console.error("Error removing item from cart:", error);
  }
}
      
