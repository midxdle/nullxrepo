'use strict';

var Book = require('../models/bookModel');
var Category = require('../models/categoryModel');

module.exports = function(router) {
    router.get('/', function(req, res) {
        var cart = req.session.cart;
        var displayCart = {items: [], total:0};
        var total = 0;

        for(var item in cart) {
            displayCart.items.push(cart[item]);
            total += (cart[item].qty * cart[item].price);

        }
        displayCart.total = total;

        res.render('cart/index', {
            cart : displayCart
        });
    });

    router.post('/:id', function(req, res) {
        req.session.cart = req.session.cart || {};
        var cart = req.session.cart;

        Book.findOne({_id : req.params.id}, function(err, book) {
            if(err) {
                console.log(err);
            }

            if(cart[req.params.id]) {
                cart[req.params.id].qty++
            } else {
                cart[req.params.id] = {
                    item : book._id,
                    title : book.title,
                    price : book.price,
                    qty : 1
                }
            }

            res.redirect('/cart');
        });
    });

    router.get('/remove', function(req, res) {
        req.session.cart = req.session.destroy();
        res.redirect('/cart');
    });
}