const loading = document.getElementById('loading');
const userDropdown = document.getElementById('user-dropdown');
const users = document.getElementById('users');
const btn = document.getElementById('btn');
const page2 = document.getElementById('page2');
const userInfo = document.getElementById('user-info');
const locate = document.getElementById('locate');
const positionTag = document.getElementById('position-tag');

class MyPosition {
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.accuracy = 0;
  }
  getHTML() {
    return `<p>${this.latitude}</p><p>${this.longitude}</p><p>${this.accuracy}</p>`;
  }
  async setAccuracy() {
    getPosition().then();
    navigator.geolocation.getCurrentPosition((position) => {
      const {accuracy} = position.coords;
      this.accuracy = accuracy;
      const text = this.getHTML();
      positionTag.innerHTML = text;
    });
  }
}

btn.addEventListener('click', (e) => {
  e.preventDefault();
  for (let user of users) {
    if (user.selected) {
      localStorage.setItem('user', user.value);
    }
  }
  userDropdown.style.display = 'none';
  renderPage2();
});

async function fetchUsers() {
  const userFetch = await fetch('https://gorest.co.in/public/v1/users');
  const json = await userFetch.json();
  loading.remove();
  userDropdown.style.display = 'block';
  const userArray = json.data;
  userArray.forEach((user) => {
    const newUser = document.createElement('option');
    newUser.value = `${user.name}`;
    newUser.textContent = `${user.name} ${user.email}`;
    users.appendChild(newUser);
  });
}

function renderPage2() {
  page2.style.display = 'block';
  let name = localStorage.getItem('user');
  userInfo.textContent = `${name}`; // TODO other info
  locate.addEventListener('keyup', (e) => {
    if (e.target.value === 'locate me') {
      geolocate();
    }
  });
}

function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const {latitude, longitude} = position.coords;
      let geoData = new MyPosition(longitude, latitude);
      geoData.setAccuracy();
    });
  } else {
    alert('unable to gelolocate');
  }
}

function getPosition() {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );
}
fetchUsers();
