const e = require('express')
const express = require('express')
const router = express.Router()

class Product {
  static #list = []

  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)
    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((e) => e.id === id)
  }

  static getPriceById = (id) => {
    return this.#list.find((e) => e.id === id).price
  }

  static getRandomList = (id) => {
    const listWithoutCurrentId = this.#list.filter(
      (e) => e.id !== id,
    )

    const suffledList = listWithoutCurrentId.sort(
      () => Math.random - 0.5,
    )

    return suffledList.slice(0, 3)
  }
}

Product.add(
  'https://content.rozetka.com.ua/goods/images/big/320078659.jpg',
  "Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600",
  'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС',
  [
    { id: 1, text: 'Готовий до відпривки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)
Product.add(
  'https://content2.rozetka.com.ua/goods/images/big/282627183.jpg',
  "Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel",
  'Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux',
  [
    { id: 1, text: 'Готовий до відпривки' },
    { id: 2, text: 'Топ продажів' },
  ],
  17000,
  10,
)
Product.add(
  'https://content2.rozetka.com.ua/goods/images/big/282627224.jpg',
  "Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)",
  'Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС',
  [
    { id: 1, text: 'Готовий до відпривки' },
    { id: 2, text: 'Топ продажів' },
  ],
  113109,
  10,
)
Product.add(
  'https://content.rozetka.com.ua/goods/images/big/282627228.jpg',
  "Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600",
  'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС',
  [
    { id: 1, text: 'Готовий до відпривки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)
Product.add(
  'https://content1.rozetka.com.ua/goods/images/big/282627232.jpg',
  "Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel",
  'Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux',
  [
    { id: 1, text: 'Готовий до відпривки' },
    { id: 2, text: 'Топ продажів' },
  ],
  17000,
  10,
)
Product.add(
  'https://content2.rozetka.com.ua/goods/images/big/282627189.jpg',
  "Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)",
  'Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС',
  [
    { id: 1, text: 'Готовий до відпривки' },
    { id: 2, text: 'Топ продажів' },
  ],
  113109,
  10,
)

// ================================================================

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1
  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (email, price, bonusUse) => {
    const amount = this.calcBonusAmount(price)
    const currentBalance = Purchase.getBonusBalance(email)
    const updatedBalance =
      currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count
    this.firstname = data.firstname
    this.lastname = data.lastname
    this.phone = data.phone
    this.email = data.email
    this.comment = data.comment || null
    this.bonus = data.bonus || 0
    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount
    this.accrualBonus = data.accrualBonus || 0

    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)
    this.#list.push(newPurchase)
    return newPurchase
  }

  static getList = () => {
    return Purchase.#list
      .reverse()
      .map(({ id, product, totalPrice, accrualBonus }) => {
        return { id, product, totalPrice, accrualBonus }
      })
  }

  static getById = (id) => {
    return Purchase.#list.find((e) => e.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email
      return true
    } else {
      return false
    }
  }
}

Purchase.add(
  {
    firstname: 'Петро',
    lastname: 'Балуваний',
    phone: '0671234567',
    email: 'email@email.ua',
    comment: 'Все буде добре',
    bonus: 111,
    promocode: 'qwe',

    totalPrice: 17150,
    productPrice: 17000,
    deliveryPrice: 150,
    amount: 1,
    accrualBonus: 1715,
  },
  Product.getById(1),
)
// ================================================================

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (...arg) => {
    const newPomocode = new Promocode(...arg)
    Promocode.#list.push(newPomocode)

    return newPomocode
  }

  static getByName = (name) => {
    return this.#list.find((e) => e.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('asd', 0.9)
Promocode.add('qwe', 0.5)
Promocode.add('zxc', 0.75)

// ================================================================

class Gn {
  static gN = (value) => {
    return Number(value)
  }
}

// ================================================================

router.get('/', function (req, res) {
  res.render('purchase-index', {
    style: 'purchase-index',
    title: 'Товари',
    info: "Комп'ютери та ноутбуки/Комп'ютери, неттопи, моноблоки",

    data: {
      list: Product.getList(),
    },
  })
})

// ================================================================

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

  const price = Product.getPriceById(id)

  res.render('purchase-product', {
    style: 'purchase-product',
    title: 'Інші товари',
    info: "Комп'ютери та ноутбуки",
    elofform: {
      input: [
        {
          label: 'Кількість товару',
          class: '__label',
          name: 'amount',
        },
        {
          type: 'number',
          value: '1',
          name: 'amount',
          class: '__input',
        },
      ],
      button: {
        title: `Купити зараз: ${price}₴`,
        class: '__button',
      },
    },
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})

// ================================================================

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)
  const price = Product.getPriceById(id)

  //

  if (amount < 1) {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Введіть коректну кількість товару!',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  //

  const product = Product.getById(id)

  if (product.amount < 1) {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такої кількості не має в наявності!',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  //

  const productPrice = product.price * amount
  const deliveryPrice = Purchase.DELIVERY_PRICE
  const totalPrice = productPrice + deliveryPrice
  const bonus = Math.trunc(
    Purchase.calcBonusAmount(totalPrice),
  )

  res.render('purchase-create', {
    style: 'purchase-create',
    title: 'Ваше замовлення',
    subtitle: 'Оформлення замовлення',

    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} - (id ${id}) (${amount} шт.) `,
          price: productPrice,
        },
        {
          text: `Вартість доставки`,
          price: deliveryPrice,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,
    },
  })
})

// ================================================================

router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,
    firstname,
    lastname,
    comment,
    email,
    phone,
    promocode,
    bonus,

    accrualBonus,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: `Товар з ID ${id} не знайдено!`,
        link: `/purchase-list`,
      },
    })
  }

  if (product.amount < amount) {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: `Товарe з ID ${id} нема в потрібній кількості!`,
        link: `/purchase-list`,
      },
    })
  }

  totalPrice = Gn.gN(totalPrice)
  productPrice = Gn.gN(productPrice)
  deliveryPrice = Gn.gN(deliveryPrice)
  amount = Gn.gN(amount)
  bonus = Gn.gN(bonus)
  accrualBonus = Gn.gN(accrualBonus)

  //

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus) ||
    isNaN(accrualBonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: `Некоректны дані`,
        link: `/purchase-list`,
      },
    })
  }

  //

  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: `Заповніть об'язкові поля`,
        link: `/purchase-list`,
      },
    })
  }

  //

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)
    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }
    Purchase.updateBonusBalance(email, totalPrice, bonus)
    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  //

  if (promocode) {
    promocode = Promocode.getByName(promocode)
    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  //

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,

      bonus,

      firstname,
      lastname,
      comment,
      email,
      phone,

      promocode,

      accrualBonus,
    },
    product,
  )

  //console.log(purchase)

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Уcпішно',
      info: `Замовлення створено`,
      link: `/purchase-list`,
    },
  })
})

