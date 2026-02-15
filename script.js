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
    renderProducts();
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

    if(index !== -1){
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
        return b.pid - a.pid ;
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

function renderProducts(listToRender = productList){

    const container = document.getElementById('productContainer');

    // clear the product container so we don't add duplicates when we inject.
    container.innerHTML = '';

    listToRender.forEach(function(product){

        // create HTML string using template literals and we inject variables using ${}
        const cardHTML = `
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text text-truncate">${product.description}</p>
                        <p class="fw-bold text-success">${product.price}</p>
                        <p class="text-muted small">ID: ${product.pid}</p>
                    </div>

                    <div class="card-footer bg-white border-top-0 d-flex justify-content-between">
                        <button class="btn btn-outline-primary btn-sm" 
                            data-bs-toggle="modal" 
                            data-bs-target="#productModal"
                            onclick="prepareEdit(${product.pid})">
                            Edit
                        </button>
                        
                        <button class="btn btn-outline-danger btn-sm" 
                            onclick="deleteProduct(${product.pid})">
                            Delete
                        </button>
                    </div>

                </div>
            </div>
        `;

        container.innerHTML += cardHTML;
    });
}

// handle form submission create and update
function handleFormSubmit() {

    let name = document.getElementById('inputName').value;
    let image = document.getElementById('inputImage').value;
    let price = parseFloat(document.getElementById('inputPrice').value);
    let desc = document.getElementById('inputDesc').value;

    if (name.trim() === "" || image.trim() === "" || desc.trim() === "") {
        alert("Please fill out all fields. Empty spaces don't count!");
        return; // STOP HERE. Do not create product.
    }

    let editPid = document.getElementById('editPid').value;

    if(editPid){
        updateProduct(parseInt(editPid), name, image, price, desc);
    }
    else{
        createProduct(name, image, price, desc);
    }

    document.getElementById('productForm').reset();
    document.getElementById('editPid').value = '';

    renderProducts();
}

function prepareCreate(){
    document.getElementById('productForm').reset();
    document.getElementById('editPid').value = '';
    document.getElementById('modalTitle').innerText = 'Add New Product';
}

// prepare the form for edit
function prepareEdit(pid) {
    // find the product
    let product = productList.find(p => p.pid === pid);
    
    // fill the inputs
    document.getElementById('inputName').value = product.name;
    document.getElementById('inputImage').value = product.image;
    document.getElementById('inputPrice').value = product.price;
    document.getElementById('inputDesc').value = product.description;
    
    // set the hidden ID so handleFormSubmit knows what to do
    document.getElementById('editPid').value = pid;
    document.getElementById('modalTitle').innerText = 'Edit Product';
}

// 5. Helper: Delete
function deleteProduct(pid) {
    if(confirm("Are you sure?")) {
        // Filter out the deleted item
        productList = productList.filter(p => p.pid !== pid);
        saveProducts();
        renderProducts();
    }
}

function handleSort(){

    let sortType = document.getElementById('sortSelect').value;

    let listToShow;

    if(sortType === 'price'){
        listToShow = sortByPrice();
    }
    else if(sortType === 'name'){
        listToShow = sortByName();
    }
    else if(sortType === 'id'){
        listToShow = sortByPid();
    }
    else{
        listToShow = productList;
    }
    renderProducts(listToShow);
}


function applyFilter(){

    let start = parseInt(document.getElementById('filterStart').value);
    let end = parseInt(document.getElementById('filterEnd').value);

    if (isNaN(start) || isNaN(end)) {
        alert("Please enter valid Start and End IDs.");
        return;
    }

    if (start < 0 || end < 0) {
        alert("IDs cannot be negative.");
        return;
    }

    // Check logic (Start cannot be bigger than End)
    if (start > end) {
        alert("Start ID cannot be greater than End ID.");
        return;
    }

    let filteredList = filterByPid(start, end);

    renderProducts(filteredList);

    console.log("Showing IDs form " + start + " to " + end);
}


function resetFilter(){

    document.getElementById('filterStart').value = '';
    document.getElementById('filterEnd').value = '';
    document.getElementById('sortSelect').value = 'default';

    renderProducts(productList);
}

loadProducts();