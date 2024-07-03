import React from 'react';
import Card from '../../card/card';
import './ProductForm.scss';

const ProductForm = ({
  product,
  productImage,
  imagePreview,
  handleInputChange,
  handleImageChange,
  saveProduct,
}) => {
  return (
    <div className="add-product-container">
      <h3 className="--mt">Add New Product</h3>
      <div className="add-product">
        <Card cardClass="card">
          <form onSubmit={saveProduct}>
            <Card cardClass="group">
              <label>Product Image</label>
              <code className="--color-dark">
                Supported Formats: jpg, jpeg, png
              </code>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="product" />
                </div>
              )}
            </Card>

            <label>SKU Code:</label>
            <input
              type="text"
              placeholder="SKU Code"
              name="skuCode"
              value={product.skuCode}
              onChange={handleInputChange}
              
            />

            <label>Item Name:</label>
            <input
              type="text"
              placeholder="Item Name"
              name="itemName"
              value={product.itemName}
              onChange={handleInputChange}
            />

            <label>HSN:</label>
            <input
              type="text"
              placeholder="HSN"
              name="hsn"
              value={product.hsn}
              onChange={handleInputChange}
            />

            <label>Product Dimensions:</label>
            <input
              type="text"
              placeholder="Product Dimensions"
              name="productDimensions"
              value={product.productDimensions}
              onChange={handleInputChange}
            />

            <label>Material Specs:</label>
            <input
              type="text"
              placeholder="Material Specs"
              name="materialSpecs"
              value={product.materialSpecs}
              onChange={handleInputChange}
            />

            <label>PCS Per Carton:</label>
            <input
              type="text"
              placeholder="PCS Per Carton"
              name="pcsPerCarton"
              value={product.pcsPerCarton}
              onChange={handleInputChange}
            />

            <label>Carton Dimensions:</label>
            <input
              type="text"
              placeholder="Carton Dimensions"
              name="cartonDimensions"
              value={product.cartonDimensions}
              onChange={handleInputChange}
            />

            <label>Carton CBM:</label>
            <input
              type="text"
              placeholder="Carton CBM"
              name="cartonCBM"
              value={product.cartonCBM}
              onChange={handleInputChange}
            />
            {/* noOfquantity */}
            <label>Available Quantity:</label>
            <input
              type="number"
              placeholder="Available quantity of product"
              name="noOfquantity"
              value={product.noOfquantity}
              onChange={handleInputChange}
            />

            <label>Print (Y/N):</label>
              <select name="print" value={product.print} onChange={handleInputChange}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>

            <label>Plain Price:</label>
            <input
              type="number"
              placeholder="Plain Price"
              name="price"
              value={product.price}
              onChange={handleInputChange}
            />

            <label>Print Price:</label>
            <input
              type="number"
              placeholder="Print Price"
              name="printPrice"
              value={product.printPrice}
              onChange={handleInputChange}
            />

            <label>Plain Lead Time:</label>
            <input
              type="text"
              placeholder="Plain Lead Time"
              name="leadTime"
              value={product.leadTime}
              onChange={handleInputChange}
            />

            <label>Print Lead Time:</label>
            <input
              type="text"
              placeholder="Print Lead Time"
              name="printLeadTime"
              value={product.printLeadTime}
              onChange={handleInputChange}
            />

            <div className="--my">
              <button type="submit" className="--btn --btn-primary">
                Save Product
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProductForm;
