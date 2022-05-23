const WIDTH = 500, HEIGHT = 500;
const JUMP_STRENGHT = -10;
const GAME_SPEED = 5;
const START = 0, PLAYING = 1, LOST = 2;
let canvas, ctx, frames = 0, gravity = 0.8, currentState = 0;

let ground = {
  x: 0,
  y: 0,
  height: HEIGHT * 0.1,
  color: 'black',

  draw: function() {
    this.y = HEIGHT - this.height;
    ctx.fillStyle = this.color;
    ctx.fillRect(0, this.y, WIDTH, this.height);
  }
};

let player = {
  width: 50,
  height: 50,
  x: 50,
  y: HEIGHT / 2,
  speed: 0,

  draw: function() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },

  update: function() {
    this.speed += gravity;
    this.y += this.speed;
    
    if (this.y > ground.y - this.height && currentState != LOST) {
      this.y = ground.y - this.height;
    }

    else if (this.y < 0) {
      this.y = 0;
    }
  },

  jump: function () {
    this.speed = JUMP_STRENGHT;
  },
}

let obstacles = {
  obs_list: [],

  insert: function() {
    let rand_height = 50 + Math.floor(Math.random() * 201);
    this.obs_list.push({
      x: WIDTH,
      width: 50,
      height: rand_height,
      height2: HEIGHT - rand_height - 200 - Math.floor(Math.random() * 51),
      color: 'green',
    });
  },

  update: function() {
    for (let obs of this.obs_list) {
      obs.x -= GAME_SPEED;

      if (obs.x <= -obs.width) {
        this.obs_list.splice(obs, 1);
      }
    }
  },

  draw: function() {
    for (let obs of this.obs_list) {
      ctx.fillStyle = obs.color;
      ctx.fillRect(obs.x, ground.y - obs.height, obs.width, obs.height);
      ctx.fillRect(obs.x, 0, obs.width, obs.height2);
    }
  }
}

function main() {
  canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  canvas.style.border = '1px black solid';
  canvas.style.background = 'lightblue';

  ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  currentState = START;
  
  document.addEventListener('mousedown', () => {
    if (currentState == LOST) {
      obstacles.obs_list = [];
      currentState = START;
    } else if (currentState == START) {
      currentState = PLAYING;
    } else if (currentState == PLAYING) {
      jump();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key == ' ') {
      if (currentState == LOST) {
        obstacles.obs_list = [];
        currentState = START;
      } else if (currentState == START) {
        currentState = PLAYING;
      } else if (currentState == PLAYING) {
        jump();
      }
    }
  });

  runGame();
}

function runGame() {
  update();
  draw();
  
  window.requestAnimationFrame(runGame);
}

function update() {
  if (frames % 60 == 0 && currentState == PLAYING) {
    obstacles.insert();
  }
  checkColision();
  frames++;

  if (currentState == PLAYING) {
    obstacles.update();
  }
  player.update();
}

function draw() {
  ctx.fillStyle = 'lightblue';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (currentState == START) {
    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(WIDTH / 2 - 25, HEIGHT / 2 - 25, 50, 50);
  } else if (currentState == LOST) {
    ctx.fillStyle = 'red';
    ctx.fillRect(WIDTH / 2 - 25, HEIGHT / 2 - 25, 50, 50);
  }

  ground.draw();
  obstacles.draw();
  player.draw();
}

function jump (event) {
  player.jump();
}

function checkColision() {
  if (obstacles.obs_list.length != 0) {
    let obs = obstacles.obs_list[0];

    if (player.x + player.width >= obs.x && player.x <= obs.x + obs.width) {
      if (player.y + player.height >= ground.y - obs.height) {
        currentState = LOST;
      } else if (player.y <= obs.height2) {
        currentState = LOST;
      }
    }
  }
}