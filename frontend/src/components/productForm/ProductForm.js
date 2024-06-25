import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Card from '../card/card';

const ProductForm = ({
    product, 
    productImage, 
    imagePreview, 
    setDescription, 
    handleInputChange, 
    handleImageChange, 
    saveProduct
}) => {
    return(
        <div className="add-product">
            <Card cardClass={"card"}>
                <form onSubmit={saveProduct}>
                    <Card cardClass={"group"}>
                        <label>Product Image</label>
                        <code className="--color-dark">
                            Supported Formats: jpg, jpeg, png
                        </code>
                        <input
                            type="file"
                            name="image"
                            onChange={(e) => handleImageChange(e)}
                        />

                        {imagePreview != null ? (
                            <div className="image-preview">
                                <img src={imagePreview} alt="product" />
                            </div>
                        ) : (
                            <p>No image set for this product.</p>
                        )}
                    </Card>

                    <label>SKU Code:</label>
                    <input
                        type="text"
                        placeholder="SKU Code"
                        name="skuCode"
                        value={product?.skuCode}
                        onChange={handleInputChange}
                    />

                    <label>Item Name:</label>
                    <input
                        type="text"
                        placeholder="Item Name"
                        name="itemName"
                        value={product?.itemName}
                        onChange={handleInputChange}
                    />

                    <label>HSN:</label>
                    <input
                        type="text"
                        placeholder="HSN"
                        name="hsn"
                        value={product?.hsn}
                        onChange={handleInputChange}
                    />

                    <label>Product Dimensions:</label>
                    <input
                        type="text"
                        placeholder="Product Dimensions"
                        name="productDimensions"
                        value={product?.productDimensions}
                        onChange={handleInputChange}
                    />

                    <label>Material Specs:</label>
                    <input
                        type="text"
                        placeholder="Material Specs"
                        name="materialSpecs"
                        value={product?.materialSpecs}
                        onChange={handleInputChange}
                    />

                    <label>PCS Per Carton:</label>
                    <input
                        type="text"
                        placeholder="PCS Per Carton"
                        name="pcsPerCarton"
                        value={product?.pcsPerCarton}
                        onChange={handleInputChange}
                    />

                    <label>Carton Dimensions:</label>
                    <input
                        type="text"
                        placeholder="Carton Dimensions"
                        name="cartonDimensions"
                        value={product?.cartonDimensions}
                        onChange={handleInputChange}
                    />

                    <label>Carton CBM:</label>
                    <input
                        type="text"
                        placeholder="Carton CBM"
                        name="cartonCBM"
                        value={product?.cartonCBM}
                        onChange={handleInputChange}
                    />

                    <label>Plain Price:</label>
                    <input
                        type="text"
                        placeholder="Plain Price"
                        name="plainPrice"
                        value={product?.plainPrice}
                        onChange={handleInputChange}
                    />

                    <label>Print Price:</label>
                    <input
                        type="text"
                        placeholder="Print Price"
                        name="printPrice"
                        value={product?.printPrice}
                        onChange={handleInputChange}
                    />

                    <label>Plain Lead Time:</label>
                    <input
                        type="text"
                        placeholder="Plain Lead Time"
                        name="plainLeadTime"
                        value={product?.plainLeadTime}
                        onChange={handleInputChange}
                    />

                    <label>Print Lead Time:</label>
                    <input
                        type="text"
                        placeholder="Print Lead Time"
                        name="printLeadTime"
                        value={product?.printLeadTime}
                        onChange={handleInputChange}
                    />

                    <label>Rate:</label>
                    <input
                        type="text"
                        placeholder="Rate"
                        name="rate"
                        value={product?.rate}
                        onChange={handleInputChange}
                    />

                    <label>Product Description:</label>
                    <ReactQuill
                        theme="snow"
                        value={product?.description}
                        onChange={setDescription}
                        modules={ProductForm.modules}
                        formats={ProductForm.formats}
                    />

                    <div className="--my">
                        <button type="submit" className="--btn --btn-primary">
                            Save Product
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

ProductForm.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};

ProductForm.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "image",
  "code-block",
  "align",
];

export default ProductForm;
