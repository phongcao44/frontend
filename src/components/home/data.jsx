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
    src: "https://picsum.photos/800/600",
    title: "Flash Deals",
    subtitle: "Limited Time Offers",
    buttonText: "Shop Now",
  },
  {
    src: "https://picsum.photos/800/600",
    title: "Flash Deals",
    subtitle: "Limited Time Offers",
    buttonText: "Shop Now",
  },
];

// New Arrival Products
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

// Flash Sale Products
export const flashSaleProducts = [
  {
    id: "1",
    name: "HAVIT HV-G92 Gamepad",
    description:
      "Ergonomic gamepad compatible with multiple platforms, offering immersive haptic feedback.",
    price: 120,
    brand: "HAVIT",
    category_id: "gaming-1",
    status: "ACTIVE",
    variants: [
      {
        id: "var-1",
        color: { id: "c1", name: "Black", hex_code: "#000000" },
        size: { id: "s1", name: "Standard", description: "Universal fit" },
        stock_quantity: 50,
        price_override: null,
      },
    ],
    images: [
      {
        id: "img1",
        image_url:
          "https://img.drz.lazcdn.com/static/bd/p/46e0546098c625381ae8258ff0b8f929.png_720x720q80.png",
        is_main: true,
        variant_id: null,
      },
    ],
    reviews: [],
    averageRating: 4.5,
    totalReviews: 88,
    originalPrice: 160,
    discount: 40,
  },
  {
    id: "2",
    name: "AK-900 Wired Keyboard",
    description:
      "RGB mechanical keyboard with ergonomic design and customizable macros.",
    price: 960,
    brand: "AK",
    category_id: "gaming-2",
    status: "ACTIVE",
    variants: [
      {
        id: "var-2",
        color: { id: "c2", name: "Black", hex_code: "#000000" },
        size: { id: "s2", name: "Full Size", description: "104 keys" },
        stock_quantity: 30,
        price_override: null,
      },
    ],
    images: [
      {
        id: "img2",
        image_url:
          "https://firsthelptech.ie/cdn/shop/files/1_78f4a339-d3c3-46e1-b6f9-42018d1a92ff.jpg?v=1723809218",
        is_main: true,
        variant_id: null,
      },
    ],
    reviews: [],
    averageRating: 4.0,
    totalReviews: 75,
    originalPrice: 1160,
    discount: 35,
  },
  {
    id: "3",
    name: "IPS LCD Gaming Monitor",
    description:
      "27-inch FHD monitor with 144Hz refresh rate and low latency for smooth gameplay.",
    price: 370,
    brand: "IPS",
    category_id: "display-1",
    status: "ACTIVE",
    variants: [
      {
        id: "var-3",
        color: { id: "c3", name: "Black", hex_code: "#000000" },
        size: { id: "s3", name: "27 inch", description: "Large screen" },
        stock_quantity: 15,
        price_override: null,
      },
    ],
    images: [
      {
        id: "img3",
        image_url:
          "https://img.drz.lazcdn.com/static/bd/p/46e0546098c625381ae8258ff0b8f929.png_720x720q80.png",
        is_main: true,
        variant_id: null,
      },
    ],
    reviews: [],
    averageRating: 4.5,
    totalReviews: 99,
    originalPrice: 400,
    discount: 30,
  },
  {
    id: "4",
    name: "S-Series Comfort Chair",
    description:
      "Ergonomic office and gaming chair with adjustable lumbar support and smooth caster wheels.",
    price: 375,
    brand: "S-Series",
    category_id: "furniture-1",
    status: "ACTIVE",
    variants: [
      {
        id: "var-4",
        color: { id: "c4", name: "Black", hex_code: "#000000" },
        size: {
          id: "s4",
          name: "Standard",
          description: "Standard size with adjustable height",
        },
        stock_quantity: 10,
        price_override: null,
      },
    ],
    images: [
      {
        id: "img4",
        image_url:
          "https://img.drz.lazcdn.com/static/bd/p/46e0546098c625381ae8258ff0b8f929.png_720x720q80.png",
        is_main: true,
        variant_id: null,
      },
    ],
    reviews: [],
    averageRating: 4.5,
    totalReviews: 99,
    originalPrice: 400,
    discount: 25,
  },
];

