/**
 * Converts degree to radians
 * @param degree
 * @returns {number}
 */
var toRadians = function (degree) {
    return degree * (Math.PI / 180);
};

/**
 * Converts radian to degree
 * @param radians
 * @returns {number}
 */
var toDegree = function (radians) {
    return radians * (180 / Math.PI);
}

function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

async function main(ev) {
    
    

    const boing = document.getElementById("boing");
    var xvel = 50;
    var yvel = 50;

    var lastMouseClickX = null;
    var lastMouseClickY = null;

    var lastMouseClickTimestamp = null;
    var timeSinceLastMouseClick = null;

    var mouseX = 0;
    var mouseY = 0;

    var targetFPS = 30;
    var gravity = 2.5;

    var fric = 0.6;
    var tinyBounceThreshold = 8;

    var fallAngle = 0;

    var mouseDown = (ev) => {
        if (ev.button != 0) return;
        
        if (boing.offsetLeft <= ev.pageX && ev.pageX <= boing.offsetLeft + boing.offsetWidth 
            && boing.offsetTop <= ev.pageY && ev.pageY <= boing.offsetTop + boing.offsetHeight) {
            lastMouseClickX = ev.pageX;
            lastMouseClickY = ev.pageY;
            boing.style.cursor = "grabbing";
        }
    }
    var mouseUp = (ev) => {
        lastMouseClickX = null;
        lastMouseClickY = null;

        lastMouseClickTimestamp = null;
        timeSinceLastMouseClick = null;
        
        boing.style.cursor = "grab";
    }

    var mouseMove = (ev) => {
        mouseX = ev.pageX;
        mouseY = ev.pageY;
    }

    var deviceOrientation = (ev) => {
        fallAngle = toRadians(ev.beta - 90);
    }

    document.addEventListener('deviceorientation', deviceOrientation, true);
    if (isTouchDevice()) {
        document.addEventListener('touchstart',  mouseDown);
        document.addEventListener('touchend',    mouseUp);
        document.addEventListener('touchcancel', mouseUp);
        document.addEventListener('touchmove',   mouseMove);
    } else {
        document.addEventListener('mousedown', mouseDown);
        document.addEventListener('mouseup',   mouseUp);
        document.addEventListener('mousemove', mouseMove);
    }

    setInterval(() => {
        var newX = boing.offsetLeft;
        var newY = boing.offsetTop;
        if (lastMouseClickX == null) {
            newX += xvel;
            newY += yvel;

            xvel += Math.sin(fallAngle) * gravity;
            yvel += Math.cos(fallAngle) * gravity;
        } else {
            var now = Date.now()
            var t_mouseX = mouseX;
            var t_mouseY = mouseY;
            var deltaX = t_mouseX - lastMouseClickX;
            var deltaY = t_mouseY - lastMouseClickY;
            if (lastMouseClickTimestamp == null) {
                lastMouseClickTimestamp = now;
            }
            timeSinceLastMouseClick = now - lastMouseClickTimestamp;

            newX += deltaX;
            newY += deltaY;

            lastMouseClickX = t_mouseX;
            lastMouseClickY = t_mouseY;

            xvel = deltaX * 0.65;
            yvel = deltaY * 0.65;
        }

        if (newX + boing.offsetWidth >= window.innerWidth) {
            if (xvel > 0) {
                xvel *= -fric;
                yvel *= fric;
                if (Math.abs(xvel) < tinyBounceThreshold) {
                    xvel = 0;
                }
            }
            newX = window.innerWidth - boing.offsetWidth - 1;
        }

        if (newX <= 0) {
            if (xvel < 0) {
                xvel *= -fric;
                yvel *= fric;
                if (Math.abs(xvel) < tinyBounceThreshold) {
                    xvel = 0;
                }
            }
            newX = 1;
        }

        if (newY + boing.offsetHeight >= window.innerHeight) {
            if (yvel > 0) {
                yvel *= -fric;
                xvel *= fric;
                if (Math.abs(yvel) < tinyBounceThreshold) {
                    yvel = 0;
                }
            }
            newY = window.innerHeight - boing.offsetHeight - 1;
        }

        if (newY <= 0) {
            if (yvel < 0) {
                yvel *= -0.9;
                xvel *= fric;
                if (Math.abs(yvel) < tinyBounceThreshold) {
                    yvel = 0;
                }
            }
            newY = 1;
        }

        boing.style.left = newX + 'px';
        boing.style.top  = newY + 'px';
    }, 1000 / targetFPS);
}
window.onload = main;