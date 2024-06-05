import React from 'react';
import './Assests/Css/About.css';
import mission from './Assests/Images/mission.png';
import vission from './Assests/Images/vission.png';
import Karan from './Assests/Images/karan1.jpg';
import satvir from './Assests/Images/satvir.jpg';



const AboutPage = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5 head">About Us</h1>
      
      <section className="company-mission mb-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <img src={mission} alt="Our Mission" className="img-fluid side mb-3"/>
          </div>
          <div className="col-md-6">
            <h2 className="mb-3">Our Mission</h2>
            <p>
              At PetPooja, our mission is to deliver delicious, high-quality meals from the best local restaurants straight to your door. We strive to provide a convenient, reliable, and enjoyable food delivery experience for our customers.
            </p>
          </div>
        </div>
      </section>
      
      <section className="services mb-5">
        <div className="row align-items-center">
          <div className="col-md-6 order-md-2">
            <img src={vission} alt="Our Services" className="img-fluid side mb-3"/>
          </div>
          <div className="col-md-6 order-md-1">
            <h2 className="mb-3">What We Offer</h2>
            <ul className="list-group">
              <li className="list-group-item">Wide variety of cuisines and dishes to choose from</li>
              <li className="list-group-item">Fast and reliable delivery service</li>
              <li className="list-group-item">Easy-to-use mobile app</li>
              <li className="list-group-item">Exclusive deals and discounts</li>
              <li className="list-group-item">24/7 customer support</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="values mb-5">
        <h2 className="text-center mb-3">Our Values</h2>
        <p className="text-center mb-4">
          We believe in delivering excellence in every meal, ensuring customer satisfaction, and supporting our local restaurant partners. Our core values include:
        </p>
        <div className="row justify-content-center">
          <div className="col-md-3 col-sm-6">
            <div className="card value-card text-center">
              <i className="fas fa-utensils value-icon"></i>
              <div className="card-body">
                <p className="card-text">Quality: Providing the best food and service</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="card value-card text-center">
              <i className="fas fa-handshake value-icon"></i>
              <div className="card-body">
                <p className="card-text">Integrity: Operating with honesty and transparency</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="card value-card text-center">
              <i className="fas fa-lightbulb value-icon"></i>
              <div className="card-body">
                <p className="card-text">Innovation: Continuously improving our services</p>
              </div>
            </div>
          </div>
          <div className="card-val col-md-3 col-sm-6">
            <div className="card value-card text-center">
              <i className="fas fa-users value-icon"></i>
              <div className="card-body">
                <p className="card-text">Community: Supporting local businesses and communities</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="team mb-5">
        <h2 className="text-center mb-3">Meet Our Team</h2>
        <div className="row justify-content-center">
          <div className="col-md-3 col-sm-4 mb-4">
            <div className="card team-card p-4">
              <img src="" className="card-img-top rounded-circle" alt="Team Member 1"/>
              <div className="card-body">
                <h5 className="card-title">Harkishan Patel</h5>
                <p className="card-text">Developer</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-4 mb-4">
            <div className="card team-card p-4">
              <img src={Karan} className="card-img-top rounded-circle" alt="Team Member 2"/>
              <div className="card-body">
                <h5 className="card-title">Karan Gandhi</h5>
                <p className="card-text">Developer</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-4 mb-4">
            <div className="card team-card p-4">
              <img src={satvir} className="card-img-top rounded-circle" alt="Team Member 3"/>
              <div className="card-body">
                <h5 className="card-title">Satvir Singh</h5>
                <p className="card-text">Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
