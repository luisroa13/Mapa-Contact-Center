// Creamos un objeto con los parámetros de conexión. Los datos deben corresponder con los de nuestra base de datos.
const config = {
    db: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Prb1234*',
        database: 'prueba',
        port: 5432,
    }
};

// Exportamos modulo
module.exports = config;