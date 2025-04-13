import { ADD_TO_CART } from "../constants/cartconstant";
import { REMOVE_CART_ITEM } from "../constants/cartconstant";

export const cartReducer = (state = { cartItems: [] }, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const item = action.payload;  // it gives data and item has product in it 
            const isItemExist = state.cartItems.find((i) => i.product === item.product); // Check if the item already exists in the cart which is old item
            if (isItemExist) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((i) =>
                        i.product === isItemExist.product ? item : i // Update the array with the new item
                    ),
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                };
            }
        case REMOVE_CART_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter((i) => i.product !== action.payload), // Remove the item from the cart
            };

        default:
            return state;
    }
};
