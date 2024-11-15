const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (normA * normB);
};

// Function to create a tag vector
const createTagVector = (tags, allTags) => {
  const vector = new Array(allTags.length).fill(0);
  tags.forEach((tag) => {
    const index = allTags.indexOf(tag.trim());
    if (index !== -1) {
      vector[index] = 1; // Mark the presence of the tag
    }
  });
  return vector;
};

// create product
router.post(
  "/create-product",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        let images = [];

        if (typeof req.body.images === "string") {
          images.push(req.body.images);
        } else {
          images = req.body.images;
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
          });

          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        const productData = req.body;
        productData.images = imagesLinks;
        productData.shop = shop;

        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Product is not found with this id", 404));
      }

      for (let i = 0; 1 < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          product.images[i].public_id
        );
      }

      await product.deleteOne();

      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get recommended products
// router.get(
//   "/get-recommended-products/:id",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const { id } = req.params;

//       // Find the product by ID
//       const targetProduct = await Product.findById(id);
//       if (!targetProduct) {
//         return next(new ErrorHandler("Product not found", 404));
//       }

//       // Get all other products (excluding the target product itself)
//       const allProducts = await Product.find({ _id: { $ne: id } });

//       // Calculate similarity scores for each product
//       const recommendedProducts = allProducts
//         .map((product) => ({
//           product,
//           score: calculateSimilarityScore(targetProduct, product),
//         }))
//         .sort((a, b) => b.score - a.score) // Sort by similarity score in descending order
//         .slice(0, 8) // Get the top 8 recommended products
//         .map((item) => item.product); // Extract the products

//       // Ensure we have at least 3 recommendations
//       if (recommendedProducts.length < 3) {
//         return next(
//           new ErrorHandler("Not enough recommended products found", 400)
//         );
//       }

//       res.status(200).json({
//         success: true,
//         recommendedProducts,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

router.get("/similar-recommendations/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send("Product not found");

    const allProducts = await Product.find();
    const allTags = Array.from(
      new Set(allProducts.flatMap((p) => p.tags.split(",")))
    ); // Unique tags from all products

    const productVector = createTagVector(product.tags.split(","), allTags);
    const recommendations = [];

    allProducts.forEach((p) => {
      const comparisonVector = createTagVector(p.tags.split(","), allTags);
      const similarity = cosineSimilarity(productVector, comparisonVector);
      recommendations.push({ product: p, similarity });
    });

    // Sort recommendations by similarity
    recommendations.sort((a, b) => b.similarity - a.similarity);
    const topRecommendations = recommendations
      .slice(0, 5)
      .map((r) => r.product); // Get top 5 products

    res.json(topRecommendations);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
