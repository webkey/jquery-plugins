function animateNumbers(elem,new_val){

    var cad = (parseFloat(new_val).toString().indexOf('.') == -1) ? 0 : 2;
    $({val_i: $(elem).text().split(' ').join('')}).animate({val_i: new_val}, {
        duration: 500,
        easing: 'swing',
        step: function () {
            $(elem).text(number_format(this.val_i, cad, '.', ' '));
        },
        complete: function () {
            $(elem).text(number_format(new_val, cad, '.', ' '));
        }
    })
}

function number_format( number, decimals, dec_point, thousands_sep ) {

    var i, j, kw, kd, km;
    if( isNaN(decimals = Math.abs(decimals)) ){
        decimals = 2;
    }
    if( dec_point == undefined ){
        dec_point = ",";
    }
    if( thousands_sep == undefined ){
        thousands_sep = ".";
    }

    i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

    kw = i.split( /(?=(?:\d{3})+$)/ ).join( thousands_sep );
    kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");


    return kw + kd;
}

animateNumbers($('.example'), 100)
