export const generateWhatsAppLink = (phone: string, petName: string, dateTime: string) => {
  const message = `Ola! Passando para lembrar do banho do ${petName} em ${dateTime}. Confirmado? 🐾`
  const encodedMessage = encodeURIComponent(message)
  const cleanPhone = phone.replace(/\D/g, '')

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}
