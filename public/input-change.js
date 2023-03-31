function CartChange (index,length) {

  
  var Quantity = document.getElementById(`q=${index}`).value;
  var Price = document.getElementById(`p=${index}`).value;
  var productID = document.getElementById(`i=${index}`).value;

  var Total = (Quantity * Price).toFixed(3);
  

  document.getElementById(`t=${index}`).textContent = Total;
  // document.getElementById(`t=${index}`).textContent = `/editProductQuantite2/${productID}/${Quantity}/${Price}`;



  $.get(`/editProductQuantite2/${productID}/${Quantity}/${Price}`, function(data) {
    
  })

  TotalChange (length);


  
}

function TotalChange (length) {

  
  var FinalTotal = 0

  // var LengthNumber = Number(length);
  

  
  for (let i = 0; i < length; i++) {
    FinalTotal += Number(document.getElementById(`t=${i}`).textContent)     
  }
  

  FinalTotal = (FinalTotal + Number(document.getElementById(`shippingCost`).value) - Number(document.getElementById(`discount`).value)).toFixed(3)
  console.log(FinalTotal);
  
  document.getElementById("FinalTotal").value = FinalTotal;


}




$("#addorder").submit(function(e) {


  var city = document.getElementById("city").value;


  if (city > 20) {
    $("#errorCart").html("يجب اختيار طريقة الشحن");
    return false;
  } else {
    $("#errorCart").html("");

  }

});






$("#cart").submit(function(e) {


  var status = document.getElementById("variant").value;
  var status = document.getElementById("variant").value;



  if (status == "0#0" ) {
    $("#errorProduct").html("يجب اختيار احد الخيارات");
    return false;
  } else {
    $("#errorProduct").html("");

  }

});

$(".p-1").change(function() {
  console.log("price changed")

});





$("#city").change(function() {

  var subTotalPrice = document.getElementById("subTotalPrice").textContent;
  var shippingPrice = this.value.split("#")[1]
  var discountrice = document.getElementById("discount").value;



  if (this.value > 20) {
    $("#shipping").html("اختر المنطقة");
    $("#shipping1").html("");
    $("#finalPrice").html((Number(0) + Number(subTotalPrice) -  Number(discountrice)).toFixed(3));
  } else {
    $("#shipping").html(shippingPrice);
    $("#shipping1").html(" K.D");
    $("#finalPrice").html((Number(shippingPrice) + Number(subTotalPrice) -  Number(discountrice)).toFixed(3));
    // $("#finalPrice").html(Number(shippingPrice) + Number(subTotalPrice));
  }


  // $("#shipping").html(this.value);


});


$("#discount").change(function() {
  // console.log("discount changed")

  //   var discountrice = document.getElementById("discount").value;

  //   var subTotalPrice = document.getElementById("subTotalPrice").textContent;


  //   console.log("discount :" + discountrice)
  //   console.log("subTotalPrice :" + subTotalPrice)


  // $("#finalPrice").html( - Number(discountrice) + Number(subTotalPrice));
  UpdateFinalPrice();

});



// $("#discount").change(function() {

//   console.log("discount  changed!");

//   // var discountrice = document.getElementById("discount").textContent;

//   // $("#finalPrice").html(Number(shippingPrice) + Number(subTotalPrice));
  
// }


$("#orderProduct").change(function() {

  document.getElementById("qurainProductOrder").value = this.value.split("#")[1]
  document.getElementById("naseemProductOrder").value = this.value.split("#")[2]
  document.getElementById("PriceO").value = this.value.split("#")[3]

});

$("#variant").change(function() {

  document.getElementById("pid").value = value = this.value.split("#")[0]
  document.getElementById("pprice").value = value = this.value.split("#")[1]
  document.getElementById("pproductNo").value = value = this.value.split("#")[2]
  document.getElementById("lprice").textContent = value = this.value.split("#")[1] + " K.D"

});



$(".input1").change(function() {
  console.log("Input text changed!");
  Quantitychange(this.id, this.value)
});

$(".remove").click(function() {
  console.log(this.value);
  Quantitychange(this.value, 0)
});




function Quantitychange(productID, Q, index, newPrice) {
    console.log("Input text changed!");

   // Q = document.getElementById(`${productID}-q=${index}`).value

  if (Q == 0) {
    var newQuantity = 0;
  } else {
    var  newQuantity = document.getElementById(`${productID}-q=${index}`).value
    // var newQuantity = document.getElementById(productID).value;
  }
  console.log("productID  ::  " + productID)
  console.log("newQuantity :: " + newQuantity)
  console.log("newPrice :: " + newPrice)
  
  $.get(`/editProductQuantite/${productID}/${newQuantity}/${newPrice}`, function(data) {
    var priceId = `#R${productID}`
    $("#subTotalPrice").html(data.totalPrice)
    $("#totalPrice").html(data.totalPrice)
    if (data.quantity == "0") {
      var divId = `#div${productID}`
      $(divId).html("");
    } else {
      console.log(data)
      $(priceId).html(data.price * 1000 * data.quantity / 1000);
      UpdateFinalPrice()
    }


  });

};



function Pricechange(productID, index) {

    console.log("index:  " + index)
    console.log("productID:  " + productID)



  var Q = document.getElementById(`${productID}-q=${index}`).value
  var newPrice = document.getElementById(`${productID}-i=${index}`).value

  console.log("newPrice:  " + newPrice)
  console.log("Quantity:  " + Q)


  Quantitychange(productID,Q,index, newPrice);
  

};






function UpdateFinalPrice() {
  var subTotalPrice = document.getElementById("subTotalPrice").textContent;
  var shipping = document.getElementById("shipping").textContent;
  var shipping = document.getElementById("shipping").textContent;
    // var shippingPrice =document.getElementById("city").split("#")[1]

  var discountrice = document.getElementById("discount").value;

  console.log(discountrice);
  console.log("shipping:" + shipping);

  $("#finalPrice").html((Number(shipping) + Number(subTotalPrice) -  Number(discountrice)).toFixed(3)) ;

  if (shipping > 0) {
    $("#finalPrice").html((Number(shipping) + Number(subTotalPrice) -  Number(discountrice)).toFixed(3));
  } else {
    $("#finalPrice").html((Number(0) + Number(subTotalPrice) -  Number(discountrice)).toFixed(3));
  }

}


