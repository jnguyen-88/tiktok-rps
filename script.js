const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const instances = [];
const bufferSize = 10; // Buffer space from the edges of the canvas
const speed = 3; // Adjust the speed

// Image paths
const imagePaths = {
  rock: './images/rock.png',
  paper: './images/paper.png',
  scissors: './images/scissors.png'
};

// Preload images
const images = {};
Object.keys(imagePaths).forEach((key) => {
  const img = new Image();
  img.src = imagePaths[key];
  images[key] = img;
});

// Generate instances for each hand
const hands = ['rock', 'paper', 'scissors'];

hands.forEach((hand) => {
  for (let i = 0; i < 50; i++) {
    let x = Math.random() * (canvas.width - bufferSize * 2) + bufferSize;
    let y = Math.random() * (canvas.height - bufferSize * 2) + bufferSize;

    const angle = Math.random() * Math.PI * 2;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;

    instances.push({
      hand: hand,
      x: x,
      y: y,
      size: 20,
      speed: speed,
      dx: dx,
      dy: dy,
      image: images[hand]
    });
  }
});

function drawInstance(instance) {
  ctx.drawImage(
    instance.image,
    instance.x - instance.size / 2,
    instance.y - instance.size / 2,
    instance.size,
    instance.size
  );
}

function restartGame() {
  // Clear the instances array
  instances.length = 0;
}

function updateInstances() {
  let allSame = true;
  let winningHand = instances[0].hand;

  instances.forEach((instance) => {
    instance.x += instance.dx;
    instance.y += instance.dy;

    // Check for collisions with other instances
    instances.forEach((otherInstance) => {
      if (instance !== otherInstance && collides(instance, otherInstance)) {
        handleCollision(instance, otherInstance);
      }
    });

    // Bounce off the sides
    if (
      instance.x + instance.size > canvas.width ||
      instance.x - instance.size < bufferSize
    ) {
      instance.dx *= -1;
    }

    // Bounce off the top and bottom
    if (
      instance.y + instance.size > canvas.height ||
      instance.y - instance.size < bufferSize
    ) {
      instance.dy *= -1;
    }

    if (instance.hand !== winningHand) {
      allSame = false;
    }
  });

  // Alert of The Winner
  if (allSame) {
    const winningHandName =
      winningHand.charAt(0).toUpperCase() + winningHand.slice(1);
    alert(`${winningHandName} Wins!`);
    restartGame(); // Restart the game after the alert
  }
}

update();

function collides(instance1, instance2) {
  return (
    Math.abs(instance1.x - instance2.x) < instance1.size &&
    Math.abs(instance1.y - instance2.y) < instance1.size
  );
}

function handleCollision(instance1, instance2) {
  // Check the type of collision and then change the image accordingly
  if (instance1.hand === 'rock' && instance2.hand === 'paper') {
    instance1.hand = 'paper';
    instance1.image = images['paper'];
  } else if (instance1.hand === 'paper' && instance2.hand === 'scissors') {
    instance1.hand = 'scissors';
    instance1.image = images['scissors'];
  } else if (instance1.hand === 'scissors' && instance2.hand === 'rock') {
    instance1.hand = 'rock';
    instance1.image = images['rock'];
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  instances.forEach(drawInstance);
}

function update() {
  updateInstances();
  draw();
  requestAnimationFrame(update);
}
