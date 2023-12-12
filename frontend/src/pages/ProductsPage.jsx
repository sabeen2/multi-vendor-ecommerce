import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";


const ProductsPage = () => {

  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);

  useEffect(() => {
    let sortedProducts = [];
  
    if (allProducts && categoryData !== null) {
      const filteredProducts = allProducts.filter((i) => i.category === categoryData);
  
      // Sort by ratings, but use a default rating of -1 for products without ratings.
      sortedProducts = filteredProducts.slice().sort((a, b) => (b.ratings || -1) - (a.ratings || -1));
    } else if (allProducts) {
      // Sort all products by ratings, with a default rating of -1 for products without ratings.
      sortedProducts = allProducts.slice().sort((a, b) => (b.ratings || -1) - (a.ratings || -1));
    }
  
    setData(sortedProducts);
  }, [allProducts, categoryData]);
  
  

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
         
          <Header activeHeading={3} />
          <br />
          <br />
          <div className={`${styles.section}`}>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
              {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
            </div>
            {data && data.length === 0 ? (
              <h1 className="text-center w-full pb-[100px] text-[20px]">
                No products Found!
              </h1>
            ) : null}
          </div>
          <Footer />
        </div>
      )}
    </>
  );

  


  
};

export default ProductsPage;
