import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../server";
import { Link } from "react-router-dom";

import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";

const RelatedProducts = ({ data }) => {
  const [similarProducts, setSimilarProducts] = useState([]);

  const fetchSimilarProducts = async () => {
    const response = await axios.get(
      `${server}/product/similar-recommendations/${data._id}`
    );
    setSimilarProducts(response.data);
  };

  useEffect(() => {
    fetchSimilarProducts();
  }, [data]);

  return (
    <div>
      {similarProducts?.length > 0 && (
        <div className={`p-4 ${styles.section}`}>
          <h2
            className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}
          >
            Related Products
          </h2>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {similarProducts.map((product, index) => (
              <Link to={`/product/${product._id}`} key={index}>
                <ProductCard data={product} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
