module.exports = (date,time) => {
    check_time = false
    check_date = false

    if (date != null){
        if(date.indexOf('.') != -1){
            if(Number(date.replaceAll('.', '')) != NaN){
                if(date.length == 10){
                    if(date[2] == '.' && date[5] == '.'){
                        if(Number(date.split('.')[0] <= 31) && (Number(date.split('.')[1] <= 12)) && (Number(date.split('.')[2] <= 2030))){
                            check_date = true
                        }
                    }
                }
                if(date.length == 9){
                    if(date[1] == '.' && date[4] == '.'){
                        if(Number(date.split('.')[0]) <= 31 && (Number(date.split('.')[1]) <= 12) && (Number(date.split('.')[2] <= 2030))){
                            check_date = true
                        }
                    }
                }
            }
        }
    }

    if(date == null) check_date = true

    if(time.indexOf(':') != -1){
        if(Number(time.replace(":", '')) != NaN){
            if(time.length == 5){
                if(time.indexOf(':') == 2){
                    if(Number(time.split(':')[0] <= 23) && (Number(time.split(':')[1] <= 59))){
                        check_time = true
                    }
                }
            }

            if(time.length == 4){
                if(time.indexOf(':') == 1){
                    if(Number(time.split(':')[0] <= 23) && (Number(time.split(':')[1] <= 59))){
                        check_time = true
                    }
                }
                
            }
        }
    }

    if (check_date == false){
        return false
    }

    if (check_time == false){
        return false
    }

    return check_date, check_time
}

// ====================== HELP ==============================

module.exports.help = {
    name : 'event_check_datetime',
    help : 'Обработка вводных данных на валидность'
}

