import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, EyeOff, Eye } from "lucide-react";
import bannerLogo from "../../assets/images/bannerLogo.png";
import Button from "../Button/Button";
import AuthModal from "../AuthModal/AuthModal";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bannerHidden, setBannerHidden] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const storedBannerStatus = localStorage.getItem("bannerHidden");
    if (storedBannerStatus === "true") {
      setBannerHidden(true);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  {/* Функция для скрытия или отображения баннера */}
  const toggleBanner = () => {
    setBannerHidden(prev => {
      const newStatus = !prev;
      localStorage.setItem("bannerHidden", newStatus.toString()); // Сохраняем состояние в localStorage
      return newStatus;
    });
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        {/* Баннер (сначала уходит) */}
        {!bannerHidden && (
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: scrolled ? "-100%" : "0%", opacity: scrolled ? 0 : 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="hidden lg:flex justify-center items-center bg-neutral-50 text-black py-4"
          >
            <div className="flex items-center justify-center gap-7">
              <img src={bannerLogo} className="w-30 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <h1 className="text-3xl font-bold font-tektur tracking-wider">
                  Администрирование вычислительных сетей
                </h1>
                <p className="font-tektur -tracking-normal">
                  Освоение курса по администрированию сетей – уверенный шаг к успешной карьере в IT!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Навбар (поднимается после баннера) */}
        <motion.nav
          initial={{ y: 0 }}
          animate={{ top: bannerHidden || scrolled ? "0rem" : "9rem" }}
          transition={{ duration: 0.1, ease: "easeInOut", delay: scrolled ? 0.2 : 0 }}
          className="bg-neutral-950 shadow-md py-3 w-full fixed top-[9rem] left-0 transition-all"
        >
          <div className="container mx-auto flex justify-between items-center px-20">
            {/* Меню для десктопа */}
            <ul className="hidden lg:flex gap-6 font-istok">
              <li>
                <NavLink to="/" className="text-white hover:text-amber-500 transition">
                  Главная
                </NavLink>
              </li>
              <li>
                <NavLink to='/learning' className="text-white hover:text-amber-500 transition">
                  Обучение
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className="text-white hover:text-amber-500 transition">
                  Профиль
                </NavLink>
              </li>
              <li>
                <NavLink to="/ai" className="text-white hover:text-amber-500 transition">
                  Нейросеть
                </NavLink>
              </li>
            </ul>

            {/* Кнопки слева */}
            <div className="flex items-center gap-5 font-istok">
              <Button variant="primary" className="px-3 py-2" onClick={() => setAuthModalOpen(true)} >
                Войти / Зарегистрироваться
              </Button>
              <a href="#" className="text-xl font-bold text-white">
                Логотип
              </a>
              {/* Кнопка для скрытия/показа баннера в навбаре */}
              <div className="group relative flex justify-center">
                <Button variant="primary" onClick={toggleBanner} className="py-1 px-2">
                  {bannerHidden ? <Eye /> : <EyeOff />}
                </Button>
                <span className="absolute top-10 scale-0 rounded bg-amber-50 p-2 text-xs text-black group-hover:scale-100">
                  Скрыть/показать баннер
                </span>
              </div>
            </div>

            {/* НЕДОДЕЛАНО */}
            {/* Кнопка для мобильного меню */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </motion.nav>

        {/* Мобильное меню */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-white shadow-md py-4"
          >
            <ul className="flex flex-col items-center gap-4">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition">
                  Главная
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition">
                  О нас
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition">
                  Контакты
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </header>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
