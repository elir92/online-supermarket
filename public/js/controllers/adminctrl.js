app.controller('adminCtrl', ['$scope', '$window', 'storeAjaxService', ($scope, $window, storeAjaxService) => {
    const { newProduct, editProduct, fetchProduct } = storeAjaxService;

    fetchProduct().then(res => $scope.items = res.data).catch(err => console.log(err));

    // Add a new product into DB
    $scope.addNewProduct = () => {
        const file = document.getElementById('myfile');

        if (file.files.length === 0) {
            $scope.imgMessage = "please choose image";
        }

        if (file.files.length !== 0) {
            $scope.imgMessage = "";
            const imagePath = window.location.origin + `/upload/` + file.files[0].name;
            uploadAjax(file);
            const id = $scope.selectedCategory._id;
            const product = {
                name: $scope.product_name,
                price: $scope.product_price,
                img: imagePath,
                category: id
            }
            console.log(product);
            newProduct(product).then(updatedProducts(), clearAddForm()).catch(err => console.log(err));
        }
    }

    // Edit product
    $scope.editProduct = (product) => {
        $scope.successMessage = "";
        const id = product._id;
        $scope.edit_product = product.name;
        $scope.edit_price = product.price;
        $scope.productCategory = product.category.name;

        $scope.editImage = () => {
            $scope.editImg = true;
        }

        $scope.saveEdit = () => {
            const editFile = document.getElementById('editFile');
            const flag = editFile;
            if (flag === null) {
                // Staying with the current product's image
                let editedProduct = {
                    id: id,
                    name: $scope.edit_product,
                    price: $scope.edit_price,
                    img: product.img
                }
                editProduct(id, editedProduct).then(res => {
                    console.log(res);
                    updatedProducts();
                    clearEditFrom();
                }).catch(err => console.log(err));
            } else {
                // Replace the current product's image
                let editPath = window.location.origin + `/upload/` + editFile.files[0].name;
                uploadAjax(editFile);
                let editedProduct = {
                    id: id,
                    name: $scope.edit_product,
                    price: $scope.edit_price,
                    img: editPath
                }
                editProduct(id, editedProduct).then(updatedProducts(), clearEditFrom()).catch(err => console.log(err));
            }
        }

    }

    // F-U-N-C-T-I-O-N-S

    // Uploading image function
    uploadAjax = (file) => {
        const formData = new FormData();
        formData.append('sampleFile', file.files[0]);
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log(this.responseText);
            }
        }
        xhr.open('post', 'http://localhost:4000/api/upload');
        xhr.send(formData);
    }

    // Fetching edited products with AJAX request.
    updatedProducts = () => {
        fetchProduct().then(res => $scope.items = res.data).catch(err => console.log(err));
    }

    // Clear the edit form.
    clearEditFrom = () => {
        $scope.edit_product = "";
        $scope.edit_price = "";
        $scope.productCategory = "";
        $scope.editForm.$setUntouched();
        $scope.updateMessage = "Product successfully updated";
    }

    // Clear the add form.
    clearAddForm = () => {
        $scope.product_name = "";
        $scope.product_price = "";
        $scope.adminForm.$setUntouched();
        document.getElementById('myfile').value = null;
    }
}]);