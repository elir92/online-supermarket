const app = angular.module('storeApp', ["ngRoute", "ngMaterial"]);

app.config($routeProvider => {
    $routeProvider
        .when("/product_view", {
            templateUrl: "views/main_view.html"
        }).when("/order", {
            templateUrl: "views/order_view.html"
        });
});




