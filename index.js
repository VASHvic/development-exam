const loading = document.getElementById('loading');
const userDropdown = document.getElementById('user-dropdown');
const users = document.getElementById('users');
const btn = document.getElementById('btn');
const page2 = document.getElementById('page2');
const userInfo = document.getElementById('user-info');
const locate = document.getElementById('locate');
const positionTag = document.getElementById('position-tag');
locate.addEventListener('keyup', (e) => {
  if (e.target.value === 'locate me') {
    geolocate();
  }
});
class MyPosition {
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.accuracy = 0;
  }
  getHTML() {
    return `<p>Latitude:${this.latitude}</p><p>longitude:${this.longitude}</p><p>Accuracy:${this.accuracy}</p>`;
  }
  setAccuracy(acc) {
    this.accuracy = acc;
    const text = this.getHTML();
    positionTag.innerHTML = text;
  }
}

btn.addEventListener('click', (e) => {
  e.preventDefault();
  saveUserInfo(users);
  userDropdown.style.display = 'none';
  renderPage2();
});

fetchUsers();

async function fetchUsers() {
  const userFetch = await fetch('https://gorest.co.in/public/v1/users');
  const json = await userFetch.json();
  loading.style.display = 'none';
  userDropdown.style.display = 'block';
  const userArray = json.data;
  createOptions(userArray, users);
}

function renderPage2() {
  page2.style.display = 'block';
  displayInfo(userInfo);
  renderPage2Users().then((data) => {
    const info = data.data;
    createTodos(info);
  });
}
/**
 * instantiates an object of the class MyPosition
 * @returns the setAccurcy method or an error
 */
async function geolocate() {
  if (navigator.geolocation) {
    const position = await getPosition();
    const {latitude, longitude, accuracy} = position.coords;
    let geoData = new MyPosition(longitude, latitude);
    return geoData.setAccuracy(accuracy);
  } else {
    throw new Error('Unable to locate');
  }
}
/**
 *
 * @returns {Promise} of getCurrentPOsition
 */
function getPosition() {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );
}
/**
 * @param {*} arr of option HTML tags
 */
function saveUserInfo(arr) {
  for (let user of arr) {
    if (user.selected) {
      storeUser(user);
    }
  }
}
/**
 * @param {*} arr of users to create options
 * @param {*} select Element where to append options
 */
function createOptions(arr, select) {
  arr.forEach((user) => {
    const newUser = document.createElement('option');
    newUser.value = `${user.name}`;
    newUser.email = `${user.email}`;
    newUser.gender = `${user.gender}`;
    newUser.textContent = `${user.name} ${user.email}`;
    select.appendChild(newUser);
  });
}
/**
 * @param {*} user
 */
function storeUser(user) {
  localStorage.setItem('user', user.value);
  localStorage.setItem('email', user.email);
  localStorage.setItem('gender', user.gender);
}
/**
 * @param {*} elem where to display the info
 */
function displayInfo(elem) {
  const name = localStorage.getItem('user');
  const email = localStorage.getItem('email');
  const gender = localStorage.getItem('gender');
  elem.textContent = `Name: ${name}, Email: ${email}, Gender: ${gender}`;
}

async function renderPage2Users() {
  loading.style.display = 'block';
  const usersPage2 = await fetch('https://gorest.co.in/public/v1/todos');
  const json = await usersPage2.json();
  return json;
}

function createTodos(arr) {
  const ul = document.createElement('ul');
  page2.append(ul);
  for (let todo of arr) {
    const newLi = document.createElement('li');
    newLi.textContent = todo.title;
    const newBtn = document.createElement('button');
    newBtn.style.display = 'inline';
    newBtn.textContent = 'delete';
    newBtn.addEventListener('click', (e) => {
      e.preventDefault();
      newBtn.previousSibling.remove();
      e.target.remove();
    });
    newLi.append(newBtn);
    ul.appendChild(newLi);
  }
  loading.style.display = 'none';
}
