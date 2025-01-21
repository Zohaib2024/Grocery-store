import React from "react";
import Link from "next/link";
import { HiShoppingCart } from "react-icons/hi";
import { removeFromCart } from "@/app/lib/features/todos/cartSlice";
import { RootState } from "@/app/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { ImCancelCircle } from "react-icons/im";
const Cart = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const toggleCartSidebar = () => {
    setIsCartOpen(!isCartOpen);
  };
  const dispatch = useDispatch();
  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  return (
    <div>
      {cartItems.length > 0 && (
        <button
          className="fixed bottom-6 right-6  gap-1 hover:bg-green-500 hover:text-black  bg-green-900  text-white rounded-full p-4 shadow-lg flex items-center justify-center"
          onClick={toggleCartSidebar}
        >
          <HiShoppingCart size={25} />

          {cartItems.length}
        </button>
      )}
      {isCartOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
          <div className="fixed top-0 right-0 bg-white w-96 h-full shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-center p-3 text-white bg-green-700">
              My Cart
            </h2>
            <button
              className="absolute top-2 left-2 text-gray-700"
              onClick={toggleCartSidebar}
            >
              <ImCancelCircle size={30} />
            </button>
            <div className="mt-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center mb-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-600">Rs. {item.price}</p>
                        <p className="text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="font-bold">
                        Rs. {item.price * item.quantity}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <h3 className="font-bold">Total Price:</h3>
                <p className="font-bold">Rs. {totalPrice}</p>
              </div>
            )}
            {cartItems.length > 0 && (
              <Link href="/checkout">
                <button
                  onClick={toggleCartSidebar}
                  className="bg-green-700 text-white font-bold w-full py-3 my-3"
                >
                  Checkout
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
