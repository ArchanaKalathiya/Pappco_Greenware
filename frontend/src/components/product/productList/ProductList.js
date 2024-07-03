import React, { useEffect, useState } from 'react';
import { SpinnerImg } from "../../../loader/Loader";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import "./ProductList.scss";
import Search from '../../search/Search';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { FILTER_PRODUCTS, selectFilteredProducts } from '../../../redux/features/product/filterSlice.js';
import { confirmAlert } from "react-confirm-alert";
import { deleteProduct, getProducts, selectProduct,} from "../../../redux/features/product/productSlice";
import { Link } from "react-router-dom";
import productService from '../../../services/productService.js';
import ProductSumary from '../productSummary/ProductSummary.js';

const ProductList = ({ products, isLoading }) => {
  const [search, setSearch] = useState("");
  const filteredProducts = useSelector(selectFilteredProducts);
  const dispatch = useDispatch();
  const [availableProducts, setAvailableProducts] = useState([]);
  const [print, setPrint] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [productStatuses, setProductStatuses] = useState({});
  // const [selectedProducts, setSelectedProducts] = useState([]);

  // Delete Products
  const delProduct = async (id) => {
    console.log(id);
    await dispatch(deleteProduct(id));
    await dispatch(getProducts());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete Product",
      message: "Are you sure you want to delete this product.",
      buttons: [
        {
          label: "Delete",
          onClick: () => delProduct(id),
        },
        {
          label: "Cancel",
          // onClick: () => alert('Click No')
        },
      ],
    });
  };

  // Pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredProducts]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };

  const handleAddProduct = async (productId, quantity, print) => {
    try {
      await productService.selectProduct(productId, quantity, print);
      setProductStatuses((prevStatuses) => ({
        ...prevStatuses,
        [productId]: 'added',
      }));
    } catch (error) {
      console.error("Error adding product:", error);
      setProductStatuses((prevStatuses) => ({
        ...prevStatuses,
        [productId]: 'error',
      }));
    }
  };
  
  useEffect(() => {
    const fetchAvailableProducts = async () => {
      try {
        const products = await productService.getAvailableProduct();
        console.log('Fetched available products:', products);
        setAvailableProducts(products);
      } catch (error) {
        console.error('Error fetching available products:', error);
      }
    };
    fetchAvailableProducts();
  }, []);

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products: availableProducts,search }));
  }, [products, availableProducts, search, dispatch]);

  const shortenText = (text, n) => {
    if (text && text.length > n) {
      return text.substring(0, n).concat("...");
    }
    return text;
  };

  return (
    <div className='product-list'>
    <ToastContainer/>
      <hr />
      <div className='table'>
        <div className='--flex-between --flex-dir-column'>
          <span>
            <h3>Available Products </h3>
          </span>
          <span>
            <Search value={search} onChange={(e) => setSearch(e.target.value || "")} />
          </span>
        </div>

        {isLoading && <SpinnerImg />}
        
        <div className='table'>
          {!isLoading && filteredProducts.length === 0 ? (
            <p>No products found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>S/n</th>
                  <th>SKU Code</th>
                  <th>Item Name</th>
                  <th>HSN</th>
                  <th>Product Dimension</th>
                  <th>Material Specs</th>
                  <th>Pcs/Box</th>
                  <th>Carton Dimension</th>
                  <th>Carton CBM</th>
                  <th>Print(Y/N)</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Total Amount</th>
                  <th>Total CBM</th>
                  <th>Lead Time</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((product, index) => {
                  const {
                    _id,
                    skuCode,
                    itemName,
                    hsn,
                    productDimensions,
                    materialSpecs,
                    pcsPerCarton,
                    cartonDimensions,
                    cartonCBM,
                    print,
                    quantity,
                    price,
                    totalAmount,
                    totalCBM,
                    leadTime,
                    printPrice,
                    leadnTime,
                    printLeadTime,
                  } = product;
                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{skuCode}</td>
                      <td>{shortenText(itemName, 5)}</td>
                      <td>{hsn}</td>
                      <td>{shortenText(productDimensions,8)}</td>
                      <td>{shortenText(materialSpecs,8)}</td>
                      <td>{pcsPerCarton}</td>
                      <td>{cartonDimensions}</td>
                      <td>{cartonCBM}</td>
                      <td>
                      <select onChange={(e) => setPrint(e.target.value === "true")}>
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                      </td>
                      <td>
                      <input 
                        type="number" 
                        placeholder="Quantity" 
                        onChange={(e) => setProductStatuses((prevStatuses) => ({
                          ...prevStatuses,
                          [product._id]: e.target.value,
                        }))}
                      />
                      </td>
                      <td>{"₹"}{price}</td>
                      <td>{"₹"}{totalAmount}</td>
                      <td>{shortenText(totalCBM,5)}</td>
                      <td>{leadTime}</td>
                      <td className='icons'>
                        <span>
                        <Link to={`/product-detail/${_id}`}>
                            <AiOutlineEye size={24} color='#03A9F4'/>
                        </Link>
                        </span>
                        <span>
                          <Link to={`/edit-product/${_id}`}>
                            <FaEdit size={22} color='#FF9800'/>
                          </Link>
                        </span>
                        <span>
                          <FaTrashAlt size={18} color='#D32F2F' onClick={()=> confirmDelete(_id)}/>
                        </span>
                        <span>
                          <FaPlus size={18} color='green' onClick={() => handleAddProduct(_id,productStatuses[product._id] || 0, true)}/>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          pageCount={pageCount}
          previousLabel="Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />
      </div>
    </div>
  );
};

export default ProductList;
