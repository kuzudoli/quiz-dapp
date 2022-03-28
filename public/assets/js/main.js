/**
 * Project  : Players
 * Date     : 03.09.2022
 * Author   : Ferdi Sahin
 * E-mail   : ferdisahin@mail.com
*/

AOS.init();


$('#faq .faq .header').on('click', function(){
    $(this).parents('.faq').toggleClass('open');
   
    if($(this).parents('.faq').hasClass('open')){
      $(this).find('span').html('-');
    }else{
      $(this).find('span').html('+');
    }
});

// $('.ud-modal-open').on('click', function(){
//   $('.ud-modal').toggleClass('open');
// });

// $('.mobile-menu-btn').on('click', function(){
//   $('#mobilemenu').toggleClass('hidden');
// });

function modalOpen(){
  var modal = $('.ud-modal');
  modal.css('visibility', 'visible');
  
  setTimeout(() => {
      modal.css('opacity', 1);
  }, 50);
}

function modalClose(){
  var modal = $('.ud-modal');
  modal.css('visibility', 'hidden');
  
  setTimeout(() => {
      modal.css('opacity', 0);
  }, 50);
}

const $plusButton = document.querySelector(".count-plus");
const $minusButton = document.querySelector(".count-minus");
const $numberText = document.getElementById("amountInput");
const $payment = document.getElementById("payment");
const $modalCloseButton = document.getElementById("ud-modal-close");

let itemCount = 1;

$plusButton.addEventListener("click", function (e) {
    e.preventDefault();
    itemCount = itemCount < 10 ? itemCount + 1 : 10;
    $numberText.value = itemCount;
    //you'll pay
    $payment.innerText = document.getElementById("priceCheck").innerText * itemCount;
    document.getElementById("counterAmount").click();
});
  
$minusButton.addEventListener("click", function (e) {
    e.preventDefault();
    itemCount = parseInt($numberText.value);
    itemCount = itemCount > 1 ? itemCount - 1 : itemCount;
    $numberText.value = itemCount;
    //you'll pay
    $payment.innerText = document.getElementById("priceCheck").innerText * itemCount;
    document.getElementById("counterAmount").click();
});

$modalCloseButton.addEventListener("click",function(e){
  e.preventDefault();
  modalClose();
})