(function() {
  if (!Element.prototype.matches)
    Element.prototype.matches =
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;

  if (!Element.prototype.closest)
    Element.prototype.closest = function(s) {
      var el = this;
      if (!document.documentElement.contains(el)) return null;
      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  var lib_controllers = {};
  var forms = {};
  var invalid_elements = {};
  var form_controller = {};
  var Form = function(name) {
    this.name = name;
    this.touched = false;
    this.pristine = true;
    this.valid = true;
    this.invalid = false;
  };

  Form.prototype = {
    checkAgainstPattern: function(pattern, text, e) {
      var regexp = new RegExp(pattern);
      if (regexp.test(text)) {
        return true;
      } else {
        return false;
      }
    },

    checkForMinLength: function(e) {
      if (
        e.target.value.length < parseInt(e.target.getAttribute("minlength"))
      ) {
        return false;
      } else {
        return true;
      }
    },

    checkForMaxLength: function(e) {
      if (e.target.value < e.target.getAttribute("maxlength")) {
        return false;
      }
      return true;
    },

    checkForRequired: function(e) {
      if (e.target.value === "") {
        return false;
      } else {
        return true;
      }
    }
  };

  function attachEventsAndCheckValidity(event, e) {
    if (e.target && e.target.closest) {
      var form_ele = e.target.closest("form[name]");
      var form_name = form_ele.getAttribute("name");
      var formReference = form_ele.dataset.formReference;
    }
    console.log("inside attachEventsAndCheckAvailaibility", form_name);
    if (
      e.target &&
      e.target.matches &&
      e.target.matches("[data-" + event + "]")
    ) {
      if (forms[form_name].touched === false) {
        forms[form_name].touched = true;
      }
      console.log(this);
      let fn = e.target.dataset[event];
      let element_form_instance = forms[form_name];

      let isFormValid = true;
      let isElementValid = true;
      console.log("in here", isFormValid);

      if (event === "submit") {
        console.log("in here");
        console.log(invalid_elements);
        if (Object.keys(invalid_elements).length > 0) {
          isFormValid = false;
        }
      }
      console.log("in here", isFormValid);

      if (e.target.dataset.pattern) {
        var pattern_error_ele = document.querySelector(
          "[data-showIf=" +
            '"' +
            formReference +
            "." +
            e.target.name +
            ".pattern" +
            '"' +
            "]"
        );

        let isValid = element_form_instance.checkAgainstPattern(
          e.target.dataset.pattern,
          e.target.value,
          e
        );
        if (isValid) {
          pattern_error_ele.setAttribute("hidden", "");
        } else {
          pattern_error_ele.removeAttribute("hidden");
          isFormValid = false;
          isElementValid = false;
        }
      }

      if (e.target.hasAttribute("minlength")) {
        var minLengthEle = document.querySelector(
          "[data-showif=" +
            '"' +
            formReference +
            "." +
            e.target.name +
            ".minlength" +
            '"' +
            "]"
        );
        let isValid = element_form_instance.checkForMinLength(e);
        console.log("iam here", isValid);

        if (isValid) {
          minLengthEle.setAttribute("hidden", "");
        } else {
          minLengthEle.removeAttribute("hidden");
          isFormValid = false;
          isElementValid = false;
        }
      }

      if (e.target.hasAttribute("maxlength")) {
        if (e.target.value.length > e.target.getAttribute("maxlength")) {
          isFormValid = false;
          isElementValid = false;
        }
      }
      if (e.target.dataset.required === "") {
        var requiredEle = document.querySelector(
          "[data-showif=" +
            '"' +
            formReference +
            "." +
            e.target.name +
            ".required" +
            '"' +
            "]"
        );
        let isValid = element_form_instance.checkForRequired(e);
        if (isValid) {
          requiredEle.setAttribute("hidden", "");
        } else {
          requiredEle.removeAttribute("hidden");

          isFormValid = false;
          isElementValid = false;
        }
      }

      if (isElementValid) {
        if (invalid_elements[e.target.name]) {
          delete invalid_elements[e.target.name];
        }
      } else {
        if (e.target.name !== "stdForm") {
          invalid_elements[e.target.name] = true;
        }
        // if (event !== "submit") {
        //   lib_controllers[form_name][fn](e);
        // }
      }
      if (event !== "submit") {
        lib_controllers[form_name][fn](e);
      }

      if (isFormValid && event === "submit") {
        if (invalid_elements[e.target.name]) {
          delete invalid_elements[e.target.name];
        }
        lib_controllers.form_name[fn](e);
      }
    }
  }

  [
    "focusin", "focusout", "click", "change", "input","submit"
  ].forEach(event => {
    if (document.addEventListener) {
      document.addEventListener(event, function(e) {
        attachEventsAndCheckValidity(event, e);
      });
    } else if (document.attachEvent) {
      document.attachEvent("on" + event, function(e) {
        attachEventsAndCheckValidity(event, e);
      });
    }
  });

  let hidden_elements = document.querySelectorAll("[data-showIf]");
  let length = hidden_elements.length;

  for (let i = 0; i < length; i++) {
    hidden_elements[i].setAttribute("hidden", "");
    console.log(hidden_elements[i]);
  }

  function initializeAllForms() {
    let f = document.querySelectorAll("form[name]");
    let l = f.length;
    for (let i = 0; i < l; i++) {
      let name = f[i].getAttribute("name");
      forms[name] = new Form(name);
    }
    console.log(forms);
  }

  function initApplication() {
    console.log(controllers);
    for (let controller in controllers) {
      lib_controllers[controller] = controllers[controller]();
    }
    console.log("InitApplication", lib_controllers);
  }

  document.onreadystatechange = function(e) {
    if (document.readyState === "interactive") {
      initializeAllForms();
    }
    if (document.readyState === "complete") {
      initApplication();
    }
  };
})();
