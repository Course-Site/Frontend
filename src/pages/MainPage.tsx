import { motion } from "framer-motion";
import backgroundImage from "../assets/images/background.jpg";
import { TypeAnimation } from 'react-type-animation';
 

const MainPage = () => {
  const scrollToNextSection = () => {
    const section = document.getElementById("next-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div>
      <div className="relative h-screen">
        {/* Фон */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>

        {/* Размытие сверху */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 to-transparent"></div>

        {/* Контент */}
        <div className="relative z-10 flex items-center justify-center h-full text-white text-3xl font-semibold font-istok">
          <TypeAnimation
            sequence={[
              'Hello!',
              500,
              'Hello! Welcome to our site!',
              500,
              'Hello! Welcome to our site! Let`s start learning.',
              1000,
              'You can use AI for better results.',
              1000,
            ]}
            speed={35}
            repeat={Infinity}
          />
        </div>
        <motion.button
          onClick={scrollToNextSection}
          initial={{ y: 0 }}
          animate={{ y: [0, -20, 0] }} // Движение вверх-вниз
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 
                    text-neutral-600 text-lg font-semibold px-6 py-3 rounded-full shadow-lg 
                    border-2 border-neutral-600 bg-none hover:text-amber-500
                    cursor-pointer transition duration-300 pointer-events-auto"
        >
          Начать ↓
        </motion.button>
      </div>
      <div>
        <div id="next-section" className="h-screen flex items-center justify-center bg-gray-100">
          <h2 className="text-3xl font-bold">Добро пожаловать в следующую секцию!</h2>
        </div>
      </div>
    </div>
  );
};


export default MainPage;