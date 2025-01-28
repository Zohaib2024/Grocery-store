"use client";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/app/lib/features/todos/cartSlice";
import { RootState } from "@/app/lib/store";
import { useState } from "react";
import Swal from "sweetalert2";
import Header from "../components/Header";
export default function Checkout() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleOrder = () => {
    setIsLoading(true);

    setTimeout(() => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Thanks for shopping",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        dispatch(clearCart());
        setIsLoading2(false);
        window.location.href = "/"; // Redirect to the home page
      });
    }, 2000); // Simulate a loading delay
  };

  const handleOrder2 = () => {
    setIsLoading2(true);

    setTimeout(() => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Thanks for shopping",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        dispatch(clearCart());
        setIsLoading2(false);
        window.location.href = "/"; // Redirect to the home page
      });
    }, 2000); // Simulate a loading delay
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100  flex justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-screen">
          <h1 className="text-center text-2xl font-bold bg-green-700 mb-6 py-3 text-white">
            Checkout
          </h1>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <h2 className="text-xl font-bold mb-4">Billing Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="border border-gray-300 p-3 rounded-lg w-full"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border border-gray-300 p-3 rounded-lg w-full"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  className="border border-gray-300 p-3 rounded-lg w-full"
                />
                <input
                  type="text"
                  placeholder="Zip"
                  className="border border-gray-300 p-3 rounded-lg w-full"
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="border border-gray-300 p-3 rounded-lg w-full col-span-1 md:col-span-2"
                />
              </div>
            </div>

            <div>
              <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold border-b pb-2 text-center">
                  Total Cart ({cartItems.length})
                </h3>
                {cartItems.length === 0 ? (
                  <p className="text-center text-gray-500">
                    Your cart is empty
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center mt-4"
                    >
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-600">Rs. {item.price}</p>
                        <p className="text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold">
                          Rs. {item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div className="flex justify-between mt-4 border-t pt-2 text-xl font-bold">
                  <span>Total :</span>
                  <span>Rs. {totalPrice}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  onClick={handleOrder}
                  disabled={isLoading}
                  className={`py-3 px-6 rounded-lg shadow-md font-bold ${
                    isLoading ? "bg-gray-400" : "bg-yellow-400 text-blue-900"
                  }`}
                >
                  {isLoading ? "Processing..." : "Pay Amount"}
                </button>
                <button
                  onClick={handleOrder2}
                  disabled={isLoading2}
                  className={`py-3 px-6 rounded-lg shadow-md font-bold ${
                    isLoading2 ? "bg-gray-400" : "bg-blue-100 text-gray-700"
                  }`}
                >
                  {isLoading2 ? "Processing..." : "Cash on Delivery"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
