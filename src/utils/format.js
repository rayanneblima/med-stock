const dateTimeFormat = (dateTime) => {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }

  const formatted = new Date(dateTime).toLocaleDateString('pt-BR', options)

  return formatted
}

const currencyFormat = (currency) => {
  const formatted = currency.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL'
  })

  return formatted
}

export {
  dateTimeFormat,
  currencyFormat
}
