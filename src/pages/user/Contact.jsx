import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitContactForm, resetContactState } from "../../redux/slices/contactSlice";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Contact = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.contact);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitContactForm(formData));
  };

  useEffect(() => {
    if (success) {
      alert("Gửi liên hệ thành công!");
      setFormData({ name: "", email: "", phone: "", message: "" });
      dispatch(resetContactState());
    } else if (error) {
      alert("Gửi thất bại: " + error);
      dispatch(resetContactState());
    }
  }, [success, error, dispatch]);

  return (
    <div style={styles.container}>
      <div style={styles.breadcrumb}>
        <span style={styles.breadcrumbDim}>Home</span> / <span style={styles.breadcrumbActive}>Contact</span>
      </div>

      <div style={styles.wrapper}>
        {/* LEFT SIDE */}
        <div style={styles.left}>
          <div style={styles.infoBlock}>
            <div style={styles.iconCircle}>
              <i className="fas fa-phone-alt" style={styles.icon}></i>
            </div>
            <h3 style={styles.title}>Call To Us</h3>
            <p style={styles.text}>We are available 24/7, 7 days a week.</p>
            <p style={styles.text}>Phone: 0123456789</p>
          </div>
          <div style={styles.line} />
          <div style={styles.infoBlock}>
            <div style={styles.iconCircle}>
              <i className="fas fa-envelope" style={styles.icon}></i>
            </div>
            <h3 style={styles.title}>Write To US</h3>
            <p style={styles.text}>Fill out our form and we will contact you within 24 hours.</p>
            <p style={styles.text}>Emails: ecommerce@gmail.com</p>
            <p style={styles.text}>Emails: support@sapo.com</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <form style={styles.right} onSubmit={handleSubmit}>
          <div style={styles.row}>
            <input
              name="name"
              placeholder="Your Name *"
              style={styles.input}
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Your Email *"
              style={styles.input}
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Your Phone *"
              style={styles.input}
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <textarea
            name="message"
            placeholder="Your Message"
            style={styles.textarea}
            rows="6"
            value={formData.message}
            onChange={handleChange}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
const styles = {
  container: {
    maxWidth: 1200,
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  breadcrumb: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
  },
  breadcrumbDim: {
    color: "#888",
  },
  breadcrumbActive: {
    color: "#000",
  },
  wrapper: {
    display: "flex",
    gap: 30,
    alignItems: "flex-start",
  },
  left: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 30,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    minWidth: 300,
  },
  infoBlock: {
    marginBottom: 30,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "#fce4e4",
    color: "#db4444",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  icon: {
    fontSize: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    margin: "10px 0",
  },
  text: {
    fontSize: 14,
    color: "#555",
    lineHeight: 1.6,
  },
  line: {
    height: 1,
    backgroundColor: "#ccc",
    margin: "20px 0",
  },
  right: {
    flex: 2,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 30,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  row: {
    display: "flex",
    gap: 15,
  },
  input: {
    flex: 1,
    padding: 12,
    border: "1px solid #eee",
    borderRadius: 4,
    fontSize: 14,
    backgroundColor: "#f5f5f5",
  },
  textarea: {
    padding: 12,
    border: "1px solid #eee",
    borderRadius: 4,
    fontSize: 14,
    backgroundColor: "#f5f5f5",
    resize: "none",
  },
  button: {
    alignSelf: "flex-end",
    padding: "12px 24px",
    backgroundColor: "#db4444",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    fontSize: 14,
    cursor: "pointer",
  },
};
