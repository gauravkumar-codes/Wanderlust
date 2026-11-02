// This file contains JavaScript code that adds custom Bootstrap validation styles to forms with the class "needs-validation". It uses an immediately invoked function expression (IIFE) to encapsulate the code and prevent polluting the global scope.

// The code selects all the forms with the class "needs-validation" and adds an event listener to each form's submit event. When a form is submitted, it checks if the form is valid using the checkValidity() method. If the form is not valid, it prevents the default form submission behavior and stops the event from propagating further. It then adds the class "was-validated" to the form, which triggers Bootstrap's validation styles to be applied.

(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()