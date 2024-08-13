const { databaseAction } = require("../connetion");

async function getAll(){
    const result = await databaseAction(
        `SELECT * FROM TB_CELULAR;`,
        []
    );

    const rates = await databaseAction(
        `SELECT * FROM TB_RATE;`,
        []
    );

    for(const cell of result){
        cell.likes = 0;
        cell.dislikes = 0;
        const comentarios = await databaseAction(`SELECT * FROM TB_COMENTARIO WHERE ID_CELULAR = ?;`, [cell.ID]);
        cell.comentarios = comentarios.length;
        cell.id_user_rates = [];
        console.log(cell.comentarios);
        for(const rate of rates){
            if(rate.ID_CELULAR == cell.ID){
                if(rate.AVALIACAO){
                    cell.likes++;
                } else {
                    cell.dislikes++;
                }
                cell.id_user_rates.push({idUser: rate.ID_USUARIO, boolean : rate.AVALIACAO});
            }
        }
    }
    
    return result;
}
async function getOne(id){
    const [cellphone] = await databaseAction(`SELECT * FROM TB_CELULAR WHERE ID = ?;`,[id]);
    const comments = await databaseAction(
        `SELECT U.NOME, C.DATA, C.COMENTARIO FROM 
        TB_COMENTARIO AS C 
        LEFT JOIN TB_USUARIO AS U 
        ON U.ID = C.ID_USUARIO
        WHERE ID_CELULAR = ?;`,[id]);
    cellphone.comentarios = comments;
    return cellphone;
}

async function rate(rate, idCellphone){
    const hasRate = await databaseAction(
        `SELECT * FROM TB_RATE WHERE ID_USUARIO = ? AND ID_CELULAR = ?`,
        [rate.idUsuario, idCellphone]
    );
    if(hasRate[0]) {
        await databaseAction(`UPDATE TB_RATE SET AVALIACAO = ${rate.avaliacao} WHERE ID = ?;`, [hasRate[0].ID])
    } else {
        await databaseAction(
            `INSERT INTO TB_RATE (AVALIACAO, ID_USUARIO, ID_CELULAR) VALUES(?,?,?)`,
            [rate.avaliacao, rate.idUsuario, idCellphone]
        );
    }
}

async function comment(rate, idCellphone){
    rate.data = new Date().toLocaleString();
    await databaseAction(
        `INSERT INTO TB_COMENTARIO (DATA, COMENTARIO, ID_USUARIO, ID_CELULAR) VALUES(?,?,?,?);`,
        [rate.data, rate.comentario, rate.idUsuario, idCellphone]
    );
}


module.exports = {
    getAll,
    getOne,
    rate,
    comment
}