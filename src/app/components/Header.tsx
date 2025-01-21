"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IoSearchOutline } from "react-icons/io5";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import Cart from "./Cart";

interface Product {
  title: string;
}

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const pathname = usePathname(); // Get the current route

  useEffect(() => {
    const fetchProducts = async () => {
      if (searchTerm.length > 1) {
        const query = `*[_type == "product" && title match "${searchTerm}*"]{title}`;
        const results: Product[] = await client.fetch(query);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    };
    fetchProducts();
  }, [searchTerm]);

  return (
    <div className="shadow-md">
      {/* Hide Cart component when user is on the /checkout page */}
      {pathname !== "/checkout" && <Cart />}
      <div className="flex flex-row justify-between items-center mx-5 my-2">
        <div className="flex flex-row gap-1 md:gap-10 justify-between items-center">
          <Link href="/">
            <Image
              src="/glogo.jpg"
              width={200}
              height={500}
              alt="Logo"
              className="mb-6 w-24 md:w-52"
            />
          </Link>
        </div>
        <div className="flex flex-row gap-5 justify-center items-center">
          <div className="relative border-2 px-1 md:px-4 py-1 md:py-3 rounded-full flex flex-row items-center gap-2">
            <IoSearchOutline size={20} />
            <input
              type="text"
              placeholder="Search"
              className="h-8 md:h-10 items-center w-32 md:w-auto px-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto z-10">
                {suggestions.map((product, index) => (
                  <Link href={`/products/${product.title}`} key={index}>
                    <li
                      className="px-4 py-3 flex flex-row gap-4 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setSearchTerm(product.title)}
                    >
                      <IoSearchOutline size={20} />
                      {product.title}
                    </li>
                  </Link>
                ))}
              </ul>
            )}
          </div>

          <div>
            <Link href="/login">
              <button className="bg-green-800 py-4 px-6 text-white font-bold rounded-lg hidden md:block">
                login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
