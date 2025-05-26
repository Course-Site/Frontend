import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Состояние для отслеживания видимости баннера
  const [isBannerVisible, setIsBannerVisible] = React.useState(true);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Передаем callback в Navbar для обновления состояния */}
      <Navbar onBannerVisibilityChange={setIsBannerVisible} />
      {/* Меняем padding-top в зависимости от видимости баннера */}
      <div className={`flex-grow ${isBannerVisible ? 'pt-50' : 'pt-17'}`}>
        <main className="container mx-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;