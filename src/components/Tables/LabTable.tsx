import React from "react";

const LabTable = () => {
  const labs = [
    { module: "Модуль 1. Системное администрирование ОС Linux", data: [
      { id: 1, name: "Пользователи, файлы и процессы ОС Linux.", hours: 6 },
      { id: 2, name: "Средства диспетчеризации ОС Linux", hours: 8 },
      { id: 3, name: "Системное администрирование с помощью сетевых инструментов Linux", hours: 8 },
      { id: 4, name: "Настройка DNS для ОС Linux.", hours: 8 },
    ]},
    { module: "Модуль 2. Администрирование сервисов ОС Linux", data: [
      { id: 5, name: "Обеспечение целостности и доступности данных в ОС Linux. RAID", hours: 6 },
      { id: 6, name: "Настройка LDAP сервера для OC Linux", hours: 8 },
      { id: 7, name: "Настройка Rsyslog для OC Linux", hours: 6 },
    ]},
    { module: "Модуль 3. Администрирование сети под управление OC Windows", data: [
      { id: 8, name: "Настройка шаблона безопасности в ОС Windows.", hours: 12 },
    ]},
    { module: "Модуль 4. Администрирование прикладных сервисов", data: [
      { id: 9, name: "Установка и настройка web-сервера Apache", hours: 12 },
      { id: 10, name: "Установка и настройка почтового сервера", hours: 10 },
    ]}
  ];

  return (
    <div className="text-white py-12 px-6 font-istok">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-orange-500 mb-10">
            Перечень лабораторных работ
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-orange-500">
            <thead>
              <tr className="bg-orange-600 text-white">
                <th className="border border-orange-500 px-4 py-2">№ п/п</th>
                <th className="border border-orange-500 px-4 py-2">Название лабораторной работы</th>
                <th className="border border-orange-500 px-4 py-2">Количество часов</th>
              </tr>
            </thead>
            <tbody>
              {labs.map((module, moduleIndex) => (
                <React.Fragment key={moduleIndex}>
                  <tr className="bg-orange-800 text-white">
                    <td colSpan={3} className="text-left font-semibold px-4 py-2 border border-orange-500">
                      {module.module}
                    </td>
                  </tr>
                  {module.data.map((lab) => (
                    <tr key={lab.id} className="hover:bg-orange-700">
                      <td className="border border-orange-500 px-4 py-2 text-center">{lab.id}</td>
                      <td className="border border-orange-500 px-4 py-2">{lab.name}</td>
                      <td className="border border-orange-500 px-4 py-2 text-center">{lab.hours}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              <tr className="bg-orange-800 text-white font-bold">
                <td colSpan={2} className="border border-orange-500 px-4 py-2 text-right">Всего часов</td>
                <td className="border border-orange-500 px-4 py-2 text-center">84</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LabTable;
