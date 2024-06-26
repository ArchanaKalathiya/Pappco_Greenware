import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductForm from '../../components/productForm/ProductForm';
import Loader from "../../loader/Loader";
import {
    createProduct,
    selectIsLoading,
  } from "../../redux/features/product/productSlice";

const initialState = {
    skuCode: "",
    itemName: "",
    hsn:"",
    image:"",
    productDimensions:"",
    materialSpecs:"",
    pcsPerCarton:"",
    cartonDimensions:"",
    cartonCBM:"",
    plainPrice:"",
    printPrice:"",
    plainLeadTime:"",
    printLeadTime:"",
    rate:"",
};

const AddProduct = () => {
    const [product, setProduct] = useState(initialState);
    const [productImage, setProductImage] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [description, setDescription] = useState("");

    const isLoading = useSelector(selectIsLoading);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleImageChange = (e) => {
        setProductImage(e.target.files[0]);
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    };

    const generateSKU = (itemName) => {
        const letter = itemName.slice(0, 3).toUpperCase();
        const number = Date.now();
        return `${letter}-${number}`;
    };

    const saveProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("skuCode", generateSKU(product.itemName));
        formData.append("itemName", product.itemName);
        formData.append("hsn", product.hsn);
        formData.append("productDimensions", product.productDimensions);
        formData.append("materialSpecs", product.materialSpecs);
        formData.append("pcsPerCarton", product.pcsPerCarton);
        formData.append("cartonDimensions", product.cartonDimensions);
        formData.append("cartonCBM", product.cartonCBM);
        formData.append("plainPrice", product.plainPrice);
        formData.append("printPrice", product.printPrice);
        formData.append("plainLeadTime", product.plainLeadTime);
        formData.append("printLeadTime", product.printLeadTime);
        formData.append("rate", product.rate);
        formData.append("description", description);
        formData.append("image", productImage);

        console.log(...formData);

        await dispatch(createProduct(formData));

        navigate("/dashboard");
    };

    return (
        <div>
            {isLoading && <Loader />}
            <h3 className='--mt'>Add New Product</h3>
            <div>Debug: AddProduct Component Rendered</div>
            <ProductForm
                product={product}
                productImage={productImage}
                imagePreview={imagePreview}
                setDescription={setDescription}
                handleInputChange={handleInputChange}
                handleImageChange={handleImageChange}
                saveProduct={saveProduct}
            />
        </div>
    );
};

export default AddProduct;
