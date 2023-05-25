const config = require('../config.json')
const error_handling = require('./error_handling')

module.exports = (client, interaction, post) => {
    function check_permision(){
        if (post.indexOf('Owner') != -1){
            if (interaction.user.id == interaction.member.ownerId){
                return true
            }
        }
        
        if (post.indexOf('Developer') != -1){
            if (interaction.user.id == config.developerId){
                return true
            }
        }

        if (post.indexOf('Admin') != -1){
            try{
                interaction.member.permissions.has('Administration')
                return true
            } catch(error){}
        }

        return false
    }

    if (!check_permision()) {
        error_handling(client, interaction, 'CustomError [Permission]: Missing permission')
    return false
    }
    return true
}

// ====================== HELP ==============================

module.exports.help = {
    name : 'check_permision',
    help : 'Проверка на права администратора!'
}