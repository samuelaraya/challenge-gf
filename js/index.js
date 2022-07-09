function createRandomId(length) {
  var randomChars = '0123456789ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}





function renderCars(array_cars) {
  final_html_cars = ""

  if (array_cars.length > 0) {
    for (car of array_cars) {
      final_html_cars += createCardFromCar(car)
    }
  } else {
    document.querySelector(".container-cars").innerHTML = `<div class="car-card bg-white p-3">There are no cars available with these characteristics.</div>`
  }


  document.querySelector(".container-cars").innerHTML = final_html_cars

}

function createCardFromCar(object_car) {
  car_card = `
<div class="car-card bg-white">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="col-4 p-2">
                        <img src="${object_car.PictureURL}"
alt="Picture of ${object_car.Name} car" class="img-fluid w-100">
                    </div>
                    <div class="col-7">
                        <h2 class="car-category ">${object_car.Features2.category}</h2>
                        <div class="container-btn d-flex justify-content-between align-items-center">
<p class="car-description mb-0">
    GROUP ${object_car.VehGroup} (${object_car.Code})<br>${object_car.Name}
</p>
<button class="btn btn-book d-flex justify-content-around align-items-center"><span><img
            src="assets/images/check.svg" alt="Checkmark Icon"></span> Book now!</button>
                        </div>

                    </div>
                </div>

                <div class="d-flex justify-content-between">
                    <div class="col-4 container-characteristics">
                        <h6 class="subtitles">
CHARACTERISTICS
                        </h6>
                        <div class="list-characteristics">
<div class="d-flex">
    <div class="container-icon d-flex justify-content-center align-items-center">
        <img src="assets/images/seats.svg" alt="Seat Icon">
    </div>
    <span>${object_car.Features2.seats} Seats</span>
</div>

<div class="d-flex">
    <div class="container-icon d-flex justify-content-center align-items-center">
        <img src="assets/images/luggage.svg" alt="Luggage Icon">
    </div>
    <span>${object_car.Features2.largeSuitcase} large suitcase</span>
</div>

<div class="d-flex">
    <div class="container-icon d-flex justify-content-center align-items-center">
        <img src="assets/images/bag.svg" alt="Bag Icon">
    </div>
    <span>${object_car.Features2.smallSuitcase} small suitcase</span>
</div>

<div class="d-flex">
    <div class="container-icon d-flex justify-content-center align-items-center">
        <img src="assets/images/door.svg" alt="Door Icon">
    </div>
    <span>${object_car.Features2.doors} doors</span>
</div>

<div class="d-flex">
    <div class="container-icon d-flex justify-content-center align-items-center">
        <img src="assets/images/transmision.svg" alt="Transmission Icon">
    </div>
    <span>${object_car.Features2.transmition} transmission</span>
</div>
 ${object_car.AirConditionInd == "true" ?
      // In the data given, all cars have Air Conditioning, but this does not show the section if the opposite is the case.
      `<div class="d-flex">
 <div class="container-icon d-flex justify-content-center align-items-center">
     <img src="assets/images/air-conditioning.svg" alt="Air Conditioning Icon">
 </div>
 <span>Air Conditioning</span>
                         </div>` : ``
    }

                        </div>
                    </div>
                    <div class="col-7">
                        <h6 class="subtitles">
AVAILABLE RATES
                        </h6>

                        ${createRatesList(object_car.Rates, object_car.temp_id)}

                    </div>
                </div>


            </div>
`

  return car_card;
}

function createRatesList(rates, id_car) {

  // Order by price as the example
  rates = Object.fromEntries(
    Object.entries(rates).sort(([, a], [, b]) => b.EstimatedTotalAmount - a.EstimatedTotalAmount)
  );

  rates_list = `<div class="container-rates w-100">
  <form action="">`

  for (rate_item in rates) {
    rates[rate_item]

    rates_list += `

    <div class="rate-item d-flex w-100 justify-content-between align-items-center">
        <div class="d-flex align-items-center">
            <div class="cont-radio">
                <input type="radio" name="rates" id="${id_car + '_' + rate_item
      // This code concatenates the temporary id of the car with the name of the rate, this way it is compatible with the HTML id's unique format and the labels work
      }">
            </div>
            <span class="rate-name">
                <label for="${id_car + '_' + rate_item}">${rate_item} - ${rates[rate_item].RateData.name}</label>
            </span>
        </div>

        <span class="rate-inclusions" onclick="openModalInclusions('${id_car}','${rate_item}')">
           Rate Inclusions
        </span>
        <div class="price">
            <span class="currency">${rates[rate_item].CurrencyCode}</span><span class="number">${Number(parseFloat(rates[rate_item].EstimatedTotalAmount)).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      // Use the german format for the commas, and the min and max fractions to avoid truncated numbers
      }</span>
        </div>
    </div>


`
  }


  rates_list += `</form></div>`

  return rates_list

}

function filterBy() {

  // Using timeout because the custom select is lazy on giving the real select the value

  setTimeout(function () {
    // First I filter the groups
    if (document.querySelector("#select-category").value != "All") {
      array_cars_use = array_cars_final.filter(car => car.VehGroup == document.querySelector("#select-category").value);
    } else {
      array_cars_use = array_cars_final
    }

    // I create an object with the sentences to filter
    object_conditions = {
      manual: 'car.Features2.transmition == "Manual"',
      automatic: 'car.Features2.transmition == "Automatic"',
      five_seats: 'parseInt(car.Features2.seats) == 5',
      seven_seats: 'parseInt(car.Features2.seats) >= 7',
      convertibles: 'car.Features2.category == "Convertible"',
    }

    evaluate = []

    // I evaluate each checkbox
    if (document.querySelector("#manual-transmission").checked) {
      evaluate.push(object_conditions.manual)
    }

    if (document.querySelector("#automatic-transmission").checked) {
      evaluate.push(object_conditions.automatic)
    }

    if (document.querySelector("#five-seats").checked) {
      evaluate.push(object_conditions.five_seats)
    }

    if (document.querySelector("#seven-seats").checked) {
      evaluate.push(object_conditions.seven_seats)
    }

    if (document.querySelector("#convertibles").checked) {
      evaluate.push(object_conditions.convertibles)
    }

    if (evaluate.length > 0) {
      evaluate = evaluate.join(" || ")


      // Filter with eval, this allows to use the string as a valid piece of code
      const results = array_cars_use.filter(eval('car => ' + evaluate));

      renderCars(results)
    } else {
      renderCars(array_cars_use)
    }
  }, 100)




}

function openModalInclusions(id_car, rate_name) {
  var result_car = array_cars_final.find(car => car.temp_id === id_car);

  result_rate = result_car.Rates[rate_name]


  html_modal = `
  <div class="d-flex justify-content-between">
  <span class="title-modal">Rate Information</span>
  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<span class="subtitles">${rate_name} - ${result_rate.RateData.name}</span>

<div class="inclusions-list">
  ${createInclusionsList(result_rate)}
</div>`


  document.getElementById('modal-inclusions-content').innerHTML = html_modal

  var modal_inclusions = new bootstrap.Modal(document.getElementById('modal-inclusions'), {

  })

  modal_inclusions.show()


}

function createInclusionsList(rate_object) {
  inclusions_list = ""

  if (rate_object.RateData.inclusions != undefined) {
    for (inclusion of rate_object.RateData.inclusions) {
      inclusions_list += `
    <div class="inclusion-item d-flex align-items-center">
        <div class="container-icon d-flex justify-content-center align-items-center"><img src="assets/images/chevron-right.svg" alt=""></div>
        <span class="text">${inclusion}</span>
    </div>
    `
    }
  } else {
    inclusions_list = "The list of inclusions is not available."
  }

  return inclusions_list

}

function getAllCategories(array_cars) {
  const unique = [...new Set(array_cars.map(item => item.VehGroup))];

  return unique
}



fetch('carsJSON.json').then(response => {
  return response.json();
}).then(data => {


  array_cars_final = []
  for (group_car of Object.values(data.cars)) {
    for (car_individual in group_car) {
      new_car = group_car[car_individual]
      new_car.company = car_individual

      // I create a random code to use it as id and to be able to call the specific object without problems in the future when the list is sorted
      new_car.temp_id = createRandomId(6)

      array_cars_final.push(new_car)
      new_car = null
    }
  }

  // render the cars

  renderCars(array_cars_final)

  // create the select with the categories

  categories = getAllCategories(array_cars_final)

  html_select = `<option value="All">All</option><option value="All">All</option>`

  for (categorie of categories) {
    html_select += `<option value="${categorie}">Group ${categorie}</option>`
  }



  document.querySelector("#select-category").innerHTML = html_select

  initializeSelects()



}).catch(err => {
  // error getting the JSON
  console.log(err)
});





// Select functions
function initializeSelects() {


  var x, i, j, l, ll, selElmnt, a, b, c;
  /*look for any elements with the class "custom-select":*/
  x = document.getElementsByClassName("custom-select");
  l = x.length;
  for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    /*for each element, create a new DIV that will act as the selected item:*/
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected select-selected-bottom-rounded");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /*for each element, create a new DIV that will contain the option list:*/
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
      /*for each option in the original select element,
      create a new DIV that will act as an option item:*/
      c = document.createElement("DIV");
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener("click", function (e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        s.dispatchEvent(new Event('change'));
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
      this.classList.toggle("select-selected-bottom-square");
    });
  }
  function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i)
      } else {
        y[i].classList.remove("select-arrow-active");
        y[i].classList.remove("select-selected-bottom-square");
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }
  /*if the user clicks anywhere outside the select box,
  then close all select boxes:*/
  document.addEventListener("click", closeAllSelect);

}