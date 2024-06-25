import React, { children } from 'react'
import Header from '../header/Header';
import Footer from '../footer/Footer';

const Layout=()=>{
    return(
        <>
            <Header />
            <div style ={{minHeight: "80vh"}} className="--pad">
                {children}
            </div>
            <Footer />
        </>
    );
};

export default Layout;
