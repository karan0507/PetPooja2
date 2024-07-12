import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const ADD_MERCHANT_MUTATION = gql`
  mutation AddMerchant($userId: ID!, $restaurantName: String!, $menu: [String!]!, $address: String!, $phone: String!, $registrationNumber: String!) {
    addMerchant(userId: $userId, restaurantName: $restaurantName, menu: $menu, address: $address, phone: $phone, registrationNumber: $registrationNumber) {
      id
      restaurantName
    }
  }
`;

const AddMerchant = () => {
  const [formData, setFormData] = useState({
    userId: '',
    restaurantName: '',
    menu: '',
    address: '',
    phone: '',
    registrationNumber: '',
  });

  const [addMerchant] = useMutation(ADD_MERCHANT_MUTATION);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userId, restaurantName, menu, address, phone, registrationNumber } = formData;
    try {
      const { data } = await addMerchant({
        variables: {
          userId,
          restaurantName,
          menu: menu.split(','),
          address,
          phone,
          registrationNumber,
        },
      });
      console.log('Merchant added:', data.addMerchant);
      setFormData({
        userId: '',
        restaurantName: '',
        menu: '',
        address: '',
        phone: '',
        registrationNumber: '',
      });
    } catch (error) {
      console.error('Error adding merchant:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Merchant</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>User ID</label>
          <input type="text" name="userId" value={formData.userId} onChange={handleChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Restaurant Name</label>
          <input type="text" name="restaurantName" value={formData.restaurantName} onChange={handleChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Menu (comma separated)</label>
          <input type="text" name="menu" value={formData.menu} onChange={handleChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Registration Number</label>
          <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary">Add Merchant</button>
      </form>
    </div>
  );
};

export default AddMerchant;
