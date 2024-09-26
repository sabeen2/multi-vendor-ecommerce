import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import RelatedProducts from "../components/Products/RelatedProducts";
import { useSelector } from "react-redux";

const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);
  const { id } = useParams(); // Get the product/event ID from URL
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent"); // Check if it's an event

  useEffect(() => {
    if (eventData !== null) {
      const event = allEvents?.find((i) => i._id === id);
      setData(event);
    } else {
      const product = allProducts?.find((i) => i._id === id);
      setData(product);
    }
  }, [id, eventData, allProducts, allEvents]); // Add id, eventData, allProducts, and allEvents as dependencies

  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {/* {!eventData && data && <SuggestedProduct data={data} />}{" "} */}
      {!eventData && data && <RelatedProducts data={data} />}{" "}
      {/* Only show suggested products if it's not an event */}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
