var alternarColor = true;
var continuar;
var puntaje;
var idRealizarMovimientosInterval;

$(function () {
    setInterval(function () {
        alternarColor ? $(".main-titulo").css('color', 'white') : $(".main-titulo").css('color', 'yellow');
        alternarColor = !alternarColor;
    }, 1000);

    $('.btn-reinicio').click(function () {
        if ($('.btn-reinicio').text() === 'Iniciar') {
            if ($(".panel-tablero").css('display') === 'none') {
                $(".panel-tablero").css('display', 'flex');
                $(".panel-tablero").css('width', '70%');
                $(".panel-tablero").css('height', '700px');
                $(".panel-score").css('display', 'flex');
                $(".panel-score").css('width', '25%');
                $(".panel-score").css('height', '700px');
                $(".time").css('display', 'block');
                $(".time").css('width', '100%');
                $(".time").css('height', '23%');
                $(".time").css('opacity', '1.0');
            }

            $('.main-titulo-juego-terminado').css("display", "none");

            removerElementos();
            rellenarTablero();
            puntaje = 0;
            iniciarJuego();
            $(this).text('Reiniciar');
        }
        else {
            clearInterval(idRealizarMovimientosInterval);
            $('#countdowntimer').countdowntimer({
                minutes: 0,
                seconds: 0
            });
            $(this).text('Iniciar');
            $('#score-text').text('0');
        }
    });
})
;

function removerElementos() {
    for (var col = 1; col <= 7; ++col) {
        $('.col-' + col).empty();
    }
}

function rellenarTablero() {
    for (var col = 1; col <= 7; ++col) {
        for (var fila = 1; fila <= 7; ++fila) {
            var nuevaImagen = $('<img>',
                {"src": "image/" + (1 + Math.floor(Math.random() * 4)) + ".png", "class": "elemento"}
            );
            $(nuevaImagen).draggable();
            $('.col-' + col).append(nuevaImagen);
        }
    }
}

function iniciarJuego() {
    continuar = true;

    $('#countdowntimer').countdowntimer({
        minutes: 2,
        seconds: 0,
        timeUp: function () {
            continuar = false;
            clearInterval(realizarMovimientos());

            var anchoPanelTablero = $('.panel-tablero').css('width');

            $(".panel-tablero").animate({
                height: "0",
                width: "0"
            }, 4100, function () {
                $(".panel-tablero").css('display', 'none');
            });

            $('.panel-score').animate({
                width: anchoPanelTablero
            }, 3000);

            $('.time').animate({
                opacity: 0.0
            }, 2000);

            $('.btn-reinicio').text('Iniciar');

            $('.main-titulo-juego-terminado').css("display", "block")
        }
    });

    idRealizarMovimientosInterval = setInterval(realizarMovimientos, 1500);
}

function realizarMovimientos() {
    var contador;
    var nombreImagen;
    var nombreImagenSgte;
    var figurasMarcadas = inicializarFigurasMarcadas();
    var huboCambios = false;

    for (var row = 0; row < 7; ++row) {
        for (var col = 0; col < 7; ++col) {
            if ((7 - col) > 2) {
                nombreImagen = $('.col-' + (col + 1)).children()[row];
                nombreImagen = $(nombreImagen).prop('src').substring($(nombreImagen).prop('src').length - 5);

                contador = 1;

                while ((7 - col) >= 3 && contador < (7 - col)) {
                    nombreImagenSgte = $('.col-' + (col + contador + 1)).children()[row];
                    nombreImagenSgte = $(nombreImagenSgte).prop('src').substring($(nombreImagenSgte).prop('src').length - 5);

                    if (nombreImagen !== nombreImagenSgte) {
                        break;
                    }

                    ++contador;
                }

                if (contador >= 3) {
                    huboCambios = true;
                    for (var i = 0; i < contador; ++i) {
                        figurasMarcadas[row][col + i] = true;
                    }
                }
            }

            if ((7 - row) > 2) {
                nombreImagen = $('.col-' + (col + 1)).children()[row];
                nombreImagen = $(nombreImagen).prop('src').substring($(nombreImagen).prop('src').length - 5);

                contador = 1;

                while ((7 - row) >= 3 && contador < (7 - row)) {
                    nombreImagenSgte = $('.col-' + (col + 1)).children()[row + contador];
                    nombreImagenSgte = $(nombreImagenSgte).prop('src').substring($(nombreImagenSgte).prop('src').length - 5);

                    if (nombreImagen !== nombreImagenSgte) {
                        break;
                    }

                    ++contador;
                }

                if (contador >= 3) {
                    huboCambios = true;
                    for (var i = 0; i < contador; ++i) {
                        figurasMarcadas[row + i][col] = true;
                    }
                }
            }
        }
    }

    if (huboCambios) {
        actualizarTablero(figurasMarcadas);
    } else {
        clearInterval(idRealizarMovimientosInterval);
    }
}


function inicializarFigurasMarcadas() {
    var figurasMarcadas = [];

    for (var row = 0; row < 7; ++row) {
        figurasMarcadas[row] = new Array(7);
        for (var col = 0; col < 7; ++col) {
            figurasMarcadas[row][col] = false;
        }
    }

    return figurasMarcadas;
}

function actualizarTablero(figurasMarcadas) {
    var puntaje = 0;
    for (var col = 0; col < 7; ++col) {
        for (var fila = 0; fila < 7; ++fila) {
            if (figurasMarcadas[fila][col]) {
                $($('.col-' + (col + 1)).children()[fila]).addClass('remover');
                puntaje += 10;
            }
        }
    }

    if ($('.remover').length > 0) {
        $('.remover').fadeIn(400).fadeOut(400).fadeIn(400).fadeOut(300, function () {
            $(this).remove();

            actualizarPuntaje(puntaje);
            crearDulces();
        });
    }
}

function crearDulces() {
    for (var col = 0; col < 7; ++col) {
        if ($('.col-' + (col + 1)).children().length < 7) {
            var numeroDulces = 7 - $('.col-' + (col + 1)).children().length;

            for (var i = 1; i <= numeroDulces; ++i) {
                var nuevoDulce = $('<img>',
                    {"src": "image/" + (1 + Math.floor(Math.random() * 4)) + ".png", "class": "elemento"});
                // $('.col-' + (col + 1)).prepend(nuevoDulce.delay(500).fadeOut("slow").fadeIn("slow"));
                $('.col-' + (col + 1)).prepend(nuevoDulce);
            }
        }
    }
}

function actualizarPuntaje(masPuntaje) {
    puntaje += masPuntaje;

    $('#score-text').text(puntaje);
}
