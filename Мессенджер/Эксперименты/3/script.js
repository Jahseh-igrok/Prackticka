// function cube(){
//     var rotateY = 0;
//     var rotateX = 0;
//     document.onkeydown = function (e){
//              if(e.code === 37) rotateY -= 2
//         else if(e.code === 38) rotateX += 2
//         else if(e.code === 39) rotateY += 2
//         else if(e.code === 40) rotateX -= 2
//         document.querySelector('.cube').style.transform =
//         'rotateY(' + rotateY + 'deg)'+
//         'rotateX(' + rotateX + 'deg)';
//     }
// };
// cube()

// document.addEventListener('keydown', function (e) {
//     var rotateY = 0;
//     var rotateX = 0;
//     if (e.key === arrowUp) rotateY -= 2
//     else if (e.code === arrowDown) rotateX += 2
//     else if (e.code === arrowRight) rotateY += 2
//     else if (e.code === arrowLeft) rotateX -= 2
//     document.querySelector('.cube').style.transform =
//         'rotateY(' + rotateY + 'deg)' +
//         'rotateX(' + rotateX + 'deg)';
// })

(function () {
    var rotateY = 0;
    var rotateX = 0;
    document.onkeydown = function (e) {

        if (e.key === 'ArrowLeft') {
            rotateY -= 4;
            console.log('влево');

        }

        else if (e.key === 'ArrowUp') {
            rotateX += 4;
            console.log('вверх');
        }

        else if (e.key === 'ArrowRight') {
            rotateY += 4;
            console.log('вправо');
        }

        else if (e.key === 'ArrowDown') {
            rotateX -= 4;
            console.log('вниз');
        }
        document.querySelector('.cube').style.transform =
            'rotateY(' + rotateY + 'deg)' +
            'rotateX(' + rotateX + 'deg)';


    }
    // document.onkeyup = function (e) {

    // }

}())
