/**
 * @special Singleton
 */
Design.images = {}

/**
 * given url(http://foobar.com/foob.png) returns foob.png
 *
 * @param {string} 
 * @return {string} 
 */
Design.images.getFilename = function (url) {
  var file = Design.images.parseBackgroundUrl(url).split(/\//)
  return file[file.length-1]
  
}

/**
 * @param {string} Image name to add
 * @param {bool} Whether to insert it via drag and drop.
 * @return {string} Scrap id
 */
Design.images.insertImageScrap = function (filename, drag) {

  if (filename.match(/^url\(/))
    filename = Design.images.parseBackgroundUrl(filename)
  
  // Easter Egg: allow swapping of images
  if (!drag && $('.selection').length > 0) {
    Design.stage.selection.css('background-image url(' + filename + ')')
    Design.stage.selection.css('background-repeat no-repeat')
    Design.stage.selection.css('background-position center')
    return false
  }

  $('<img/>').attr("src", filename).load(function() {
     
    var space = new Space(
      "style" +
      "\n background-image " + 'url(' + filename + ')' +
      "\n background-repeat no-repeat" + 
      "\n background-color transparent" +
      "\n background-position center" +
      "\n background-size contain" +
      "\n width " + this.width + 'px' +
      "\n height " + this.height + 'px')
    var scraps = new Space().set('scrap', space)
    return Design.stage.insert(scraps, drag)
  })
}

/**
 * Is it an image?
 *
 * @param {string}
 * @return {bool}
 */
Design.images.isImage = function (filename) {
  return filename.match(/\.(png|jpg|jpeg|gif)$/i)
}

/**
 * given url(/foob.png) returns /foob.png
 *
 * @param {string} 
 * @return {string} 
 */
Design.images.parseBackgroundUrl = function (url) {
  return url.split(/(\(|\))/).slice(2)[0]
}

/**
 * Downloads the latest list of images from server and stores
 * it in a property which is used to render the droppables.
 */
Design.images.images = new Space()
Design.images.updateList = function () {
  $.get('/Explorer.public', {}, function (space) {
    var dropImageDiv = ''
    Design.images.images = new Space(space)
    Design.images.images.each(function (key, value) {
      if (Design.images.isImage(key))
        dropImageDiv += '<div class="DesignImageThumbDrop">&nbsp;<img src="/'+ key +'">&nbsp;</div>'
    })

    $('#DesignImageDroppablesList').html(dropImageDiv)
    
  })
}

// When an image is uploaded
nudgepad.on('uploadComplete', Design.images.updateList)
nudgepad.on('uploadComplete', function () {
  mixpanel.track('I uploaded something')
})
nudgepad.on('public', Design.images.updateList)
nudgepad.on('main', Design.images.updateList)
