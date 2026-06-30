let allDrinks = []
let cartCount = 0
const maxCartItem = 7

const loadData = async () => {
    const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=m'
    let response = await fetch(url)

    if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`)
        return
    }

    let data = await response.json()
    allDrinks = data.drinks
    displayDrinksData(allDrinks)
    displayCartData()
}

const displayDrinksData = (drinkItems) => {
    const cocktailContainer = document.querySelector('.cocktail-container')
    cocktailContainer.innerHTML = ''

    if (drinkItems === null || drinkItems.length === 0) {
        cocktailContainer.innerHTML = `
            <p class="w-100 text-center fs-2 fw-semibold">No drinks found following query</p>
        `
        return
    }

    drinkItems.forEach((drink) => {
        const cocktailCard = document.createElement('div')
        cocktailCard.classList.add('col')
        cocktailCard.innerHTML = `
            <div class="card border-0">
                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="${drink.strDrink}" />
                <div class="card-body">
                    <h5 class="card-title">${drink.strDrink}</h5>
                    <p class="card-text">${drink.strInstructions.slice(0, 15)}...</p>
                    <div class="container-fluid d-flex justify-content-center gap-2">
                        <button id="btn-${drink.idDrink}" class="btn btn-success" onclick="handleAddToGrp('${drink.idDrink}')">Add to Group</button>
                        <buttton class="btn btn-warning" onclick="loadSingleData('${drink.idDrink}')" data-bs-toggle="modal" data-bs-target="#detailsModal">Details</buttton>
                    </div>
                </div>
            </div>
        `
        cocktailContainer.appendChild(cocktailCard)
    })
}

// search
const displaySearchData = () => {
    const searchInputText = document.querySelector('.search-drinks')
    const searchCurrentValue = searchInputText.value.toLocaleLowerCase()

    const matchedText = allDrinks.filter((drink) =>
        drink.strDrink.toLocaleLowerCase().includes(searchCurrentValue),
    )
    displayDrinksData(matchedText)
}

const searchBtn = document.querySelector('.search-btn')
searchBtn.addEventListener('click', (e) => {
    e.preventDefault()
    displaySearchData()
})

const searchText = document.querySelector('.search-drinks')
searchText.addEventListener('keyup', () => {
    displaySearchData()
})

const handleAddToGrp = (id) => {
    if (cartCount >= maxCartItem) {
        displayMaxLimitModal()
        return
    }

    let selectedItem = null
    for (let i = 0; i < allDrinks.length; i++) {
        if (allDrinks[i].idDrink === id) {
            selectedItem = allDrinks[i]
            break
        }
    }
    if (!selectedItem) return

    const cartGroupContainer = document.querySelector('.cart-group-item')

    if (cartCount === 0) cartGroupContainer.innerHTML = ''

    const cartItem = document.createElement('div')
    cartItem.classList.add('col')
    cartItem.id = `cart-btn-${id}`
    cartItem.innerHTML = `
        <div class="d-flex justify-content-center align-items-center gap-2 p-2 mb-2 border rounded">
            <div class="d-flex gap-2 align-items-center">
                
                <div style="width: 15%;"><img src="${selectedItem.strDrinkThumb}" alt="${selectedItem.strDrink}" class="img-fluid rounded" /></div>
                <p class="mb-0">${selectedItem.strDrink}</p>
            </div>
            <button class="btn btn-danger remove-btn" onclick="handleRemoveFromCart('${id}')"><i class="bi bi-x-circle"></i></button>
        </div>
    `
    cartGroupContainer.appendChild(cartItem)

    cartCount++
    displayCartData()

    const disableBtn = document.getElementById(`btn-${id}`)
    disableBtn.disabled = true
    disableBtn.innerText = 'Added'

    displayToastNotification(selectedItem.strDrink)
}

const handleRemoveFromCart = (id) => {
    const drinkRemove = document.getElementById(`cart-btn-${id}`)
    drinkRemove.remove()

    cartCount--
    displayCartData()

    const activeBtn = document.getElementById(`btn-${id}`)
    activeBtn.disabled = false
    activeBtn.innerText = 'Add to Group'
}

const displayCartData = () => {
    const cartCounter = document.querySelector('.cart-counter')
    const cartGroupContainer = document.querySelector('.cart-group-item')

    if (cartCount > 0)
        cartCounter.innerText = `Total Drinks Added: ${cartCount}`

    if (cartCount === 0) {
        cartGroupContainer.innerHTML = `
            <div class="counter-inner">
                <p>No Item Added Yet!</p>
            </div>
        `
    }
}

const displayMaxLimitModal = () => {
    const modalContent = document.querySelector('.modal-content')
    modalContent.innerHTML = `
        <div class="modal-header">
            <h1 class="modal-title fs-5">Limit Reached</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <p class="fs-4">You can add maximum 7 DRINKS</p>
            <p>Remove an item to add another DRINK</p>
        </div>
    `
    const maxModal = new bootstrap.Modal(
        document.getElementById('detailsModal'),
    )
    maxModal.show()
}

const loadSingleData = async (id) => {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
    let response = await fetch(url)

    if (!response.ok) {
        console.log(
            `HTTP error fetching single data status: ${response.status}`,
        )
        return
    }
    let data = await response.json()

    displaySingleData(data.drinks[0])
}
const displaySingleData = (drink) => {
    const modalContent = document.querySelector('.modal-content')

    modalContent.innerHTML = `
        <div class="modal-header">
            <h1 class="modal-title fs-5">${drink.strDrink}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="cocktail-details-img w-50 mb-3">
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" class="img-fluid" />
            </div>
            <div class="cocktail-details-content">
                <p><strong>Category:</strong> ${drink.strCategory}</p>
                <p><strong>Alcoholic:</strong> ${drink.strAlcoholic}</p>
                <p><strong>Glass:</strong> ${drink.strGlass}</p>
                <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
            </div>
        </div>
    `
}

const displayToastNotification = (drinkName) => {
    const toaster = document.querySelector('.toast')
    const toastBody = toaster.querySelector('.toast-body')
    toastBody.innerText = `${drinkName} added successfully to group!`
    const toast = new bootstrap.Toast(toaster)
    toast.show()
}

loadData()