// Best Selling Products (standardized)
export const bestSellingProducts = [
  {
    id: "5",
    name: "The North Coat",
    description:
      "Stylish winter coat made with durable material and modern fit design.",
    price: 260,
    brand: "The North",
    category_id: "fashion-1",
    status: "ACTIVE",
    variants: [
      {
        id: "var-5",
        color: { id: "c5", name: "Gray", hex_code: "#6B7280" },
        size: { id: "s5", name: "M", description: "Medium size" },
        stock_quantity: 20,
        price_override: null,
      },
    ],
    images: [
      {
        id: "img5",
        image_url:
          "https://daiphattoy.vn/upload/sanpham/large/xe-dia-hinh-dieu-khien-tu-xa-toc-do-cao-044-1636612914-ad2299.jpg",
        is_main: true,
        variant_id: null,
      },
    ],
    reviews: [],
    averageRating: 5.0,
    totalReviews: 65,
    originalPrice: 360,
    discount: 28,
  },
  {
    id: "6",
    name: "Gucci Duffle Bag",
    description:
      "Luxury leather duffle bag with spacious compartments and elegant finish.",
    price: 960,
    brand: "Gucci",
    category_id: "fashion-2",
    status: "ACTIVE",
    variants: [
      {
        id: "var-6",
        color: { id: "c6", name: "Brown", hex_code: "#A16207" },
        size: { id: "s6", name: "Standard", description: "Standard size" },
        stock_quantity: 10,
        price_override: null,
      },
    ],
    images: [
      {
        id: "img6",
        image_url:
          "https://daiphattoy.vn/upload/sanpham/large/xe-dia-hinh-dieu-khien-tu-xa-toc-do-cao-044-1636612914-ad2299.jpg",
        is_main: true,
        variant_id: null,
      },
    ],
    reviews: [],
    averageRating: 4.5,
    totalReviews: 65,
    originalPrice: 1160,
    discount: 17,
  },
  {
    id: "7",
    name: "RGB Liquid CPU Cooler",
    description:
      "High-performance RGB cooling system for gaming CPUs, supports overclocking.",
    price: 160,
    brand: "CoolerMaster",
    category_id: "hardware-1",
    status: "ACTIVE",
    variants: [
      {
        id: "var-7",
        color: { id: "c7", name: "Black", hex_code: "#000000" },
        size: { id: "s7", name: "240mm", description: "240mm radiator" },
        stock_quantity: 15,
        price_override: null,
      },
    ],
    images: [
      {
        id: "img7",
        image_url:
          "https://daiphattoy.vn/upload/sanpham/large/xe-dia-hinh-dieu-khien-tu-xa-toc-do-cao-044-1636612914-ad2299.jpg",
        is_main: true,
        variant_id: null,
      },
    ],
    reviews: [],
    averageRating: 4.5,
    totalReviews: 65,
    originalPrice: 170,
    discount: 6,
  },
  {
    id: "8",
    name: "Small BookShelf",
    description:
      "Compact wooden bookshelf perfect for home or office storage and decoration.",
    price: 360,
    brand: "FurniturePro",
    category_id: "furniture-2",
    status: "ACTIVE",
    variants: [
      {
        id: "var-8",
        color: { id: "c8", name: "Oak", hex_code: "#B45309" },
        size: { id: "s8", name: "Small", description: "Compact 3-layer shelf" },
        stock_quantity: 20,
        price_override: null,
      },
    ],
    images: [
      {
        id: "img8",
        image_url:
          "https://daiphattoy.vn/upload/sanpham/large/xe-dia-hinh-dieu-khien-tu-xa-toc-do-cao-044-1636612914-ad2299.jpg",
        is_main: true,
        variant_id: null,
      },
    ],
    reviews: [],
    averageRating: 5.0,
    totalReviews: 65,
    originalPrice: 400,
    discount: 10,
  },
];
