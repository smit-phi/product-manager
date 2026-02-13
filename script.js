const productList = []
var id = 1;

function Product(pid, name, image, price, description){
    this.pid = pid;
    this.name = name;
    this.image = image;
    this.price = price;
    this.description = description;

    this.getPid = function(){
        return this.pid;
    }

    this.getImageLink = function(){
        return this.image
    }

}

function addToLocalStorage(product){
    let productString = JSON.stringify(product);
    window.localStorage.setItem(`${product.getPid()}`, productString);
}

function createProduct(name, image, price, description){
    let p = new Product(id, name, image, price, description);
    id = id + 1;
    addToLocalStorage(p);
    console.log(p);
}

function updateProduct(pid, name, image, price, description){
    
}
