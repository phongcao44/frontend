import Cookies from "js-cookie";

let socket = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 3000;

export const initializeWebSocket = (dispatch, userId) => {
  // Prevent multiple WebSocket connections
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("WebSocket already connected");
    return;
  }

  // Get the Bearer token from cookies
  const token = Cookies.get("access_token");
  if (!token) {
    console.error("No authentication token available in cookies");
    return;
  }

  // Initialize WebSocket with userId and token as query parameters
  // Using ws://localhost:8080 to match the Axios baseURL[](http://localhost:8080/api/v1)
  socket = new WebSocket(`ws://localhost:8080/ws/cart?userId=${userId}&token=${encodeURIComponent(token)}`);

  socket.onopen = () => {
    console.log("WebSocket connected successfully");
    reconnectAttempts = 0; // Reset reconnect attempts on successful connection
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.event === "cart_updated") {
        dispatch({
          type: "cart/updateFromWebSocket",
          payload: data.cart,
        });
      } else {
        console.log("Unhandled WebSocket event:", data.event);
      }
    } catch (err) {
      console.error("WebSocket message parse error:", err);
    }
  };

  socket.onclose = (event) => {
    console.log(`WebSocket disconnected (code: ${event.code}, reason: ${event.reason})`);
    if (reconnectAttempts < maxReconnectAttempts) {
      setTimeout(() => {
        console.log(`Reconnecting WebSocket, attempt ${reconnectAttempts + 1}/${maxReconnectAttempts}`);
        reconnectAttempts++;
        initializeWebSocket(dispatch, userId);
      }, reconnectDelay);
    } else {
      console.error("Max WebSocket reconnect attempts reached");
    }
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
    socket.close(); // Close the socket on error to trigger onclose handling
  };
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close(1000, "Closed by client"); // 1000 is a normal closure code
    socket = null;
    console.log("WebSocket closed by client");
  }
};