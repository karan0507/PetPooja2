import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_CONTACT_MESSAGES_QUERY = gql`
  query GetContactMessages {
    contactMessages {
      _id
      name
      email
      subject
      message
      createdAt
    }
  }
`;

const ContactMessages = () => {
  const { loading, error, data } = useQuery(GET_CONTACT_MESSAGES_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading contact messages: {error.message}</p>;

  return (
    <div className="container mt-5">
      <h2>Contact Messages</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.contactMessages.map((message) => (
            <tr key={message._id}>
              <td>{message.name}</td>
              <td>{message.email}</td>
              <td>{message.subject}</td>
              <td>{message.message}</td>
              <td>{new Date(message.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactMessages;