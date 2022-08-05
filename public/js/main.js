/* eslint-disable */

/* ======================================================================
                        LOGIN
/* ======================================================================*/
const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const loginForm = document.querySelector('.login-form .form');

if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = this.email.value;
    const password = this.password.value;

    login(email, password);
  });
}

/* ======================================================================
                        Logout
/* ======================================================================*/
const logoutButton = document.querySelector('.nav_el--logout');

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });

    if (res.data.status === 'success') {
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again');
  }
};

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}

/* ======================================================================
                        UPDATE USER DATA
/* ======================================================================*/
const formUserData = document.querySelector('.form-user-data');

const updateUserData = async data => {
  try {
    const res = await axios({
      method: 'patch',
      url: '/api/v1/users/update-me',
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Data updated successfully');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

if (formUserData) {
  formUserData.addEventListener('submit', function(e) {
    e.preventDefault();
    const form = new FormData(); // multipart/form-data enctype => exist in form property

    form.append('name', this.name.value);
    form.append('email', this.email.value);
    form.append('photo', this.photo.files[0]);

    updateUserData(form);
  });
}

/* ======================================================================
                        UPDATE PASSWORD
/* ======================================================================*/
const updatePassword = async data => {
  try {
    const res = await axios({
      method: 'patch',
      url: '/api/v1/users/update-password',
      data
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const formUserPassword = document.querySelector('.form-user-settings');

if (formUserPassword) {
  formUserPassword.addEventListener('submit', async function(e) {
    e.preventDefault();
    const savePasswordButton = document.querySelector('.save--password');

    savePasswordButton.textContent = 'Updating...';

    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;

    await updatePassword({ currentPassword, password, confirmPassword });

    savePasswordButton.textContent = 'Save password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

/* ======================================================================
                        ALERT
/* ======================================================================*/
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};

const showAlert = (type, msg) => {
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  setTimeout(hideAlert, 5000);
};
