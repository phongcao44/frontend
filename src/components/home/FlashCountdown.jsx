import { useEffect, useState } from "react";
import { Typography } from "antd";

const { Text } = Typography;

// eslint-disable-next-line react/prop-types
const CountdownBlock = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
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

const FlashCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56,
  });

  useEffect(() => {
    const deadline =
      Date.now() +
      1000 * 60 * 60 * 24 * 3 +
      1000 * 60 * 60 * 23 +
      1000 * 60 * 19 +
      1000 * 59;

    const timer = setInterval(() => {
      const diff = deadline - Date.now();

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <CountdownBlock label="Days" value={timeLeft.days} />
      <span style={{ fontSize: "20px", color: "#ff4d4f", alignSelf: "center" }}>
        :
      </span>
      <CountdownBlock label="Hours" value={timeLeft.hours} />
      <span style={{ fontSize: "20px", color: "#ff4d4f", alignSelf: "center" }}>
        :
      </span>
      <CountdownBlock label="Minutes" value={timeLeft.minutes} />
      <span style={{ fontSize: "20px", color: "#ff4d4f", alignSelf: "center" }}>
        :
      </span>
      <CountdownBlock label="Seconds" value={timeLeft.seconds} />
    </div>
  );
};

export default FlashCountdown;
