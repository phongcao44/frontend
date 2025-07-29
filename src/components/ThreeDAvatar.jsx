import * as THREE from "three";
import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ThreeDAvatar = ({ onClick }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentRef = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      35,
      1, // Tỷ lệ khung hình 1:1
      0.1,
      1000
    );
    camera.position.z = 3; // Giảm khoảng cách camera để mô hình to hơn

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    const size = 150; // Tăng kích thước container lên 150x150
    renderer.setSize(size, size);
    currentRef.appendChild(renderer.domElement);

    // Ánh sáng
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Load mô hình GLB/GLTF
    const loader = new GLTFLoader();
    loader.load(
      "/public/assets/3d/May_bay.glb",
      (gltf) => {
        const model = gltf.scene;

        // Tính toán kích thước và căn giữa mô hình
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Căn giữa mô hình
        model.position.sub(center);

        // Tăng tỷ lệ mô hình để to hơn
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim; // Tăng scale từ 2 lên 4 để mô hình lớn hơn
        model.scale.set(scale, scale, scale);

        // Điều chỉnh camera dựa trên kích thước mô hình
        const fov = camera.fov * (Math.PI / 180);
        camera.position.z = (maxDim / scale) * 1.5; // Giảm hệ số để camera gần hơn

        scene.add(model);

        // Animation
        const animate = () => {
          requestAnimationFrame(animate);
          model.rotation.y += 0.01;
          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      (error) => {
        console.error("❌ Error loading model:", error);
      }
    );

    // Xử lý resize
    const handleResize = () => {
      const width = currentRef.clientWidth;
      const height = currentRef.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      currentRef.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 30,
        right: 30,
        width: 150, // Tăng kích thước container
        height: 150,
        cursor: "pointer",
        zIndex: 9999,
      }}
    />
  );
};

export default ThreeDAvatar;    