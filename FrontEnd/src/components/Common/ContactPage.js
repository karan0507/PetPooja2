import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import '../Assests/Css/ContactPage.css';  

const SUBMIT_CONTACT_FORM = gql`
  mutation SubmitContactForm($name: String!, $email: String!, $subject: String!, $message: String!) {
    submitContactForm(name: $name, email: $email, subject: $subject, message: $message) {
      id
      name
      email
      subject
      message
      createdAt
    }
  }
`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitContactForm, { data, loading, error }] = useMutation(SUBMIT_CONTACT_FORM);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.email) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Email is invalid";
    }
    if (!formData.subject) formErrors.subject = "Subject is required";
    if (!formData.message) formErrors.message = "Message is required";
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      try {
        await submitContactForm({ variables: { ...formData } });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setErrors({});
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({ message: 'Error submitting form. Please try again later.' });
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="contact-container">
      <h1 className='head'>Contact Us</h1>
      <section className="contact-form">
        <h2>Contact Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />
            {errors.subject && <span className="error">{errors.subject}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            {errors.message && <span className="error">{errors.message}</span>}
          </div>
          <div className="button-container">
            <button type="submit" className="btn subm" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
          {data && <p className="success-message">Message submitted successfully!</p>}
          {error && <p className="error-message">{errors.message}</p>}
        </form>
      </section>
      <section className="contact-info">
        <div className="info">
          <h3 className='text-center bolder infoh3' style={{color:'#ff8d33'}}>Contact Info</h3>
          <p>
            We'd love to hear from you! Whether you have questions, feedback, or need assistance, feel free to reach out to us.
          </p>
          <ul>
            <li>Email: support@petpooja.com</li>
            <li>Phone: (123) 456-7890</li>
            <li>Address: 108 University Ave, Waterloo, ON N2J 2W2</li>
          </ul>
        </div>
        <div className="map">
          <iframe
            title='address'
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11580.395921845182!2d-80.5180089!3d43.4794047!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882bf31d0cec9491%3A0x8bf5f60c306d2207!2sConestoga%20College%20Waterloo%20Campus!5e0!3m2!1sen!2sca!4v1718124419728!5m2!1sen!2sca"
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
