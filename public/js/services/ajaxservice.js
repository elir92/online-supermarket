ajaxService = ($http) => {

    const fetchUser = () => {
        return $http.get('api/user');
    }

    const fetchAllCarts = () => {
        return $http.get('api/carts');
    }

    const fetchUserCart = (userId) => {
        return $http.get('api/usercart/' + userId);
    }

    const fetchUserOrder = (clientId) => {
        return $http.get('api/clientorder/' + clientId);
    }

    const fetchProduct = () => {
        return $http.get('api/product');
    }

    const fetchCategory = () => {
        return $http.get('api/category');
    }

    const countOrders = () => {
        return $http.get('api/countorders');
    }

    const countProducts = () => {
        return $http.get('api/countproducts');
    }

    const verifyId = (checkUserId) => {
        return $http.post('api/verifyid', checkUserId);
    }

    const checkShipDate = (shipDate) => {
        return $http.post('api/shipdate/', shipDate);
    }

    const startCart = (clientId) => {
        return $http.put('api/startcart', clientId);
    }

    const newProduct = (product) => {
        return $http.put('api/newproduct', product);
    }

    const newOrder = (order) => {
        return $http.put('api/neworder', order);
    }

    const addToCart = (cartId, product) => {
        return $http.patch('api/addproduct/' + cartId, product);
    }

    const editProduct = (productId, product) => {
        return $http.patch('api/editproduct/' + productId, product);
    }

    const removeProduct = (cartId, product) => {
        return $http.patch('api/removeproduct/' + cartId, product);
    }

    const removeAllProducts = (cartId) => {
        return $http.patch('api/removeallpr/' + cartId);
    }

    const deleteCart = (cartId) => {
        return $http.delete('api/deletecart/' + cartId);
    }




    return {
        fetchUser,
        fetchAllCarts,
        fetchUserCart,
        fetchUserOrder,
        fetchProduct,
        fetchCategory,
        countOrders,
        countProducts,
        verifyId,
        startCart,
        newProduct,
        newOrder,
        addToCart,
        editProduct,
        removeProduct,
        removeAllProducts,
        deleteCart,
        checkShipDate
    }
}

app.factory("storeAjaxService", ajaxService);