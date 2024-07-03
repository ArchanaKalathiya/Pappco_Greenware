import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../loader/Loader";
import ProductForm from "../../components/product/productForm/ProductForm";
import {
  createProduct,
  selectIsLoading,
  selectProducts,
} from "../../redux/features/product/productSlice";
import ProductSumary from "../../components/product/productSummary/ProductSummary";
import { toast } from "react-toastify";

const initialState = {
  skuCode: "",
  itemName: "",
  hsn: "",
  productDimensions: "",
  materialSpecs: "",
  pcsPerCarton: "",
  cartonDimensions: "",
  cartonCBM: "",
  print: "false",
  price: "",
  printPrice: "",
  leadTime: "",
  printLeadTime: "",
  noOfquantity:"",
};

const AddProduct = () => {
  const [product, setProduct] = useState(initialState);
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const generateSKU = (itemName) => {
    const letter = itemName.slice(0, 3).toUpperCase();
    const number = Date.now();
    return `${letter}-${number}`;
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("skuCode", generateSKU(product.itemName));
      formData.append("itemName", product.itemName);
      formData.append("hsn", product.hsn);
      formData.append("productDimensions", product.productDimensions);
      formData.append("materialSpecs", product.materialSpecs);
      formData.append("pcsPerCarton", product.pcsPerCarton);
      formData.append("cartonDimensions", product.cartonDimensions);
      formData.append("cartonCBM", product.cartonCBM);
      formData.append("print", product.print);
      formData.append("price", product.price);
      formData.append("printPrice", product.printPrice);
      formData.append("leadTime", product.leadTime);
      formData.append("printLeadTime", product.printLeadTime);
      formData.append("noOfquantity",product.noOfquantity);
      if (productImage) {
        formData.append("image", productImage);
      }
      await dispatch(createProduct(formData));
      toast.success("Product added to inventory");
      setProduct(initialState);
      setProductImage(null);
      setImagePreview(null);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Error in adding product");
    }
  };

  return (
    <div>
      <ProductSumary products={products} />
      {isLoading && <Loader />}
      <ProductForm
        product={product}
        productImage={productImage}
        imagePreview={imagePreview}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        saveProduct={saveProduct}
      />
    </div>
  );
};

export default AddProduct;
