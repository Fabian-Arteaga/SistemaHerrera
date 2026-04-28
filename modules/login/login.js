class LoginForm {
    constructor() {
        this.passwordInput = document.getElementById('password');
        this.toggleBtn = document.querySelector('.toggle-password');
    }

    init() {
        lucide.createIcons();
        this.toggleBtn.addEventListener('click', () => this.#togglePassword());
    }

    #togglePassword() {
        const isHidden = this.passwordInput.type === 'password';

        this.passwordInput.type = isHidden ? 'text' : 'password';
        this.toggleBtn.innerHTML = isHidden
            ? '<i data-lucide="eye-off"></i>'
            : '<i data-lucide="eye"></i>';

        lucide.createIcons();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = new LoginForm();
    loginForm.init();
});