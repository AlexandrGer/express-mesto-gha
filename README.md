<h1>Учебный backend-проект: "Mesto"</h1>

<h2>Описание проекта</h2>

Данный [проект](https://github.com/elrouss/express-mesto-gha) был сделан в рамках образовательной программы [Яндекс.Практикума.](https://practicum.yandex.ru/) Проект представляет собой написание серверной логики для последующего объединения с частью [frontend`а](https://github.com/AlexandrGer/react-mesto-auth), сделанной на "React"

<h2>Стек технологий</h2>

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

<h2>Инструкция по установке</h2>

1. ```git clone https://github.com/AlexandrGer/express-mesto-gha.git``` - клонируем репозиторий
2. ```npm i``` - устанавливаем зависиимости 
3. ```npm run dev``` - запускает сервер с hot-reload
4. ```npm run start``` - запускает сервер

<h2>Директории</h2>

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки  
  
Остальные директории вспомогательные, создаются при необходимости разработчиком

<h2>Методология и процесс создания</h2>
Работа была выполнена в 2 этапа:

1. Написание схем, контроллеров и моделей (users & cards), подключение запросов с методами api, добавление кодов и текстов ошибок при неуспешных запросах (400, 404, 500)
2. Расширение схем и контроллеров (users & cards), добавление функций регистрации и авторизации пользователей, добавление предварительного этапа валидации данных (celebrate & joi), обработка новых ошибок в едином обработчике (401, 403 и 409), обеспечение безопасности приложения (хэширование паролей пользователей, защита от DoS-атак, настройка заголовков HTTP)
