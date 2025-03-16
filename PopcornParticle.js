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

    handleCollision(particle) {
        if (!particle) return;
        if (this === particle) return;

        let distance = this.position.dist(particle.position);
        let totalRadius = this.radius + particle.radius;

        if (distance < totalRadius) {
            let normal = p5.Vector.sub(particle.position, this.position);
            normal.normalize();

            let relativeVelocity = p5.Vector.sub(particle.velocity, this.velocity);
            let speed = relativeVelocity.dot(normal);

            if (speed < 0) {
                let impulse = 0.4 * speed / (this.mass + particle.mass);
                let impulseVector = p5.Vector.mult(normal, impulse);

                // Apply the impulse to the velocities of both particles
                this.velocity.sub(p5.Vector.mult(impulseVector, particle.mass));
                particle.velocity.add(p5.Vector.mult(impulseVector, this.mass));

                // Slow down both particles (add a damping factor)
                this.velocity.mult(0.98);  // Damping factor
                particle.velocity.mult(0.98);  // Damping factor

                // Prevent particles from becoming too fast
                this.limitVelocity();
                particle.limitVelocity();

                // Adjust the positions to avoid overlap
                let overlap = totalRadius - distance;
                let correction = p5.Vector.mult(normal, overlap / 2);
                this.position.sub(correction);
                particle.position.add(correction);
            }
        }
    }

    // Cap the maximum velocity
    limitVelocity() {
        const maxSpeed = 0.7;  // Cap the maximum speed
        if (this.velocity.mag() > maxSpeed) {
            this.velocity.normalize().mult(maxSpeed);
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
 