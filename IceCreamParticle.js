const G_ACCEL = 0.000025;  // Weaker gravity

class Particle {
    constructor(x, y, mass) {
        this.position = createVector(x, y);
        this.acceleration = createVector(0, 0);
        // Slow initial velocity
        this.velocity = createVector(random(-0.15, 0.15), random(-0.15, 0.15));
        this.mass = mass;
        this.radius = Math.sqrt(this.mass / PI) * SCALE;
        this.color = color(random(0, 255), random(0, 255), random(0, 255));
    }

    draw() {
        noStroke();
        fill(this.color);
        ellipse(this.position.x, this.position.y, this.radius * 2);
    }

    applyForce(force) {
        this.acceleration.add(p5.Vector.div(force, this.mass));
    }

    applyGravity() {
        let gravity = createVector(0, this.mass * G_ACCEL);
        this.applyForce(gravity);
    }

    // Cap the maximum velocity
    limitVelocity() {
        const maxSpeed = 0.7;  // Cap the maximum speed
        if (this.velocity.mag() > maxSpeed) {
            this.velocity.normalize().mult(maxSpeed);
        }
    }

    // Handle collision with another particle
    handleCollision(particle) {
        // Ensure that the passed particle is valid
        if (!particle || !particle.position) return;  // Early exit if the particle is invalid
    
        let distance = this.position.dist(particle.position);
        let minDist = this.radius + particle.radius;
    
        if (distance < minDist) {
            // Calculate the normal vector between the particles
            let collisionNormal = p5.Vector.sub(this.position, particle.position);
            collisionNormal.normalize();
            
            // Reflect the velocity vectors along the normal line
            let relativeVelocity = p5.Vector.sub(this.velocity, particle.velocity);
            let speed = relativeVelocity.dot(collisionNormal);
            
            // If the particles are moving towards each other, reverse and slow down
            if (speed < 0) {
                let collisionImpulse = collisionNormal.mult(speed * 0.5);  // Use a smaller impulse for a slower result
    
                this.velocity.sub(collisionImpulse);  // Reduce speed along collision normal
                particle.velocity.add(collisionImpulse);  // Reverse the particle's velocity along the normal
    
                // Slow down both particles significantly after collision
                this.velocity.mult(0.2);
                particle.velocity.mult(0.2);
    
                // Move particles apart to avoid overlap
                let overlap = minDist - distance;
                let separation = collisionNormal.mult(overlap / 2);
                this.position.add(separation);
                particle.position.sub(separation);
            }
        }
    }
    
    physics(particle) {
        this.handleCollision(particle);  // Handle collision

        this.applyGravity();  // Apply gravity

        let deltaVelocity = p5.Vector.mult(this.acceleration, deltaTime);
        this.velocity.add(deltaVelocity);
        this.position.add(p5.Vector.mult(this.velocity, deltaTime));  // Update position

        // Boundary collisions (with wall)
        if (this.position.x - this.radius < 0 || this.position.x + this.radius > width) {
            this.velocity.x *= -0.3;  // Reverse and dampen horizontal velocity
            this.position.x = constrain(this.position.x, this.radius, width - this.radius);
        }

        if (this.position.y - this.radius < 0 || this.position.y + this.radius > height) {
            this.velocity.y *= -0.3;  // Reverse and dampen vertical velocity
            this.position.y = constrain(this.position.y, this.radius, height - this.radius);
        }

        this.acceleration.set(0, 0);  // Reset acceleration after applying forces
    }
}
