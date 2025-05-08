import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import BubbleIcon from "../../components/BubbleIcon";
// import NotificationButton from "../components/NotificationButton";
import waterImage from "../../assets/water1.jpg"; // Import hình ảnh nước từ thư mục assets

const Home = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-1/6 min-h-screen bg-gray-800 text-white" />

      <div className="flex flex-col w-5/6">
        <Header className="w-full bg-blue-500 text-white p-4" />

        <div
          className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `url(${waterImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Main Content */}
          <div className="relative z-1 text-center px-6 py-12 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg">
            <h1 className="text-6xl font-extrabold text-white drop-shadow-lg">
              🌿 Hệ Thống Tưới Thông Minh
            </h1>
            <p className="mt-4 text-2xl text-white max-w-2xl mx-auto">
              Giám sát và điều khiển hệ thống thông minh trong nhà kính.
            </p>
          </div>

          {/* Bubble Icons in the bottom-right corner */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            <BubbleIcon
              type="phone"
              onClick={() => window.open("tel:+123456789")}
              size="md"
            />
            <BubbleIcon
              type="zalo"
              href="https://zalo.me/yournumber"
              size="md"
            />
            <BubbleIcon
              type="tiktok"
              href="https://tiktok.com/yourprofile"
              size="md"
            />
          </div>
        </div>

        {/* Footer */}
        <Footer className="w-full bg-gray-200 text-center p-4" />
      </div>
    </div>
  );
};

export default Home;
