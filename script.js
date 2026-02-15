let productList = []
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

function toString(product){
    return JSON.stringify(product);
}

function toObject(str){
    return JSON.parse(str);
}

// save the entire array to LocalStorage at once.
function saveProducts(){
    let str = toString(productList);
    localStorage.setItem('products', str);
}

// load products when the script starts for persistence
function loadProducts(){
    let str = localStorage.getItem('products');
    if(str){
        productList = toObject(str);
        // so the id don't overlap, set the current id to the last product's id + 1
        if(productList.length > 0){
            id = productList[productList.length - 1].pid + 1
        }
    }
}

function createProduct(name, image, price, description){
    let p = new Product(id, name, image, price, description);

    productList.push(p);   
    saveProducts();

    id++;
    console.log("Created: ", p);
}

function updateProduct(pid, name, image, price, description){
    let index = productList.findIndex(function(p) {
        return p.pid === pid;
    });

    if(index != 1){
        productList[index].name = name;
        productList[index].image = image;
        productList[index].price = price;
        productList[index].description = description;

        saveProducts();
        console.log("Updated: ", productList[index]);
    }
    else{
        console.log("Product with id " + pid + " not found.");
    }
}

function filterByPid(startPid, endPid){

    let filterdlist = productList.filter(function(product){
        return product.pid >= startPid && product.pid <= endPid;
    });

    return filterdlist;
}


function sortByPid(){
    let sortedList = [...productList];

    sortedList.sort(function(a, b){
        return a.pid - b.pid;
    })

    return sortedList;
}

function sortByPrice(){
    let sortedList = [...productList];

    sortedList.sort(function(a, b){
        return a.price - b.price;
    })

    return sortedList;
}

function sortByName(){
    let sortedList = [...productList];

    sortedList.sort(function(a, b){
        return a.name.localeCompare(b.name);
    })

    return sortedList;
}

loadProducts();