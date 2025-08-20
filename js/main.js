/* Set Behavior Logo */
var setBehaviorLogo = function() {
  logo = document.getElementById('logo');
  var y = window.scrollY;
  // console.log(y);
  if (y >= 50) {
    logo.classList.add('sticky');
  } else {
    logo.classList.remove('sticky');
  }
};

/* On Load */
(function() {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
  // window.addEventListener('scroll', setBehaviorLogo);
})();
