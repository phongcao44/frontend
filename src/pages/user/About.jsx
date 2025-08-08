
import AboutImg from '../../assets/images/AboutImg.png';
import Tom from '../../assets/images/Tom.png';
import Emma from '../../assets/images/Emma.png';
import Will from '../../assets/images/will.png';
import Services from '../../assets/images/Services.png';
import Customer from '../../assets/images/customer.png';
import Money from '../../assets/images/money.png';
import React, { useState, useEffect } from 'react';

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const membersPerPage = 3;
  const totalSlides = Math.ceil(team.length / membersPerPage);
  const startIndex = currentSlide * membersPerPage;
  const visibleMembers = team.slice(startIndex, startIndex + membersPerPage);

  useEffect(() => {
    // Inject Fchat script
    const script = document.createElement("script");
    script.src = "https://cdn.fchat.vn/assets/embed/webchat.js?id=686dc526b7fbfe64fd0f1c82";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup khi component unmount
    };
  }, []);


  useEffect(() => {
    // Định nghĩa window.fbMessengerPlugins nếu chưa có
    window.fbMessengerPlugins = window.fbMessengerPlugins || {
      init: function () {
        FB.init({
          appId: "1784956665094089",
          xfbml: true,
          version: "v3.0",
        });
      },
      callable: [],
    };

    window.fbAsyncInit = window.fbAsyncInit || function () {
      window.fbMessengerPlugins.callable.forEach(function (item) {
        item();
      });
      window.fbMessengerPlugins.init();
    };

    // Thêm script Facebook SDK động
    if (!document.getElementById("facebook-jssdk")) {
      const js = document.createElement("script");
      js.id = "facebook-jssdk";
      js.src = "//connect.facebook.net/vi_VN/sdk.js";
      document.body.appendChild(js);
    }
  }, []);


  return (
    <div style={styles.container}>
      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>Home / <span style={{ color: '#000' }}>About</span></div>

      {/* Our Story */}
      <div style={styles.storySection}>
        <div style={styles.storyText}>
          <h2 style={styles.title}>Our Story</h2>
          <p style={styles.paragraph}>
            Founded in 2015, Exclusive Marketplace has rapidly grown to become one of South Asia’s largest and most trusted online shopping destinations. We connect millions of buyers and sellers across Bangladesh and beyond, empowering local businesses and delivering quality products right to your doorstep.
          </p>
          <p style={styles.paragraph}>
            With a commitment to innovation and customer satisfaction, our platform offers a seamless shopping experience featuring a wide range of categories from electronics, fashion, home essentials to groceries and more. We believe in making online shopping easy, affordable, and accessible to everyone.
          </p>
          <p style={styles.paragraph}>
            Our mission is to support entrepreneurs, foster community growth, and provide customers with unbeatable deals, fast delivery, and exceptional service — every day.
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
          {visibleMembers.map((member, index) => (
            <div key={index} style={styles.card}>
              <img src={member.image} alt={member.name} style={styles.avatar} />
              <h4 style={styles.name}>{member.name}</h4>
              <p style={styles.role}>{member.role}</p>
              <div style={styles.social}>
                <a href={member.twitter} target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                <a href={member.instagram} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.dots}>
          {[...Array(totalSlides)].map((_, i) => (
            <span
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                ...styles.dot,
                backgroundColor: i === currentSlide ? '#DB4444' : '#ccc',
                cursor: 'pointer',
              }}
            ></span>
          ))}
        </div>
      </div>

      {/* Services */}
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

      {/* Thêm phần Social Media ở cuối trang */}
      <div style={styles.socialFollowSection}>
        <h3 style={styles.socialFollowTitle}>Follow Us On Social Media</h3>
        <div style={styles.socialIcons}>
          <a href="https://www.facebook.com/ecommerce122" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
            <i className="fab fa-facebook-f" style={{ fontSize: 28, color: '#1877F2' }}></i>
          </a>
          {/* Bạn có thể thêm các icon khác nếu muốn */}
        </div>
      </div>
      <div
        className="fb-customerchat"
        attribution="biz_inbox"
        page_id="697490283449445"
        theme_color="#DB4444"
        logged_in_greeting="Xin chào! Bạn cần hỗ trợ gì không?"
        logged_out_greeting="Vui lòng đăng nhập Facebook để chat với chúng tôi."
      ></div>
      <script type="text/javascript" src="https://cdn.fchat.vn/assets/embed/webchat.js?id=686dc526b7fbfe64fd0f1c82" async="async"></script>
    </div>
  );
};

export default About;

