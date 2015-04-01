function drawLegend(id) {
    var canvas = document.getElementById(id);
    var context = canvas.getContext('2d');
    canvas.style.left = "0px";
    canvas.style.top = "0px";
    canvas.style.position = "absolute";
    x = 10;
    y = 10;
    radius = 10;

    //draw rectangle
    context.fillStyle = '#ffff33';
    context.fillRect(x, y, 20, 20);
    context.fillStyle = '#888';
    context.fillRect(x, y + 25, 20, 20);

    //draw triangle
    context.beginPath();
    context.moveTo(x + 10, y + 50);
    context.lineTo(x, y + 70);
    context.lineTo(x + 20, y + 70);
    context.fillStyle = '#E6A9EC';
    context.fill();
    context.closePath();

    //draw round cornered rectangle
    drawRoundRect(context, x - 5, y + 75, 30, 20, 5, true, true);

    //draw circle
    context.beginPath();
    context.arc(x + 10, y + 115, radius, 0, 2 * Math.PI, false);
    context.fillStyle = '#888';
    context.fill();
    context.closePath();

    context.beginPath();
    context.arc(x + 10, y + 140, radius / 2, 0, 2 * Math.PI, false);
    context.fillStyle = '#888';
    context.fill();
    context.closePath();

    //add node text;
    context.font = '10pt';
    context.fillStyle = 'black';
    context.fillText('Protein', x + 35, y + 15);
    context.fillText('Protein (absent)', x + 35, y + 40);
    context.fillText('Small Molecule', x + 35, y + 65);
    context.fillText('Complex', x + 35, y + 90);
    context.fillText('Converted Entity', x + 35, y + 115);
    context.fillText('Biochemical Reaction', x + 35, y + 140);

//add edge legend
    drawArrow(context, x + 150, y + 15, x + 190, y + 15, 'black', 'solid');
    drawArrow(context, x + 150, y + 40, x + 190, y + 40, 'black', 'dashed');
    drawArrow(context, x + 150, y + 65, x + 190, y + 65, 'red', 'solid');
    drawTshape(context, x + 150, y + 90, x + 185, y + 90);
    context.beginPath();
    context.moveTo(x + 150, y + 115);
    context.lineTo(x + 185, y + 115);
    context.stroke();
    context.closePath();
    context.beginPath();
    context.moveTo(x + 150, y + 140);
    context.lineTo(x + 185, y + 140);
    context.strokeStyle = '#888'
    context.stroke();
    context.closePath();


    // edge text
    context.font = '10pt';
    context.fillStyle = 'black';
    context.fillText('Output', x + 200, y + 15);
    context.fillText('Reaction Sequence', x + 200, y + 40);
    context.fillText('Positive Regulation', x + 200, y + 65);
    context.fillText('Negative Regulation', x + 200, y + 90);
    context.fillText('Input', x + 200, y + 115);
    context.fillText('Component', x + 200, y + 140);
}

function drawRoundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fillStyle = '#9172EC';
        ctx.fill();
    }
}

function drawArrow(context, fromx, fromy, tox, toy, color, style) {
    var headlen = 10;   // length of head in pixels
    var angle = Math.atan2(toy - fromy, tox - fromx);
    context.beginPath();
    if (style == 'dashed') {
        context.setLineDash([5]);
    } else {
        context.setLineDash([0]);
    }
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.strokeStyle = color;
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    context.fillStyle = color;
    context.fill();
    context.closePath();
}

function drawTshape(context, fromx, fromy, tox, toy) {
    context.beginPath();
    context.setLineDash([0]);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.moveTo(tox, toy - 5);
    context.lineTo(tox, toy + 5);
    context.strokeStyle = 'black';
    context.stroke();
    context.closePath();

}