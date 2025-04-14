class Weapon {
    constructor(player) {
        this.player = player;
        this.damage = 25;
        this.bulletSpeed = 15;
        this.bullets = [];
    }

    update(mouseX, mouseY) {
        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            
            // Remove bullets that are out of bounds
            if (bullet.x < 0 || bullet.x > canvas.width || 
                bullet.y < 0 || bullet.y > canvas.height) {
                this.bullets.splice(i, 1);
            }
        }
    }

    shoot() {
        const angle = Utils.angle(this.player.x, this.player.y, mouseX, mouseY);
        this.bullets.push({
            x: this.player.x,
            y: this.player.y,
            vx: Math.cos(angle) * this.bulletSpeed,
            vy: Math.sin(angle) * this.bulletSpeed,
            damage: this.damage
        });
    }

    draw(ctx) {
        // Draw bullets
        ctx.fillStyle = '#f1c40f';
        for (const bullet of this.bullets) {
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
} 