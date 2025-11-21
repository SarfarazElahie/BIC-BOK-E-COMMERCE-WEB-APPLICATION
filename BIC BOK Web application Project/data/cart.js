export let cart = JSON.parse(localStorage.getItem("cart")) 

    if(!cart){
      cart =  [
   /*  {
      productId : 1,
      quantity : 2
},{
      productId : 2,
      quantity : 1
} */];
    }


// Make local storage for cart

function saveLocalStorage(){
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Add to cart Functionality 
export function addToCart(cart_product_Id){
    let matchchingItem ;

    // checking if selected item already in cart
    cart.forEach((cartItem)=>{
        if(cartItem.productId === cart_product_Id){
            matchchingItem = cartItem;
        };
    });
    // if item is already in cart , quantity increase
    if(matchchingItem){
            matchchingItem.quantity+= 1
        }

        // if not a new object push to cart of btn clicked id 
        else{
            cart.push({
                productId : cart_product_Id,
                quantity : 1
            })
        }
        saveLocalStorage();
};

// Cart quantity 
export function updateCartQuantity(){
    let cartQuantity = 0;
    cart.forEach((cartItem)=>{
        cartQuantity+= cartItem.quantity;
    })
     document.querySelector(".cart-count").textContent = cartQuantity
     saveLocalStorage();
}