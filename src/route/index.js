const express = require('express')
const router = express.Router()

// ================================================================
class Product {
  static #list = []

  constructor(name, price, description) {
    this.id = Math.trunc(
      Math.fround((Math.random() + 1) * 10000),
    )
    this.name = name
    this.createDate = new Date().toISOString()
    this.price = Number(price)
    this.description = description
  }

  static createProduct = (product) => {
    if (
      product.name.length === 0 ||
      product.description.length === 0 ||
      product.price === 0
    ) {
      return false
    }

    this.#list.push(product)
    return true
  }

  static getList = () => this.#list

  static getProductById = (id) =>
    this.#list.find((product) => product.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const product = this.getProductById(id)

    if (product) {
      this.udate(product, data)
      return true
    } else {
      return false
    }
  }

  static udate = (product, data) => {
    if (product) {
      Object.assign(product, data)
    }
  }
}
// ================================================================

router.get('/', function (req, res) {
  res.render('index', {
    style: 'index',
  })
})

// ================================================================

router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
  })
})

// ================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  let result = false

  try {
    result = Product.createProduct(product)
  } catch (error) {
    result = false
  }

  res.render('alert', {
    style: 'alert',
    info: result
      ? 'Товар успішно був доданий'
      : 'Сталася помилка! Товар не був доданий!',
  })
})

// ================================================================

router.get('/product-list', function (req, res) {
  const listProduct = Product.getList()

  res.render('product-list', {
    style: 'product-list',
    listProduct,
  })
})

// ================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getProductById(Number(id))

  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      product,
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: `Товар з ID ${id} не знайдено...`,
    })
  }
})

// ================================================================

router.post('/product-edit', function (req, res) {
  const { name, price, description } = req.body
  const { id } = req.body

  result = Product.updateById(Number(id), {
    name,
    price,
    description,
  })

  res.render('alert', {
    style: 'alert',
    info: result
      ? 'Товар успішно був оновлений'
      : 'Сталася помилка! Товар не був оновлений!',
  })
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  let result = Product.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    info: result
      ? 'Товар успішно видалений'
      : 'Сталася помилка! Товар не був видалений!',
  })
})
// Підключаємо роутер до бек-енду
module.exports = router
