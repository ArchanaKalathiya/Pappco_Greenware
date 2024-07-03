import React, { useEffect, useState } from "react";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/features/auth/authSlice";
import { getProducts, getAvailableProduct, selectIsLoading, selectProducts } from "../../redux/features/product/productSlice";
import ProductList from "../../components/product/productList/ProductList";
import SelectedProducts from "../../components/product/SelectedProducts/SelectedProducts";

const Dashboard = () => {
  useRedirectLoggedOutUser('/login');
  
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector((state) => state.product.isError);
  const message = useSelector((state) => state.product.message);

  const [showSelectedProducts, setShowSelectedProducts] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getProducts());
      dispatch(getAvailableProduct());
    }
    if (isError) {
      console.log(message);
    }
  }, [dispatch, isLoggedIn, isError, message]);

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px",
    marginTop: "-10px",
  };

  const handleViewProducts = () => {
    setShowSelectedProducts(true);
  };

  return (
    <div>
      <div style={containerStyle}>
        <h3>Generate Your Quotation</h3>
        <button style={buttonStyle} onClick={handleViewProducts}>
          View Your Products
        </button>
      </div>

      {showSelectedProducts && <SelectedProducts />} {/* Conditionally render SelectedProducts */}

      <ProductList products={products} isLoading={isLoading} />
    </div>
  );
};

export default Dashboard;
