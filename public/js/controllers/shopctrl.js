app.controller('shopCtrl', ['$scope', 'storeAjaxService', '$window', '$filter', '$timeout', '$mdSidenav', ($scope, storeAjaxService, $window, $filter, $timeout, $mdSidenav) => {
    const { fetchUser, fetchUserCart, fetchProduct, fetchCategory, addToCart, removeProduct, removeAllProducts } = storeAjaxService;


    let clientDetails;
    // Fetching user details.
    fetchUser().then(res => {
        if (res.data.status === false) {
            $window.location.href = '/welcome.html#!/login';
        }
        clientDetails = res.data.user._id;
        $scope.user_name = res.data.user.name;
        $scope.admin = res.data.user.role;
        !$scope.admin ? fetchUserCart(clientDetails).then(res => showUserCart(res)).catch(err => console.log(err)) : console.log('admin logged');

    });

    // Fetching all categories details from DB
    fetchCategory().then(res => $scope.categories = res.data).catch(err => console.log(err));

    // Fetching all products details from DB
    fetchProduct().then(res => $scope.products = res.data).catch(err => console.log(err));

    // Navigation between categories views.
    $scope.currentView = (category) => {
        $scope.quantity = 0;
        $scope.remove_search = false;
        $scope.disable_button = true;
        $scope.updated = false;
        $scope.filterName = { category: { name: category.name } }
        $scope.addMessage = "";
    }

    // Add product to the client cart
    $scope.addProductToCart = (product, quantity) => {
        if (quantity === 0 || quantity === undefined) {
            $scope.addMessage = "";
            $scope.productId = product._id;
            $scope.noQty = "Please choose quantity";
        } else {
            $scope.noQty = "";
            $scope.productId = product._id;
            let total_price = quantity * product.price;
            let cartId = $scope.cartId;
            let cart_product = {
                id: product._id,
                name: product.name,
                quantity: quantity,
                img: product.img,
                price: total_price
            }
            addToCart(cartId, cart_product).then(updatedCart(clientDetails), $scope.addMessage = `Added to your cart`).catch(err => console.log(err));
        }
    }

    // Delete product from client cart
    $scope.deleteFromCart = (product) => {
        removeProduct($scope.cartId, product).then(updatedCart(clientDetails)).catch(err => console.log(err));
    }

    // Delete all products from client cart
    $scope.deleteAllProducts = () => {
        removeAllProducts($scope.cartId).then(updatedCart(clientDetails)).catch(err => console.log(err));
    }

    // Search box for products
    $scope.searchProduct = () => {
        if ($scope.search === undefined) {
            document.getElementById('search_button').style.borderColor = "red";
        }
        if ($scope.search !== undefined) {
            if ($scope.search.length >= 3) {
                for (let product of $scope.products) {
                    if (product.name.toLowerCase().indexOf($scope.search) > - 1) {
                        $scope.filterName = product.name;
                        $scope.clicked = true;
                        $scope.disable_button = true;
                        document.getElementById('search_button').style.borderColor = "";
                        document.getElementById('search_button').value = "";
                        break;
                    } else {
                        document.getElementById('search_button').style.borderColor = "red";
                    }
                }
            } else {
                document.getElementById('search_button').style.borderColor = "red";
            }
        }
    }

    // Removing search box when client at order view
    $scope.disableSearch = () => {
        $scope.inOrderScreen = true;
        $scope.remove_search = true;
        $scope.disable_button = false;
    }

    // Getting back the button/links for client in order to continue shopping.
    $scope.backToShop = () => {
        $scope.inOrderScreen = false;
        $scope.remove_search = false;
        $scope.disable_button = true;
        $scope.addMessage = "";
    }

    // Pages conditions on reload.
    const orderPage = 'http://localhost:4000/main_shop.html#!/order';
    if (location.href === orderPage) {
        $scope.inOrderScreen = true;
        $scope.remove_search = true;
    }

    const productPage = 'http://localhost:4000/main_shop.html#!/product_view';
    if (location.href === productPage) {
        $scope.disable_button = true;
        $scope.quantity = 0;
    }



    // --- F-U-N-C-T-I-O-N-S ----

    // Calculate total order price
    totalOrder = (cart) => {
        let total = 0;
        for (let product of cart) {
            total += product.price;
        }
        $scope.order_price = total;
    }

    // Present client's cart.
    showUserCart = (res) => {
        $scope.cart = res.data[0].products;
        $scope.cartId = res.data[0]._id;
        totalOrder(res.data[0].products);
    }

    // Updating the client cart.
    updatedCart = (clientId) => {
        fetchUserCart(clientId).then(res => showUserCart(res)).catch(err => console.log(err));
    }

    // Shopping cart's side-bar function
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');
    function buildToggler(componentId) {
        return function () {
            $mdSidenav(componentId).toggle();
        };
    }

}]);

