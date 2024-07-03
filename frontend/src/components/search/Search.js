import React from 'react';
import './Search.scss';
import { BiSearch } from "react-icons/bi";

const Search = ({ value, onChange }) => {
  return (
    <div className="search">
      <BiSearch size={18} className="icon" />
      <input type="text" placeholder='Enter SKU Code' value={value} onChange={onChange} />
    </div>
  );
}

export default Search;
