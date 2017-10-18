prop8 = {

    "backColor": "#F8F9FA" ,
    "paddingLeft" : "350" ,
    "paddingBottom" : "50"  ,
    "paddingTop" : "50"  ,
    "moveMounth":"5" ,
    "gistPadding": "60" ,
    "spaceBetween" : "40" ,
    "barSize":"35" ,

    "colors": [
        "#FDCA8B", "#568a67", "#8BC33C", "#65746b",
        "#828BC4", "#e47171", "#8DC2D7" , "#e2e392" ,
        "#475cf9", "#7ce1d6", "#d082f8" , "#cd5454" ,
        "#989898", "#dd88e7", "#e7a788" , "#663922" ,
        "#1f81af", "#2b8422", "#228184" , "#6b4786" ,
        "#4f8647", "#d38471", "#89d4bc" , "#729eef"
    ] ,
}

function getData8(ndfl , carTax , flTax , eathTax) {
    data8 =[
        {"Расходы на управление": 5.8} ,
        {"Сельское, водное и лесное хозяйство, рыболовство": 5} ,
        {"Общеэкономические вопросы": 1.3} ,
        {"Охрана окружающей среды": 0.5} ,
    ]  ;

    function retz(d) {
        if (!isNaN(parseFloat(d))  )
            return parseFloat(d)  ;
        else
            return 0 ;
    }

    summ = retz(ndfl) + retz(flTax) + retz(eathTax) ;
    data8.forEach(function (t, number) {
        t[Object.keys(t)] *= 0.01 *summ ;
        if ( Object.keys(t) == "Транспортный налог" ) t[Object.keys(t)]  = carTax ;
    })
    data8["Транспортный налог"] = carTax;
    return data8;

}
data8 = getData8(1000.25255 , 12);




