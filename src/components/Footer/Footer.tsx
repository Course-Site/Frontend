import { Tooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css';
import corgiImage from "../../assets/images/corgi.png";

const Footer = () => {
  return (
    <footer className="bg-neutral-950 text-white py-4 text-center font-istok">
      {/* flex-контейнер для трёх колонок */}
      <div className="flex flex-row justify-center items-start gap-10 py-5 min-h-[150px]">

        {/* 1-я колонка - список ссылок */}
        <ul className="flex flex-col justify-between h-full">
          <li><a href="https://lms.sfedu.ru/course/view.php?id=272" className="hover:text-amber-50">Профиль</a></li>
          <li><a href="https://lms.sfedu.ru/course/view.php?id=2725" className="hover:text-amber-50">Курс в LMS</a></li>
          <li><a href="#" className="hover:text-amber-50">FAQ</a></li>
          <li><a href="https://ictis.sfedu.ru/schedule/" className="hover:text-amber-50">Расписание</a></li>
        </ul>

        {/* 2-я колонка - контакты */}
        <div className="flex flex-col justify-between h-full">
          <div>
            <p>Связь с преподавателем:</p>
            <div className="flex gap-4 text-center justify-center">
              <a href="https://vk.com/id1976181" className="hover:text-amber-50">vk</a>
              <a href="https://t.me/ekaterina_pak" className="hover:text-amber-50">tg</a>
              <a
                data-tooltip-id="teacher-email-tooltip"
                data-tooltip-content="epakulova@sfedu.ru"
                className="hover:text-amber-50"
              >
                sfedu
              </a>
              <Tooltip id="teacher-email-tooltip" place="top" />
            </div>
          </div>

          <div>
            <p>Связь с разработчиками:</p>
            <div className="flex gap-4 text-center justify-center">
              <a
                href="https://vk.com/yaniktoniya999"
                className="hover:text-amber-50"
                data-tooltip-id="dev-vk-tooltip"
                data-tooltip-content="Лучший фронтенд-разработчик эвер"
              >
                vk
              </a>
              <a
                href="https://t.me/Akhtungg"
                className="hover:text-amber-50"
                data-tooltip-id="dev-tg-tooltip"
                data-tooltip-content="Ведущий бэкенд-разработчик Грин Атом"
              >
                tg
              </a>
              <a
                data-tooltip-id="dev-email-tooltip"
                data-tooltip-content="Какой-то безответственный"
                className="hover:text-amber-50"
              >
                dparamonov@sfedu.ru
              </a>

              <Tooltip id="dev-vk-tooltip" place="top" />
              <Tooltip id="dev-tg-tooltip" place="top" />
              <Tooltip id="dev-email-tooltip" place="top" />
            </div>
          </div>
        </div>

        {/* 3-я колонка - корги и подпись */}
        <div className="flex flex-col justify-between items-center h-full">
          <p>Команда проекта</p>
          <img 
            src={corgiImage} 
            alt="Веселый корги - талисман проекта" 
            className="w-20 h-20 object-contain rounded-full"
            data-tooltip-id="corgi-tooltip"
            data-tooltip-content="Наш талисман - корги!"
          />
          <Tooltip id="corgi-tooltip" place="top" />
        </div>
      </div>
      <p>&copy; 2025 Все права защищены</p>
    </footer>
  );
};

export default Footer;
