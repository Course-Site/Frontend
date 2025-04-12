import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const goals = [
  "Овладение базами настройки сетевых протоколов — освоить настройку IPv4 и IPv6, обеспечить связность между устройствами в сети.",
  "Понимание работы сетевых протоколов через анализ трафика — изучить принципы работы DHCP, DNS, ICMP с использованием Wireshark.",
  "Настройка и управление DNS-сервером — изучить внутренние и внешние зоны, прямое и обратное отображение имён.",
  "Развертывание корпоративных сервисов — получить опыт настройки файлового сервера в инфраструктуре предприятия.",
  "Управление пользователями через каталог LDAP — освоить конфигурацию OpenLDAP для централизованного управления доступом.",
  "Обеспечение безопасности с помощью центра сертификации — научиться создавать и применять цифровые сертификаты на базе OpenSSL.",
  "Администрирование веб-серверов и балансировка нагрузки — освоить настройку Apache и Nginx, механизмы кэширования и распределения трафика."
];

const GoalSlider = () => {
  const [scroll, setScroll] = useState(0);

  // Функция для прокрутки
  const scrollGoals = () => {
    setScroll((prev) => {
      const newScroll = prev + 1;
      if (newScroll >= goals.length) {
        return 0; // Сбросим к началу, если прокрутили до конца
      }
      return newScroll;
    });
  };

  useEffect(() => {
    // Запуск анимации прокрутки с интервалом
    const interval = setInterval(scrollGoals, 3000); // Прокрутка каждые 3 секунды

    return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
  }, []);

  return (
    <div className="relative h-[700px] w-full overflow-hidden rounded-lg">
      <motion.div
        className="flex flex-col space-y-4"
        initial={{ y: 0 }}
        animate={{ y: -scroll * 60 }} // Прокрутка по оси Y, можно настроить размер сдвига
        transition={{
          type: "tween",
          duration: 1, // Длительность анимации прокрутки
          ease: "easeInOut",
        }}
      >
        {goals.map((goal, index) => (
          <motion.div
            key={index}
            className="h-[100px] flex justify-center items-center p-4"
            style={{
              transform:
                index === scroll
                  ? "scale(1)" // Увеличиваем центральный элемент
                  : "scale(0.8)", // Уменьшаем остальные элементы
              opacity: index === scroll ? 1 : 0.6, // Уменьшаем непрозрачность остальных
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: index === scroll ? 1 : 0.6, // Для центрального элемента полная непрозрачность
              scale: index === scroll ? 1 : 0.8, // Для центрального элемента нормальный размер
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <p className="font-istok text-2xl text-center">{goal}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GoalSlider;
