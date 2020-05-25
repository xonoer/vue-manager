<template>
  <div :id='`${id}`'></div>
</template>
<script>
export default {
  name: 'kCkeditor',
  props: {
    id: { type: String, required: true },
    value: { type: String, default: '' }
  },
  data () {
    return {
      editor: null
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      this.editor = window.CKEDITOR.replace(this.id)
      window.CKEDITOR.config.filebrowserUploadUrl = '/uploader/upload.php'
      window.CKEDITOR.config.filebrowserUploadMethod = 'xhr'
      window.CKEDITOR.config.uploadUrl = 'service/upload'
      this.editor.on('fileUploadRequest', function (evt) {
        var fileLoader = evt.data.fileLoader
        var formData = new FormData()
        var xhr = fileLoader.xhr

        xhr.open('PUT', fileLoader.uploadUrl, true)

        xhr.setRequestHeader('Cache-Control', 'no-cache')
        xhr.setRequestHeader('X-CUSTOM', 'HVVkkkk')
        xhr.withCredentials = true

        formData.append('upload', fileLoader.file, fileLoader.fileName)
        fileLoader.xhr.send(formData)

        // Prevented the default behavior.
        evt.stop()
      }, null, null, 4)

      this.editor.on('fileUploadResponse', function (evt) {
        // Prevent the default response handler.
        evt.stop()

        // Get XHR and response.
        var data = evt.data
        var xhr = data.fileLoader.xhr
        var response = xhr.responseText.split('|')

        if (response[1]) {
          // An error occurred during upload.
          data.message = response[1]
          evt.cancel()
        } else {
          data.url = response[0]
        }
      })
    }
  }
}
</script>
