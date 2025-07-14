import { useEffect, useState } from "react";
import { Row, Col, Image } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getProductImagesByProduct } from "../../../redux/slices/productImageSlice";

// eslint-disable-next-line react/prop-types
const ProductGallery = ({ productId }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch = useDispatch();
  const {
    list: imageList,
    loading: imageLoading,
    error: imageError,
  } = useSelector((state) => state.productImage);

  useEffect(() => {
    if (productId) {
      dispatch(getProductImagesByProduct(productId));
    }
  }, [dispatch, productId]);

  if (imageLoading) return <div>Loading images...</div>;
  if (imageError) return <div>Error: {imageError}</div>;

  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <div
          className={`flex flex-col gap-3 items-center ${
            imageList?.length > 4 ? "justify-start" : "justify-center"
          } min-h-[400px]`}
        >
          {imageList?.map((image, index) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`cursor-pointer border-2 ${
                selectedImage === index ? "border-red-500" : "border-gray-200"
              } rounded-lg p-1 bg-gray-100 w-full`}
            >
              <Image
                src={image.imageUrl}
                alt={`${image.productName} ${index + 1}`}
                width="100%"
                height={80}
                className="object-cover rounded"
                preview={false}
              />
            </div>
          ))}
        </div>
      </Col>

      <Col span={18}>
        <div className="bg-gray-100 rounded-xl p-5 flex items-center justify-center min-h-[400px]">
          <Image
            src={imageList?.[selectedImage]?.imageUrl}
            alt={imageList?.[selectedImage]?.productName}
            width="100%"
            className="object-contain rounded-lg max-h-[400px]"
            preview={{
              src: imageList?.[selectedImage]?.imageUrl,
            }}
          />
        </div>
      </Col>
    </Row>
  );
};

export default ProductGallery;
