import React from "react";
import { FaTrashAlt, FaEye, FaStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

import Bag from '../../assets/images/Bag.png';
import CPU from '../../assets/images/CPU.png';
import Gamepad from '../../assets/images/Gamepad.png';
import Jacket from '../../assets/images/Jacket.png';
import Keyboard from '../../assets/images/Keyboard.png';
import Laptop from '../../assets/images/Laptop.png';
import LCD from '../../assets/images/LCD.png';

const wishlistItems = [
  { id: 1, name: "Gucci duffle bag", price: 960, originalPrice: 1160, discount: "-35%", image: Bag },
  { id: 2, name: "RGB liquid CPU Cooler", price: 1960, image: CPU },
  { id: 3, name: "GP11 Shooter USB Gamepad", price: 550, image: Gamepad },
  { id: 4, name: "Quilted Satin Jacket", price: 750, image: Jacket },
];

const suggestions = [
  { id: 5, name: "ASUS FHD Gaming Laptop", price: 960, originalPrice: 1160, discount: "-35%", image: Laptop },
  { id: 6, name: "IPS LCD Gaming Monitor", price: 1160, image: LCD },
  { id: 7, name: "HAVIT HV-G92 Gamepad", price: 560, image: Gamepad, tag: "NEW" },
  { id: 8, name: "AK-900 Wired Keyboard", price: 200, image: Keyboard },
];

const WishList = () => {
  return (
    <div style={styles.container}>
      {/* Wishlist Header */}
      <div style={styles.sectionHeader}>
        <h3 style={styles.title}>Wishlist ({wishlistItems.length})</h3>
        <button style={styles.outlineBtn}>Move All To Bag</button>
      </div>

      {/* Wishlist Items */}
      <div style={styles.grid}>
        {wishlistItems.map(item => (
          <div
            key={item.id}
            style={{ ...styles.card, ...styles.cardHover }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            {item.discount && <div style={styles.discount}>{item.discount}</div>}
            <button
              style={styles.icon}
              onMouseEnter={e => e.currentTarget.style.color = "#DB4444"}
              onMouseLeave={e => e.currentTarget.style.color = "#000"}
            >
              <FaTrashAlt />
            </button>
            <img src={item.image} alt={item.name} style={styles.image} />
            <button
              style={styles.cartBtn}
              onMouseEnter={e => e.currentTarget.style.background = "#333"}
              onMouseLeave={e => e.currentTarget.style.background = "#000"}
            >
              <FiShoppingCart /> Add To Cart
            </button>
            <p style={styles.name}>{item.name}</p>
            <p style={styles.price}>
              ${item.price}
              {item.originalPrice && <span style={styles.oldPrice}>${item.originalPrice}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Just For You */}
      <div style={{ ...styles.sectionHeader, marginTop: 40 }}>
        <div style={styles.redLine}></div>
        <h4 style={styles.subTitle}>Just For You</h4>
        <button style={styles.outlineBtn}>See All</button>
      </div>

      <div style={styles.grid}>
        {suggestions.map(item => (
          <div
            key={item.id}
            style={{ ...styles.card, ...styles.cardHover }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            {item.discount && <div style={styles.discount}>{item.discount}</div>}
            {item.tag && <div style={styles.newTag}>{item.tag}</div>}
            <button
              style={styles.icon}
              onMouseEnter={e => e.currentTarget.style.color = "#DB4444"}
              onMouseLeave={e => e.currentTarget.style.color = "#000"}
            >
              <FaEye />
            </button>
            <img src={item.image} alt={item.name} style={styles.image} />
            <button
              style={styles.cartBtn}
              onMouseEnter={e => e.currentTarget.style.background = "#333"}
              onMouseLeave={e => e.currentTarget.style.background = "#000"}
            >
              <FiShoppingCart /> Add To Cart
            </button>
            <p style={styles.name}>{item.name}</p>
            <p style={styles.price}>
              ${item.price}
              {item.originalPrice && <span style={styles.oldPrice}>${item.originalPrice}</span>}
            </p>
            <div style={styles.rating}>
              {[...Array(5)].map((_, i) => <FaStar key={i} color="#FFAD33" size={14} />)}
              <span style={styles.review}>(65)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishList;

// Inline Styles
const styles = {
  container: {
    padding: "40px 10%",
    fontFamily: "'Segoe UI', sans-serif",
    background: "#fff",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { fontSize: 16 },
  outlineBtn: {
    padding: "8px 16px",
    border: "1px solid #000",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },
  redLine: {
    width: 6,
    height: 20,
    background: "#DB4444",
    borderRadius: 2,
  },
  subTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 500,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 30,
    marginBottom: 40,
  },
  card: {
    position: "relative",
    background: "#f4f4f4",
    padding: "10px",
    textAlign: "center",
    transition: "all 0.3s ease",
  },
  cardHover: {
    transform: "translateY(0)",
  },
  discount: {
    position: "absolute",
    top: 10,
    left: 10,
    background: "#DB4444",
    color: "#fff",
    fontSize: 12,
    padding: "2px 6px",
    borderRadius: 4,
  },
  newTag: {
    position: "absolute",
    top: 10,
    left: 10,
    background: "#00FF66",
    color: "#fff",
    fontSize: 12,
    padding: "2px 6px",
    borderRadius: 4,
  },
  icon: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    color: "#000",
  },
  image: {
    width: "100%",
    height: "auto",
    marginBottom: 10,
  },
  cartBtn: {
    width: "100%",
    background: "#000",
    color: "#fff",
    padding: "8px",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    marginBottom: 10,
    transition: "background 0.3s ease",
  },
  name: {
    fontSize: 14,
    fontWeight: 500,
    margin: "8px 0 4px",
  },
  price: {
    fontSize: 14,
    color: "#DB4444",
  },
  oldPrice: {
    marginLeft: 8,
    textDecoration: "line-through",
    color: "#888",
    fontSize: 13,
  },
  rating: {
    marginTop: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  review: {
    marginLeft: 6,
    fontSize: 12,
    color: "#333",
  },
};
