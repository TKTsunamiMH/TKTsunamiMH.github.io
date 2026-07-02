// Game constants
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 2.5;
const ENEMY_SPEED = 1;
const GAME_WIDTH = 800;

// Game state
let gameState = {
  score: 0,
  level: 1,
  lives: 3,
  gameRunning: true,
  keys: {}
};

// Player object
let player = {
  element: document.getElementById('arcanine'),
  x: 50,
  y: 331,
  width: 35,
  height: 29,
  velocityX: 0,
  velocityY: 0,  
  prevX: 50,
  prevY: 331,
  grounded: false,
  facing: 'right',
  state: 'idle',
  attackTimer: 0,
  ap: 0,
  infiniteAP: false
};

// Game objects arrays
let gameObjects = {
  platforms: [],
  enemies: [],
  coins: [],
  surpriseBlocks: [],
  stumps: [],
  fireballs: [],
  growlithe: []
};

// Levels
const levels = [
  // Level 1
  {
    platforms: [
      // Left ground
      { x: 0, y: 380, width: 400, height: 20, type: 'ground' },
      { x: 0, y: 360, width: 400, height: 20, type: 'groundGrass' },
      // Right ground
      { x: 500, y: 380, width: 300, height: 20, type: 'ground' },
      { x: 500, y: 360, width: 300, height: 20, type: 'groundGrass' },
      // Floating
      { x: 200, y: 280, width: 60, height: 20, type: 'floating'},
      { x: 300, y: 240, width: 60, height: 20, type: 'floating'},
      { x: 600, y: 280, width: 80, height: 20, type: 'floating'}
    ],
    enemies: [
      { x: 250, y: 335, type: 'spearow'},
      { x: 550, y: 335, type: 'spearow'}
    ],
    coins: [
      { x: 220, y: 260},
      { x: 320, y: 220},
      { x: 620, y: 260}
    ],
    surpriseBlocks: [
      { x: 320, y: 180, type: 'leppaBerry'}
    ],
    stumps: [
      { x: 760, y: 330}
    ],
    growlithe: []
  },
  // Level 2
  {
    platforms: [
      // Left Ground
      { x: 0, y: 380, width: 200, height: 20, type: 'ground' },
      { x: 0, y: 360, width: 200, height: 20, type: 'groundGrass' },
      // Middle Ground
      { x: 300, y: 380, width: 200, height: 20, type: 'ground' },
      { x: 300, y: 360, width: 200, height: 20, type: 'groundGrass' },
      // Right Ground
      // { x: 600, y: 360, width: 200, height: 40, type: 'blue'},
      { x: 600, y: 380, width: 200, height: 20, type: 'ground' },
      { x: 600, y: 360, width: 200, height: 20, type: 'groundGrass' },
      // Floating platforms
      { x: 150, y: 300, width: 40, height: 20, type: 'floating'},
      { x: 250, y: 280, width: 40, height: 20, type: 'floating'},
      { x: 350, y: 260, width: 40, height: 20, type: 'floating'},
      { x: 450, y: 240, width: 40, height: 20, type: 'floating'},
      { x: 550, y: 280, width: 60, height: 20, type: 'floating'}
    ],
    enemies: [
      { x: 350, y: 320, type: 'fearow'},
      { x: 650, y: 320, type: 'fearow'},
      { x: 570, y: 260, type: 'spearow'}
    ],
    coins: [
      { x: 170, y: 280},
      { x: 270, y: 260},
      { x: 370, y: 240},
      { x: 470, y: 220},
      { x: 570, y: 260}
    ],
    surpriseBlocks: [
      { x: 200, y: 260, type: 'coin'},
      { x: 400, y: 220, type: 'leppaBerry'}
    ],
    stumps: [
      { x: 760, y: 330}
    ],
    growlithe: []
  },
  // Level 3
  {
    platforms: [
      // Left Ground
      { x: 0, y: 380, width: 500, height: 20, type: 'ground-dry' },
      { x: 0, y: 360, width: 500, height: 20, type: 'groundGrass-dry' },
      // Right ground
      { x: 700, y: 380, width: 100, height: 20, type: 'ground-dry' },
      { x: 700, y: 360, width: 100, height: 20, type: 'groundGrass-dry' },
      // Floating
      { x: 150, y: 300, width: 40, height: 20, type: 'groundGrass-dry'},
      { x: 250, y: 280, width: 60, height: 20, type: 'groundGrass-dry'},
      { x: 350, y: 260, width: 40, height: 20, type: 'groundGrass-dry'},
      { x: 450, y: 240, width: 40, height: 20, type: 'groundGrass-dry'}
    ],
    enemies: [
      { x: 750, y: 210, type: 'fearow-shiny'},
      { x: 230, y: 320, type: 'fearow'},
      { x: 260, y: 255, type: 'spearow'},
    ],
    coins: [],
    surpriseBlocks: [
      { x: 200, y: 260, type: 'leppaBerry-infinite'}
    ],
    stumps: [],
    growlithe: [
      { x: 758, y: 242 }
    ]
  }
];

