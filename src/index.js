// 실시간 시계
function updateClock() {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  let day = now.getDay();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  let currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  document.querySelector(".clock-text").innerText = currentTime;
}
setInterval(updateClock, 1000);
updateClock();

// 랜덤 백그라운드 이미지 from unsplash
function getRandomImage() {
  const imagePaths = [
    "src/img/bg1.jpg",
    "src/img/bg2.jpg",
    "src/img/bg3.jpg",
    "src/img/bg4.jpg",
    "src/img/bg5.jpg",
  ];
  const randomImagePath =
    imagePaths[Math.floor(Math.random() * imagePaths.length)];
  document.body.style.background = `url(${randomImagePath})`;
  document.body.style.backgroundSize = "100% auto";
}
getRandomImage();

// localStorage login
const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-form input");
const greeting = document.querySelector("#greeting");

const HIDDEN_CLASSNAME = "hidden";
const USERNAME_KEY = "username";

function onLoginSubmit(event) {
  event.preventDefault();
  loginForm.classList.add(HIDDEN_CLASSNAME);
  const username = loginInput.value;
  localStorage.setItem(USERNAME_KEY, username);
  paintGreetings(username);
}

function paintGreetings(username) {
  greeting.innerText = `Hello ${username}`;
  greeting.classList.remove(HIDDEN_CLASSNAME);
}

const savedUsername = localStorage.getItem(USERNAME_KEY);

if (savedUsername === null) {
  loginForm.classList.remove(HIDDEN_CLASSNAME);
  loginForm.addEventListener("submit", onLoginSubmit);
} else {
  paintGreetings(savedUsername);
}

// todo

const todoForm = document.getElementById("todo-form");
const todoInput = document.querySelector("#todo-form input");
const todoList = document.getElementById("todo-list");

const TODOS_KEY = "todos";

let todos = [];

function saveToDos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}
function deleteTodo(event) {
  const li = event.target.parentElement;
  li.remove();
  todos = todos.filter((todos) => todos.id !== parseInt(li.id));
  saveToDos();
}
function paintTodo(newTodo) {
  const li = document.createElement("li");
  li.id = newTodo.id;
  const span = document.createElement("span");
  span.innerText = newTodo.text;
  const button = document.createElement("button");
  button.innerText = "❌";
  button.addEventListener("click", deleteTodo);
  li.appendChild(span);
  li.appendChild(button);
  todoList.appendChild(li);
}
function handleTodosubmit(event) {
  event.preventDefault();
  const newTodo = todoInput.value;
  todoInput.value = "";
  const newTodoObj = {
    text: newTodo,
    id: Date.now(),
  };
  todos.push(newTodoObj);
  paintTodo(newTodoObj);
  saveToDos();
}
todoForm.addEventListener("submit", handleTodosubmit);

const savedTodos = localStorage.getItem(TODOS_KEY);
if (savedTodos !== null) {
  const parsedTodos = JSON.parse(savedTodos);
  todos = parsedTodos;
  parsedTodos.forEach(paintTodo);
}

// weather https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
const API_KEY = "e42915540fe195fc7e55e44636eed48d";
function onGeoPass(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`;
  fetch(url).then(response => response.json()).then(data => {
    const weather = document.querySelector("#weather span:first-child");
    const city = document.querySelector("#weather span:last-child");
    city.innerText = data.name;
    weather.innerText = `${data.weather[0].main} / ${data.main.temp}`;
    console.log(data);
  });
}
function onGeoError() {
  alert("Cant get weather for you");
}
navigator.geolocation.getCurrentPosition(onGeoPass, onGeoError);
