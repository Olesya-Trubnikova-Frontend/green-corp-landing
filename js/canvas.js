const COLORS = ["255,108,80", "5,117,18", "29,39,57", "67,189,81"]; // цвета пузырьков
const BUBBLE_DENSITY = 100; // количество пузырьков

  function generateDecimalBetween(left, right) { // начальная позиция пузырька, его размер, скорость движения вверх, прозрачность цвета
      return (Math.random() * (left - right) + right).toFixed(2);
    }

  class Bubble { // размер, цвет, положение пузырьков
  constructor(canvas) {
    this.canvas = canvas;

    this.getCanvasSize(); // вызывает метод

    this.init(); // вызывает метод
  }

  getCanvasSize() {
    // вытаскивает из холста его размеры и сохраняет в переменные
    this.canvasWidth = this.canvas.clientWidth; // расчет положения точки на холсте
    this.canvasHeight = this.canvas.clientHeight; // расчет положения точки на холсте
  }

  init() {
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]; // случайный цвет пузырьков
    this.alpha = generateDecimalBetween(5, 10) / 10;
    this.size = generateDecimalBetween(1, 3); // размер пузырьков
    this.translateX = generateDecimalBetween(0, this.canvasWidth); // начальное положение на холсте
    this.translateY = generateDecimalBetween(0, this.canvasHeight); // начальное положение на холсте
    this.velocity = generateDecimalBetween(20, 40); // значение скорости
    this.movementX = generateDecimalBetween(-2, 2) / this.velocity; // движение пузырьков
    this.movementY = generateDecimalBetween(1, 20) / this.velocity; // движение пузырьков
  }

  move() {
   this.translateX = this.translateX - this.movementX; // обновляются координаты
   this.translateY = this.translateY - this.movementY; // обновляются координаты

   if (this.translateY < 0 || this.translateX < 0 || this.translateX > this.canvasWidth) {
     // цикл не дает выйти за границы пузырькам и возвращает их обратно
     this.init(); // вызывает метод
     this.translateY = this.canvasHeight;
   }
  }
}

class CanvasBackground { // рисует пузырьки на холсте и анимирует их
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
    this.dpr = window.devicePixelRatio;
  }

  start() { // запуск анимации
    this.canvasSize(); // подстраивает размер
    this.generateBubbles(); // создает пузырьки
    this.animate(); // анимирует
  }

  canvasSize() {
    this.canvas.width = this.canvas.offsetWidth * this.dpr;
    this.canvas.height = this.canvas.offsetHeight * this.dpr;

    this.ctx.scale(this.dpr, this.dpr);
  }

  animate() { 
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight); // очищаем холст

    this.bubblesList.forEach((bubble) => {
      bubble.move();
      this.ctx.translate(bubble.translateX, bubble.translateY);
      this.ctx.beginPath(); // начало отрисовки
      this.ctx.arc(0, 0, bubble.size, 0, 2 * Math.PI); // рисуем круг
      this.ctx.fillStyle = "rgba(" + bubble.color + "," + bubble.alpha + ")"; // закрашиваем круг
      this.ctx.fill(); // закрашиваем круг
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); // горизонтальное и вертикальное масштабирование
    });
    requestAnimationFrame(this.animate.bind(this)); // запуск анимации
  }

  generateBubbles() {
    this.bubblesList = [];
    for (let i = 0; i < BUBBLE_DENSITY; i++) {
      this.bubblesList.push(new Bubble(this.canvas));
    }
  }
}
const canvas = new CanvasBackground("orb-canvas"); // создает class
canvas.start(); // вызывает метод, запуск