// import React, { useState, useEffect } from 'react';
// import { useMutation, gql, useQuery, useLazyQuery } from '@apollo/client';
// import { Container, Form, Button, Spinner, Row, Col, Card, Alert } from 'react-bootstrap';
// import { useUser } from '../Common/UserContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const ADD_PRODUCT = gql`
//   mutation AddProduct($userId: ID!, $name: String!, $price: Float!, $categoryId: ID!, $image: String) {
//     addProduct(userId: $userId, name: $name, price: $price, categoryId: $categoryId, image: $image) {
//       id
//       name
//       price
//       category {
//         id
//         name
//       }
//     }
//   }
// `;

// const GET_CATEGORIES = gql`
//   query GetCategories {
//     categories {
//       id
//       name
//     }
//   }
// `;

// const MERCHANT_BY_USER_ID = gql`
//   query MerchantByUserId($userId: ID!) {
//     merchantByUserId(userId: $userId) {
//       id
//     }
//   }
// `;

// const AddMenu = () => {
//   const { user } = useUser();
//   const [merchantId, setMerchantId] = useState(null);
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [categoryId, setCategoryId] = useState('');
//   const [image, setImage] = useState(null);
//   const [errorMessage, setErrorMessage] = useState('');

//   const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery(GET_CATEGORIES);
//   const [addProduct, { loading }] = useMutation(ADD_PRODUCT);
//   const [getMerchantByUserId, { data: merchantData }] = useLazyQuery(MERCHANT_BY_USER_ID);

//   useEffect(() => {
//     if (user?.role === 'Merchant' && user?.id) {
//       getMerchantByUserId({ variables: { userId: user.id } });
//     }
//   }, [user, getMerchantByUserId]);

//   useEffect(() => {
//     if (merchantData) {
//       setMerchantId(merchantData.merchantByUserId.id);
//     }
//   }, [merchantData]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.size > 10000000) { // 10MB limit
//       toast.error('Image size should be less than 10MB');
//       setImage(null);
//     } else {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImage(reader.result); // base64 encoded string
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!image) {
//       toast.error('Please select an image');
//       return;
//     }
//     try {
//       console.log("Submitting with userId:", user.id);
//       await addProduct({
//         variables: {
//           userId: user.id,
//           name,
//           price: parseFloat(price),
//           categoryId,
//           image
//         }
//       });
//       toast.success('Product added successfully!');
//       setName('');
//       setPrice('');
//       setCategoryId('');
//       setImage(null);
//       window.location.replace("/merchantdashboard/menu-list");
//     } catch (error) {
//       toast.error('An error occurred while adding the product.');
//       setErrorMessage(error.message);
//       console.error('Error details:', error);
//     }
//   };

//   if (categoriesLoading) return <Spinner animation="border" />;
//   if (categoriesError) return <Alert variant="danger">{categoriesError.message}</Alert>;

//   return (
//     <Container className="mt-5">
//       <Row className="justify-content-center">
//         <Col md={8}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <h2 className="text-center mb-4">Add New Menu Item</h2>
//               <Form onSubmit={handleSubmit}>
//                 <Form.Group controlId="formName">
//                   <Form.Label>Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group controlId="formPrice" className="mt-3">
//                   <Form.Label>Price</Form.Label>
//                   <Form.Control
//                     type="number"
//                     value={price}
//                     onChange={(e) => setPrice(e.target.value)}
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group controlId="formCategory" className="mt-3">
//                   <Form.Label>Category</Form.Label>
//                   <Form.Control
//                     as="select"
//                     value={categoryId}
//                     onChange={(e) => setCategoryId(e.target.value)}
//                     required
//                   >
//                     <option value="">Select category</option>
//                     {categoriesData.categories.map((category) => (
//                       <option key={category.id} value={category.id}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </Form.Control>
//                 </Form.Group>
//                 <Form.Group controlId="formImage" className="mt-3">
//                   <Form.Label>Image</Form.Label>
//                   <Form.Control
//                     type="file"
//                     onChange={handleFileChange}
//                     required
//                   />
//                 </Form.Group>
//                 <Button variant="primary" type="submit" className="mt-4 w-100" disabled={loading || !merchantId}>
//                   {loading ? 'Adding...' : 'Add Product'}
//                 </Button>
//               </Form>
//               {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default AddMenu;


import React, { useState, useEffect } from 'react';
import { useMutation, gql, useLazyQuery } from '@apollo/client';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../Common/UserContext';

const ADD_PRODUCT = gql`
  mutation AddProduct($userId: ID!, $name: String!, $price: Float!, $categoryId: ID!, $image: String) {
    addProduct(userId: $userId, name: $name, price: $price, categoryId: $categoryId, image: $image) {
      id
      name
      price
      category {
        id
        name
      }
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

const MERCHANT_BY_USER_ID = gql`
  query MerchantByUserId($userId: ID!) {
    merchantByUserId(userId: $userId) {
      id
    }
  }
`;

const AddMenu = () => {
  const { user } = useUser();
  const [merchantId, setMerchantId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [categoriesFetched, setCategoriesFetched] = useState(false);

  const [addProduct, { loading: adding }] = useMutation(ADD_PRODUCT);
  const [getMerchantByUserId, { data: merchantData }] = useLazyQuery(MERCHANT_BY_USER_ID);
  const [getCategories, { data: categoriesData, loading: categoriesLoading }] = useLazyQuery(GET_CATEGORIES);

  useEffect(() => {
    if (user?.role === 'Merchant' && user?.id) {
      getMerchantByUserId({ variables: { userId: user.id } });
    }
  }, [user, getMerchantByUserId]);

  useEffect(() => {
    if (merchantData) {
      setMerchantId(merchantData.merchantByUserId.id);
    }
  }, [merchantData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10000000) { // 10MB limit
      toast.error('Image size should be less than 10MB');
      setImage(null);
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // base64 encoded string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please select an image');
      return;
    }
    try {
      await addProduct({
        variables: {
          userId: user.id,
          name,
          price: parseFloat(price),
          categoryId,
          image
        }
      });
      toast.success('Product added successfully!');
      setName('');
      setPrice('');
      setCategoryId('');
      setImage(null);
      window.location.replace("/merchantdashboard/menu-list");
    } catch (error) {
      toast.error('An error occurred while adding the product.');
      setErrorMessage(error.message);
    }
  };

  const handleCategoryClick = () => {
    if (!categoriesFetched) {
      getCategories();
      setCategoriesFetched(true);
    }
  };

  const categoryOptions = categoriesData?.categories?.map((category) => ({
    value: category.id,
    label: category.name,
  })) || [];

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">Add New Menu Item</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPrice" className="mt-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formCategory" className="mt-3">
                  <Form.Label>Category</Form.Label>
                  <Select
                    isSearchable
                    isLoading={categoriesLoading}
                    options={categoryOptions}
                    onChange={(selectedOption) => setCategoryId(selectedOption?.value)}
                    onMenuOpen={handleCategoryClick}
                    placeholder="Select category..."
                  />
                </Form.Group>
                <Form.Group controlId="formImage" className="mt-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-4 w-100" disabled={adding || !merchantId}>
                  {adding ? 'Adding...' : 'Add Product'}
                </Button>
              </Form>
              {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddMenu;
