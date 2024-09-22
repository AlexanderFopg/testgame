const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Игрок
const player = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    width: 40,
    height: 60,
    speed: 5,
    velocityX: 0,
    color: '#ff0000'
};

// Управление
const keys = {
    right: false,
    left: false
};

document.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowRight') {
        keys.right = true;
    } else if (event.code === 'ArrowLeft') {
        keys.left = true;
    }
});

document.addEventListener('keyup', function(event) {
    if (event.code === 'ArrowRight') {
        keys.right = false;
    } else if (event.code === 'ArrowLeft') {
        keys.left = false;
    }
});

// Игровой цикл
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function update() {
    // Обновление позиции игрока
    player.velocityX = 0;

    if (keys.right) {
        player.velocityX = player.speed;
    }
    if (keys.left) {
        player.velocityX = -player.speed;
    }

    player.x += player.velocityX;

    // Ограничение игрока границами канваса
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function render() {
    // Очистка канваса
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Рисование земли
    context.fillStyle = '#654321'; // Коричневый цвет земли
    context.fillRect(0, canvas.height - 20, canvas.width, 20);

    // Рисование игрока
    context.fillStyle = player.color;
    context.fillRect(player.x, player.y, player.width, player.height);
}

// Запуск игры
gameLoop();