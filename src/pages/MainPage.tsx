import { motion } from "framer-motion";
import backgroundImage from "../assets/images/background.jpg";
import { TypeAnimation } from 'react-type-animation';
import { BotIcon, HelpCircleIcon, ZapIcon } from "lucide-react";
import { Server, ShieldCheck, Network, Terminal, Activity } from "lucide-react";
import InfoCard from "../components/Cards/InfoCard";
import { Link } from "react-router-dom";
import GoalSlider from "../components/Sleders/GoalSlider";
import LabTable from "../components/Tables/LabTable";



const skills = [
  { icon: <Server size={40} className="text-orange-500" />, title: "Веб-серверы и хостинг", desc: "Настройка LEMP-стека, управление WordPress, работа с SSL." },
  { icon: <ShieldCheck size={40} className="text-orange-500" />, title: "Безопасность и защита", desc: "Настройка шлюзов, брандмауэров, VPN и контроль доступа." },
  { icon: <Network size={40} className="text-orange-500" />, title: "Работа с сетями", desc: "Настройка DNS, IP, NAT, мониторинг трафика и доменов." },
  { icon: <Terminal size={40} className="text-orange-500" />, title: "Администрирование серверов", desc: "Конфигурация Linux, автоматизация задач, управление процессами." },
  { icon: <Activity size={40} className="text-orange-500" />, title: "Мониторинг и оптимизация", desc: "Использование Zabbix, Grafana, диагностика и устранение проблем." },
];

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
                    border-2 border-neutral-600 bg-none hover:text-amber-500 hover:border-amber-500
                    cursor-pointer transition duration-300 pointer-events-auto"
        >
          Начать ↓
        </motion.button>
      </div>
      <section className="bg-stone-900 py-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
          className="text-5xl font-bold text-center relative"
        >
          <span className="relative inline-block bg-gradient-to-r from-orange-700 via-amber-400 to-orange-500 
                          bg-clip-text text-transparent animate-gradient">
            Как работать с <span className="relative text-orange-400 glow-text">ИИ</span> ?
          </span>
        </motion.h1>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center my-12 max-w-4xl mx-auto">
          <InfoCard Icon={BotIcon} text='Перейди во вкладку "Нейросеть"' />
          <InfoCard Icon={HelpCircleIcon} text="Задай вопрос ИИ" />
          <InfoCard Icon={ZapIcon} text="Получи ответ" />
        </div>

        {/* Кнопка CTA */}
        <div className="flex justify-center mt-8">
        <Link to="/ai">
        <motion.button
          onClick={scrollToNextSection}
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mb-10 z-10 text-lg font-semibold px-6 py-3 rounded-full shadow-lg
                    border-2 border-orange-500 bg-none text-orange-500 hover:bg-orange-500 
                    hover:text-black cursor-pointer transition duration-300 pointer-events-auto"
        >
          Попробовать ИИ →
        </motion.button>
        </Link>
        </div>
      </section>
      <section className="px-[60px] py-12 h-screen text-white bg-black flex items-center justify-items-center">
        <div>
          <h1 className="font-istok text-3xl text-center"> Задачи, которые ты сможешь решать после курса: </h1>
        </div>
        <div>
          <GoalSlider />
        </div>
      </section>


      {/* Следующая секция */}
      <section id="next-section" className="bg-neutral-900 px-[60px]">
        <LabTable/>
      </section>

      <section className="bg-neutral-900 text-beige-300 py-16 px-6">
      <div className="container mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
          className="text-4xl font-bold text-orange-500 mb-10"
        >
          Какие навыки вы получите?
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-neutral-800 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center"
            >
              {skill.icon}
              <h3 className="text-xl font-semibold mt-4 text-orange-400">{skill.title}</h3>
              <p className="text-sm mt-2 text-beige-300">{skill.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    </div>
  );
};


export default MainPage;