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

    let name = document.getElementById('inputName').value.trim();
    let image = document.getElementById('inputImage').value.trim();
    let price = document.getElementById('inputPrice').value.trim();
    let desc = document.getElementById('inputDesc').value.trim();

    if (!name || !image || !price || !desc) {
        alert("All fields are required.");
        return;
    }
    if (isNaN(price) || price === "" || Number(price) <= 0) {
        alert("Price must be a positive number.");
        return;
    }
    price = parseFloat(price);

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
    // Close modal after save
    let modal = document.getElementById('productModal');
    let bsModal = bootstrap.Modal.getInstance(modal);
    if (!bsModal) bsModal = new bootstrap.Modal(modal);
    bsModal.hide();
}

// Restrict add product to logged-in users
function checkAuthForAdd() {
    let user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (!user) {
        alert('Please log in to add a product.');
        return false;
    }
    return true;
}

// Update prepareCreate to check auth
function prepareCreate() {
    if (!checkAuthForAdd()) return;
    document.getElementById('productForm').reset();
    document.getElementById('editPid').value = '';
    document.getElementById('modalTitle').innerText = 'Add New Product';
}

// Restrict edit and delete to logged-in users
function checkAuthForEditDelete() {
    let user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (!user) {
        alert('Please log in to edit or delete products.');
        return false;
    }
    return true;
}

// Update prepareEdit to check auth
function prepareEdit(pid) {
    if (!checkAuthForEditDelete()) return;
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

// Update deleteProduct to check auth
function deleteProduct(pid) {
    if (!checkAuthForEditDelete()) return;
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

// Authentication logic
function toggleAuthForm() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const modalTitle = document.getElementById('authModalTitle');
    const toggleLink = document.getElementById('toggleAuth');

    if (loginForm.style.display === 'none') {
        loginForm.style.display = '';
        signupForm.style.display = 'none';
        modalTitle.innerText = 'Login';
        toggleLink.innerText = 'Switch to Signup';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = '';
        modalTitle.innerText = 'Signup';
        toggleLink.innerText = 'Switch to Login';
    }
}

function handleSignup() {
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    if (!email || !password) {
        alert('Please fill all fields.');
        return;
    }
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === email)) {
        alert('User already exists.');
        return;
    }
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful! Please login.');
    toggleAuthForm();
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) {
        alert('Please fill all fields.');
        return;
    }
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        alert('Invalid credentials.');
        return;
    }
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    alert('Login successful!');
    // Hide modal after login
    let modal = document.getElementById('authModal');
    let bsModal = bootstrap.Modal.getInstance(modal);
    if (!bsModal) bsModal = new bootstrap.Modal(modal);
    bsModal.hide();
    updateNavbarAuth(); // Update navbar immediately after login
    // Optionally, update UI for logged-in user
}

// Update navbar for authentication state
function updateNavbarAuth() {
    const authBtn = document.querySelector('[data-bs-target="#authModal"]');
    let navbar = authBtn.parentElement;
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    // Remove any existing user info or logout button
    let userInfo = document.getElementById('userInfo');
    if (userInfo) userInfo.remove();
    let logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.remove();
    if (loggedInUser) {
        authBtn.style.display = 'none';
        // Show user info and logout button
        let info = document.createElement('span');
        info.id = 'userInfo';
        info.className = 'navbar-text text-light ms-2';
        info.textContent = loggedInUser.email;
        navbar.appendChild(info);
        let btn = document.createElement('button');
        btn.id = 'logoutBtn';
        btn.className = 'btn btn-outline-danger ms-2';
        btn.textContent = 'Logout';
        btn.onclick = handleLogout;
        navbar.appendChild(btn);
    } else {
        authBtn.style.display = '';
    }
}

function handleLogout() {
    localStorage.removeItem('loggedInUser');
    updateNavbarAuth();
    // Optionally, refresh UI or restrict actions
}

// Call updateNavbarAuth on page load and after login
window.addEventListener('DOMContentLoaded', updateNavbarAuth);
// Also call after successful login
// In handleLogin(), add: updateNavbarAuth(); after bsModal.hide();

loadProducts();