// Initialize game
function initGame() {
  loadLevel(gameState.level -1);
  gameLoop();
}

function loadLevel(levelIndex) {
  if(levelIndex >= levels.length) {
    showGameOver(true)
    return;
  }

  // Clearing existing objects
  clearLevel();

  const level = levels[levelIndex];
  const gameArea = document.getElementById('game-area');

  // Reset player
  resetPlayer();
  updateElementPosition(player.element, player.x, player.y);

  // Create platforms
  createPlatforms(level, gameArea);

  // Create enemies
  createEnemies(level, gameArea);

  // Create growlithe
  createGrowlithe(level, gameArea);

  // Create coins
  createCoins(level, gameArea);

  // Create surprise blocks
  createSurpriseBlocks(level, gameArea);

  // Create stumps
  createStumps(level, gameArea);
}

function createPlatforms(level, gameArea) {
    level.platforms.forEach((platformData, index) => {
    const platform = createDiv(`platform ${platformData.type}`, {
      left: platformData.x + 'px',
      top: platformData.y + 'px',
      width: platformData.width + 'px',
      height: platformData.height + 'px'
    });
    gameArea.appendChild(platform);
    gameObjects.platforms.push({
      element: platform,
      ...platformData,
      id: 'platform-' + index
    });
  });
}

function createEnemies(level, gameArea) {
  level.enemies.forEach((enemyData, index) => {
    const enemy = createDiv(`enemy ${enemyData.type} left`, {
      left: enemyData.x + 'px',
      top: enemyData.y + 'px'
    });

    let enemyWidth = 20;
    let enemyHeight = 20;
    let enemyLife = 1;

    if(enemyData.type === 'fearow') {
      enemyWidth = 35;
      enemyHeight = 40;
    }

    if(enemyData.type === 'fearow-shiny') {
      enemyWidth = 35;
      enemyHeight = 40;
      enemyLife = 5;
    }

    gameArea.appendChild(enemy);
    gameObjects.enemies.push({
      element: enemy,
      type: enemyData.type,
      x: enemyData.x,
      y: enemyData.y,
      originX: enemyData.x,
      originY: enemyData.y,
      width: enemyWidth,
      height: enemyHeight,
      direction: -1,
      verticalDirection: -1,
      verticalSpeed: 1.5,
      minY: 0,
      maxY: 280,
      speed: ENEMY_SPEED,
      life: enemyLife,
      hurtTimer: 0,
      id: 'enemy-' + index,
      alive: true
    });
  });
}

function createCoins(level, gameArea){
  level.coins.forEach((coinData, index) => {
    const coin = createDiv(`coin ${coinData.type}`, {
      left: coinData.x + 'px',
      top: coinData.y + 'px'
    });
    gameArea.appendChild(coin);
    gameObjects.coins.push({
      element: coin,
      x: coinData.x,
      y: coinData.y,
      width: 20,
      height: 20,
      collected: false,
      id: 'coin-' + index
    });
  });
}

