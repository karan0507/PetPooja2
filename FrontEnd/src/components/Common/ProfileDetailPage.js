import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Container, Row, Col, Button, Form, Image, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import profile from '../Assests/Images/default.png';
import '../Assests/Css/MerchantDetailPage.css';
import 'react-toastify/dist/ReactToastify.css';

const GET_PROFILE_DETAILS = gql`
  query GetProfileDetails($userId: ID!) {
    user(id: $userId) {
      id
      username
      role
      email
      phone
      profilePic
    }
  }
`;

const GET_MERCHANT_DETAILS = gql`
  query GetMerchantDetails($userId: ID!) {
    merchant(userId: $userId) {
      id
      restaurantName
      address {
        street
        city
        province
        zipcode
      }
      phone
      registrationNumber
      user {
        id
        username
        email
        phone
        profilePic
      }
    }
  }
`;

const GET_CUSTOMER_DETAILS = gql`
  query GetCustomerDetails($userId: ID!) {
    customer(userId: $userId) {
      id
      address {
        street
        city
        province
        zipcode
      }
      user {
        id
        username
        email
        phone
        profilePic
      }
    }
  }
`;

const UPLOAD_PROFILE_PIC = gql`
  mutation UploadProfilePic($userId: ID!, $file: Upload!) {
    uploadProfilePic(userId: $userId, file: $file) {
      id
      username
      profilePic
    }
  }
`;

const REMOVE_PROFILE_PIC = gql`
  mutation RemoveProfilePic($userId: ID!) {
    removeProfilePic(userId: $userId) {
      id
      username
      profilePic
    }
  }
`;

const ProfileDetailPage = () => {
  const { userId } = useParams();
  const [file, setFile] = useState(null);
  const [showFileInput, setShowFileInput] = useState(false);

  const { loading: userLoading, data: userData, refetch: refetchUserData } = useQuery(GET_PROFILE_DETAILS, { variables: { userId } });
  const { loading: merchantLoading, data: merchantData, refetch: refetchMerchantData } = useQuery(GET_MERCHANT_DETAILS, { variables: { userId }, skip: !userData || userData.user.role !== 'Merchant' });
  const { loading: customerLoading, data: customerData, refetch: refetchCustomerData } = useQuery(GET_CUSTOMER_DETAILS, { variables: { userId }, skip: !userData || userData.user.role !== 'Customer' });
  const [uploadProfilePic, { loading: uploadLoading, error: uploadError }] = useMutation(UPLOAD_PROFILE_PIC);
  const [removeProfilePic, { loading: removeLoading, error: removeError }] = useMutation(REMOVE_PROFILE_PIC);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const { data } = await uploadProfilePic({
        variables: {
          userId,
          file,
        },
      });
      toast.success('Profile picture uploaded successfully!');
      setShowFileInput(false);
      setFile(null);

      const updatedUser = { ...userData.user, profilePic: data.uploadProfilePic.profilePic };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      refetchUserData();
      if (userData.user.role === 'Merchant') {
        refetchMerchantData();
      } else if (userData.user.role === 'Customer') {
        refetchCustomerData();
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Error uploading profile picture.');
    }
  };

  const handleRemove = async () => {
    try {
      await removeProfilePic({
        variables: {
          userId,
        },
      });
      toast.success('Profile picture removed successfully!');
      setShowFileInput(false);

      const updatedUser = { ...userData.user, profilePic: null };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      refetchUserData();
      if (userData.user.role === 'Merchant') {
        refetchMerchantData();
      } else if (userData.user.role === 'Customer') {
        refetchCustomerData();
      }
    } catch (error) {
      console.error('Error removing profile picture:', error);
      toast.error('Error removing profile picture.');
    }
  };

  const handleChangeImageClick = () => {
    setShowFileInput(true);
  };

  if (userLoading || (userData && userData.user.role === 'Merchant' && merchantLoading) || (userData && userData.user.role === 'Customer' && customerLoading)) {
    return <p>Loading...</p>;
  }

  const user = userData.user;
  const merchant = user.role === 'Merchant' ? merchantData?.merchant : null;
  const customer = user.role === 'Customer' ? customerData?.customer : null;

  return (
    <Container>
      <Row className="my-4">
        <Col md={4} className="text-center">
          <Card className="profile-card">
            <Card.Body>
              <Image src={user.profilePic || profile} roundedCircle width="150" className="profile-image" />
              {showFileInput ? (
                <>
                  <Form.Group className="mt-3">
                    <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                  </Form.Group>
                  <Button className="mt-2" onClick={handleUpload} disabled={uploadLoading}>
                    {uploadLoading ? 'Uploading...' : 'Upload'}
                  </Button>
                </>
              ) : (
                <div className="d-flex justify-content-center mt-2">
                  <Button className="me-2" onClick={handleChangeImageClick}>
                    Change Image
                  </Button>
                  <Button variant="danger"  onClick={handleRemove} disabled={removeLoading}>
                    {removeLoading ? 'Removing...' : 'Remove Image'}
                  </Button>
                </div>
              )}
              {uploadError && <p className="text-danger">Error uploading file: {uploadError.message}</p>}
              {removeError && <p className="text-danger">Error removing file: {removeError.message}</p>}
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              <h1>{user.username}</h1>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              {merchant && (
                <>
                  <p><strong>Restaurant Name:</strong> {merchant.restaurantName}</p>
                  <p><strong>Address:</strong> {merchant.address.street}, {merchant.address.city}, {merchant.address.province}, {merchant.address.zipcode}</p>
                  <p><strong>Registration Number:</strong> {merchant.registrationNumber}</p>
                </>
              )}
              {customer && (
                <>
                  <p><strong>Address:</strong> {customer.address.street}, {customer.address.city}, {customer.address.province}, {customer.address.zipcode}</p>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileDetailPage;
