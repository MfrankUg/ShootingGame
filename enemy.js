class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 40;
        this.speed = 3;
        this.health = 50;
        this.damage = 10;
        this.direction = 0;
        this.attackRange = 50;
        this.attackCooldown = 0;
    }

    update(player) {
        // Calculate direction to player
        this.direction = Utils.angle(this.x, this.y, player.x, player.y);
        
        // Move towards player
        const distance = Utils.distance(this.x, this.y, player.x, player.y);
        
        if (distance > this.attackRange) {
            this.x += Math.cos(this.direction) * this.speed;
            this.y += Math.sin(this.direction) * this.speed;
        }

        // Attack player if in range
        if (distance <= this.attackRange && this.attackCooldown <= 0) {
            player.takeDamage(this.damage);
            this.attackCooldown = 60; // 1 second at 60 FPS
        }

        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.direction);
        
        // Body
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Head
        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        ctx.arc(0, -this.height/2 - 10, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    takeDamage(amount) {
        this.health -= amount;
        return this.health <= 0;
    }
} 