function createSurpriseBlocks(level, gameArea) {
  level.surpriseBlocks.forEach((blockData, index) => {
    const block = createDiv(`surprise-block`, {
      left: blockData.x + 'px',
      top: blockData.y + 'px'
    });
    gameArea.appendChild(block);
    gameObjects.surpriseBlocks.push({
      element: block,
      x: blockData.x,
      y: blockData.y,
      width: 20,
      height: 20,
      type: blockData.type,
      hit: false,
      id: 'block-' + index
    });
  });
}

function createStumps(level, gameArea) {
  level.stumps.forEach((stumpData, index) => {
    const stump = createDiv('stump', {
      left: stumpData.x + 'px',
      top: stumpData.y + 'px'
    });

    gameArea.appendChild(stump);

    gameObjects.stumps.push({
      element: stump,
      x: stumpData.x,
      y: stumpData.y,
      width: 40,
      height: 40,
      id: 'stump-' + index
    });
  });
}

function createGrowlithe(level, gameArea) {
  if (!level.growlithe || level.growlithe.length === 0)
    return;

  level.growlithe.forEach((growlitheData, index) => {
    const growlithe = createDiv('growlithe', {
      left: growlitheData.x + 'px',
      top: growlitheData.y + 'px'
    });

    gameArea.appendChild(growlithe);

    gameObjects.growlithe.push({
      element: growlithe,
      x: growlitheData.x,
      y: growlitheData.y,
      width: 19,
      height: 19,
      direction: -1,
      offsetX: 8,
      offsetY: 32,
      velocityY: 0,
      falling: false,
      rescued: false,
      id: 'growlithe-' + index
    });
  });

  updateGrowlitheDirection(gameObjects.growlithe[gameObjects.growlithe.length - 1]);
}

function createDiv(className, styles = {}) {
  const div = document.createElement('div');
  div.className = className;
  Object.assign(div.style, styles);
  return div;
}

function updateElementPosition(element, x, y) {
  element.style.left = x + 'px';
  element.style.top = y + 'px';
}

function showGameOver(won) {
  gameState.gameRunning = false;
  document.getElementById('game-over-title').textContent = won ? 'Congratulations! You won!' : 'Game Over!';
  document.getElementById('final-score').textContent = gameState.score;
  document.getElementById('game-over').style.display = 'block';
}

function clearLevel() {
  // const gameArea = document.getElementById('game-area');

  Object.values(gameObjects).flat().forEach(obj => {
    if(obj.element && obj.element.parentNode) {
      obj.element.remove();
    }
  })

  gameObjects = {
    platforms: [],
    enemies: [],
    coins: [],
    surpriseBlocks: [],
    stumps: [],
    fireballs: [],
    growlithe: []
  }
}

// Input handling
document.addEventListener('keydown', (e) => {
  gameState.keys[e.code] = true;

  if(e.code === "Space") {
    e.preventDefault();
  }
})

document.addEventListener('keyup', (e) => {
  gameState.keys[e.code] = false;
})

// Game loop
function gameLoop() {
  if(!gameState.gameRunning)
    return;

  update();
  requestAnimationFrame(gameLoop);
}

// Update game logic
function update() {
  handleInput();  
  applyPhysics();
  movePlayer();
  keepPlayerInsideGameArea();

  player.grounded = false;

  handlePlatformCollisions();
  handleStumpCollisions();
  updateEnemies();
  updateGrowlithe();
  collectCoins();
  handleSurpriseBlocks();
  handleStumpExit();
  checkFallDeath();
  updateFireballs();

  updateElementPosition(player.element, player.x, player.y);
  updatePlayerAnimation();
  updateUI();
}

