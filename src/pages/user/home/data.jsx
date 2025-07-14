import {
  MobileOutlined,
  DesktopOutlined,
  ClockCircleOutlined,
  CameraOutlined,
  AudioOutlined,
} from "@ant-design/icons";
import { FaGamepad } from "react-icons/fa";

export const categories = [
  { icon: <MobileOutlined />, name: "Phones", active: false },
  { icon: <DesktopOutlined />, name: "Computers", active: false },
  { icon: <ClockCircleOutlined />, name: "SmartWatch", active: false },
  { icon: <CameraOutlined />, name: "Camera", active: true },
  { icon: <AudioOutlined />, name: "HeadPhones", active: false },
  { icon: <FaGamepad />, name: "Gaming", active: false },
];
// Banner carousel

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
