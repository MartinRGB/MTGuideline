APP = {}

$ ()->

  APP.startX = $(window).width()/2 - 120
  APP.startY = 100
  APP.isAnimating = false
  APP.animation = null
  APP.springType = 'bezier-curve'
  APP.codeString = ''
  APP.bezierProps =
    type: 'bezier'
    options:
      p1x: .5
      p1y: 0
      p2x: .5
      p2y: 1
      time: 1
  APP.rk4Props =
    type: 'rk4'
    options:
      tension: 10
      friction: 10
      velocity: 10
  APP.dhoProps =
    type: 'dho'
    options:
      stiffness: 10
      damping: 10
      mass: 10
      velocity: 10
  APP.DemoLayer = null

  APP.DemoLayer = DemoLayer = new Layer
    x: APP.startX
    y: APP.startY
    width: 120
    height: 120
  DemoLayer.style =
    backgroundColor: '#7ed321'
    borderRadius: '10px'
    textAlign: 'center'
    lineHeight: '120px'
    fontSize: '1rem'
  DemoLayer.html = 'Drag me!'

  DemoLayer.draggable.enabled = true
  DemoLayer.on Events.DragEnd, (evt) ->
    springStr = APP.springType

    if springStr == 'bezier-curve'
      props = APP.bezierProps
      APP.animation = new Animation
        layer: @
        properties:
          x: APP.startX
          y: APP.startY
        curve: springStr
        curveOptions: [props.options.p1x, props.options.p1y, props.options.p2x, props.options.p2y]
        time: props.options.time
    else
      props = if springStr == 'spring-rk4' then APP.rk4Props else APP.dhoProps
      APP.animation = new Animation
        layer: @
        properties:
          x: APP.startX
          y: APP.startY
        curve: springStr
        curveOptions: props.options
    APP.animation.on Events.AnimationStart, () ->
      APP.isAnimating = true
      DemoLayer.html = 'Animating...'
      DemoLayer.opacity = .3
    APP.animation.on Events.AnimationStop, () ->
      APP.isAnimating = false
      DemoLayer.x = APP.startX
      DemoLayer.y = APP.startY
      DemoLayer.html = 'Drag me!'
      DemoLayer.opacity = 1
    APP.animation.start()

  setupControls()
  $(document).foundation()
  $(window).on 'resize', () ->
    resetPosition()







setupControls = () ->

  $('[data-tab]').on 'toggled', (evt, tab) ->
    $(tab).find('[data-slider]').foundation()
    str = tab[0].id
    APP.springType = if str == 'bezier' then 'bezier-curve' else 'spring-'+tab[0].id
    updateCodeString APP[tab[0].id+'Props']
    updatePage()

  $('#bezier [data-slider]').on 'change', () ->
    valueName = $(@).data('slider-name')
    value = $(@).attr('data-slider')
    value = +parseFloat(value).toFixed(2)
    $('#bezier input[name="'+valueName+'"]').val(value)
    APP.bezierProps.options[valueName] = Number value
    updateCodeString(APP.bezierProps)
    updatePage()
  $('#rk4 [data-slider]').on 'change', () ->
    valueName = $(@).data('slider-name')
    value = $(@).attr('data-slider')
    $('#rk4 input[name="'+valueName+'"]').val(value)
    APP.rk4Props.options[valueName] = Number value
    updateCodeString(APP.rk4Props)
    updatePage()
  $('#dho [data-slider]').on 'change', () ->
    valueName = $(@).data('slider-name')
    value = $(@).attr('data-slider')
    $('#dho input[name="'+valueName+'"]').val(value)
    APP.dhoProps.options[valueName] = Number value
    updateCodeString(APP.dhoProps)
    updatePage()

  $('#bezier input[type="text"]').on 'change', (evt) ->
    APP.bezierProps.options[$(@).attr('name')] = Number $(@).val()
    updateCodeString(APP.bezierProps)
    updatePage()
  $('#rk4 input[type="text"]').on 'change', (evt) ->
    APP.rk4Props.options[$(@).attr('name')] = Number $(@).val()
    updateCodeString(APP.rk4Props)
    updatePage()
  $('#dho input[type="text"]').on 'change', (evt) ->
    APP.dhoProps.options[$(@).attr('name')] = Number $(@).val()
    updateCodeString(APP.dhoProps)
    updatePage()

  $('#stop-btn').on 'click', (evt) ->
    evt.preventDefault()
    if APP.isAnimating
      APP.animation.stop()

  Utils.delay .1, () ->
    updateCodeString(APP.bezierProps)
    updatePage()



updateCodeString = (props) ->
  if props.time?
    props.options.time = props.time
  if props.type == 'rk4'
    template = _.template "
myLayer.animate\n
\tproperties:\n
\t\tx: 0\n
\t\ty: 0\n
\tcurve: 'spring-rk4'\n
\tcurveOptions:\n
\t\ttension: <%= tension %>\n
\t\tfriction: <%= friction %>\n
\t\tvelocity: <%= velocity %>\n"
  else if props.type == 'dho'
    template = _.template "
myLayer.animate\n
\tproperties:\n
\t\tx: 0\n
\t\ty: 0\n
\tcurve: 'spring-dho'\n
\tcurveOptions:\n
\t\tstiffness: <%= stiffness %>\n
\t\tdamping: <%= damping %>\n
\t\tmass: <%= mass %>\n
\t\tvelocity: <%= velocity %>\n"
  else
    template = _.template "
myLayer.animate\n
\tproperties:\n
\t\tx: 0\n
\t\ty: 0\n
\tcurve: 'bezier-curve'\n
\tcurveOptions: [<%= p1x %>, <%= p1y %>, <%= p2x %>, <%= p2y %>]\n
\ttime: <%= time %>"
  APP.codeString = template props.options


updatePage = () ->
  $('.snippet').html(APP.codeString)
  Rainbow.color()

resetPosition = () ->
  APP.startX = $(window).width()/2 - 120
  APP.DemoLayer.x = APP.startX