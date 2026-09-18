import React from 'react';
import './ProductInfo.css';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Luminous Foundation', category: 'Makeup', stock: 120, price: '$35.00' },
  { id: 2, name: 'Hydrating Serum', category: 'Skincare', stock: 85, price: '$42.00' },
  { id: 3, name: 'Matte Lipstick', category: 'Makeup', stock: 210, price: '$22.00' },
  { id: 4, name: 'Vitamin C Toner', category: 'Skincare', stock: 45, price: '$28.00' },
];

const ProductInfo = () => {
  return (
    <div className="product-container fade-in">
      <div className="product-header">
        <h1 className="gradient-text">Product Information</h1>
        <p className="subtitle">View and manage your current beauty catalog</p>
      </div>
      
      <div className="product-table-wrapper glass-panel">
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PRODUCTS.map((product) => (
              <tr key={product.id}>
                <td>#{product.id}</td>
                <td>{product.name}</td>
                <td><span className={`badge ${product.category.toLowerCase()}`}>{product.category}</span></td>
                <td>
                  <div className="stock-indicator">
                    <div className={`dot ${product.stock > 50 ? 'high' : 'low'}`}></div>
                    {product.stock}
                  </div>
                </td>
                <td className="price-col">{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductInfo;
