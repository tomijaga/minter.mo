import { Button } from "antd"
import React, { useState } from "react"
import { usePlug } from "../../hooks/usePlug"

export const Plug = () => {
  const [isDisabled, setIsDisabled] = useState(false)
  const plug = usePlug()

  const connectToPlug = async () => {
    setIsDisabled(() => true)
    console.log(await plug.connect())
    setIsDisabled(() => false)
  }

  return (
    <Button
      disabled={isDisabled}
      onClick={connectToPlug}
      className="plug-button"
    >
      Pair Plug
    </Button>
  )
}
