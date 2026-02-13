const productList = {}
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

function addToLocalStorage(product){
    let productString = toString(product);
    window.localStorage.setItem(`${product.getPid()}`, productString);
}

function createProduct(name, image, price, description){
    let p = new Product(id, name, image, price, description);
    productList[id] = toString(p);    
    addToLocalStorage(p);
    id = id + 1;
    console.log(p);
}

function updateProduct(pid, name, image, price, description){
    window.localStorage.removeItem(`${pid}`);
    let p = new Product(pid, name, image, price, description);
    addToLocalStorage(p);
    productList[pid] = toString(p);
    console.log(p);
}

function filterByPid(startPid, endPid){

    // if(endPid < startPid){
        // return;
    // }
    // let start = 0;
    // let end = productList.length - 1;
    // if(endPid > end) return;

    let filterdlist = {}
    let curr = startPid;

    while(curr != endPid + 1){
        let obj = toObject(productList[curr])
        filterdlist[curr] = obj
        curr = curr + 1;
    }
    return filterdlist;    
}

createProduct('daftpunk helmet', 'url', 999, 'suit your self');
createProduct('cricket helmet', 'url', 999, 'suit your own self');
createProduct('mototcycle helmet', 'url', 999, 'save your self');


let a = filterByPid(1, 2);
console.log(typeof(a[1]));
console.log(a);


function sortByPid(products){
    let sortedList = {}

    



}

function sortByName(){

}

function sortByPrice(){

}

