import axios from "axios";
import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  PRODUCTS_DETAILS_REQUEST,
  PRODUCTS_DETAILS_SUCCESS,
  PRODUCTS_DETAILS_FAIL,
} from "../constants/productConstant";

// ✅ Fetch all products with filters
export const getProduct = (keyword = "", price = [0, 25000], category = "", ratings = 0) => async (dispatch) => {
  try {
    dispatch({ type: ALL_PRODUCTS_REQUEST });

    let link = `http://localhost:4000/api/v1/products?keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}`;

    if (category) {
      link += `&category=${category}`;
    }

    if (ratings > 0) {
      link += `&ratings[gte]=${ratings}`;
    }

    const { data } = await axios.get(link);

    dispatch({
      type: ALL_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PRODUCTS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Fetch Product Details by ID
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCTS_DETAILS_REQUEST });

    const { data } = await axios.get(`http://localhost:4000/api/v1/products/${id}`);

    dispatch({
      type: PRODUCTS_DETAILS_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: PRODUCTS_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
