//error codes
const responseCode = {
    OK:200,
    CREATED:201,
    BAD_REQUEST:400,
    CONFLICT:409,
    FORBIDDEN:403,
    NOT_FOUNT :404,
    INTERNAL_SERVERERROR:500,
    UNAUTERIZED:401
}
//roles
const role={
    Admin:'admin',
    User:'user'
};
//UUID
const { v4: uuidv4 } = require('uuid');
const UUID = uuidv4;

//validation events
let events = {
    adminEvents:{
        registration:'admin_registration',
        login:'admin_login',
    },
    userEvents:{
        registration:'user_registration',
        login:'user_login'
    },
    productEvents:{
        create:"create",
        update:"update",
        delete:"delete",
        getById:"getById"
    },
    cartEvents:{
        add:'add',
        remove:'remove',

    },
    orderEvents:{
        create:'ordercreate',
        changeStatus:'changeStatus',
        getHistory:'getHistory'
    },
    reviewEvents:{
        reviewAdd:'reviewAdd',
        reviewUpdate:'reviewUpdate',
        getReviews:'getReviews',
    }
};

let validationRules ={
    admin:{
        registration:{
            firstName: 'required|string', 
            lastName:'required|string',
            email:'required|email',
            password:[
                'required',
                'string',
                'min:8',
                `regex:^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*[0-9]))(?=(.*[!@#$%^&*()])).{8,16}$`,
              ],
        }
    },
    user:{
        registration:{
            firstName: 'required|string', 
            lastName:'required|string',
            phone:'required|string|max:12|regex:/^[0-9]+$/',
            email:'required|email',
            password:[
                'required',
                'string',
                'min:8',
                `regex:^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*[0-9]))(?=(.*[!@#$%^&*()])).{8,16}$`,
              ],
        }
    },
    product:{
        id:'required|string',
        productName:'required|string',
        variation:'required|string',
        quantity:'required|integer',
        price:'required|numeric',
    },
    cart:{
        id:'required|string',
        action:'required|string|in:P,M'
    },
    order:{
        id:'required|string',
        status:'required|string|in:processing,shipped,delivered'
    },
    address:{
        name:'required|string',
        landmark:'required|string',
        city:'required|string',
        pin:'required|string|max:12|regex:/^[0-9]+$/',
        phone:'required|string|max:12|regex:/^[0-9]+$/'
    },
    review:{
       id:'required|string',
       reviewPoint:'required|integer|min:0|max:5',
       description:'required|string',
    }
}
const paginateObj={
    page:1,
    limit:10,
}

module.exports = {
    responseCode,
    events,
    validationRules,
    role,
    paginateObj,
    UUID
}