const stats = [
  { number: '15K+', label: 'Active Sellers', icon: 'fas fa-store' },
  { number: '1.2M+', label: 'Monthly Orders', icon: 'fas fa-shopping-cart' },
  { number: '2M+', label: 'Registered Customers', icon: 'fas fa-users' },
  { number: '$120M+', label: 'Annual Gross Merchandise Value', icon: 'fas fa-dollar-sign' },
];

const team = [
  {
    name: 'Nguyễn Minh Dương',
    role: 'Founder & Chairman',
    image: Tom,
    twitter: 'https://twitter.com/tomcruise',
    instagram: 'https://instagram.com/tomcruise',
    linkedin: 'https://linkedin.com/in/tomcruise',
  },
  {
    name: 'Nguyễn Văn Luận',
    role: 'Manager',
    image: Emma,
    twitter: 'https://twitter.com/emmawatson',
    instagram: 'https://instagram.com/emmawatson',
    linkedin: 'https://linkedin.com/in/emmawatson',
  },
  {
    name: 'Nguyễn Văn Cao',
    role: 'Manager',
    image: Will,
    twitter: 'https://twitter.com/willsmith',
    instagram: 'https://instagram.com/willsmith',
    linkedin: 'https://linkedin.com/in/willsmith',
  },
  {
    name: 'Huỳnh Gia Phúc',
    role: 'developer',
    image: Will,
    twitter: 'https://twitter.com/willsmith',
    instagram: 'https://instagram.com/willsmith',
    linkedin: 'https://linkedin.com/in/willsmith',
  },
  {
    name: 'Nguyễn Minh Nhật',
    role: 'developer',
    image: Will,
    twitter: 'https://twitter.com/willsmith',
    instagram: 'https://instagram.com/willsmith',
    linkedin: 'https://linkedin.com/in/willsmith',
  },
  {
    name: 'Cao Tấn Phong',
    role: 'developer',
    image: Will,
    twitter: 'https://twitter.com/willsmith',
    instagram: 'https://instagram.com/willsmith',
    linkedin: 'https://linkedin.com/in/willsmith',
  },
  {
    name: 'Trần Phát Tài',
    role: 'developer',
    image: Will,
    twitter: 'https://twitter.com/willsmith',
    instagram: 'https://instagram.com/willsmith',
    linkedin: 'https://linkedin.com/in/willsmith',
  },
  {
    name: 'Nguyễn Quốc Đại',
    role: 'developer',
    image: Will,
    twitter: 'https://twitter.com/willsmith',
    instagram: 'https://instagram.com/willsmith',
    linkedin: 'https://linkedin.com/in/willsmith',
  },
];

const services = [
  {
    title: 'FAST & FREE DELIVERY',
    text: 'Enjoy free delivery on orders above $140 with quick processing.',
    icon: Services,
  },
  {
    title: '24/7 CUSTOMER SUPPORT',
    text: 'Our dedicated support team is here to assist you anytime.',
    icon: Customer,
  },
  {
    title: 'MONEY BACK GUARANTEE',
    text: 'Not satisfied? Get a full refund within 30 days of purchase.',
    icon: Money,
  },
];

const styles = {
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
    objectFit: 'cover',
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 20,
    color: '#222',
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
    padding: 30,
    borderRadius: 10,
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'default',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 12,
    color: '#DB4444',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 15,
    color: '#666',
  },
  teamSection: {
    marginBottom: 60,
  },
  sectionTitle: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 700,
    marginBottom: 30,
    color: '#222',
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
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#fff',
    transition: 'transform 0.3s ease',
  },
  avatar: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 14,
    objectFit: 'cover',
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 6,
    color: '#333',
  },
  role: {
    fontSize: 14,
    color: '#777',
    marginBottom: 12,
  },
  social: {
    display: 'flex',
    justifyContent: 'center',
    gap: 18,
    fontSize: 18,
    color: '#DB4444',
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    marginTop: 24,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    cursor: 'pointer',
  },
  services: {
    display: 'flex',
    gap: 40,
    justifyContent: 'center',
    paddingBottom: 60,
    flexWrap: 'wrap',
  },
  service: {
    flex: '0 0 260px',
    textAlign: 'center',
    padding: 10,
  },
  serviceIconWrapper: {
    width: 75,
    height: 75,
    borderRadius: '50%',
    backgroundColor: '#D9D9D9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 18px',
  },
  serviceImageIcon: {
    width: 36,
    height: 36,
    objectFit: 'contain',
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 6,
    textTransform: 'uppercase',
    color: '#222',
  },
  serviceText: {
    fontSize: 14,
    color: '#555',
  },

};
