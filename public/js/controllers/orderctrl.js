app.controller('orderCtrl', ['$scope', 'storeAjaxService', '$filter', '$window', ($scope, storeAjaxService, $filter, $window) => {
    const { fetchUser, fetchUserCart, newOrder, deleteCart, checkShipDate } = storeAjaxService;

    // Sending the order to DB and removing the current client's cart.
    $scope.sendOrder = () => {
        console.log($scope.payment);
        let validCreditCard = creditCardCheck($scope.payment);
        let shipdate = $filter('date')($scope.shipdate, 'dd/MM/yyyy');
        let finalOrder = {
            client: $scope.client_details._id,
            totalprice: $scope.order_price,
            city: $scope.client_details.city,
            street: $scope.client_details.street,
            deliverydate: shipdate,
            creditcard: $scope.payment,
            products: $scope.productArr
        }
        // Create new order in DB and delete the current cart.
        validCreditCard ? newOrder(finalOrder).then(deleteClientCart($scope.cartId)).catch(err => console.log(err)) : $scope.orderForm.payment.$setValidity("required", false);
    }

    // Delete the current client card after he send the order to DB.
    deleteClientCart = (cartId) => {
        deleteCart(cartId).then($window.location.href = '/thanks_page.html').catch(err => console.log(err));
    }


    // Page status on reload.
    const orderPage = 'http://localhost:4000/main_shop.html#!/order';
    if (location.href === orderPage) {
        $scope.inOrderScreen = true;
        $scope.remove_search = true;
        fetchUser().then(res => {
            if (res.data.status === false) {
                $window.location.href = '/welcome.html#!/login';
            }
            $scope.client_details = res.data.user;
            $scope.user_name = res.data.user.name;
            fetchUserCart(res.data.user._id).then(res => clientCart(res)).catch(err => console.log(err));
        });
    }

    // Getting the client's final cart when the page reloaded.
    clientCart = (res) => {
        let orderArr = res.data[0].products;
        if (orderArr.length) {
            $scope.carts = orderArr;
            productsName($scope.carts);
        } else {
            $scope.orderForm.$setValidity("required", false);
            $scope.emptyCart = "Your cart is empty";
        }

    }

    // Getting the product's names and qty's for the order receipt file in the server.
    productsName = (products) => {
        let tmp = [];
        products.map(product => {
            return tmp.push({ name: product.name, quantity: product.quantity });
        });
        $scope.productArr = tmp;
    }

    // Checking credit card validity.
    creditCardCheck = (credit) => {
        let visa = new RegExp("^4[0-9]{12}(?:[0-9]{3})?$");
        let amex = new RegExp("^3[47][0-9]{13}$");
        let mastercard = new RegExp("^5[1-5][0-9]{14}$");
        let checkVisa = visa.test(credit);
        let checkAmex = amex.test(credit);
        let checkMasterCard = mastercard.test(credit);
        if (checkVisa) return true;
        if (checkAmex) return true;
        if (checkMasterCard) return true;
    }

    // Checking if there are available shipping dates.
    validShipDate = () => {
        let filterDate = $filter('date')($scope.shipdate, 'dd/MM/yyyy');
        let shipDate = {
            deliverydate: filterDate
        }
        checkShipDate(shipDate).then(res => {
            res.data.message === 'invalid' ? $scope.orderForm.shipdate.$setValidity("required", false) : console.log('valid date');
        }).catch(err => console.log(err));
    }
    
}]);