function handleInput() {
  // Handles left and right
  if(gameState.keys['ArrowLeft'] || gameState.keys['KeyA']) {
    player.velocityX = -MOVE_SPEED;
    setPlayerFacing('left');
  }
  else if(gameState.keys['ArrowRight'] || gameState.keys['KeyD']) {
    player.velocityX = MOVE_SPEED;
    setPlayerFacing('right');
  }
  else {
    player.velocityX *= 0.8;
  }

  // Handle jumping
  if(gameState.keys['Space'] && player.grounded) {
    player.velocityY = JUMP_FORCE;
    player.grounded = false;
  }

  if (gameState.keys['KeyE']) {
    shootFireball();
    gameState.keys['KeyE'] = false;
  }
}

function setPlayerState(newState) {
  if (player.state === newState) {
    return;
  }

  player.state = newState;
  updatePlayerClass();
}


function setPlayerFacing(newFacing) {
  if (player.facing === newFacing) {
    return;
  }

  player.facing = newFacing;
  updatePlayerClass();
}

function updatePlayerClass() {
  player.element.className = `${player.state} ${player.facing}`;
}


function updatePlayerAnimation() {
  if (player.attackTimer > 0) {
    player.attackTimer--;
    setPlayerState('attack');
    return;
  }

  const movingLeft = gameState.keys['ArrowLeft'] || gameState.keys['KeyA'];
  const movingRight = gameState.keys['ArrowRight'] || gameState.keys['KeyD'];
  const moving = movingLeft || movingRight;

  if (!player.grounded) {
    setPlayerState('jumping');
  } else if (moving) {
    setPlayerState('running');
  } else {
    setPlayerState('idle');
  }
}

function applyPhysics() {
  //Apply gravity
  if(!player.grounded) {
    player.velocityY += GRAVITY;
  }
}

function movePlayer() {
  // Update player position
  player.prevX = player.x;
  player.prevY = player.y;

  player.x += player.velocityX;
  player.y += player.velocityY;
}

function keepPlayerInsideGameArea() {
  // Left wall
  if (player.x < 0) {
    player.x = 0;
    player.velocityX = 0;
  }

  // Right wall
  if (player.x + player.width > GAME_WIDTH) {
    player.x = GAME_WIDTH - player.width;
    player.velocityX = 0;
  }
}

function handlePlatformCollisions() {
  // Platform collision
  for (let platform of gameObjects.platforms) {
    const playerFeet = player.y + player.height;
    const previousFeet = player.prevY + player.height;

    const horizontallyOverlapping =
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x;

    const landing =
      player.velocityY >= 0 &&
      previousFeet <= platform.y &&
      playerFeet >= platform.y;

    if (horizontallyOverlapping && landing) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      player.grounded = true;
    }
  }
}

function handleStumpCollisions() {
  // Stump collision
  for (let stump of gameObjects.stumps) {
    const playerFeet = player.y + player.height;
    const previousFeet = player.prevY + player.height;

    const horizontallyOverlapping =
      player.x < stump.x + stump.width &&
      player.x + player.width > stump.x;

    const landing =
      player.velocityY >= 0 &&
      previousFeet <= stump.y &&
      playerFeet >= stump.y;

    if (horizontallyOverlapping && landing) {
      player.y = stump.y - player.height;
      player.velocityY = 0;
      player.grounded = true;
    }
  }
}

