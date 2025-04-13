import React from 'react';
import { Link } from 'react-router-dom';
import "./Carditem.css";

export default function Carditem({ item, deleteCartitem }) {
  return (
    <div className='CartItemCard'>
      <img src={item.image || item.images?.[0]?.url} alt="item" />
      <div>
        <Link to={`/product/${item.product}`}>{item.name}</Link>
        <span>{`Price : ${item.price} Rs`}</span>
        <p onClick={() => deleteCartitem(item.product)}>Remove</p>
      </div>
    </div>
  );
}
