import React, { useState, useEffect } from 'react';

const ManageOrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');

  // Simulate fetching orders from an API
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/orders'); // Replace with your API endpoint
      const data = await response.json();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  const handleStatusChange = (id, status) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === id ? { ...order, status } : order
      )
    );

    // Update order status in the backend (simulated)
    // await fetch(`/api/orders/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify({ status }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
  };

  const filteredOrders = orders.filter(order => filter === 'all' || order.status === filter);

  return (
    <div>
      <h2>Manage Order Status</h2>
    
      <div>
        <label>
          Filter by status:
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.items.join(', ')}</td>
              <td>{order.status}</td>
              <td>
                <select
                  value={order.status}
                  onChange={e => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOrderStatus;