function updateEnemies() {
  // Enemy movement and collision
  for (let enemy of gameObjects.enemies) 
  {
      if(!enemy.alive)
        continue;

      if (enemy.hurtTimer > 0) {
        enemy.hurtTimer--;

        updateElementPosition(enemy.element, enemy.x, enemy.y);

        if (enemy.hurtTimer === 0) {
          if (enemy.life <= 0) {
            enemy.alive = false;
            enemy.element.remove();
            gameState.score += 100;
            continue;
          }

          updateEnemyDirection(enemy, enemy.type);
        }
        continue;
      }

      if (enemy.type === 'fearow-shiny') {
        enemy.y += enemy.verticalSpeed * enemy.verticalDirection;

        if (enemy.y <= enemy.minY) {
          enemy.y = enemy.minY;
          enemy.verticalDirection = 1;
        }

        if (enemy.y >= enemy.maxY) {
          enemy.y = enemy.maxY;
          enemy.verticalDirection = -1;
        }
      }
      else {
        enemy.x += enemy.speed * enemy.direction;

        if(!isEnemyOnPlatform(enemy) || isEnemyTouchingStump(enemy) || enemy.x <= 0 || enemy.x + enemy.width >= GAME_WIDTH) {
          enemy.direction *= -1;
          updateEnemyDirection(enemy, enemy.type);
        }
      }
    updateElementPosition(enemy.element, enemy.x, enemy.y);

    // Check player-enemy collision
    if(checkCollision(player, enemy)) {
      if(player.velocityY > 0 && player.y < enemy.y) {
        // Jump on enemy
        enemyLoseLife(enemy);
        player.velocityY = JUMP_FORCE * 0.7;
        
      }
      else {
        // Hit by enemy
        resetPlayersAP();
        if(player.grounded) {
          loseLife();
        }
      }
    }
  }
}

function updateEnemyDirection(enemy, type) {
  if (enemy.direction === -1) {
    enemy.element.className = `enemy  ${type} left`;
  } else {
    enemy.element.className = `enemy  ${type} right`;
  }
}

 function enemyLoseLife(enemy) {
  enemy.life--;
  enemy.hurtTimer = 7;
  updateEnemyHurtClass(enemy);
}

function updateEnemyHurtClass(enemy) {
  const directionClass = enemy.direction === -1 ? 'left' : 'right';
  enemy.element.className = `enemy ${enemy.type} hurt ${directionClass}`;
}

function updateGrowlithe() {
  if(gameObjects.growlithe.length === 0)
    return;

  const shinyFearow = gameObjects.enemies.find(enemy =>
    enemy.type === 'fearow-shiny' && enemy.alive
  );

  for (let growlithe of gameObjects.growlithe) {
    if (growlithe.rescued)
      continue;

    if (shinyFearow && !growlithe.falling) {
      growlithe.x = shinyFearow.x + growlithe.offsetX;
      growlithe.y = shinyFearow.y + growlithe.offsetY;

      if (growlithe.direction !== shinyFearow.direction) {
        growlithe.direction = shinyFearow.direction;
        updateGrowlitheDirection(growlithe);
      }

    updateElementPosition(growlithe.element, growlithe.x, growlithe.y);
    continue;
  }
    
    growlithe.falling = true;
    growlithe.velocityY += GRAVITY;
    growlithe.y += growlithe.velocityY;

    for (let platform of gameObjects.platforms) {
      const growlitheFeet = growlithe.y + growlithe.height;

      const horizontallyOverlapping =
        growlithe.x < platform.x + platform.width &&
        growlithe.x + growlithe.width > platform.x;

      const landing =
        growlitheFeet >= platform.y &&
        growlitheFeet <= platform.y + 10;

      if (horizontallyOverlapping && landing) {
        growlithe.y = platform.y - growlithe.height;
        growlithe.velocityY = 0;
        growlithe.falling = false;
        growlithe.rescued = true;

        updateElementPosition(growlithe.element, growlithe.x, growlithe.y);

        showGameOver(true);
        return;
      }
    }

    updateElementPosition(growlithe.element, growlithe.x, growlithe.y);
  }
}

function updateGrowlitheDirection(growlithe) {
  if (growlithe.direction === -1) {
    growlithe.element.className = 'growlithe left';
  } else {
    growlithe.element.className = 'growlithe right';
  }
}

function collectCoins() {
  // Coin collection
  for(let coin of gameObjects.coins) {
    if(!coin.collected && checkCollision(player, coin)) {
      coin.collected = true;
      coin.element.remove();
      gameState.score += 50;
    }
  }
}

