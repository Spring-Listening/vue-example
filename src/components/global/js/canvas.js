window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 6000 / 60);
        };
})();

const initRender = (el,img, end) => {
    const h_fz = parseInt(document.getElementsByTagName('html')[0].style.fontSize) * 3,
        c = el.getContext('2d'),
        w = el.width = h_fz * 0.42,
        h = el.height = h_fz * 0.42,
        r = w / 2,
        cR1 = r - h_fz * 0.01;
    let startAngle = -(1 / 2 * Math.PI),
        endAngle = startAngle + (end / 100) * 2 * Math.PI,
        xAngle = 1 * (Math.PI / 90),
        tmpAngle = startAngle;

    //渲染函数
    const render = () => {
        if (!end) {
            canvasRender();
        }
        if (tmpAngle >= endAngle) {
            return;
        } else if (tmpAngle + xAngle > endAngle) {
            tmpAngle = endAngle;
            canvasRender();
            requestAnimationFrame(render);
        } else {
            tmpAngle += xAngle;
            canvasRender();
            requestAnimationFrame(render);
        }
    };

    const canvasRender = () => {
        c.clearRect(0, 0, w, h);
        c.lineWidth = h_fz * 0.02;
        c.lineCap = 'butt';

        //画一个灰圆
        c.strokeStyle = '#808080';
        c.beginPath();
        c.arc(r, r, cR1, startAngle, endAngle);
        c.stroke();
        c.closePath();

        c.drawImage(img, 6, 8,50,50);

    }
    
    render();

    //  缩放
    el.style.cssText = `width: ${h_fz * 0.42 / 3}px; height: ${h_fz * 0.42 / 3}px;`
}

export default initRender;

