import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      id
      username
      role
      email
      phone
    }
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      username
    }
  }
`;

const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePassword($id: ID!, $newPassword: String!) {
    updatePassword(id: $id, newPassword: $newPassword) {
      id
      username
    }
  }
`;

const UsersPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_USERS_QUERY);
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);
  const [updatePassword] = useMutation(UPDATE_PASSWORD_MUTATION);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser({ variables: { id } });
        refetch();
      } catch (error) {
        alert('Failed to delete the user. Please try again.');
      }
    }
  };

  const handleUpdatePassword = async (id) => {
    try {
      await updatePassword({ variables: { id, newPassword } });
      setSelectedUser(null);
      setNewPassword('');
      refetch();
    } catch (error) {
      alert('Failed to update password. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading users: {error.message}</p>;

  return (
    <div className="container mt-5">
      <h2>Manage Users</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-warning ml-2"
                  onClick={() => {
                    setSelectedUser(user.id);
                    setNewPassword('');
                  }}
                >
                  Update Password
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUser && (
        <div className="mt-4">
          <h3>Update Password for User {selectedUser}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdatePassword(selectedUser);
            }}
          >
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Update Password</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
