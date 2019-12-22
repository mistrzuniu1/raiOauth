const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://rai_user:rai_pass@cluster0-aimox.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
});