import React from "react";

const Footer = () => {
  return (
    <footer className="bg-neutral-950 text-white py-4 text-center font-istok">
      <div className="flex flex-row justify-center item-center gap-10 py-5">
        <ul>
          <li><a href="#" className="hover:text-amber-50">Профиль</a></li>
          <li><a href="#" className="hover:text-amber-50">Курс в LMS</a></li>
          <li><a href="#" className="hover:text-amber-50">FAQ</a></li>
          <li><a href="#" className="hover:text-amber-50">Расписание</a></li>
        </ul>
        <div>
          <p>Связь с преподавателем:</p>
          <a href="#" className="hover:text-amber-50">vk tg sfedu</a>
          <p>Связь с разработчиками:</p>
          <a href="#" className="hover:text-amber-50">vk tg sfedu</a>
        </div>
        <div>
          <p>Команда разработчиков</p>
          <ul>
            <li><a href="#" className="hover:text-amber-50">links</a></li>
            <li><a href="#" className="hover:text-amber-50">logo</a></li>
          </ul>
        </div>
      </div>
      <p>&copy; 2025 Все права защищены</p>
    </footer>
  );
};

export default Footer;