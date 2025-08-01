import { useEffect, useRef } from "react";

const ShipperHereMap = ({ userLocation, shippingLocation }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.H || !window.H.Map) {
      console.error("HERE Maps SDK chưa được load!");
      return;
    }

    const platform = new window.H.service.Platform({
      apikey: "Ao97kismDBtgnSIbhEnEIjetXmlIV4NI7C4eQzUQip8",
    });

    const defaultLayers = platform.createDefaultLayers();

    const map = new window.H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      center: userLocation,
      zoom: 12,
      pixelRatio: window.devicePixelRatio || 1,
    });

    const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));
    window.H.ui.UI.createDefault(map, defaultLayers);

    // Icon xanh dương cho shipper
    const blueIcon = new window.H.map.Icon("https://maps.google.com/mapfiles/ms/icons/blue-dot.png");
    const userMarker = new window.H.map.Marker(userLocation, { icon: blueIcon });
    map.addObject(userMarker);

    // Icon đỏ cho khách hàng
    const redIcon = new window.H.map.Icon("https://maps.google.com/mapfiles/ms/icons/red-dot.png");
    const shippingMarker = new window.H.map.Marker(shippingLocation, { icon: redIcon });
    map.addObject(shippingMarker);

    //  Gọi HERE Routing API để lấy đường đi
    const router = platform.getRoutingService(null, 8);
    const routingParams = {
      routingMode: "fast",
      transportMode: "car",
      origin: `${userLocation.lat},${userLocation.lng}`,
      destination: `${shippingLocation.lat},${shippingLocation.lng}`,
      return: "polyline",
    };
    console.log("userLocation:", userLocation);
    console.log("shippingLocation:", shippingLocation);

    router.calculateRoute(routingParams, (result) => {
      if (result.routes.length > 0) {
        const route = result.routes[0];
        const lineString = new window.H.geo.LineString();

        route.sections.forEach((section) => {
          const lineString = H.geo.LineString.fromFlexiblePolyline(section.polyline);

          const routeLine = new H.map.Polyline(lineString, {
            style: { strokeColor: "rgba(0, 128, 255, 0.7)", lineWidth: 5 },
          });

          map.addObject(routeLine);
          map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
        });


        const routeLine = new window.H.map.Polyline(lineString, {
          style: { strokeColor: "rgba(0, 128, 255, 0.7)", lineWidth: 5 },
        });

        map.addObject(routeLine);

        // Fit map vừa đủ cả tuyến đường
        map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
      }
    }, (error) => {
      console.error("Lỗi khi lấy route:", error);
    });

    return () => {
      map.dispose();
    };
  }, [userLocation, shippingLocation]);

  return (
  <div
    ref={mapRef}
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
      zIndex: 0,
    }}
  />
);

};

export default ShipperHereMap;
