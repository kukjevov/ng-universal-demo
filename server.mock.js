module.exports = function(app)
{
    //LOAD ACCOUNT RESOURCE
    require('./mocks/account')(app);

    //LOAD CONFIG RESOURCE
    require('./mocks/config')(app);
};
