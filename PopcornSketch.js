// Constants
const G = 6.67e-11
const SCALE = 0.001

// Array to store particles
let particles = []

function setup() {
  createCanvas(400, 400);

  // Create initial particles
  for (let i = 0; i < 2; i++) {
    let x = random(0, width);
    let y = random(0, height);
    let mass = random(2e8, 1e9);
    
    particles.push(new Particle(x, y, mass));
  }

  const playButton = document.getElementById('nice balls gang');
  playButton.addEventListener('click', function() {
    let x = random(0, width);
    let y = random(0, height);
    let mass = random(2e8, 1e9);
    
    particles.push(new Particle(x, y, mass));
  });
}
const slowdownFactor = 0.1; // Global slowdown factor

function draw() {
    // Set the background of the canvas to a dark gray
    background(51, 51, 51);

    // Loop all particles twice to handle physics
    for (const particleA of particles)
        for (const particleB of particles)
            if (particleA !== particleB) particleA.physics(particleB);

    // Loop through particles to update and draw
    for (const particle of particles) {
        // Update the particle with the new physics calculations
        particle.physics();
        // Draw the particle on the canvas
        particle.draw();
    }
}