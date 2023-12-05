const Validator = require('validatorjs');
const {events,validationRules} = require('../config/constants');
const adminEvents = events.adminEvents;
const adminRules = validationRules.admin;
const userEvents = events.userEvents;
const userRules = validationRules.user;
const productEvents = events.productEvents;
const producRules = validationRules.product;
const cartEvents = events.cartEvents;
const cartRules = validationRules.cart;
const orderEvents = events.orderEvents;
const orderRules = validationRules.order;
const addressRules = validationRules.address;
const reviewEvents = events.reviewEvents;
const reviewRules = validationRules.review;

/**setup validate input data */
const validateData = (data, event)=> {
    let rules;
    switch (event) {

      case adminEvents.registration:
        rules = {
          firstName: adminRules.registration.firstName,
          lastName: adminRules.registration.lastName,
          email: adminRules.registration.email,
          password: adminRules.registration.password,
          repeatPassword: adminRules.registration.password,
        };
        break;
      case adminEvents.login:
      rules = {
        email: adminRules.registration.email,
        password: adminRules.registration.password,
      };
        break;
      case userEvents.registration:
        rules = {
          firstName: userRules.registration.firstName,
          lastName: userRules.registration.lastName,
          email: userRules.registration.email,
          phone:userRules.registration.phone,
          password: userRules.registration.password,
          repeatPassword: userRules.registration.password,
        };
        break;
      case userEvents.login:
        rules = {
          email: userRules.registration.email,
          password: userRules.registration.password,
        };
          break;
      case productEvents.create:
        rules = {
          productName:producRules.productName,
          variation:producRules.variation,
          quantity:producRules.quantity,
          price:producRules.price,
        };
        break;
      case productEvents.delete:
        rules={
          productId:producRules.id
        }
        break;
      case productEvents.getById:
        rules={
          productId:producRules.id
        }
        break;
      case cartEvents.add:
        rules={
          productId:cartRules.id
        }
        break;
      case cartEvents.update:
        rules={
          cartId:cartRules.id,
          action:cartRules.action
        }
        break;
      case cartEvents.remove:
        rules={
          cartId:cartRules.id,
        }
        break; 
      case orderEvents.create:
        rules={
          cartIds:'required|array',
          paymentId:orderRules.id,
          'billingaddress.name':addressRules.name,
          'billingaddress.landmark':addressRules.landmark,
          'billingaddress.city':addressRules.city,
          'billingaddress.pin':addressRules.pin,
          'billingaddress.phone':addressRules.phone,
          'shippingAddress.name':addressRules.name,
          'shippingAddress.landmark':addressRules.landmark,
          'shippingAddress.city':addressRules.city,
          'shippingAddress.pin':addressRules.pin,
          'shippingAddress.phone':addressRules.phone,
        }
        break; 
      case orderEvents.changeStatus:
        rules={
          orderItemId:orderRules.id,
          status:orderRules.status
        }  
      break;
      case reviewEvents.reviewAdd:
      rules={
        orderId:reviewRules.id,
        productId:reviewRules.id,
        reviewPoint:reviewRules.reviewPoint,
        description:reviewRules.description
      }
      break;
      case reviewEvents.reviewUpdate:
      rules={
       reviewId:reviewRules.id,
        // reviewPoint:reviewRules.reviewPoint,
        // description:reviewRules.description
      }
      break;
      case reviewEvents.getReviews:
      rules={
       productId:reviewRules.id
      }
      break;
      default:
        break;
    }
    let validation = new Validator(data, rules);
    let result = {};

    if (validation.passes()) {
      result['hasError'] = false;
    }
    if (validation.fails()) {
      result['hasError'] = true;
      result['errors'] = validation.errors.all();
    }
    return result;
  }

  module.exports = validateData;