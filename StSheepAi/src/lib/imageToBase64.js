export function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not read this image file.'))
    reader.readAsDataURL(file)
  })
}

