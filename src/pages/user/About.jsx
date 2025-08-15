import AboutImg from '../../assets/images/AboutImg.png';
import Tom from '../../assets/images/Tom.png';
import Emma from '../../assets/images/Emma.png';
import Will from '../../assets/images/will.png';
import Services from '../../assets/images/Services.png';
import Customer from '../../assets/images/customer.png';
import Money from '../../assets/images/money.png';
import { useState } from 'react';

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const membersPerPage = 3;
  const totalSlides = Math.ceil(team.length / membersPerPage);
  const startIndex = currentSlide * membersPerPage;
  const visibleMembers = team.slice(startIndex, startIndex + membersPerPage);

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

      {/* Payment Methods + Social inline */}
      <div style={styles.bottomRow}>
        {/* Social (left) */}
        <div style={styles.socialFollowSection}>
          <h3 style={styles.socialFollowTitle}>Follow Us On Social Media</h3>
          <div style={styles.socialIcons}>
            <a href="https://www.facebook.com/ecommerce122" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
              <i className="fab fa-facebook-f" style={{ fontSize: 28, color: '#1877F2' }}></i>
            </a>
          </div>
        </div>

        {/* Payment (right) */}
        <div style={styles.paymentInline}>
          <h3 style={styles.paymentTitle}>Phương thức thanh toán</h3>
          <div style={styles.paymentLogoRow}>
            {/* VNPay Logo */}
            <img
              src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png"
              alt="VNPay"
              title="VNPay"
              style={styles.paymentLogoImg}
            />
            {/* COD Chip */}
            <div style={styles.paymentChip} title="Thanh toán khi nhận hàng">
              <span style={styles.paymentChipText}>COD</span>
            </div>
            {/* MoMo Logo */}
            <img
              src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
              alt="MoMo"
              title="MoMo"
              style={styles.paymentLogoImg}
            />
          </div>
        </div>
      </div>
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
    role: 'Developer',
    image: Will,
    twitter: 'https://twitter.com/willsmith',
    instagram: 'https://instagram.com/willsmith',
    linkedin: 'https://linkedin.com/in/willsmith',
  },
  {
    name: 'Lê Minh Nhựt',
    role: 'Developer',
    image: Will,
    twitter: 'https://twitter.com/willsmith',
    instagram: 'https://instagram.com/willsmith',
    linkedin: 'https://linkedin.com/in/willsmith',
  },
  {
    name: 'Cao Tấn Phong',
    role: 'Developer',
    image: Will,
    twitter: 'https://twitter.com/willsmith',
    instagram: 'https://instagram.com/willsmith',
    linkedin: 'https://linkedin.com/in/willsmith',
  },
  {
    name: 'Trần Phát Tài',
    role: 'Developer',
    image: Will,
    twitter: 'https://twitter.com/willsmith',
    instagram: 'https://instagram.com/willsmith',
    linkedin: 'https://linkedin.com/in/willsmith',
  },
  {
    name: 'Nguyễn Quốc Đại',
    role: 'Developer',
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
  paymentSection: {
    marginTop: 20,
    marginBottom: 60,
    padding: '24px 16px',
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
  },
  paymentTitle: {
    fontSize: 22,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 16,
    color: '#222',
  },
  paymentIcons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 16,
    alignItems: 'center',
  },
  paymentIconItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  paymentIconCircle: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  },
  paymentIconText: {
    fontSize: 14,
    color: '#444',
  },
  bottomRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 24,
    alignItems: 'stretch',
    marginTop: 20,
    marginBottom: 40,
  },
  paymentInline: {
    background: '#fff',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 140,
  },
  paymentInlineIcons: {
    display: 'flex',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentLogoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    flexWrap: 'wrap',
  },
  paymentLogoImg: {
    height: 28,
    width: 'auto',
    objectFit: 'contain',
    filter: 'none',
  },
  paymentChip: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#10b981',
    borderRadius: 9999,
    padding: '6px 12px',
    minWidth: 56,
    height: 28,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  paymentChipText: {
    color: '#fff',
    fontWeight: 700,
    letterSpacing: 1,
    fontSize: 14,
  },
  socialFollowSection: {
    background: '#fff',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 140,
  },
  socialFollowTitle: {
    fontSize: 22,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 12,
    color: '#222',
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
  },
  socialLink: {
    display: 'inline-flex',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: '#f3f4f6',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
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