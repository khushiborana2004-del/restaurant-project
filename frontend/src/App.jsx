
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [cart, setCart] = useState([])
  const [foods, setFoods] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [customerName, setCustomerName] = useState('')

  const addToCart = (food) => {
    const existingFood = cart.find(
      (item) => item._id === food._id
    )

    if (existingFood) {
      setCart(
        cart.map((item) =>
          item._id === food._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCart([...cart, { ...food, quantity: 1 }])
    }
  }

  useEffect(() => {
    fetch('http://localhost:5001/foods')
      .then((response) => response.json())
      .then((data) => setFoods(data))
      .catch((error) => console.log('Error:', error))
  }, [])

  const foodsPerPage = 3
  const indexOfLastFood = currentPage * foodsPerPage
  const indexOfFirstFood = indexOfLastFood - foodsPerPage
  const currentFoods = foods.slice(
    indexOfFirstFood,
    indexOfLastFood
  )
  const totalPages = Math.ceil(foods.length / foodsPerPage)

  const totalBill = cart.reduce(
    (total, food) =>
      total + Number(food.price) * food.quantity,
    0
  )

  const confirmOrder = () => {
    if (customerName === '') {
      alert('Please select your name!')
      return
    }

    alert(
      'Thank you ' + customerName +
      '! Your order has been placed successfully.'
    )

    setCart([])
    setShowForm(false)
    setCustomerName('')
  }

  return (
    <div>
      <header>
        <h2>Khushi's Restaurant</h2>
        <nav>
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#contact">Contact</a>
          <a href="#cart">🛒 Cart: {cart.length}</a>
        </nav>
      </header>

      <section className="home" id="home">
        <h1>Welcome to Khushi's Restaurant</h1>
        <p>Fresh Food, Great Taste!</p>
        <a href="#menu" className="btn">View Menu</a>
      </section>

      <section className="menu" id="menu">
        <h2>Our Menu</h2>

        <div className="food-list">
          {currentFoods.map((food) => (
            <div className="food" key={food._id}>
              {food.image && (
                <img
                  src={food.image}
                  alt={food.name}
                  className="food-image"
                />
              )}

              <h3>{food.name}</h3>
              <p>Price: ₹{food.price}</p>
              <p>{food.description}</p>

              <button onClick={() => addToCart(food)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </section>

      <section className="cart-section" id="cart">
        <h2>🛒 Your Cart</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.map((food, index) => (
              <div
                className="cart-item"
                key={`${food._id}-${index}`}
              >
                <span>{food.name}</span>

                <div className="quantity-controls">
                  <button
                    onClick={() => {
                      if (food.quantity > 1) {
                        setCart(
                          cart.map((item) =>
                            item._id === food._id
                              ? {
                                  ...item,
                                  quantity: item.quantity - 1
                                }
                              : item
                          )
                        )
                      } else {
                        setCart(
                          cart.filter(
                            (item) => item._id !== food._id
                          )
                        )
                      }
                    }}
                  >
                    −
                  </button>

                  <span>{food.quantity}</span>

                  <button
                    onClick={() =>
                      setCart(
                        cart.map((item) =>
                          item._id === food._id
                            ? {
                                ...item,
                                quantity: item.quantity + 1
                              }
                            : item
                        )
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <span>₹{food.price * food.quantity}</span>

                <button
                  onClick={() =>
                    setCart(
                      cart.filter((_, i) => i !== index)
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}

            <h3>Total Bill: ₹{totalBill}</h3>

            <button onClick={() => setShowForm(true)}>
              Place Order
            </button>

            {showForm && (
              <div className="order-form">
                <h3>Customer Details</h3>

                <label htmlFor="customerName">
                  Customer Name
                </label>

                <select
                  id="customerName"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                >
                  <option value="">Select your name</option>
                  <option value="Khushi">Khushi</option>
                  <option value="Rishita">Rishita</option>
                  <option value="Bhuvnesh">Bhuvnesh</option>
                  <option value="Manisha">Manisha</option>
                  <option value="Gorav">Gorav</option>
                  <option value="Rishab">Rishab</option>
                </select>

                <button onClick={confirmOrder}>
                  Confirm Order
                </button>

                <button onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="contact" id="contact">
        <h2>Contact Us</h2>
        <p>Thank you for visiting Khushi's Restaurant!</p>
        <p>Phone: 1234567890</p>
      </section>

      <footer>
        <p>© 2026 Khushi's Restaurant</p>
      </footer>
    </div>
  )
}

export default App
