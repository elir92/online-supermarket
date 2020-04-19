app.controller('statusCtrl', ['$scope', 'storeAjaxService', '$window', ($scope, storeAjaxService, $window) => {
    const { fetchUser, fetchUserCart, fetchUserOrder, fetchAllCarts, countOrders, countProducts, startCart } = storeAjaxService;

    // Fetching user details
    fetchUser().then(res => {
        if (res.data.status === false) {
            $window.location.href = '/welcome.html#!/login';
        }
        $scope.user_name = res.data.user.name;
        $scope.client_id = res.data.user._id;
        $scope.admin = res.data.user.role;
        fetchUserCart(res.data.user._id).then(res => {
            $scope.start_shop = !res.data.length;
            $scope.con_shop = res.data.length;
        }).catch(err => console.log(err));

        fetchClientOrders(res.data.user._id);
    });


    $scope.adminPanel = () => {
        $window.location.href = '/main_shop.html#!/product_view';
    }

    // Starting shop button. //Creating new cart on DB and redirect to shoping page.
    $scope.startShop = () => {
        let clientId = {
            client: $scope.client_id
        }
        startCart(clientId).then($window.location.href = '/main_shop.html#!/product_view').catch(err => console.log(err));
    }

    // Continue shop button. if the user has already cart, redirect to shoping page.
    $scope.continueCart = () => {
        $window.location.href = '/main_shop.html#!/product_view';
    }

    $scope.fetchOrderFile = (order) => {
        window.open('api/orderfile/' + order._id);
    }

    countOrders().then(res => $scope.current_orders = res.data).catch(err => console.log(err));
    countProducts().then(res => $scope.current_products = res.data).catch(err => console.log(err));

    // Fetching all client's purchase history
    fetchClientOrders = (clientId) => {
        fetchUserOrder(clientId).then((res) => {
            if (res.data.length === 0) {
                console.log('Fresh User');
                $scope.firstBuy = true;
            }
            $scope.orders = res.data;
            $scope.lastOrder = $scope.orders[$scope.orders.length - 1];
        }

        ).catch(err => console.log(err));

    }
}]);