function handleSurpriseBlocks() {
  // Surprise blocks
  for(let block of gameObjects.surpriseBlocks) {
    if(!block.hit && checkCollision(player, block) && player.velocityY < 0) {
      block.hit = true;
      block.element.classList.add('hit');
      spawnItemOnBox(block, block.type);

      if(block.type === 'leppaBerry') {
        player.ap = 5,
        gameState.score += 100;
      }
      else if(block.type === 'leppaBerry-infinite') {
        player.infiniteAP = true;
        player.ap = 9999;
        gameState.score += 100;
      }
      else if (block.type === 'coin') {
        gameState.score += 50;
      }
    }
  }
}

function isPlayerOnStump(stump) {
  return (
    player.grounded &&
    player.x + player.width > stump.x &&
    player.x < stump.x + stump.width &&
    Math.abs(player.y + player.height - stump.y) < 5
  );
}

function isPressingDown() {
  return gameState.keys['ArrowDown'] || gameState.keys['KeyS'];
}

function handleStumpExit() {
  // Stump interaction to next level
  for (const stump of gameObjects.stumps) {
    if (isPlayerOnStump(stump) && isPressingDown()) {
      nextLevel();
      break;
    }
  }
}

function checkFallDeath() {
  // Fall death
  if(player.y > 400) {
    loseLife();
  }
}

function updateUI() {
  // Update UI score, level and life
  document.getElementById('score').textContent = gameState.score;
  document.getElementById('level').textContent = gameState.level;
  document.getElementById('lives').textContent = gameState.lives;

  if(!player.infiniteAP){
    document.getElementById('ap').textContent = player.ap + '/5';
  }    
  else {
    document.getElementById('ap').textContent = '∞/∞';
  }
}

function checkCollision(element1, element2) {
  return element1.x < element2.x + element2.width &&
  element1.x + element1.width > element2.x &&
  element1.y < element2.y + element2.height &&
  element1.y + element1.height > element2.y;
}

function isEnemyOnPlatform(enemy) {
  return gameObjects.platforms.some(platform => {
    const enemyFeetY = enemy.y + enemy.height;

    const edgeX =
      enemy.direction === 1
        ? enemy.x + enemy.width
        : enemy.x;

    return (
      edgeX >= platform.x &&
      edgeX <= platform.x + platform.width &&
      enemyFeetY >= platform.y - 5 &&
      enemyFeetY <= platform.y + 5
    );
  });
}

function isEnemyTouchingStump(enemy) {
  return gameObjects.stumps.some(stump => checkCollision(enemy, stump));
}

function shootFireball() {
  if (gameObjects.fireballs.length > 0) {
    return;
  }

  if (!player.infiniteAP && player.ap <= 0) return;

  if (!player.infiniteAP) {
    player.ap--;
  }

  player.attackTimer = 15;
  setPlayerState('attack');
  
  const gameArea = document.getElementById('game-area');

  const direction = player.facing === 'right' ? 1 : -1;

  const fireball = spawnFireball();

  const startX = player.facing === 'right'
  ? player.x + player.width + 5
  : player.x - 15 - 5;

  const maxDistance = player.infiniteAP
  ? (player.facing === 'right'
      ? GAME_WIDTH - startX
      : startX)
  : 80;

  gameArea.appendChild(fireball);

  gameObjects.fireballs.push({
    element: fireball,
    x: player.facing === 'right'
      ? player.x + player.width + 5
      : player.x - 15 - 5,
    y: player.y + player.height / 2 - 3,
    width: 15,
    height: 9,
    direction,
    speed: 3,
    distance: 0,
    maxDistance: maxDistance
  });
}

function spawnFireball() {
  return createDiv(`fireball ${player.facing}`, {
    left: player.facing === 'right'
      ? player.x + player.width + 5 + 'px'
      : player.x - 15 - 5 + 'px',
    top: player.y + player.height / 2 - 3 + 'px'
  });
}

