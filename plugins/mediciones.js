const mediciones = (min, max) => {
  const rango = (max - min) / 2 - 1
  window.setInterval(() => {
    localStorage.setItem(
      'humedad',
      2 * Math.floor(Math.random() * rango) + 1 + min
    )
    localStorage.setItem(
      'luminosidad',
      2 * Math.floor(Math.random() * rango) + 1 + min
    )
  }, 1000)
}

const medicionSensores = (min, max) => {
  const rango = (max - min) / 2 - 1
  const medicion = 2 * Math.floor(Math.random() * rango) + 1 + min

  return medicion
}

export { mediciones, medicionSensores }
