// Получаем элементы канваса
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Устанавливаем размер канваса на весь экран
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Объект для хранения состояния нажатых клавиш
const keys = {
    right: false,
    left: false,
    up: false
};

// Обработчики событий нажатия и отпускания клавиш
window.addEventListener('keydown', function(e) {
    if (e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'ArrowUp') keys.up = true;
});

window.addEventListener('keyup', function(e) {
    if (e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'ArrowUp') keys.up = false;
});

// Класс игрока
class Player {
    constructor() {
        this.width = 50;
        this.height = 80;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 50; // 50 - высота земли
        this.speed = 5;
        this.velX = 0;
        this.velY = 0;
        this.gravity = 0.5;
        this.jumpStrength = 15;
        this.onGround = false;
    }

    update() {
        // Горизонтальное движение
        if (keys.right) {
            this.velX = this.speed;
        } else if (keys.left) {
            this.velX = -this.speed;
        } else {
            this.velX = 0;
        }

        // Прыжок
        if (keys.up && this.onGround) {
            this.velY = -this.jumpStrength;
            this.onGround = false;
        }

        // Применяем гравитацию
        this.velY += this.gravity;

        // Обновляем позицию
        this.x += this.velX;
        this.y += this.velY;

        // Ограничиваем движение по горизонтали границами канваса
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;

        // Проверяем столкновение с землей
        if (this.y + this.height >= canvas.height - 50) {
            this.y = canvas.height - this.height - 50;
            this.velY = 0;
            this.onGround = true;
        }

        // Проверяем столкновение с платформами
        platforms.forEach(platform => {
            if (this.x + this.width > platform.x &&
                this.x < platform.x + platform.width &&
                this.y + this.height > platform.y &&
                this.y + this.height < platform.y + platform.height) {
                this.y = platform.y - this.height;
                this.velY = 0;
                this.onGround = true;
            }
        });
    }

    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Класс платформы
class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = 'brown';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Создаем игрока
const player = new Player();

// Создаем массив платформ
const platforms = [];
platforms.push(new Platform(200, canvas.height - 150, 100, 20));
platforms.push(new Platform(500, canvas.height - 250, 150, 20));
platforms.push(new Platform(800, canvas.height - 350, 100, 20));

// Функция игрового цикла
function gameLoop() {
    // Очищаем канвас
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем землю
    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    // Рисуем платформы
    platforms.forEach(platform => {
        platform.draw();
    });

    // Обновляем и рисуем игрока
    player.update();
    player.draw();

    // Запрашиваем следующий кадр анимации
    requestAnimationFrame(gameLoop);
}

// Запускаем игровой цикл
gameLoop();