import { useState, useEffect } from 'react'

import { db } from "./data/db"
import Header from "./components/Header"
import Guitar from "./components/Guitar"

function App() {

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)

  //constant var
  const MAX_ITEMS = 10
  const MIN_ITEMS = 1

  //React state isnt asynchronous, so with useEffect we can save on localStorage, even if the state hasnt been modified yet
  useEffect(() => {
    localStorage.setItem('cart',JSON.stringify(cart))
  }, [cart])

  function addToCart(item) {

    const itemExist = cart.findIndex(guitar => guitar.id === item.id)
    if(itemExist>=0){ //the item exist on the cart
      if(cart[itemExist].quantity >= MAX_ITEMS) return
      const updatedCart = [...cart]
      updatedCart[itemExist].quantity++
      setCart(updatedCart)
    } else {
      item.quantity = 1
      setCart([...cart, item])  
    }


  }

  function removeFromCart(id) {
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
  }

  function decreaseQuantity(id) {
    const updatedCart = cart.map(item => {
      if(item.id === id && item.quantity > MIN_ITEMS){
        return {
          ...item, 
          quantity: item.quantity - 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  function increaseQuantity(id) {
    const updatedCart = cart.map(item => {
      if(item.id === id && item.quantity < MAX_ITEMS) {
        return {
         ...item, 
         quantity: item.quantity + 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  function clearCart(){
    setCart([])
  }



  return (
    <>     


    <Header
      cart={cart}
      removeFromCart={removeFromCart}
      decreaseQuantity={decreaseQuantity}
      increaseQuantity={increaseQuantity}
      clearCart={clearCart}

    />

    <main className="container-xl mt-5">
        <h2 className="text-center">Our Colection</h2>

        <div className="row mt-5">
          
            {data.map((guitar) => (
              <Guitar
                key={guitar.id}
                guitar={guitar}
                setCart={setCart}
                addToCart={addToCart}

              />

              
            ))}  
            
           
        </div>
    </main>


    <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
            <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - All rights reserved.</p>
        </div>
    </footer>

    </>
  )
}

export default App
