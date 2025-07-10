/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Typography } from "antd";

const { Text } = Typography;

const CountdownBlock = ({ label, value }) => (
  <div
    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
  >
    <Text style={{ fontSize: "12px", marginBottom: "4px" }}>{label}</Text>
    <Text
      style={{
        fontSize: "32px",
        fontWeight: "bold",
        color: "#000",
        lineHeight: 1,
      }}
    >
      {String(value).padStart(2, "0")}
    </Text>
  </div>
);

const FlashCountdown = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!endTime) return;

    const deadline = new Date(endTime).getTime();

    const calculateTimeLeft = () => {
      const diff = deadline - Date.now();

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (!endTime) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <CountdownBlock label="Days" value={timeLeft.days} />
      <span style={{ fontSize: "20px", color: "#ff4d4f" }}>:</span>
      <CountdownBlock label="Hours" value={timeLeft.hours} />
      <span style={{ fontSize: "20px", color: "#ff4d4f" }}>:</span>
      <CountdownBlock label="Minutes" value={timeLeft.minutes} />
      <span style={{ fontSize: "20px", color: "#ff4d4f" }}>:</span>
      <CountdownBlock label="Seconds" value={timeLeft.seconds} />
    </div>
  );
};

export default FlashCountdown;
