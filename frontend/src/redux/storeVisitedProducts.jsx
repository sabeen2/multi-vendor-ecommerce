// Function to add a visited product to LocalStorage
export const addVisitedProduct = (productId) => {
    // Retrieve the current list of visited products from LocalStorage (if any)
    const existingVisitedProducts = localStorage.getItem('visitedProducts')
      ? JSON.parse(localStorage.getItem('visitedProducts'))
      : [];
  
    // Add the new product ID to the list
    existingVisitedProducts.unshift(productId);
  
    // Limit the list to store only the latest 3-4 visited products (remove older ones)
    const latestVisitedProducts = existingVisitedProducts.slice(0, 4);
  
    // Store the updated list back in LocalStorage
    localStorage.setItem('visitedProducts', JSON.stringify(latestVisitedProducts));
  };
  
  // Function to get the list of visited products from LocalStorage
  export const getVisitedProducts = () => {
    // Retrieve the list of visited products from LocalStorage
    const storedVisitedProducts = localStorage.getItem('visitedProducts');
  
    // Parse the stored data (if any)
    if (storedVisitedProducts) {
      return JSON.parse(storedVisitedProducts);
    }
  
    // If no data is stored, return an empty array
    return [];
  };
  