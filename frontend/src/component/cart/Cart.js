import React, { Fragment } from "react";
import "./Cart.css";
import Carditem from "../cart/Carditem";
import {additem , removeItem} from "../../actions/cartaction";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (quantity >= stock) return;
    dispatch(additem(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (newQty < 1) return;
    dispatch(additem(id, newQty));
  };

  const deleteCartItems = (id) => {
    dispatch(removeItem(id));
  };

  const grossTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Fragment>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <p>No Products in Your Cart</p>
          <a href="/products">View Products</a>
        </div>
      ) : (
        <div className="cartPage">
          <div className="cartHeader">
            <p>Product</p>
            <p>Quantity</p>
            <p>Subtotal</p>
          </div>

          {cartItems.map((item) => (
            <div className="cartContainer" key={item.product}>
              <Carditem item={item} deleteCartitem={deleteCartItems} />

              <div className="cartInput">
                <button onClick={() => decreaseQuantity(item.product, item.quantity)}>-</button>
                <input type="number" value={item.quantity} readOnly />
                <button onClick={() => increaseQuantity(item.product, item.quantity, item.stock)}>+</button>
              </div>

              <p className="cartSubtotal">₹{item.price * item.quantity}</p>
            </div>
          ))}

          <div className="cartGrossProfit">
            <div></div>
            <div className="cartGrossProfitBox">
              <p>Gross Total</p>
              <p>₹{grossTotal}</p>
            </div>
            <div></div>
            <div className="checkOutBtn">
              <button>Check Out</button>               
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}