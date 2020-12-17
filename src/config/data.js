let mongoose = require('mongoose');

const url = 'mongodb+srv://DoxuanHung:729199dohung@cluster0.pnryf.mongodb.net/TumblrzData?retryWrites=true&w=majority';
const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}
class Database {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(url, connectionParams)
            .then(() => {
                console.log('Connected to database ')
            })
            .catch((err) => {
                console.error(`Error connecting to the database. \n${err}`);
            })
    }
}

module.exports = new Database();    