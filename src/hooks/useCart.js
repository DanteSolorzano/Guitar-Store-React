import { useState, useEffect, useMemo } from 'react'
import { db } from "../data/db"


export const useCart = () => {

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

    //derived state
    //useMemo is used to avoid rendering the app many times, unless we tell it to render. and its a hook focused to performance
    const isEmpty = useMemo(() => cart.length == 0, [cart]) 
    const cartTotal = useMemo( () => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart] )  

    //to share data between files we use a return
    return{
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}

