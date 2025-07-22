import React from 'react';


import AboutImg from '../../assets/images/AboutImg.png';
import Tom from '../../assets/images/Tom.png';
import Emma from '../../assets/images/Emma.png';
import Will from '../../assets/images/will.png';


import Services from '../../assets/images/Services.png';     
import Customer from '../../assets/images/customer.png';     
import Money from '../../assets/images/money.png';           

const About = () => {
  return (
    <div style={styles.container}>
      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>Home / <span style={{ color: '#000' }}>About</span></div>

      {/* Our Story */}
      <div style={styles.storySection}>
        <div style={styles.storyText}>
          <h2 style={styles.title}>Our Story</h2>
          <p style={styles.paragraph}>
            Launched in 2015, Exclusive is South Asia’s premier online shopping marketplace with an active presence in Bangladesh...
          </p>
          <p style={styles.paragraph}>
            Exclusive offers a diverse assortment in categories ranging from consumer...
          </p>
        </div>
        <img src={AboutImg} alt="Our Story" style={styles.storyImage} />
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        {stats.map((item, index) => (
          <div
            key={index}
            style={{
              ...styles.statBox,
              backgroundColor: item.highlight ? '#DB4444' : '#fff',
              color: item.highlight ? '#fff' : '#000',
              boxShadow: item.highlight ? '0 4px 10px rgba(0,0,0,0.1)' : 'none',
              border: item.highlight ? 'none' : '1px solid #e0e0e0',
            }}
          >
            <i className={item.icon} style={styles.statIcon}></i>
            <h3 style={styles.statNumber}>{item.number}</h3>
            <p style={styles.statLabel}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Team Members */}
      <div style={styles.teamSection}>
        <h2 style={styles.sectionTitle}>Meet Our Team</h2>
        <div style={styles.team}>
          {team.map((member, index) => (
            <div key={index} style={styles.card}>
              <img src={member.image} alt={member.name} style={styles.avatar} />
              <h4 style={styles.name}>{member.name}</h4>
              <p style={styles.role}>{member.role}</p>
              <div style={styles.social}>
                <i className="fab fa-twitter"></i>
                <i className="fab fa-instagram"></i>
                <i className="fab fa-linkedin-in"></i>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.dots}>
          {[0, 1, 2, 3, 4].map((dot, i) => (
            <span
              key={i}
              style={{
                ...styles.dot,
                backgroundColor: i === 2 ? '#DB4444' : '#ccc',
              }}
            ></span>
          ))}
        </div>
      </div>

      {/* Services – icon PNG nằm giữa trong vòng tròn xám */}
      <div style={styles.services}>
        {services.map((service, index) => (
          <div key={index} style={styles.service}>
            <div style={styles.serviceIconWrapper}>
              <img src={service.icon} alt={service.title} style={styles.serviceImageIcon} />
            </div>
            <h4 style={styles.serviceTitle}>{service.title}</h4>
            <p style={styles.serviceText}>{service.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;


const stats = [
  { number: '10.5k', label: 'Sellers active on our site', icon: 'fas fa-store' },
  { number: '33k', label: 'Monthly Product Sale', icon: 'fas fa-dollar-sign', highlight: true },
  { number: '45.5k', label: 'Customer active on our site', icon: 'fas fa-users' },
  { number: '25k', label: 'Annual gross sale on our site', icon: 'fas fa-chart-line' },
];

const team = [
  { name: 'Tom Cruise', role: 'Founder & Chairman', image: Tom },
  { name: 'Emma Watson', role: 'Managing Director', image: Emma },
  { name: 'Will Smith', role: 'Product Designer', image: Will },
];

const services = [
  {
    title: 'FREE AND FAST DELIVERY',
    text: 'Free delivery for all orders over $140',
    icon: Services,
  },
  {
    title: '24/7 CUSTOMER SERVICE',
    text: 'Friendly 24/7 customer support',
    icon: Customer,
  },
  {
    title: 'MONEY BACK GUARANTEE',
    text: 'We return money within 30 days',
    icon: Money,
  },
];


const styles = {
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', sans-serif",
  },
  breadcrumb: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
  },
  storySection: {
    display: 'flex',
    gap: 40,
    marginBottom: 80,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  storyText: {
    flex: 1,
  },
  storyImage: {
    width: '50%',
    borderRadius: 8,
    maxWidth: 500,
  },
  title: {
    fontSize: 32,
    fontWeight: 600,
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    color: '#555',
    lineHeight: 1.8,
    marginBottom: 16,
  },
  stats: {
    display: 'flex',
    gap: 20,
    marginBottom: 80,
    flexWrap: 'wrap',
  },
  statBox: {
    flex: '1 1 200px',
    padding: 25,
    borderRadius: 8,
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: 600,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
  },
  teamSection: {
    marginBottom: 60,
  },
  sectionTitle: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 600,
    marginBottom: 30,
  },
  team: {
    display: 'flex',
    gap: 30,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  card: {
    textAlign: 'center',
    width: 260,
  },
  avatar: {
    width: '100%',
    borderRadius: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  social: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    fontSize: 14,
    color: '#333',
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },
  services: {
    display: 'flex',
    gap: 40,
    justifyContent: 'center',
    paddingBottom: 60,
    flexWrap: 'wrap',
  },
  service: {
    flex: '0 0 250px',
    textAlign: 'center',
  },
  serviceIconWrapper: {
    width: 70,
    height: 70,
    borderRadius: '50%',
    backgroundColor: '#D9D9D9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  serviceImageIcon: {
    width: 32,
    height: 32,
    objectFit: 'contain',
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  serviceText: {
    fontSize: 13,
    color: '#555',
  },
};
