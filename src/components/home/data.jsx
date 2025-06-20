import {
  MobileOutlined,
  DesktopOutlined,
  ClockCircleOutlined,
  CameraOutlined,
  AudioOutlined,
} from "@ant-design/icons";
import { FaGamepad } from "react-icons/fa";

export const categoryList = [
  "Woman's Fashion",
  "Men's Fashion",
  "Electronics",
  "Home & Lifestyle",
  "Medicine",
  "Sports & Outdoor",
  "Baby's & Toys",
  "Groceries & Pets",
  "Health & Beauty",
];

export const categories = [
  { icon: <MobileOutlined />, name: "Phones", active: false },
  { icon: <DesktopOutlined />, name: "Computers", active: false },
  { icon: <ClockCircleOutlined />, name: "SmartWatch", active: false },
  { icon: <CameraOutlined />, name: "Camera", active: true },
  { icon: <AudioOutlined />, name: "HeadPhones", active: false },
  { icon: <FaGamepad />, name: "Gaming", active: false },
];

// Banner carousel
export const bannerImages = [
  {
    src: "https://www.xtsmart.vn/vnt_upload/product/09_2023/banner_iphone_15_pro_max_1_1_2.jpg",
    title: "Up to 10% off Voucher",
    subtitle: "Special offer on iPhone 14 Series",
    buttonText: "Shop Now",
  },
  {
    src: "https://www.xtsmart.vn/vnt_upload/product/09_2023/banner_iphone_15_pro_max_1_1_2.jpg",
    title: "Enhance Your Music Experience",
    subtitle: "Special offer on JBL Speaker",
    buttonText: "Buy Now",
  },
  {
    src: "https://www.xtsmart.vn/vnt_upload/product/09_2023/banner_iphone_15_pro_max_1_1_2.jpg",
    title: "Flash Deals",
    subtitle: "Limited Time Offers",
    buttonText: "Shop Now",
  },
];

export const products = [
  {
    id: 1,
    name: "HAVIT HV-G92 Gamepad",
    originalPrice: 160,
    salePrice: 120,
    discount: 40,
    rating: 4.5,
    reviews: 88,
    image:
      "https://img.drz.lazcdn.com/static/bd/p/46e0546098c625381ae8258ff0b8f929.png_720x720q80.png",
  },
  {
    id: 2,
    name: "AK-900 Wired Keyboard",
    originalPrice: 1160,
    salePrice: 960,
    discount: 35,
    rating: 4.0,
    reviews: 75,
    image:
      "https://firsthelptech.ie/cdn/shop/files/1_78f4a339-d3c3-46e1-b6f9-42018d1a92ff.jpg?v=1723809218",
  },
  {
    id: 3,
    name: "IPS LCD Gaming Monitor",
    originalPrice: 400,
    salePrice: 370,
    discount: 30,
    rating: 4.5,
    reviews: 99,
    image:
      "https://img.drz.lazcdn.com/static/bd/p/46e0546098c625381ae8258ff0b8f929.png_720x720q80.png",
  },
  {
    id: 4,
    name: "S-Series Comfort Chair",
    originalPrice: 400,
    salePrice: 375,
    discount: 25,
    rating: 4.5,
    reviews: 99,
    image:
      "https://img.drz.lazcdn.com/static/bd/p/46e0546098c625381ae8258ff0b8f929.png_720x720q80.png",
  },
];

export const bestSellingProducts = [
  {
    id: 1,
    name: "The north coat",
    salePrice: 260,
    originalPrice: 360,
    discount: 28,
    rating: 5,
    reviews: 65,
    image:
      "https://daiphattoy.vn/upload/sanpham/large/xe-dia-hinh-dieu-khien-tu-xa-toc-do-cao-044-1636612914-ad2299.jpg",
  },
  {
    id: 2,
    name: "Gucci duffle bag",
    salePrice: 960,
    originalPrice: 1160,
    discount: 17,
    rating: 4.5,
    reviews: 65,
    image:
      "https://daiphattoy.vn/upload/sanpham/large/xe-dia-hinh-dieu-khien-tu-xa-toc-do-cao-044-1636612914-ad2299.jpg",
  },
  {
    id: 3,
    name: "RGB liquid CPU Cooler",
    salePrice: 160,
    originalPrice: 170,
    discount: 6,
    rating: 4.5,
    reviews: 65,
    image:
      "https://daiphattoy.vn/upload/sanpham/large/xe-dia-hinh-dieu-khien-tu-xa-toc-do-cao-044-1636612914-ad2299.jpg",
  },
  {
    id: 4,
    name: "Small BookShelf",
    salePrice: 360,
    originalPrice: 400,
    discount: 10,
    rating: 5,
    reviews: 65,
    image:
      "https://daiphattoy.vn/upload/sanpham/large/xe-dia-hinh-dieu-khien-tu-xa-toc-do-cao-044-1636612914-ad2299.jpg",
  },
];