function updateFireballs() {
  for (let i = gameObjects.fireballs.length - 1; i >= 0; i--) {
    const fireball = gameObjects.fireballs[i];

    fireball.x += fireball.speed * fireball.direction;
    fireball.distance += fireball.speed;

    let hitEnemy = false;

    for (let enemy of gameObjects.enemies) {
      if (!enemy.alive) continue;

      if (checkCollision(fireball, enemy)) {
        // Kill enemy
        enemyLoseLife(enemy);

        // Destroy fireball
        fireball.element.remove();
        gameObjects.fireballs.splice(i, 1);

        gameState.score += 100;

        hitEnemy = true;
        break;
      }
    }

    if (hitEnemy) {
      continue;
    }

    if (fireball.distance >= fireball.maxDistance) {
      fireball.element.remove();
      gameObjects.fireballs.splice(i, 1);
      continue;
    }

    updateElementPosition(
      fireball.element,
      fireball.x,
      fireball.y
    );
  }
}

function spawnItemOnBox(block, type) {
  const gameArea = document.getElementById('game-area');
  const item = document.createElement('div')
  item.classList.add(type);
  item.style.left = block.x + 'px';
  item.style.top = (block.y - 20) + 'px';
  gameArea.appendChild(item);

  const itemObj = {
    x: block.x,
    y: block.y - 20,
    width: 20,
    height: 20,
    element: item,
    velocityY: 0,
    frames: 0
  }

  if(type === 'leppaBerry' || type === 'leppaBerry-infinite') {
    function fall() {
      itemObj.velocityY += GRAVITY;
      itemObj.y += itemObj.velocityY;

      let onPlatform = false;

      for(let platform of gameObjects.platforms) {
        if(itemObj.x < platform.x + platform.width &&
          itemObj.x + itemObj.width > platform.x &&
          itemObj.y + itemObj.height >= platform.y &&
          itemObj.y + itemObj.height <= platform.y + 5 
        ) {
          onPlatform = true;
          itemObj.y = platform.y - itemObj.height;
          itemObj.velocityY = 0;
          item.remove();
          break;
        }
      }

      item.style.top = itemObj.y + 'px';

      if(!onPlatform) {
        requestAnimationFrame(fall);
      }
    }

    fall();

  }
  else if(type === 'coin') {
    function floatUp() {
      itemObj.y -=1;
      item.style.top = itemObj.y + 'px';
      itemObj.frames++;

      if(itemObj.frames < 180) {
        requestAnimationFrame(floatUp);        
      }
      else {
        item.remove();
      }
    }

    floatUp();
  }
}

function loseLife() {
  gameState.lives--;
  if(gameState.lives <= 0) {
    console.log(gameState.lives)
    showGameOver(false);
  }
  else {
    resetPlayer();
    resetEnemies();
  }
}

function nextLevel() {
  gameState.level++;
  if(gameState.level > levels.length)
  {
    showGameOver(true);
  }
  else {
    loadLevel(gameState.level - 1);
  }
}

function restartGame() {
  gameState = {
    score: 0,
    level: 1,
    lives: 3,
    gameRunning: true,
    keys: {}
  }

  resetPlayer();

  document.getElementById('game-over').style.display = 'none';
  initGame();
}

function resetPlayer() {
  player.x = 50;
  player.y = 331;
  player.velocityX = 0;
  player.velocityY = 0;
  player.prevX = player.x;
  player.prevY = player.y;
  player.facing = 'right';
  player.state = 'idle';

  updatePlayerAnimation();

  resetPlayersAP();
}

function resetPlayersAP() {
  if(player.ap === 0)
    return;

  if(player.infiniteAP && gameState.level == 3)
    return;

  player.ap = 0;
  player.infiniteAP = false;
  player.attackTimer = 0;
}

function resetEnemies() {
  for (let enemy of gameObjects.enemies) {
    enemy.x = enemy.originX;
    enemy.y = enemy.originY;
  }
}

document.getElementById('restart-button').addEventListener('click', restartGame);

// Start Game
initGame();