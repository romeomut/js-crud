// ================================================================
class Product {
  static #list = []

  constructor(name, price, description) {
    this.id = Math.trunc(
      Math.fround((Math.random() + 1) * 10000),
    )
    this.name = name
    this.createDate = new Date().toISOString()
    this.price = price
    this.description = description
  }

  static createProduct = (product) => {
    this.#list.push(product)
    return true
  }

  static getList = () => this.#list

  static getProductById = (id) =>
    this.#list.find((product) => product.id === id)

  // static deketeById = (id) => {
  //   const index = this.#list.findIndex(
  //     (user) => user.id === id,
  //   )
  //   if (index !== -1) {
  //     this.#list.splice(index, 1)
  //     return true
  //   } else {
  //     return false
  //   }
  // }
  // static updateById = (id, data) => {
  //   const user = this.getById(id)
  //   if (user) {
  //     this.udate(user, data)
  //     return true
  //   } else {
  //     return false
  //   }
  // }
  // static udate = (user, { email }) => {
  //   if (email) {
  //     user.email = email
  //   }
  // }
  static init() {
    this.#list.push(
      new Product('prod1', 111, 'desc'),
      new Product('prod2', 222, 'desc2'),
    )
  }
}
exports.Product = Product