export const allProducts = [
  {
    id: 5,
    name: "Breed Dry Dog Food",
    price: 100,
    rating: 3,
    reviews: 35,
    image:
      "https://daiphattoy.vn/upload/sanpham/large/xe-dia-hinh-dieu-khien-tu-xa-toc-do-cao-044-1636612914-ad2299.jpg",
    emoji: "🐕",
    bgColor: "#8b5cf6",
  },
  {
    id: 6,
    name: "CANON EOS DSLR Camera",
    price: 360,
    rating: 4,
    reviews: 95,
    image:
      "https://daiphattoy.vn/upload/sanpham/large/xe-dia-hinh-dieu-khien-tu-xa-toc-do-cao-044-1636612914-ad2299.jpg",
    emoji: "📷",
    bgColor: "#374151",
    hasAddToCart: true,
  },
  {
    id: 7,
    name: "ASUS FHD Gaming Laptop",
    price: 700,
    rating: 5,
    reviews: 325,
    image:
      "https://daiphattoy.vn/upload/sanpham/large/xe-dia-hinh-dieu-khien-tu-xa-toc-do-cao-044-1636612914-ad2299.jpg",
    emoji: "💻",
    bgColor: "#1f2937",
  },
  {
    id: 8,
    name: "Curology Product Set",
    price: 500,
    rating: 4,
    reviews: 145,
    image:
      "https://daiphattoy.vn/upload/sanpham/large/xe-dia-hinh-dieu-khien-tu-xa-toc-do-cao-044-1636612914-ad2299.jpg",
    emoji: "🧴",
    bgColor: "#d97706",
  },
  {
    id: 9,
    name: "Kids Electric Car",
    price: 960,
    rating: 5,
    reviews: 65,
    image:
      "https://daiphattoy.vn/upload/sanpham/large/xe-dia-hinh-dieu-khien-tu-xa-toc-do-cao-044-1636612914-ad2299.jpg",
    isNew: true,
    colors: ["#ef4444", "#1f2937"],
    emoji: "🚗",
    bgColor: "#ef4444",
  },
  {
    id: 10,
    name: "Jr. Zoom Soccer Cleats",
    price: 1160,
    rating: 5,
    reviews: 35,
    image:
      "https://daiphattoy.vn/upload/sanpham/large/xe-dia-hinh-dieu-khien-tu-xa-toc-do-cao-044-1636612914-ad2299.jpg",
    colors: ["#eab308", "#1f2937"],
    emoji: "👟",
    bgColor: "#eab308",
  },
  {
    id: 11,
    name: "GP11 Shooter USB Gamepad",
    price: 660,
    rating: 4.5,
    reviews: 55,
    image:
      "https://daiphattoy.vn/upload/sanpham/large/xe-dia-hinh-dieu-khien-tu-xa-toc-do-cao-044-1636612914-ad2299.jpg",
    isNew: true,
    colors: ["#1f2937", "#ef4444"],
    emoji: "🎮",
    bgColor: "#1f2937",
  },
  {
    id: 12,
    name: "Quilted Satin Jacket",
    price: 660,
    rating: 4.5,
    reviews: 55,
    image:
      "https://daiphattoy.vn/upload/sanpham/large/xe-dia-hinh-dieu-khien-tu-xa-toc-do-cao-044-1636612914-ad2299.jpg",
    colors: ["#065f46", "#f97316"],
    emoji: "🧥",
    bgColor: "#065f46",
  },
];

export const productCards = [
  {
    id: 1,
    title: "PlayStation 5",
    subtitle: "Black and White version of the PS5 coming out on sale.",
    buttonText: "Shop Now",
    image: "https://picsum.photos/800/600",
  },
  {
    id: 2,
    title: "Women's Collections",
    subtitle: "Featured woman collections that give you another vibe.",
    buttonText: "Shop Now",
    image: "https://picsum.photos/600/338",
  },
  {
    id: 3,
    title: "Speakers",
    subtitle: "Amazon wireless speakers",
    buttonText: "Shop Now",
    image: "https://picsum.photos/300/300",
  },
  {
    id: 4,
    title: "Perfume",
    subtitle: "GUCCI INTENSE OUD EDP",
    buttonText: "Shop Now",
    image: "https://picsum.photos/300/400",
  },
];
