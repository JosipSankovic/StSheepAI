const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const maxFileSize = 5 * 1024 * 1024

function PhotoUpload({ file, previewUrl, onFileChange, onError }) {
  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      return
    }

    if (!acceptedTypes.includes(selectedFile.type)) {
      onError('Please upload a JPG, PNG, or WebP image.')
      event.target.value = ''
      return
    }

    if (selectedFile.size > maxFileSize) {
      onError('Please choose an image under 5MB for the hackathon demo.')
      event.target.value = ''
      return
    }

    onError('')
    onFileChange(selectedFile)
  }

  return (
    <section className="photo-upload-panel" aria-labelledby="photo-upload-title">
      <div>
        <p className="eyebrow">Step 1</p>
        <h2 id="photo-upload-title">Upload a Split photo</h2>
        <p>
          Choose a landmark, street, church, statue, square, waterfront, or building photo.
        </p>
      </div>

      <label className="upload-dropzone" htmlFor="photo-upload">
        <input
          id="photo-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
        />
        <span className="upload-title">{file ? file.name : 'Choose photo'}</span>
        <span className="upload-hint">JPG, PNG, or WebP, max 5MB</span>
      </label>

      {previewUrl ? (
        <figure className="preview-frame">
          <img src={previewUrl} alt="Selected tourist guide preview" />
        </figure>
      ) : (
        <div className="preview-placeholder">
          <span>Preview will appear here</span>
        </div>
      )}
    </section>
  )
}

export default PhotoUpload

