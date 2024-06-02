// frontend/src/components/AboutPage.js
import React from 'react';
import './AboutPage.css';  // Import a CSS file for styling

const AboutPage = () => {
  return (
    <div className="container mt-5">
      <h1>About Us</h1>
      <section className="company-mission">
        <h2>Our Mission</h2>
        <p>
          At PetPooja, our mission is to deliver delicious, high-quality meals from the best local restaurants straight to your door. We strive to provide a convenient, reliable, and enjoyable food delivery experience for our customers.
        </p>
      </section>
      <section className="services">
        <h2>What We Offer</h2>
        <ul>
          <li>Wide variety of cuisines and dishes to choose from</li>
          <li>Fast and reliable delivery service</li>
          <li>Easy-to-use mobile app</li>
          <li>Exclusive deals and discounts</li>
          <li>24/7 customer support</li>
        </ul>
      </section>
      <section className="values">
        <h2>Our Values</h2>
        <p>
          We believe in delivering excellence in every meal, ensuring customer satisfaction, and supporting our local restaurant partners. Our core values include:
        </p>
        <ul>
          <li>Quality: Providing the best food and service</li>
          <li>Integrity: Operating with honesty and transparency</li>
          <li>Innovation: Continuously improving our services</li>
          <li>Community: Supporting local businesses and communities</li>
        </ul>
      </section>
      <section className="team">
        <h2>Meet Our Team</h2>
        <p>
          Our dedicated team is passionate about food and committed to delivering the best dining experience to our customers. From our delivery drivers to our customer service representatives, everyone plays a vital role in making PetPooja a trusted name in food delivery.
        </p>
      </section>
      
    </div>
  );
};

export default AboutPage;

