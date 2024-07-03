import React, { useEffect} from 'react';
import { BsCart4, BsCartX } from "react-icons/bs";
import './ProductSummary.scss';
import InfoBox from "../../infoBox/InfoBox";
import { useDispatch, useSelector } from 'react-redux'; 
import { CALC_OUTOFSTOCK, getAvailableProduct, selectOutOfStock, selectProducts } from '../../../redux/features/product/productSlice'; 

const productIcon = <BsCart4 size={40} color="#fff" />;
const outofStockIcon = <BsCartX size={40} color="#fff" />;

const ProductSummary = () => {
    const dispatch = useDispatch();
    const availableProducts = useSelector(selectProducts);
    const outOfStock = useSelector(selectOutOfStock);

    useEffect(() => {
        dispatch(getAvailableProduct());
    }, [dispatch]);

    useEffect(() => {
        if (availableProducts.length) {
            dispatch(CALC_OUTOFSTOCK(availableProducts));
        }
    }, [dispatch, availableProducts]);


    return (
        <div className='product-summary'>
            <h3 className="--mt">Inventory Stats</h3>
            <div className="info-summary">
                <InfoBox 
                    icon={productIcon} 
                    title={"Total Products"} 
                    count={availableProducts.length} 
                    bgColor="card1"
                />
                <InfoBox 
                    icon={outofStockIcon} 
                    title={"Out of Stock"} 
                    count={outOfStock} 
                    bgColor="card4"
                />
            </div>
        </div>
    );
};

export default ProductSummary;
