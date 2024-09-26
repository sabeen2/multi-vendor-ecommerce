import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";

function jaccardSimilarity(setA, setB) {
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

const SideProduct = ({ data }) => {
  const { allProducts } = useSelector((state) => state.products);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { productId } = useParams(); // Get product ID from URL

  useEffect(() => {
    // Extract tags from the currently viewed product
    const currentProductTags = new Set(data.tags);

    // Calculate Jaccard similarity with other products and filter similar ones
    const productsWithSimilarity = allProducts?.map((product) => {
      const productTags = new Set(product.tags);
      const similarity = jaccardSimilarity(currentProductTags, productTags);
      return { ...product, similarity };
    });

    // Sort products by similarity (higher similarity first) and limit the results
    const sortedSimilarProducts = productsWithSimilarity
      ?.filter((product) => product._id !== data._id) // Exclude the current product
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 4); // Adjust the number of suggested products as needed

    setSimilarProducts(sortedSimilarProducts);
  }, [data, allProducts, productId]); // Add productId to dependencies to trigger re-render when the URL changes

  return (
    <div>
      {similarProducts?.length > 0 && (
        <div className={`p-4 `}>
          <h2
            className={`${styles.heading} text-[25px] font-[500] border-b mb-5 `}
          >
            Other Users Also Purchased
          </h2>
          <div className="flex flex-col xl:gap-[30px] mb-12 h-[80vh] overflow-y-scroll ">
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

export default SideProduct;
