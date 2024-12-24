document.addEventListener('DOMContentLoaded', function () {
    // 注册表单 
    const registerForm = document.getElementById('register-form');
    registerForm.onsubmit = function (event) {
        event.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        fetch('http://localhost:5500/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    // 登录表单
    const loginForm = document.getElementById('login-form');
    loginForm.onsubmit = function (event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        fetch('http://localhost:5500/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Login successful') {
                // 存储用户名到LocalStorage
                localStorage.setItem('username', username);

                // 跳转到主页
                window.location.href = 'index.html';
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
});
