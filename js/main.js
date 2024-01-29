// Nav Bar

$(document).ready(() => {
  getMealsData().then(() => {
    $(".loadingScreen").fadeOut(1000,function () {
      $('body').css('overflow', 'visible')
    })
  })
})
function openOuterSide() {
  $('#navBar').animate({ left: 0 }, 500);
  $('.outerSide .fa-2x').addClass('d-none');
  $('.outerSide .fa-xmark').removeClass('d-none');
  for (let i = 0; i < 5; i++) {
    $('.innerSide ul li ').eq(i).animate({ top: 0 }, (i + 5) * 100);
  }
}
function closeOuterSide() {
  let outerSideWidth = $('.innerSide').innerWidth();
  $('#navBar ').animate({ left: -outerSideWidth }, 500)
  $('.innerSide li').animate({ top: 300 }, 500);
  $('.outerSide .fa-2x').removeClass('d-none');
  $('.outerSide .fa-xmark').addClass('d-none');
}
closeOuterSide()
$('.outerSide .fa-2x').click(function () {
  openOuterSide();
})
$('.outerSide .fa-xmark').click(function () {
  closeOuterSide();
})

// Getting Data and Home
async function getMealsData() {
  let data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
  let response = await data.json();
  displayMeals(response.meals);
}
function displayMeals(response) {
  $(".loadingScreen").show();
  box = "";
  for (let i = 0; i < response.length; i++) {
    box += ` <div class="col-md-3" onclick="getMealDataById('${response[i].idMeal}')">
        <div class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <img src="${response[i].strMealThumb}" alt="${response[i].strMeal}" class="w-100">
          <div class="mealName position-absolute d-flex flex-column justify-content-center ps-3 ">
            <h3>${response[i].strMeal}</h3>
          </div>
        </div>
      </div>`
  }
  $(".loadingScreen").fadeOut(1000);
  $("#demo").html(box);
}
async function getMealDataById(x) {
  $(".loadingScreen").show();
  let mealDataById = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${x}`)
  let response = await mealDataById.json();
  showInstructions(response.meals[0]);
}
function showInstructions(response) {
  let Recipes = '';
  for (let i = 0; i < 20; i++) {
    if (response[`strIngredient${i}`]) {
      Recipes += `<li class="alert alret-info m-2 p-1 bg-white text-black"> ${response[`strMeasure${i}`]} ${response[`strIngredient${i}`]}</li>`
    }
  }
  let tag = response.strTags?.split(",");
  if (tag == null) {
    tag =[];
  } 
  let tagHome = '';
  for (let i = 0; i < tag.length; i++) {
    tagHome += `<li class="alert alret-info m-2 p-1 bg-white text-black">${tag[i]}</li>`
  }
  box = ` 
    <div class="col-md-4 text-white">
      <img src="${response.strMealThumb}" alt="" class="w-100">
      <h2>${response.strMeal}</h2>
    </div>
    <div class="col-md-8 text-white">
      <h2>Instructions</h2>
      <p>${response.strInstructions}</p>
      <h3>Area : ${response.strArea}</h3>
      <h3>Category : ${response.strCategory}</h3>
      <h3>Recipes :</h3>
      <ul class="d-flex flex-wrap g-3">
        ${Recipes}
      </ul>
      <h3>Tags : </h3>
      <ul class="d-flex flex-wrap g-3">
        ${tagHome}
      </ul>
      <button class="btn btn-success me-2"><a target="_blank" href="${response.strSource}">Source</a></button>
      <button class="btn btn-danger"><a target="_blank"  href="${response.strYoutube}">Youtube</a></button>
    </div>`
  $(".loadingScreen").fadeOut(1000);  
  $('#demo').html(box);
}

// Categories
$('#categories').click(async function () {
  $('#demo2').addClass('d-none');
  $('#demo').removeClass('d-none');
  $(".loadingScreen").show();
  let categoriesData = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
  let response = await categoriesData.json();
  box = "";
  for (let i = 0; i < response.categories.length; i++) {
    box += `
      <div onclick="getCategoryMeals('${response.categories[i].strCategory}')" class="col-md-3" id="${response.categories[i].idCategory}">
        <div class="category position-relative overflow-hidden rounded-2 cursor-pointer">
          <img src="${response.categories[i].strCategoryThumb}" alt="${response.categories[i].strCategory}" class="w-100">
          <div class="categoryName position-absolute d-flex flex-column align-items-center ps-3 ">
            <h3>${response.categories[i].strCategory}</h3>
            <p>${response.categories[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
          </div>
        </div>
      </div>`
  }
  $(".loadingScreen").fadeOut(1000);
  $('#demo').html(box);
  closeOuterSide();
})
async function getCategoryMeals(category) {
  let categoriesMeals = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
  let response = await categoriesMeals.json();
  displayMeals(response.meals.slice(0,20));
}

//AREA
$('#area').click(async function () {
  $('#demo2').addClass('d-none');
  $('#demo').removeClass('d-none');
  $(".loadingScreen").show();
  let data = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
  let response = await data.json();
  box = '';
  for (let i = 0; i < response.meals.length; i++) {
    box += `
      <div class="col-md-3 text-white text-center cursor-pointer" onclick="getAreaMeals('${response.meals[i].strArea}')">
        <div class="area">
          <i class="fa-solid fa-house-laptop fa-4x"></i>
          <h3>${response.meals[i].strArea}</h3>
        </div>
      </div>`
  }
  $(".loadingScreen").fadeOut(1000);
  $('#demo').html(box);
  closeOuterSide();
})
async function getAreaMeals(area) {
  let data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
  let response = await data.json();
  displayMeals(response.meals);
}

// ingredients
$('#ingredients').click(async function () {
  $('#demo2').addClass('d-none');
  $('#demo').removeClass('d-none');
  $(".loadingScreen").show();
  let data = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
  let response = await data.json();
  box = '';
  for (let i = 0; i < 20; i++) {
    box += `
      <div class="col-md-3 text-white text-center cursor-pointer" onclick="getIngredientsMeals('${response.meals[i].strIngredient}')">
        <div class="ingredients">
          <i class="fa-solid fa-drumstick-bite fa-4x"></i>
          <h3>${response.meals[i].strIngredient}</h3>
          <p>${response.meals[i].strDescription.slice(0, 100)}</p>
        </div>
      </div>`
  }
  $(".loadingScreen").fadeOut(1000);
  $('#demo').html(box);
  closeOuterSide();
})
async function getIngredientsMeals(ingredients) {
  let data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
  let response = await data.json();
  displayMeals(response.meals);
}

// SEARCH
$('#search').click(function () {
  $('#demo2').removeClass('d-none');
  $(".loadingScreen").show();
  box = `
  <div class="col-md-6">
    <input onkeyup="searchByName(this.value)" type="text" class=" form-control bg-transparent text-white" placeholder="Search By Name ... ">
  </div>
  <div class="col-md-6">
    <input onkeyup="searchByFirstLetter(this.value)" type="text" class="form-control bg-transparent text-white" placeholder="Search By First Letter ...">
  </div>`
  $(".loadingScreen").fadeOut(1000);
  $('#demo2').html(box);
  $('#demo').addClass('d-none');
  closeOuterSide();
})
async function searchByName(term) {
  $(".loadingScreen").show();
  let data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
  let response = await data.json();
  displayMeals(response.meals);
  $(".loadingScreen").fadeOut(1000);
  $('#demo').removeClass('d-none');
  $("#demo").html(box);
}
async function searchByFirstLetter(term) {
  $(".loadingScreen").show();
  let data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
  let response = await data.json();
  displayMeals(response.meals);
  $(".loadingScreen").fadeOut(1000);
  $('#demo').removeClass('d-none');
  $("#demo").html(box);
}

// contacts
$('#contactUs').click(function () {
  $('#demo2').addClass('d-none');
  $('#demo').removeClass('d-none');
  $(".loadingScreen").show();
  box = ` 
  <div class="col-md-6 pt-5 mt-5">
  <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
  <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
    Special characters and numbers not allowed
  </div>
</div>
<div class="col-md-6 pt-5 mt-5">
  <input id="emailInput" type="email" class="form-control" placeholder="Enter Your Email">
  <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
    Email not valid *exemple@yyy.zzz
  </div>
</div>
<div class="col-md-6">
  <input id="phoneInput" type="number" class="form-control" placeholder="Enter Your Phone">
  <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
    Enter valid Phone Number
  </div>
</div>
<div class="col-md-6">
  <input  id="ageInput" type="number" class="form-control" placeholder="Enter Your Age">
  <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
    Enter valid age
  </div>
</div>
<div class="col-md-6">
  <input id="passwordInput" type="password" class="form-control" placeholder="Enter Your Password">
  <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
    Enter valid password *Minimum eight characters, at least one letter and one number:*
  </div>
</div>
<div class="col-md-6">
  <input id="repasswordInput" type="password" class="form-control" placeholder="Repassword">
  <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
    Enter valid repassword 
  </div>
</div>
<button  id="submitBtn" disabled class="btn btn-danger w-100">Submit</button>`
$(".loadingScreen").fadeOut(1000);
  $('#demo').html(box);
  nameValidation();
  emailValidation();
  phoneValidation();
  ageValidation();
  passwordValidation();
  repasswordValidation();
  closeOuterSide();
})

function nameValidation() {
  $('#nameInput').on('keyup', function () {
    var regex = /^[a-zA-Z ]+$/
    if (regex.test($('#nameInput').val())) {
      document.getElementById("nameAlert").classList.replace("d-block", "d-none")
    } else {
      document.getElementById("nameAlert").classList.replace("d-none", "d-block")
    }
  })
}
function emailValidation() {
  $('#emailInput').on('keyup', function () {
    var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (regex.test($('#emailInput').val())) {
      document.getElementById("emailAlert").classList.replace("d-block", "d-none")
    } else {
      document.getElementById("emailAlert").classList.replace("d-none", "d-block")
    }
  })
}
function phoneValidation() {
  $('#phoneInput').on('keyup', function () {
    var regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    if (regex.test($('#phoneInput').val())) {
      document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
    } else {
      document.getElementById("phoneAlert").classList.replace("d-none", "d-block")
    }
  })
}
function ageValidation() {
  $('#ageInput').on('keyup', function () {
    var regex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/
    if (regex.test($('#ageInput').val())) {
      document.getElementById("ageAlert").classList.replace("d-block", "d-none")
    } else {
      document.getElementById("ageAlert").classList.replace("d-none", "d-block")
    }
  })
}
function passwordValidation() {
  $('#passwordInput').on('keyup', function () {
    var regex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/
    if (regex.test($('#passwordInput').val())) {
      document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
    } else {
      document.getElementById("passwordAlert").classList.replace("d-none", "d-block")
    }
  })
}
function repasswordValidation() {
  $('#repasswordInput').on('keyup', function () {
    if ($("#repasswordInput").val() == $("#passwordInput").val()) {
      document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
      validationBtn()
    } else {
      document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")
    }
  })
}

function validationBtn() {
  if ($("#nameAlert").hasClass("d-none") &&
    $("#phoneAlert").hasClass("d-none") &&
    $("#ageAlert").hasClass("d-none") &&
    $("#passwordAlert").hasClass("d-none") &&
    $("#emailAlert").hasClass("d-none") &&
    $("#repasswordAlert").hasClass("d-none")) {
    document.getElementById('submitBtn').removeAttribute("disabled")
  } else {
    document.getElementById('submitBtn').setAttribute("disabled", true)
  }
}





