const { databaseAction } = require("../connetion");


async function login(loginDTO){
    const result = await databaseAction(
        `SELECT ID, NOME, EMAIL FROM TB_USUARIO WHERE EMAIL = ? AND SENHA = ?;`,
        [loginDTO.email, loginDTO.senha]
    );
    return result;
}

module.exports = {login}