import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useDispatch } from "react-redux";
import { fetchFlashSales } from "../redux/slices/flashSaleSlice"; // Adjust the import
function FlashSaleListener() {
  const [event, setEvent] = useState(null);
  const stompClient = useRef(null);
const dispatch = useDispatch();

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe("/topic/flashsale", (message) => {
          const eventData = JSON.parse(message.body);
          dispatch(fetchActiveFlashSale()).then((res) => {
  if (res.payload?.id) {
    dispatch(fetchFlashSaleItems(res.payload.id));
  }
});

          setEvent(eventData);
        });
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  return (
    <div>
      {event && (
        <div className="flash-sale-event">
          🔥 {event.message} at {event.createdAt}
        </div>
      )}
    </div>
  );
}

export default FlashSaleListener;
