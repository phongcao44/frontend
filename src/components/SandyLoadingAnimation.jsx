import React from "react";
import Lottie from "lottie-react";
import sandyLoading from "../assets/SandyLoading.json"; // đường dẫn tới file JSON

export default function SandyLoadingAnimation() {
  return (
    <div style={{ width: 200, height: 200, margin: "auto" }}>
      <Lottie
        animationData={sandyLoading}
        loop={true} 
        autoplay={true} 
      />
    </div>
  );
}
