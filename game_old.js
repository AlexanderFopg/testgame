// Получаем элементы канваса
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Устанавливаем размер канваса на весь экран
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Константы
const BLOCK_SIZE = 32; // Размер одного блока в пикселях
const WORLD_WIDTH = 500; // Ширина мира в блоках
const WORLD_HEIGHT = 500; // Высота мира в блоках

// Объект для хранения состояния нажатых клавиш
const keys = {
    right: false,
    left: false,
    up: false
};

// Обработчики событий нажатия и отпускания клавиш
window.addEventListener('keydown', function(e) {
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
    if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') keys.up = true;
});

window.addEventListener('keyup', function(e) {
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') keys.up = false;
});

// Типы блоков
const BLOCK_TYPES = {
    AIR: 0,
    GRASS: 1,
    DIRT: 2,
    STONE: 3
};

// Цвета блоков для отрисовки
const BLOCK_COLORS = {
    [BLOCK_TYPES.AIR]: null, // Прозрачный, не рисуем
    [BLOCK_TYPES.GRASS]: '#00ff00',
    [BLOCK_TYPES.DIRT]: '#a0522d',
    [BLOCK_TYPES.STONE]: '#808080'
};

// Генерация мира
const world = [];
function generateWorld() {
    for (let x = 0; x < WORLD_WIDTH; x++) {
        world[x] = [];
        // Сгенерируем поверхность с небольшой вариацией
        let surfaceHeight = Math.floor(WORLD_HEIGHT / 2) + Math.floor(Math.random() * 5 - 2);

        for (let y = 0; y < WORLD_HEIGHT; y++) {
            if (y < surfaceHeight) {
                world[x][y] = BLOCK_TYPES.AIR;
            } else if (y === surfaceHeight) {
                world[x][y] = BLOCK_TYPES.GRASS;
            } else if (y < surfaceHeight + 5) {
                world[x][y] = BLOCK_TYPES.DIRT;
            } else {
                world[x][y] = BLOCK_TYPES.STONE;
            }
        }
    }
}

// Класс игрока
class Player {
    constructor() {
        this.width = BLOCK_SIZE * 0.8;
        this.height = BLOCK_SIZE * 1.6;
        this.x = WORLD_WIDTH * BLOCK_SIZE / 2;
        this.y = BLOCK_SIZE * 10;
        this.speed = 5;
        this.velX = 0;
        this.velY = 0;
        this.gravity = 0.5;
        this.jumpStrength = 12;
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

        // Предиктивное столкновение по X
        let nextX = this.x + this.velX;
        if (!this.checkCollision(nextX, this.y)) {
            this.x = nextX;
        } else {
            // Коллизия по X
            this.velX = 0;
        }

        // Предиктивное столкновение по Y
        let nextY = this.y + this.velY;
        if (!this.checkCollision(this.x, nextY)) {
            this.y = nextY;
            this.onGround = false;
        } else {
            // Коллизия по Y
            if (this.velY > 0) {
                this.onGround = true;
            }
            this.velY = 0;
        }
    }

    checkCollision(x, y) {
        // Проверяем четыре угла игрока
        const corners = [
            { x: x, y: y },
            { x: x + this.width, y: y },
            { x: x, y: y + this.height },
            { x: x + this.width, y: y + this.height }
        ];
        for (let corner of corners) {
            let blockX = Math.floor(corner.x / BLOCK_SIZE);
            let blockY = Math.floor(corner.y / BLOCK_SIZE);
            if (blockX >= 0 && blockX < WORLD_WIDTH && blockY >= 0 && blockY < WORLD_HEIGHT) {
                if (world[blockX][blockY] !== BLOCK_TYPES.AIR) {
                    return true;
                }
            } else if (blockY >= WORLD_HEIGHT) {
                // Если ниже мира (падение)
                return true;
            }
        }
        return false;
    }

    draw() {
        // Позиция игрока относительно камеры
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;

        ctx.fillStyle = 'red';
        ctx.fillRect(drawX, drawY, this.width, this.height);
    }
}

// Камера
const camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,

    update() {
        // Центрируем камеру на игроке
        this.x = player.x + player.width / 2 - this.width / 2;
        this.y = player.y + player.height / 2 - this.height / 2;

        // Ограничиваем камеру границами мира
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        const maxX = WORLD_WIDTH * BLOCK_SIZE - this.width;
        const maxY = WORLD_HEIGHT * BLOCK_SIZE - this.height;
        if (this.x > maxX) this.x = maxX;
        if (this.y > maxY) this.y = maxY;
    }
};

// Создаем игрока
const player = new Player();

// Генерируем мир
generateWorld();

// Функция отрисовки мира
function drawWorld() {
    // Вычисляем видимые блоки
    const startX = Math.floor(camera.x / BLOCK_SIZE);
    const endX = Math.ceil((camera.x + camera.width) / BLOCK_SIZE);
    const startY = Math.floor(camera.y / BLOCK_SIZE);
    const endY = Math.ceil((camera.y + camera.height) / BLOCK_SIZE);

    for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
            if (x >= 0 && x < WORLD_WIDTH && y >= 0 && y < WORLD_HEIGHT) {
                const blockType = world[x][y];
                const color = BLOCK_COLORS[blockType];
                if (color) {
                    ctx.fillStyle = color;
                    ctx.fillRect(
                        x * BLOCK_SIZE - camera.x,
                        y * BLOCK_SIZE - camera.y,
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    );
                }
            }
        }
    }
}

// Функция игрового цикла
function gameLoop() {
    // Очищаем канвас
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Обновляем игрока
    player.update();

    // Обновляем камеру
    camera.update();

    // Рисуем мир
    drawWorld();

    // Рисуем игрока
    player.draw();

    // Запрашиваем следующий кадр анимации
    requestAnimationFrame(gameLoop);
}

// Запускаем игровой цикл
gameLoop();
