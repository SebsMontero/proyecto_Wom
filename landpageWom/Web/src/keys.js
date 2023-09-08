require('./index')

//Variables Database Local
IPServidor = 'localhost'
UsuarioServidor = 'root'
ContrasenaServidor = 'Colombia1+'
BaseDatosServidor = 'dbp_wom'

module.exports = {
    database: {
        host: IPServidor,
        user: UsuarioServidor,
        password: ContrasenaServidor,
        database: BaseDatosServidor,
        dateStrings: true,
        encoding: 'utf8',
        charset: 'utf8mb4'
    }
}