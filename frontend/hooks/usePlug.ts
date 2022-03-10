export interface RequestConnectParams {
  whitelist?: string[]
  host?: "https://network-address"
}

const isInstalled = () => !!(window as any).ic?.plug

const verifyInstallation = () => {
  const installed = isInstalled()

  if (!installed) window.open("https://plugwallet.ooo/", "_blank")
}

const connect = async (params?: RequestConnectParams) => {
  verifyInstallation()
  let hasAllowed: Object | null = null

  try {
    hasAllowed = await (window as any)?.ic?.plug?.requestConnect({
      whitelist: params?.whitelist,
      host: params?.host,
    })
  } catch (e) {
    hasAllowed = null
  }

  return hasAllowed
}

const isConnected = async () => await (window as any)?.ic?.plug.isConnected()
const verifyConnection = async () => {
  const connected = await isConnected()

  if (!connected) {
    await connect()
  }
}

const requestBalance = async () => {
  await verifyConnection()

  return await (window as any).ic?.plug?.requestBalance()
}

export interface TransferArgs {
  to: string
  amount: number
}
const requestTransfer = async ({ to, amount }: TransferArgs) => {
  await verifyConnection()

  const balance = await requestBalance()

  const result = { success: false, message: "" }

  if (balance >= amount) {
    const transfer = await (window as any).ic?.plug?.requestTransfer({
      to,
      amount,
    })

    const transferStatus = transfer?.transactions?.transactions[0]?.status

    if (transferStatus === "COMPLETED") {
      result.success = true
      result.message = `Plug wallet transferred ${amount} e8s`
    } else if (transferStatus === "PENDING") {
      result.message = "Plug wallet is pending."
    }
    result.message = "Plug wallet failed to transfer"
  }

  result.message = "Plug wallet doesn't have enough balance"

  return result
}

export const usePlug = () => {
  return {
    isInstalled,
    verifyInstallation,
    connect,
    isConnected,
    verifyConnection,
    requestBalance,
    requestTransfer,
  }
}
