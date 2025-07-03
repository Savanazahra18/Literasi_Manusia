document.getElementById("registerForm").addEventListener("submit", register);
document.getElementById("loginForm").addEventListener("submit", login);

function showRegister() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("registerPage").classList.remove("hidden");
}

function showLogin() {
  document.getElementById("registerPage").classList.add("hidden");
  document.getElementById("loginPage").classList.remove("hidden");
}

function register(e) {
  e.preventDefault();

  const username = document.getElementById("regUsername").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;

  if (password !== confirmPassword) {
    alert("Password tidak cocok!");
    return;
  }

  const userData = { username, email, password };
  localStorage.setItem("userAccount", JSON.stringify(userData));
  alert("Registrasi berhasil! Silakan login.");
  showLogin();
}

function login(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const storedUser = JSON.parse(localStorage.getItem("userAccount"));

  if (!storedUser) {
    alert("Belum ada akun terdaftar. Silakan registrasi.");
    return;
  }

  if (username === storedUser.username && password === storedUser.password) {
    alert("Login berhasil!");
    window.location.href = "dashboard.html"; // ganti sesuai halaman utama kamu
  } else {
    alert("Username atau password salah!");
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const regUsername = document.getElementById('regUsername').value;
      const regEmail = document.getElementById('regEmail').value;
      const regPassword = document.getElementById('regPassword').value;
      const regConfirmPassword = document.getElementById('regConfirmPassword').value;
      const formData = new FormData();
      formData.append('regUsername', regUsername);
      formData.append('regEmail', regEmail);
      formData.append('regPassword', regPassword);
      formData.append('regConfirmPassword', regConfirmPassword);
      try {
        const res = await fetch('register.php', {
          method: 'POST',
          body: formData
        });
        const text = await res.text();
        alert(text);
        if (text.includes('berhasil')) {
          // Optionally switch to login page
          showLogin();
        }
      } catch (err) {
        alert('Registrasi gagal: ' + err);
      }
    });
  }
});
