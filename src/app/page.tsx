"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Heading from "./components/Heading";
import { ImCancelCircle } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/app/lib/features/todos/cartSlice";
import Swal from "sweetalert2";

import { removeFromCart } from "@/app/lib/features/todos/cartSlice";
import Header from "./components/Header";

export default function Home() {
  const [productsData, setProductsData] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [sliderData, setSliderData] = useState<any[]>([]); // State for slider data
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // Function to fetch data from Sanity
  const fetchSanityData = async () => {
    const [products, categories, sliders] = await Promise.all([
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
      client.fetch(`
        *[_type == "category"]{
          _id,
          title,
          description,
          image{
            asset->{
              _id,
              url
            }
          }
        }
      `),
      client.fetch(`
        *[_type == "Slider"]{
          _id,
          title,
          Image{
            asset->{
              _id,
              url
            }
          }
        }
      `),
    ]);

    setProductsData(products);
    setCategoriesData(categories);
    setSliderData(sliders); // Set slider data
  };

  // useEffect to fetch data when component mounts
  useEffect(() => {
    fetchSanityData();
  }, []);

  // useEffect to filter products when selectedCategory or productsData changes
  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredProducts(productsData);
    } else {
      setFilteredProducts(
        productsData.filter(
          (product: any) => product.category?._id === selectedCategory
        )
      );
    }
  }, [selectedCategory, productsData]);

  const urlFor = (source: any) => {
    const builder = imageUrlBuilder(client);
    return builder.image(source);
  };

  // State to control the current index of the carousel
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next image (with loop)
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderData.length); // Loop to first slide when reaching the end
  };

  // Function to go to the previous image (with loop)
  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + sliderData.length) % sliderData.length // Loop to last slide when going back from the first slide
    );
  };

  // Add to Cart handler
  const dispatch = useDispatch(); // Move this outside of the function

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

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <main>
      <Header />
      <Heading title="Welcome to Online Grocery Store" />
      <div className="relative my-5">
        {/* Carousel */}
        <div className="overflow-hidden">
          <div
            className="flex transition-all duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {sliderData.map((slide: any) => (
              <div key={slide._id} className="flex-shrink-0 w-full">
                <img
                  src={urlFor(slide.Image.asset).width(1200).url()}
                  alt={slide.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Prev and Next Buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black text-white p-2"
        >
          &#10094;
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black text-white p-2"
        >
          &#10095;
        </button>
      </div>
      <hr className="my-10" />
      <div className="mx-0 md:mx-10">
        <Heading title="Shop by category" />
        <div className="flex flex-wrap gap-6 justify-center text-center mx-10">
          {categoriesData.map((cat: any) => (
            <button
              key={cat._id}
              className={` w-36 h-36 md:w-72 md:h-52 cursor-pointer font-bold bg-green-100 ${selectedCategory === cat._id ? " bg-green-500 text-white" : ""}`}
              onClick={() => setSelectedCategory(cat._id)}
            >
              <img
                src={urlFor(cat.image.asset).width(100).url()}
                alt={cat.title}
                className="w-full h-20 object-contain mb-2 "
              />
              {cat.title}
            </button>
          ))}
          {/* <button
            className=" p-2 mt-2 cursor-pointer font-bold bg-green-100"
            onClick={() => setSelectedCategory(null)}
          >
            Show All
          </button> */}
        </div>
        <hr className="my-10 " />
        <Heading title="Products" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 my-14 px-5 md:px-0">
          {filteredProducts.map((product: any) => (
            <div
              key={product._id}
              className="border p-4 h-full rounded-lg shadow-md flex justify-center items-center flex-col"
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
        {/* Floating Cart Button */}

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
                // onClick={() => setSelectedProduct(null)}
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
      </div>
    </main>
  );
}
