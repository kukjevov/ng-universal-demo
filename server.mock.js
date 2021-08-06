module.exports = function(app)
{
    //LOAD ACCOUNT RESOURCE
    require('./mocks/account')(app);

    //LOAD CONFIG RESOURCE
    require('./mocks/config')(app);

    //LOAD DYNAMIC RESOURCE
    require('./mocks/dynamic')(app);

    //LOAD DATA RESOURCE
    require('./mocks/data')(app);
};
