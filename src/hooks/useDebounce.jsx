import React, { useEffect, useState } from 'react'

const useDebounce = (value, time) => {
  const [innerVal, setInnerVal] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setInnerVal(value)
    }, time)

    return () => {
      clearTimeout(timer)
    }
  }, [value, time])

  return innerVal
}

export default useDebounce