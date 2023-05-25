module.exports = (time) => {
    if (Number(time.replace(":", '')) > 129){
        if (time.length == 5){
            if(Number(time.split(':')[1]) < 31 && Number(time.split(':')[1]) != 0){
                time = ((Number(time.replace(":", ''))) - 70).toString()
                time = time[0] + time[1] + ":" + time[2] + time[3]
            }

            else if(Number(time.split(':')[1]) == 0){
                time = ((Number(time.replace(":", ''))) - 40).toString()
                time = time[0] + time[1] + ":" + "3" + "0"
            }

            else if(Number(time.split(':')[1]) >= 30 && Number(time.split(':')[1]) != 0){
                time = ((Number(time.replace(":", ''))) - 30).toString()
                time = time[0] + time[1] + ":" + time[2] + time[3]
            }
        }

        if (time.length == 4){
            if(Number(time.split(':')[1]) < 30 && Number(time.split(':')[1]) != 0){
                time = ((Number(time.replace(":", ''))) - 70).toString()
                time = time[0] + ":" + time[1] + time[2]
            }

            else if(Number(time.split(':')[1]) == 0){
                time = ((Number(time.replace(":", ''))) - 40).toString()
                time = time[0] + ":" + "3" + "0"
            }

            else if(Number(time.split(':')[1]) >= 30){
                time = ((Number(time.replace(":", ''))) - 30).toString()
                time = time[0] + ":" + time[1] + time[2]
            }
        }
    }

    else if(Number(time.replace(":", '')) < 130){
        if(time[0] == '1'){
            if(Number(time.split(':')[1]) < 30 && Number(time.split(':')[1]) != 0){
                time = ((Number(time.replace(":", ''))) - 70).toString()
                time = "0" + ":" + time[0] + time[1]
            }

            else if(Number(time.split(':')[1]) == 0){
                time = ((Number(time.replace(":", ''))) - 40).toString()
                time = "0" + ":" + '3' + '0'
            }
        }

        else if(time[0] == '0'){
            if(Number(time.split(':')[1]) < 30 && Number(time.split(':')[1]) != 0){
                time = ((Number(time.replace(":", '')) + 100) - 70).toString()
                time = "23" + ":" + time[0] + time[1]
            }

            else if(Number(time.split(':')[1]) == 0){
                time = ((Number(time.replace(":", ''))) - 40).toString()
                time = "23" + ":" + '3' + '0'
            }

            else if(Number(time.split(':')[1]) >= 30){
                time = ((Number(time.replace(":", ''))) - 30).toString()
                time = "23" + ":" + time[0] + '0'
            }
        }
    }
    return time
}

// ====================== HELP ==============================

module.exports.help = {
    name: 'adjustment',
    description: 'Корректировка'
}