// ================================================================

router.get('/purchase-list', function (req, res) {
  res.render('purchase-list', {
    style: 'purchase-list',
    title: 'Мої замовлення',
    data: Purchase.getList(),
  })
})

// ================================================================

router.get('/purchase-info', function (req, res) {
  const idPurchase = Gn.gN(req.query.id)
  const purchase = Purchase.getById(idPurchase)

  if (purchase === undefined) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: `Замовлення з ID ${idPurchase} не знайдено!`,
        link: `/purchase-list`,
      },
    })
  }

  res.render('purchase-info', {
    style: 'purchase-info',
    title: 'Інформація про замовлення',
    data: purchase,
  })
})

// ================================================================

router.post('/purchase-update', function (req, res) {
  const idPurchase = Gn.gN(req.query.id)
  const purchase = Purchase.getById(idPurchase)

  if (purchase === undefined) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: `Замовлення з ID ${idPurchase} не знайдено!`,
        link: `/purchase-list`,
      },
    })
  }

  res.render('purchase-update', {
    style: 'purchase-update',
    title: 'Зміна данних',
    data: purchase,
  })
})

router.post('/purchase-save', function (req, res) {
  const idPurchase = Gn.gN(req.query.id)
  const purchase = Purchase.getById(idPurchase)
  console.log(req.body)
  let { firstname, lastname, phone, email } = req.body

  if (purchase === undefined) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: `Замовлення з ID ${idPurchase} не знайдено!`,
        link: `/purchase-list`,
      },
    })
  }

  const result = Purchase.updateById(idPurchase, {
    firstname,
    lastname,
    phone,
    email,
  })

  if (!result) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: `Дані не були змінені!`,
        link: `/purchase-list`,
      },
    })
  }

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Уcпішно',
      info: `Дані збережено!`,
      link: `/purchase-list`,
    },
  })
})

// router.post('/purchase-update', function (req, res) {
//   res.render('purchase-update', {
//     style: 'purchase-update',
//     data: {},
//   })
// })

// Підключаємо роутер до бек-енду
module.exports = router
