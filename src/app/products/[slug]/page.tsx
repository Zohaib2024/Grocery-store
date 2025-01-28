"use client";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import { ImCancelCircle } from "react-icons/im";
// import Link from "next/link";

import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

// import { HiShoppingCart } from "react-icons/hi";
// import { removeFromCart } from "@/app/lib/features/todos/cartSlice";
import { useDispatch, useSelector } from "react-redux";

// import { RootState } from "@/app/lib/store";

import { addToCart } from "@/app/lib/features/todos/cartSlice";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
// import Cart from "@/app/components/Cart";

export default function Productlist(props: any) {
  const [productsData, setProductsData] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch data from Sanity
  const fetchSanityData = async () => {
    const [products] = await Promise.all([
      client.fetch(`
        *[_type == "product"]{
          _id,
          title,
          description,
          price,
          discountPercentage,
          isNew,
          tags,
          category->{
            _id,
            title
          },
          productImage{
            asset->{
              _id,
              url
            },
            alt
          }
        }
      `),
    ]);

    setProductsData(products);
  };

  // useEffect to fetch data when component mounts
  useEffect(() => {
    fetchSanityData();
  }, []);

  // useEffect to filter products when productsData or slug changes
  useEffect(() => {
    if (props.params.slug) {
      setFilteredProducts(
        productsData.filter((product: any) =>
          product.title.toLowerCase().includes(props.params.slug.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(productsData); // If no slug, show all products
    }
  }, [productsData, props.params.slug]);

  const urlFor = (source: any) => {
    const builder = imageUrlBuilder(client);
    return builder.image(source);
  };

  // const [isCartOpen, setIsCartOpen] = useState(false);
  // const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    setIsLoading(true);

    if (selectedProduct) {
      dispatch(
        addToCart({
          id: selectedProduct._id,
          name: selectedProduct.title,
          price: selectedProduct.price,
          image: selectedProduct.productImage?.asset?.url,
          quantity: quantity, // The selected quantity
        })
      );

      Swal.fire({
        position: "center",
        title: "Successfully Added",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        setIsLoading(false);
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Please select a product",
        showConfirmButton: false,
        timer: 1500,
      });
      setIsLoading(false);
    }
  };
  // const toggleCartSidebar = () => {
  //   setIsCartOpen(!isCartOpen);
  // };

  // const handleRemoveItem = (id: string) => {
  //   dispatch(removeFromCart(id));
  // };

  // const totalPrice = cartItems.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0
  // );

  const [quantity, setQuantity] = useState(1);
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div>
      <Header />
      {/* <Cart /> */}
      <main className="mx-0 md:mx-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 my-14 px-5 md:px-0">
          {filteredProducts.map((product: any) => (
            <div
              key={product._id}
              className="border w-full  md:w-auto p-4 h-full rounded-lg shadow-md flex justify-center items-center flex-col"
            >
              {product.productImage?.asset?.url && (
                <img
                  src={urlFor(product.productImage.asset).width(400).url()}
                  alt={product.productImage.alt || "Product Image"}
                  className="w-full max-h-[400px] object-scale-down mb-4"
                />
              )}
              <h2 className="font-semibold text-2xl text-center">
                {product.title}
              </h2>
              <p className="text-green-600 font-bold mb-2 text-xl ">
                Rs. {product.price}
              </p>
              <button
                onClick={() => setSelectedProduct(product)}
                className="bg-green-700 p-3 font-bold hover:bg-green-800 rounded-xl text-white"
              >
                Add to cart
              </button>
              {product.discountPercentage && (
                <p className="text-red-500 text-sm">
                  {product.discountPercentage}% OFF
                </p>
              )}
            </div>
          ))}
        </div>
        {/* {cartItems.length > 0 && (
          <button
            className="fixed bottom-6 right-6  gap-1 hover:bg-green-500 hover:text-black  bg-green-900  text-white rounded-full p-4 shadow-lg flex items-center justify-center"
            onClick={toggleCartSidebar}
          >
            <HiShoppingCart size={25} />
       
            {cartItems.length}
          
          </button>
        )} */}

        {/* {isCartOpen && (
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
                  <p className="text-center text-gray-500">
                    Your cart is empty
                  </p>
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
        )} */}

        {selectedProduct && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[800px]">
              <div className="grid grid-cols-2 gap-5 ">
                <div>
                  <img
                    src={urlFor(selectedProduct.productImage.asset)
                      .width(500)
                      .url()}
                    alt={selectedProduct.productImage.alt || "Product Image"}
                    className="w-[400px] h-[400px] object-contain mb-4"
                  />
                </div>
                <div className="space-y-5">
                  <div className="flex justify-end">
                    <ImCancelCircle
                      size={20}
                      className="hover:text-gray-400"
                      onClick={() => setSelectedProduct(null)}
                    />
                  </div>
                  <h2 className="font-bold text-4xl">
                    {selectedProduct.title}
                  </h2>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                  <p className="text-green-600 font-bold text-3xl">
                    Rs. {selectedProduct.price}
                  </p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={decreaseQuantity}
                      className="bg-gray-200 px-4 py-2 rounded-lg text-xl font-bold"
                    >
                      -
                    </button>
                    <span className="text-2xl font-semibold">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      className="bg-gray-200 px-4 py-2 rounded-lg text-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setSelectedProduct(null)}
                className="flex items-center mt-4"
              >
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className={`p-3 font-bold rounded-xl w-full ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-700 hover:bg-green-800 text-white"
                  }`}
                >
                  {isLoading ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
