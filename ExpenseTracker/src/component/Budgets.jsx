import React from 'react'
import { useSelector } from 'react-redux'

const Budgets = () => {
  const Bill = useSelector((state)=>state.Bills?.Bill)
  return (
    <div>

    </div>
  )
}

export default Budgets
