class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.speed = 5;
        this.health = 100;
        this.ammo = 30;
        this.direction = 0; // angle in radians
        this.isMoving = false;
        this.weapon = new Weapon(this);
    }

    update(keys, mouseX, mouseY) {
        // Calculate direction to mouse
        this.direction = Utils.angle(this.x, this.y, mouseX, mouseY);

        // Movement
        if (keys.w) this.y -= this.speed;
        if (keys.s) this.y += this.speed;
        if (keys.a) this.x -= this.speed;
        if (keys.d) this.x += this.speed;

        // Update weapon
        this.weapon.update(mouseX, mouseY);
    }

    draw(ctx) {
        // Draw player body
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.direction);
        
        // Body
        ctx.fillStyle = '#3498db';
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Gun
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, -5, 30, 10);
        
        ctx.restore();
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
    }

    shoot() {
        if (this.ammo > 0) {
            this.weapon.shoot();
            this.ammo--;
        }
    }
} 