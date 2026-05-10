class LoginForm {
    constructor() {
        this.passwordInput = document.getElementById('password');
        this.toggleBtn = document.querySelector('.toggle-password');
        this.form = document.getElementById('login-form');
    }

    init() {
        lucide.createIcons();
        this.toggleBtn.addEventListener('click', () => this.#togglePassword());
        
        this.form.addEventListener('submit', (e) => this.#handleLogin(e));
    }

    #togglePassword() {
        const isHidden = this.passwordInput.type === 'password';

        this.passwordInput.type = isHidden ? 'text' : 'password';
        this.toggleBtn.innerHTML = isHidden
            ? '<i data-lucide="eye-off"></i>'
            : '<i data-lucide="eye"></i>';

        lucide.createIcons();
    }

    #handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const users = [
            { user: 'admin', pass: '123456', rol: 'administrador' },
            { user: 'vendedor', pass: 'vendedor123', rol: 'vendedor' }
        ];

        const validUser = users.find(u => u.user === username && u.pass === password);

        if (validUser) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('rol', validUser.rol);
            
            window.location.href = '/modules/dashboard/dashboard.html';
        } else {
            alert('Credenciales incorrectas. Intenta de nuevo.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = new LoginForm();
    loginForm.init();
});