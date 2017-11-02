(function(){

  var canvas = this.canvas = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.StaticCanvas();

  function getAbsolutePath(path) {
    var isAbsolute = /^https?:/.test(path);
    if (isAbsolute) {
      return path;
    }
    var imgEl = _createImageElement();
    imgEl.src = path;
    var src = imgEl.src;
    imgEl = null;
    return src;
  }

  var IMG_SRC = fabric.isLikelyNode ? (__dirname + '/../fixtures/test_image.gif') : getAbsolutePath('../fixtures/test_image.gif'),
      IMG_WIDTH = 276,
      IMG_HEIGHT  = 110;

  function _createImageElement() {
    return fabric.isLikelyNode ? new (require(fabric.canvasModule).Image)() : fabric.document.createElement('img');
  }

  function createImageObject(callback) {
    var elImage = _createImageElement();
    elImage.width = IMG_WIDTH;
    elImage.height = IMG_HEIGHT;
    setSrc(elImage, IMG_SRC, function() {
      callback(elImage);
    });
  }

  function setSrc(img, src, callback) {
    if (fabric.isLikelyNode) {
      require('fs').readFile(src, function(err, imgData) {
        if (err) {
          throw err;
        };
        img.src = imgData;
        callback && callback();
      });
    }
    else {
      img.src = src;
      callback && callback();
    }
  }

  QUnit.module('fabric.Object', {
    afterEach: function() {
      fabric.perfLimitSizeTotal = 2097152;
      fabric.maxCacheSideLimit = 4096;
      fabric.minCacheSideLimit = 256;
      canvas.clear();
      canvas.backgroundColor = fabric.Canvas.prototype.backgroundColor;
      canvas.calcOffset();
    }
  });

  QUnit.test('constructor & properties', function(assert) {
    assert.ok(typeof fabric.Object === 'function');

    var cObj = new fabric.Object();

    assert.ok(cObj);
    assert.ok(cObj instanceof fabric.Object);
    assert.ok(cObj.constructor === fabric.Object);

    assert.equal(cObj.type, 'object');
    assert.equal(cObj.includeDefaultValues, true);
    assert.equal(cObj.selectable, true);
  });

  QUnit.test('get', function(assert) {
    var cObj = new fabric.Object({
      left: 11,
      top: 22,
      width: 50,
      height: 60,
      opacity: 0.7
    });

    assert.equal(cObj.get('left'), 11);
    assert.equal(cObj.get('top'), 22);
    assert.equal(cObj.get('width'), 50);
    assert.equal(cObj.get('height'), 60);
    assert.equal(cObj.get('opacity'), 0.7);
  });

  QUnit.test('set', function(assert) {
    var cObj = new fabric.Object({ left: 11, top: 22, width: 50, height: 60, opacity: 0.7 });

    cObj.set('left', 12);
    cObj.set('top', 23);
    cObj.set('width', 51);
    cObj.set('height', 61);
    cObj.set('opacity', 0.5);

    assert.equal(cObj.get('left'), 12);
    assert.equal(cObj.get('top'), 23);
    assert.equal(cObj.get('width'), 51);
    assert.equal(cObj.get('height'), 61);
    assert.equal(cObj.get('opacity'), 0.5);

    assert.equal(cObj.set('opacity', 0.5), cObj, 'chainable');
  });

  QUnit.test('set with object of prop/values', function(assert) {
    var cObj = new fabric.Object({  });

    assert.equal(cObj, cObj.set({ width: 99, height: 88, fill: 'red' }), 'chainable');

    assert.equal('red', cObj.get('fill'));
    assert.equal(99, cObj.get('width'));
    assert.equal(88, cObj.get('height'));
  });

  // QUnit.test('Dinamically generated accessors', function(assert) {
  //   var cObj = new fabric.Object({ });
  //
  //   assert.equal('function', typeof cObj.getWidth);
  //   assert.equal('function', typeof cObj.setWidth);
  //
  //   assert.equal('function', typeof cObj.getFill);
  //   assert.equal('function', typeof cObj.setFill);
  //
  //   assert.equal(cObj, cObj.setFill('red'), 'chainable');
  //   assert.equal('red', cObj.getFill());
  //
  //   cObj.setScaleX(2.3);
  //   assert.equal(2.3, cObj.getScaleX());
  //
  //   cObj.setOpacity(0.123);
  //   assert.equal(0.123, cObj.getOpacity());
  // });

  QUnit.test('stateProperties', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(cObj.stateProperties);
    assert.ok(cObj.stateProperties.length > 0);
  });

  QUnit.test('transform', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(typeof cObj.transform === 'function');
  });

  QUnit.test('toJSON', function(assert) {
    var emptyObjectJSON = '{"type":"object","version":"2.0.0-beta6","originX":"left","originY":"top","left":0,"top":0,"width":0,"height":0,"fill":"rgb(0,0,0)",' +
                          '"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,' +
                          '"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,' +
                          '"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over",' +
                          '"transformMatrix":null,"skewX":0,"skewY":0}';

    var augmentedJSON = '{"type":"object","version":"2.0.0-beta6","originX":"left","originY":"top","left":0,"top":0,"width":122,"height":0,"fill":"rgb(0,0,0)",' +
                        '"stroke":null,"strokeWidth":1,"strokeDashArray":[5,2],"strokeLineCap":"round","strokeLineJoin":"bevil","strokeMiterLimit":5,' +
                        '"scaleX":1.3,"scaleY":1,"angle":0,"flipX":false,"flipY":true,"opacity":0.88,' +
                        '"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over",' +
                        '"transformMatrix":null,"skewX":0,"skewY":0}';

    var cObj = new fabric.Object();
    assert.ok(typeof cObj.toJSON === 'function');
    assert.equal(JSON.stringify(cObj.toJSON()), emptyObjectJSON);

    cObj.set('opacity', 0.88)
      .set('scaleX', 1.3)
      .set('width', 122)
      .set('flipY', true)
      .set('strokeDashArray', [5, 2])
      .set('strokeLineCap', 'round')
      .set('strokeLineJoin', 'bevil')
      .set('strokeMiterLimit', 5);

    assert.equal(JSON.stringify(cObj.toJSON()), augmentedJSON);
  });

  QUnit.test('toObject', function(assert) {
    var emptyObjectRepr = {
      'version':                  fabric.version,
      'type':                     'object',
      'originX':                  'left',
      'originY':                  'top',
      'left':                     0,
      'top':                      0,
      'width':                    0,
      'height':                   0,
      'fill':                     'rgb(0,0,0)',
      'stroke':                   null,
      'strokeWidth':              1,
      'strokeDashArray':          null,
      'strokeLineCap':            'butt',
      'strokeLineJoin':           'miter',
      'strokeMiterLimit':         10,
      'scaleX':                   1,
      'scaleY':                   1,
      'angle':                    0,
      'flipX':                    false,
      'flipY':                    false,
      'opacity':                  1,
      'shadow':                   null,
      'visible':                  true,
      'backgroundColor':          '',
      'clipTo':                   null,
      'fillRule':                 'nonzero',
      'globalCompositeOperation': 'source-over',
      'skewX':                      0,
      'skewY':                      0,
      'transformMatrix':          null
    };

    var augmentedObjectRepr = {
      'version':                  fabric.version,
      'type':                     'object',
      'originX':                  'left',
      'originY':                  'top',
      'left':                     10,
      'top':                      20,
      'width':                    30,
      'height':                   40,
      'fill':                     'rgb(0,0,0)',
      'stroke':                   null,
      'strokeWidth':              1,
      'strokeDashArray':          [5, 2],
      'strokeLineCap':            'round',
      'strokeLineJoin':           'bevil',
      'strokeMiterLimit':         5,
      'scaleX':                   1,
      'scaleY':                   1,
      'angle':                    0,
      'flipX':                    true,
      'flipY':                    false,
      'opacity':                  0.13,
      'shadow':                   null,
      'visible':                  true,
      'backgroundColor':          '',
      'clipTo':                   null,
      'fillRule':                 'nonzero',
      'globalCompositeOperation': 'source-over',
      'transformMatrix':          null,
      'skewX':                      0,
      'skewY':                      0
    };

    var cObj = new fabric.Object();
    assert.deepEqual(emptyObjectRepr, cObj.toObject());

    cObj.set('left', 10)
      .set('top', 20)
      .set('width', 30)
      .set('height', 40)
      .set('flipX', true)
      .set('opacity', 0.13)
      .set('strokeDashArray', [5, 2])
      .set('strokeLineCap', 'round')
      .set('strokeLineJoin', 'bevil')
      .set('strokeMiterLimit', 5);

    assert.deepEqual(augmentedObjectRepr, cObj.toObject());

    var fractionalValue = 166.66666666666666,
        testedProperties = 'left top width height'.split(' '),
        fractionDigitsDefault = 2;

    function testFractionDigits(fractionDigits, expectedValue) {

      fabric.Object.NUM_FRACTION_DIGITS = fractionDigits;

      testedProperties.forEach(function(property) {
        cObj.set(property, fractionalValue);
        assert.equal(cObj.toObject()[property], expectedValue,
          'value of ' + property + ' should have ' + fractionDigits + ' fractional digits');
      }, this);

      fabric.Object.NUM_FRACTION_DIGITS = fractionDigitsDefault;
    }

    testFractionDigits.call(this, 2, 166.67);
    testFractionDigits.call(this, 3, 166.667);
    testFractionDigits.call(this, 0, 167);
  });

  QUnit.test('toObject without default values', function(assert) {

    var emptyObjectRepr = { version: fabric.version, type: 'object' };

    var augmentedObjectRepr = {
      version: fabric.version,
      type: 'object',
      left: 10,
      top: 20,
      width: 30,
      height: 40,
      strokeDashArray: [5, 2],
      strokeLineCap: 'round',
      strokeLineJoin: 'bevil',
      strokeMiterLimit: 5,
      flipX: true,
      opacity: 0.13,
      transformMatrix: [3, 0, 3, 1, 0, 0]
    };

    var cObj = new fabric.Object(),
        toObjectObj;
    cObj.includeDefaultValues = false;
    assert.deepEqual(emptyObjectRepr, cObj.toObject());

    cObj.set('left', 10)
      .set('top', 20)
      .set('width', 30)
      .set('height', 40)
      .set('flipX', true)
      .set('opacity', 0.13)
      .set('strokeDashArray', [5, 2])
      .set('strokeLineCap', 'round')
      .set('strokeLineJoin', 'bevil')
      .set('strokeMiterLimit', 5)
      .set('transformMatrix', [3, 0, 3, 1, 0, 0]);
    toObjectObj = cObj.toObject();
    assert.deepEqual(augmentedObjectRepr, toObjectObj);
    assert.notEqual(augmentedObjectRepr.transformMatrix, toObjectObj.transformMatrix);
    assert.deepEqual(augmentedObjectRepr.transformMatrix, toObjectObj.transformMatrix);
    assert.notEqual(augmentedObjectRepr.strokeDashArray, toObjectObj.strokeDashArray);
    assert.deepEqual(augmentedObjectRepr.strokeDashArray, toObjectObj.strokeDashArray);
  });

  QUnit.test('toDatalessObject', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(typeof cObj.toDatalessObject === 'function');
    assert.deepEqual(cObj.toObject(), cObj.toDatalessObject());
  });

  QUnit.test('toString', function(assert) {
    var cObj = new fabric.Object();
    assert.equal(cObj.toString(), '#<fabric.Object>');
    cObj.type = 'moo';
    assert.equal(cObj.toString(), '#<fabric.Moo>');
  });

  QUnit.test('render', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(typeof cObj.render === 'function');
  });

  QUnit.test('getBoundingRect', function(assert) {
    var cObj = new fabric.Object({ strokeWidth: 0 }),
        boundingRect;
    assert.ok(typeof cObj.getBoundingRect === 'function');

    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left, 0);
    assert.equal(boundingRect.top, 0);
    assert.equal(boundingRect.width, 0);
    assert.equal(boundingRect.height, 0);
    cObj.set('width', 123).setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left, 0);
    assert.equal(boundingRect.top, 0);
    assert.equal(boundingRect.width, 123);
    assert.equal(boundingRect.height, 0);

    cObj.set('height', 167).setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left, 0);
    assert.equal(Math.abs(boundingRect.top).toFixed(13), 0);
    assert.equal(boundingRect.width, 123);
    assert.equal(boundingRect.height, 167);

    cObj.scale(2).setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left, 0);
    assert.equal(Math.abs(boundingRect.top).toFixed(13), 0);
    assert.equal(boundingRect.width, 246);
    assert.equal(boundingRect.height, 334);
  });

  QUnit.test('getBoundingRectWithStroke', function(assert) {
    var cObj = new fabric.Object(),
        boundingRect;
    assert.ok(typeof cObj.getBoundingRect === 'function');

    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left.toFixed(2), 0);
    assert.equal(boundingRect.top.toFixed(2), 0);
    assert.equal(boundingRect.width.toFixed(2), 1);
    assert.equal(boundingRect.height.toFixed(2), 1);

    cObj.set('width', 123).setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left.toFixed(2), 0);
    assert.equal(boundingRect.top.toFixed(2), 0);
    assert.equal(boundingRect.width.toFixed(2), 124);
    assert.equal(boundingRect.height.toFixed(2), 1);

    cObj.set('height', 167).setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left.toFixed(2), 0);
    assert.equal(boundingRect.top.toFixed(2), 0);
    assert.equal(boundingRect.width.toFixed(2), 124);
    assert.equal(boundingRect.height.toFixed(2), 168);

    cObj.scale(2).setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left.toFixed(2), 0);
    assert.equal(boundingRect.top.toFixed(2), 0);
    assert.equal(boundingRect.width.toFixed(2), 248);
    assert.equal(boundingRect.height.toFixed(2), 336);
  });

  QUnit.test('getScaledWidth', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(typeof cObj.getScaledWidth === 'function');
    assert.equal(cObj.getScaledWidth(), 0 + cObj.strokeWidth);
    cObj.set('width', 123);
    assert.equal(cObj.getScaledWidth(), 123 + cObj.strokeWidth);
    cObj.set('scaleX', 2);
    assert.equal(cObj.getScaledWidth(), 246 + cObj.strokeWidth * 2);
  });

  QUnit.test('getHeight', function(assert) {
    var cObj = new fabric.Object({strokeWidth: 0});
    //  assert.ok(typeof cObj.getHeight === 'function');
    assert.equal(cObj.getScaledHeight(), 0);
    cObj.set('height', 123);
    assert.equal(cObj.getScaledHeight(), 123);
    cObj.set('scaleY', 2);
    assert.equal(cObj.getScaledHeight(), 246);
  });

  QUnit.test('rotate', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(typeof cObj.rotate === 'function');
    assert.equal(cObj.get('angle'), 0);
    assert.equal(cObj.rotate(45), cObj, 'chainable');
    assert.equal(cObj.get('angle'), 45);
  });

  QUnit.test('scale', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(typeof cObj.scale === 'function');
    assert.equal(cObj.get('scaleX'), 1);
    assert.equal(cObj.get('scaleY'), 1);
    cObj.scale(1.5);
    assert.equal(cObj.get('scaleX'), 1.5);
    assert.equal(cObj.get('scaleY'), 1.5);
    assert.equal(cObj.scale(2), cObj, 'chainable');
  });

  QUnit.test('scaleToWidth', function(assert) {
    var cObj = new fabric.Object({ width: 560, strokeWidth: 0 });
    assert.ok(typeof cObj.scaleToWidth === 'function');
    assert.equal(cObj.scaleToWidth(100), cObj, 'chainable');
    assert.equal(cObj.getScaledWidth(), 100);
    assert.equal(cObj.get('scaleX'), 100 / 560);
  });

  QUnit.test('scaleToHeight', function(assert) {
    var cObj = new fabric.Object({ height: 560, strokeWidth: 0 });
    assert.ok(typeof cObj.scaleToHeight === 'function');
    assert.equal(cObj.scaleToHeight(100), cObj, 'chainable');
    assert.equal(cObj.getScaledHeight(), 100);
    assert.equal(cObj.get('scaleY'), 100 / 560);
  });

  QUnit.test('scaleToWidth on rotated object', function(assert) {
    var obj = new fabric.Object({ height: 100, width: 100, strokeWidth: 0 });
    obj.rotate(45);
    obj.scaleToWidth(200);
    assert.equal(Math.round(obj.getBoundingRect().width), 200);
  });

  QUnit.test('scaleToHeight on rotated object', function(assert) {
    var obj = new fabric.Object({ height: 100, width: 100, strokeWidth: 0 });
    obj.rotate(45);
    obj.scaleToHeight(300);
    assert.equal(Math.round(obj.getBoundingRect().height), 300);
  });

  QUnit.test('setOpacity', function(assert) {
    var cObj = new fabric.Object();
    assert.equal(cObj.get('opacity'), 1);
    cObj.set('opacity', 0.68);
    assert.equal(cObj.get('opacity'), 0.68);
    assert.equal(cObj.set('opacity', 1), cObj, 'chainable');
  });

  QUnit.test('getAngle', function(assert) {
    var cObj = new fabric.Object();
    assert.equal(cObj.get('angle'), 0);
    cObj.rotate(45);
    assert.equal(cObj.get('angle'), 45);
  });

  QUnit.test('rotate', function(assert) {
    var cObj = new fabric.Object();
    assert.equal(cObj.get('angle'), 0);
    assert.equal(cObj.set('angle', 45), cObj, 'chainable');
    assert.equal(cObj.get('angle'), 45);
  });

  QUnit.test('drawBorders', function(assert) {
    var cObj = new fabric.Object(), canvas = fabric.document.createElement('canvas');

    var dummyContext = canvas.getContext('2d');

    assert.ok(typeof cObj.drawBorders === 'function');
    assert.equal(cObj.drawBorders(dummyContext), cObj, 'chainable');
  });

  QUnit.test('drawControls', function(assert) {
    var cObj = new fabric.Object(), canvas = fabric.document.createElement('canvas');

    var dummyContext = canvas.getContext('2d');
    assert.ok(typeof cObj.drawControls === 'function');
    assert.equal(cObj.drawControls(dummyContext), cObj, 'chainable');
  });

  QUnit.test('clone', function(assert) {
    var cObj = new fabric.Object({ left: 123, top: 456, opacity: 0.66 });
    assert.ok(typeof cObj.clone === 'function');
    cObj.clone(function(clone) {
      assert.equal(clone.get('left'), 123);
      assert.equal(clone.get('top'), 456);
      assert.equal(clone.get('opacity'), 0.66);

      // augmenting clone properties should not affect original instance
      clone.set('left', 12).set('scaleX', 2.5).rotate(33);

      assert.equal(cObj.get('left'), 123);
      assert.equal(cObj.get('scaleX'), 1);
      assert.equal(cObj.get('angle'), 0);
    });
  });

  QUnit.test('cloneAsImage', function(assert) {
    var done = assert.async();
    var cObj = new fabric.Rect({ width: 100, height: 100, fill: 'red', strokeWidth: 0 });

    assert.ok(typeof cObj.cloneAsImage === 'function');

    if (!fabric.Canvas.supports('toDataURL')) {
      fabric.log('`toDataURL` is not supported by this environment; skipping `cloneAsImage` test (as it relies on `toDataURL`)');
      done();
    }
    else {
      cObj.cloneAsImage(function(image) {
        assert.ok(image);
        assert.ok(image instanceof fabric.Image);
        assert.equal(image.width, 100, 'the image has same dimension of object');
        done();
      });
    }
  });

  QUnit.test('cloneAsImage with retina scaling enabled', function(assert) {
    var done = assert.async();
    var cObj = new fabric.Rect({ width: 100, height: 100, fill: 'red', strokeWidth: 0 });
    fabric.devicePixelRatio = 2;
    if (!fabric.Canvas.supports('toDataURL')) {
      fabric.log('`toDataURL` is not supported by this environment; skipping `cloneAsImage` test (as it relies on `toDataURL`)');
      done();
    }
    else {
      cObj.cloneAsImage(function(image) {
        assert.ok(image);
        assert.ok(image instanceof fabric.Image);
        assert.equal(image.width, 200, 'the image has been scaled by retina');
        fabric.devicePixelRatio = 1;
        done();
      }, { enableRetinaScaling: true });
    }
  });

  QUnit.test('toDataURL', function(assert) {
    // var data =
    //   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQA'+
    //   'AABkCAYAAABw4pVUAAAA+UlEQVR4nO3RoRHAQBDEsOu/6YR+B2s'+
    //   'gIO4Z3919pMwDMCRtHoAhafMADEmbB2BI2jwAQ9LmARiSNg/AkLR5AI'+
    //   'akzQMwJG0egCFp8wAMSZsHYEjaPABD0uYBGJI2D8CQtHkAhqTNAzAkbR'+
    //   '6AIWnzAAxJmwdgSNo8AEPS5gEYkjYPwJC0eQCGpM0DMCRtHoAhafMADEm'+
    //   'bB2BI2jwAQ9LmARiSNg/AkLR5AIakzQMwJG0egCFp8wAMSZsHYEjaPABD0'+
    //   'uYBGJI2D8CQtHkAhqTNAzAkbR6AIWnzAAxJmwdgSNo8AEPS5gEYkjYPw'+
    //   'JC0eQCGpM0DMCRtHsDjB5K06yueJFXJAAAAAElFTkSuQmCC';

    var cObj = new fabric.Rect({
      width: 100, height: 100, fill: 'red', strokeWidth: 0
    });

    assert.ok(typeof cObj.toDataURL === 'function');

    if (!fabric.Canvas.supports('toDataURL')) {
      window.alert('toDataURL is not supported by this environment. Some of the tests can not be run.');
    }
    else {
      var dataURL = cObj.toDataURL();
      assert.equal(typeof dataURL, 'string');
      assert.equal(dataURL.substring(0, 21), 'data:image/png;base64');

      try {
        dataURL = cObj.toDataURL({ format: 'jpeg' });
        assert.equal(dataURL.substring(0, 22), 'data:image/jpeg;base64');
      }
      catch (err) {
        fabric.log('jpeg toDataURL not supported');
      }
    }
  });

  QUnit.test('toDataURL & reference to canvas', function(assert) {
  // var data =
  //   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQA'+
  //   'AABkCAYAAABw4pVUAAAA+UlEQVR4nO3RoRHAQBDEsOu/6YR+B2s'+
  //   'gIO4Z3919pMwDMCRtHoAhafMADEmbB2BI2jwAQ9LmARiSNg/AkLR5AI'+
  //   'akzQMwJG0egCFp8wAMSZsHYEjaPABD0uYBGJI2D8CQtHkAhqTNAzAkbR'+
  //   '6AIWnzAAxJmwdgSNo8AEPS5gEYkjYPwJC0eQCGpM0DMCRtHoAhafMADEm'+
  //   'bB2BI2jwAQ9LmARiSNg/AkLR5AIakzQMwJG0egCFp8wAMSZsHYEjaPABD0'+
  //   'uYBGJI2D8CQtHkAhqTNAzAkbR6AIWnzAAxJmwdgSNo8AEPS5gEYkjYPw'+
  //   'JC0eQCGpM0DMCRtHsDjB5K06yueJFXJAAAAAElFTkSuQmCC';

    var cObj = new fabric.Rect({
      width: 100, height: 100, fill: 'red'
    });
    canvas.add(cObj);

    if (!fabric.Canvas.supports('toDataURL')) {
      window.alert('toDataURL is not supported by this environment. Some of the tests can not be run.');
    }
    else {
      var objCanvas = cObj.canvas;
      cObj.toDataURL();

      assert.equal(objCanvas, cObj.canvas);
    }
  });

  QUnit.test('isType', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(typeof cObj.isType === 'function');
    assert.ok(cObj.isType('object'));
    assert.ok(!cObj.isType('rect'));
    cObj = new fabric.Rect();
    assert.ok(cObj.isType('rect'));
    assert.ok(!cObj.isType('object'));
  });

  QUnit.test('toggle', function(assert) {
    var object = new fabric.Object({ left: 100, top: 124, width: 210, height: 66 });
    assert.ok(typeof object.toggle === 'function');

    object.set('flipX', false);
    assert.equal(object.toggle('flipX'), object, 'should be chainable');
    assert.equal(object.get('flipX'), true);
    object.toggle('flipX');
    assert.equal(object.get('flipX'), false);

    object.set('left', 112.45);
    object.toggle('left');
    assert.equal(object.get('left'), 112.45, 'non boolean properties should not be affected');
  });

  QUnit.test('_setLineDash', function(assert) {
    var object = new fabric.Rect({ left: 100, top: 124, width: 210, height: 66, stroke: 'black', strokeWidth: 2});
    assert.ok(typeof object._setLineDash === 'function');
    object.strokeDashArray = [3, 2, 1];
    assert.equal(object.strokeDashArray.length, 3, 'strokeDash array is odd');
    object._setLineDash(canvas.contextContainer, object.strokeDashArray, null);
    assert.equal(object.strokeDashArray.length, 6, 'strokeDash array now is even');
  });

  QUnit.test('straighten', function(assert) {
    var object = new fabric.Object({ left: 100, top: 124, width: 210, height: 66 });
    assert.ok(typeof object.straighten === 'function');

    object.rotate(123.456);
    object.straighten();
    assert.equal(object.get('angle'), 90);

    object.rotate(97.111);
    object.straighten();
    assert.equal(object.get('angle'), 90);

    object.rotate(3.45);
    object.straighten();
    assert.equal(object.get('angle'), 0);

    object.rotate(-157);
    object.straighten();
    assert.equal(object.get('angle'), -180);

    object.rotate(159);
    object.straighten();
    assert.equal(object.get('angle'), 180);

    object.rotate(999);
    object.straighten();
    assert.equal(object.get('angle'), 270);
  });

  QUnit.test('fxStraighten', function(assert) {
    var done = assert.async();
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    var onCompleteFired = false;
    var onComplete = function(){ onCompleteFired = true; };

    var onChangeFired = false;
    var onChange = function(){ onChangeFired = true; };

    var callbacks = { onComplete: onComplete, onChange: onChange };
    assert.ok(typeof object.fxStraighten === 'function');
    assert.equal(object.fxStraighten(callbacks), object, 'should be chainable');
    assert.equal(fabric.util.toFixed(object.get('angle'), 0), 43);
    setTimeout(function(){
      assert.ok(onCompleteFired);
      assert.ok(onChangeFired);
      assert.equal(object.get('angle'), 0, 'angle should be set to 0 by the end of animation');
      assert.equal(object.fxStraighten(), object, 'should work without callbacks');
      done();
    }, 1000);
  });

  QUnit.test('observable', function(assert) {
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    var fooFired = false,
        barFired = false;

    object.on('foo', function() { fooFired = true; });
    object.on('bar', function() { barFired = true; });

    object.fire('foo');
    assert.ok(fooFired);
    assert.ok(!barFired);

    object.fire('bar');
    assert.ok(fooFired);
    assert.ok(barFired);

    var firedOptions;
    object.on('baz', function(options) { firedOptions = options; });
    object.fire('baz', { param1: 'abrakadabra', param2: 3.1415 });

    assert.equal('abrakadabra', firedOptions.param1);
    assert.equal(3.1415, firedOptions.param2);
  });

  QUnit.test('object:added', function(assert) {
    var object = new fabric.Object();
    var addedEventFired = false;

    object.on('added', function() { addedEventFired = true; });
    canvas.add(object);

    assert.ok(addedEventFired);
  });

  QUnit.test('canvas reference', function(assert) {
    var object = new fabric.Object();
    var object2 = new fabric.Object();

    canvas.add(object);
    canvas.insertAt(object2, 0);

    assert.ok(object.canvas === canvas);
    assert.ok(object2.canvas === canvas);
  });

  QUnit.test('object:removed', function(assert) {
    var object = new fabric.Object();
    var removedEventFired = false;

    canvas.add(object);

    object.on('removed', function() { removedEventFired = true; });
    canvas.remove(object);

    assert.ok(removedEventFired);
  });

  QUnit.test('center', function(assert) {
    var object = new fabric.Object();
    object.strokeWidth = 0;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    assert.ok(typeof object.center === 'function');

    canvas.add(object);
    assert.equal(object.center(), object, 'should be chainable');

    assert.equal(object.getCenterPoint().x, canvas.getWidth() / 2);
    assert.equal(object.getCenterPoint().y, canvas.getHeight() / 2);

    canvas.setZoom(2);
    object.center();
    assert.equal(object.getCenterPoint().x, canvas.getWidth() / 2, 'object center.x is in canvas center when the canvas is transformed');
    assert.equal(object.getCenterPoint().y, canvas.getHeight() / 2, 'object center.y is in canvas center when the canvas is transformed');

  });

  QUnit.test('centerH', function(assert) {
    var object = new fabric.Object();
    object.strokeWidth = 0;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    assert.ok(typeof object.centerH === 'function');
    var oldY = object.top;

    canvas.add(object);
    assert.equal(object.centerH(), object, 'should be chainable');

    assert.equal(object.getCenterPoint().x, canvas.getWidth() / 2);
    assert.equal(object.top, oldY, 'object top did not change');
    canvas.setZoom(2);
    object.centerH();
    assert.equal(object.getCenterPoint().x, canvas.getWidth() / 2, 'object center.x is in canvas center when the canvas is transformed');
  });

  QUnit.test('centerV', function(assert) {
    var object = new fabric.Object();
    object.strokeWidth = 0;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    assert.ok(typeof object.centerV === 'function');
    var oldX = object.left;

    canvas.add(object);
    assert.equal(object.centerV(), object, 'should be chainable');
    assert.equal(object.left, oldX, 'object top did not change');
    assert.equal(object.getCenterPoint().y, canvas.getHeight() / 2);

    canvas.setZoom(2);
    object.centerV();
    assert.equal(object.getCenterPoint().y, canvas.getHeight() / 2, 'object center.y is in canvas center when the canvas is transformed');
  });

  QUnit.test('viewportCenter', function(assert) {
    var object = new fabric.Object();
    object.strokeWidth = 0;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    assert.ok(typeof object.viewportCenter === 'function');

    canvas.add(object);
    assert.equal(object.viewportCenter(), object, 'should be chainable');

    assert.equal(object.getCenterPoint().x, canvas.getWidth() / 2);
    assert.equal(object.getCenterPoint().y, canvas.getHeight() / 2);

    canvas.setZoom(2);
    object.viewportCenter();
    assert.equal(object.getCenterPoint().x, canvas.getWidth() / (2 * canvas.getZoom()));
    assert.equal(object.getCenterPoint().y, canvas.getHeight() / (2 * canvas.getZoom()));
  });

  QUnit.test('viewportCenterH', function(assert) {
    var object = new fabric.Object();
    object.strokeWidth = 0;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    assert.ok(typeof object.viewportCenterH === 'function');

    var oldY = object.top;
    canvas.add(object);
    assert.equal(object.viewportCenterH(), object, 'should be chainable');
    assert.equal(object.getCenterPoint().x, canvas.getWidth() / 2);
    assert.equal(object.top, oldY, 'object top did not change');
    canvas.setZoom(2);
    object.viewportCenterH();
    assert.equal(object.getCenterPoint().x, canvas.getWidth() / (2 * canvas.getZoom()));
    assert.equal(object.top, oldY, 'object top did not change');
  });

  QUnit.test('viewportCenterV', function(assert) {
    var object = new fabric.Object();
    object.strokeWidth = 0;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    assert.ok(typeof object.viewportCenterV === 'function');

    var oldX = object.left;

    canvas.add(object);
    assert.equal(object.viewportCenterV(), object, 'should be chainable');
    assert.equal(object.getCenterPoint().y, canvas.getHeight() / 2);
    assert.equal(object.left, oldX, 'object left did not change');
    canvas.setZoom(2);
    object.viewportCenterV();
    assert.equal(object.getCenterPoint().y, canvas.getHeight() / (2 * canvas.getZoom()));
    assert.equal(object.left, oldX, 'object left did not change');
  });


  QUnit.test('sendToBack', function(assert) {
    var object = new fabric.Object();

    assert.ok(typeof object.sendToBack === 'function');

    canvas.add(object);
    assert.equal(object.sendToBack(), object, 'should be chainable');
  });

  QUnit.test('bringToFront', function(assert) {
    var object = new fabric.Object();

    assert.ok(typeof object.bringToFront === 'function');

    canvas.add(object);
    assert.equal(object.bringToFront(), object, 'should be chainable');
  });

  QUnit.test('sendBackwards', function(assert) {
    var object = new fabric.Object();

    assert.ok(typeof object.sendBackwards === 'function');

    canvas.add(object);
    assert.equal(object.sendBackwards(), object, 'should be chainable');
  });

  QUnit.test('bringForward', function(assert) {
    var object = new fabric.Object();

    assert.ok(typeof object.bringForward === 'function');

    canvas.add(object);
    assert.equal(object.bringForward(), object, 'should be chainable');
  });

  QUnit.test('moveTo', function(assert) {
    var object = new fabric.Object();

    assert.ok(typeof object.moveTo === 'function');

    canvas.add(object);
    assert.equal(object.moveTo(), object, 'should be chainable');
  });

  QUnit.test('setGradient', function(assert) {
    var object = new fabric.Object();

    assert.ok(typeof object.setGradient === 'function');

    assert.equal(object.setGradient('fill', {
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      colorStops: {
        '0': 'rgb(255,0,0)',
        '1': 'rgb(0,128,0)'
      }
    }), object, 'should be chainable');

    assert.ok(typeof object.toObject().fill == 'object');
    assert.ok(object.fill instanceof fabric.Gradient);

    var fill = object.fill;

    assert.equal(fill.type, 'linear');

    assert.equal(fill.coords.x1, 0);
    assert.equal(fill.coords.y1, 0);

    assert.equal(fill.coords.x2, 100);
    assert.equal(fill.coords.y2, 100);

    assert.equal(fill.colorStops[0].offset, 0);
    assert.equal(fill.colorStops[1].offset, 1);
    assert.equal(fill.colorStops[0].color, 'rgb(255,0,0)');
    assert.equal(fill.colorStops[1].color, 'rgb(0,128,0)');
  });

  QUnit.test('setGradient with gradientTransform', function(assert) {
    var object = new fabric.Object();

    assert.ok(typeof object.setGradient === 'function');

    assert.equal(object.setGradient('fill', {
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      gradientTransform: [1, 0, 0, 4, 5, 5],
      colorStops: {
        '0': 'rgb(255,0,0)',
        '1': 'rgb(0,128,0)'
      }
    }), object, 'should be chainable');

    assert.ok(typeof object.toObject().fill == 'object');
    assert.ok(object.fill instanceof fabric.Gradient);

    var fill = object.fill;

    assert.equal(fill.type, 'linear');

    assert.equal(fill.coords.x1, 0);
    assert.equal(fill.coords.y1, 0);

    assert.equal(fill.coords.x2, 100);
    assert.equal(fill.coords.y2, 100);

    assert.deepEqual(fill.gradientTransform, [1, 0, 0, 4, 5, 5]);

    assert.equal(fill.colorStops[0].offset, 0);
    assert.equal(fill.colorStops[1].offset, 1);
    assert.equal(fill.colorStops[0].color, 'rgb(255,0,0)');
    assert.equal(fill.colorStops[1].color, 'rgb(0,128,0)');
  });

  QUnit.test('setPatternFill', function(assert) {
    var done = assert.async();
    var object = new fabric.Object();

    assert.ok(typeof object.setPatternFill === 'function');

    createImageObject(function(img) {
      assert.equal(object.setPatternFill({source: img}), object, 'should be chainable');

      assert.ok(typeof object.toObject().fill == 'object');
      assert.ok(object.fill instanceof fabric.Pattern);

      assert.equal(object.fill.source, img);
      assert.equal(object.fill.repeat, 'repeat');
      assert.equal(object.fill.offsetX, 0);
      assert.equal(object.fill.offsetY, 0);

      assert.equal(object.setPatternFill({source: img, repeat: 'repeat-y', offsetX: 100, offsetY: 50}), object, 'should be chainable');

      assert.ok(typeof object.fill == 'object');
      assert.ok(object.fill instanceof fabric.Pattern);

      assert.equal(object.fill.source, img);
      assert.equal(object.fill.repeat, 'repeat-y');
      assert.equal(object.fill.offsetX, 100);
      assert.equal(object.fill.offsetY, 50);

      done();
    });
  });

  QUnit.test('setShadow', function(assert) {
    var object = new fabric.Object();

    assert.ok(typeof object.setShadow === 'function');

    assert.equal(object.setShadow({
      color: 'red',
      blur: 10,
      offsetX: 5,
      offsetY: 15
    }), object, 'should be chainable');

    assert.ok(typeof object.toObject().shadow === 'object');
    assert.ok(object.shadow instanceof fabric.Shadow);

    assert.equal(object.shadow.color, 'red');
    assert.equal(object.shadow.blur, 10);
    assert.equal(object.shadow.offsetX, 5);
    assert.equal(object.shadow.offsetY, 15);

    assert.equal(object.setShadow(null), object, 'should be chainable');
    assert.ok(!(object.shadow instanceof fabric.Shadow));
    assert.equal(object.shadow, null);

  });

  QUnit.test('set shadow', function(assert) {
    var object = new fabric.Object();

    object.set('shadow', '10px 5px 0 #FF0000');

    assert.ok(object.shadow instanceof fabric.Shadow);

    assert.equal(object.shadow.color, '#FF0000');
    assert.equal(object.shadow.blur, 0);
    assert.equal(object.shadow.offsetX, 10);
    assert.equal(object.shadow.offsetY, 5);

    object.set('shadow', null);

    assert.ok(!(object.shadow instanceof fabric.Shadow));

    assert.equal(object.shadow, null);
  });

  QUnit.test('setColor', function(assert) {
    var object = new fabric.Object();

    assert.ok(typeof object.setColor === 'function');

    assert.equal(object.setColor('123456'), object, 'should be chainable');
    assert.equal(object.get('fill'), '123456');
  });

  QUnit.test('clipTo', function(assert) {
    var object = new fabric.Object({
      left: 40,
      top: 40,
      width: 40,
      height: 50,
      clipTo: function(ctx) { ctx.arc(10, 10, 10, 0, Math.PI * 2, false); }
    });

    assert.equal(typeof object.clipTo, 'function');

    var deserializedObject = new fabric.Object(JSON.parse(JSON.stringify(object)));
    assert.equal(typeof deserializedObject.clipTo, 'function');
  });

  QUnit.test('getObjectScale', function(assert) {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2});
    var objectScale = object.getObjectScaling();
    assert.deepEqual(objectScale, {scaleX: object.scaleX, scaleY: object.scaleY});
  });

  QUnit.test('getObjectScale in group', function(assert) {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2});
    var group = new fabric.Group();
    group.scaleX = 2;
    group.scaleY = 2;
    object.group = group;
    var objectScale = object.getObjectScaling();
    assert.deepEqual(objectScale, {
      scaleX: object.scaleX * group.scaleX,
      scaleY: object.scaleY * group.scaleY
    });
  });

  QUnit.test('dirty flag on set property', function(assert) {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2});
    object.cacheProperties = ['propA', 'propB'];
    object.dirty = false;
    assert.equal(object.dirty, false, 'object starts with dirty flag disabled');
    object.set('propC', '3');
    assert.equal(object.dirty, false, 'after setting a property out of cache, dirty flag is still false');
    object.set('propA', '2');
    assert.equal(object.dirty, true, 'after setting a property from cache, dirty flag is true');
  });

  QUnit.test('isCacheDirty statefullCache disabled', function(assert) {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2, width: 1, height: 2});
    assert.equal(object.dirty, true, 'object is dirty after creation');
    object.cacheProperties = ['propA', 'propB'];
    object.dirty = false;
    object.statefullCache = false;
    object._createCacheCanvas();
    assert.equal(object.isCacheDirty(), false, 'object is not dirty if dirty flag is false');
    object.dirty = true;
    assert.equal(object.isCacheDirty(), true, 'object is dirty if dirty flag is true');
  });

  QUnit.test('isCacheDirty statefullCache enabled', function(assert) {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2, width: 1, height: 2});
    object.cacheProperties = ['propA', 'propB'];
    object.dirty = false;
    object.statefullCache = true;
    object.propA = 'A';
    object.setupState({ propertySet: 'cacheProperties' });
    object._createCacheCanvas();
    assert.equal(object.isCacheDirty(), true, 'object is dirty if canvas has been just created');
    object.setupState({ propertySet: 'cacheProperties' });
    assert.equal(object.isCacheDirty(), false, 'object is not dirty');
    object.propA = 'B';
    assert.equal(object.isCacheDirty(), true, 'object is dirty because change in propA is detected by statefullCache');
  });

  QUnit.test('_getCacheCanvasDimensions returns dimensions and zoom for cache canvas', function(assert) {
    var object = new fabric.Object({ width: 10, height: 10, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    assert.deepEqual(dims, { width: 12, height: 12, zoomX: 1, zoomY: 1 }, 'if no scaling is applied cache is as big as object');
    object.strokeWidth = 2;
    dims = object._getCacheCanvasDimensions();
    assert.deepEqual(dims, { width: 14, height: 14, zoomX: 1, zoomY: 1 }, 'cache contains the stroke');
    object.scaleX = 2;
    object.scaleY = 3;
    dims = object._getCacheCanvasDimensions();
    assert.deepEqual(dims, { width: 26, height: 38, zoomX: 2, zoomY: 3 }, 'cache is as big as the scaled object');
  });

  QUnit.test('_updateCacheCanvas check if cache canvas should be updated', function(assert) {
    fabric.perfLimitSizeTotal = 10000;
    fabric.maxCacheSideLimit = 4096;
    fabric.minCacheSideLimit = 1;
    var object = new fabric.Object({ width: 10, height: 10, strokeWidth: 0 });
    object._createCacheCanvas();
    assert.equal(object.cacheWidth, 12, 'current cache dimensions are saved');
    assert.equal(object.cacheHeight, 12, 'current cache dimensions are saved');
    assert.equal(object._updateCacheCanvas(), false, 'second execution of cache canvas return false');
    object.scaleX = 2;
    assert.equal(object._updateCacheCanvas(), true, 'if scale change, it returns true');
    assert.equal(object.cacheWidth, 22, 'current cache dimensions is updated');
    assert.equal(object.zoomX, 2, 'current scale level is saved');
    object.width = 2;
    assert.equal(object._updateCacheCanvas(), true, 'if dimension change, it returns true');
    assert.equal(object.cacheWidth, 6, 'current cache dimensions is updated');
    object.strokeWidth = 2;
    assert.equal(object._updateCacheCanvas(), true, 'if strokeWidth change, it returns true');
  });

  QUnit.test('_limitCacheSize limit min to 256', function(assert) {
    fabric.perfLimitSizeTotal = 10000;
    fabric.maxCacheSideLimit = 4096;
    fabric.minCacheSideLimit = 256;
    var object = new fabric.Object({ width: 200, height: 200, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    assert.equal(dims, limitedDims, 'object is mutated');
    assert.equal(dims.width, 256, 'width gets minimum to the cacheSideLimit');
    assert.equal(dims.height, 256, 'height gets minimum to the cacheSideLimit');
    assert.equal(zoomX, dims.zoomX, 'zoom factor X does not need a change');
    assert.equal(zoomY, dims.zoomY, 'zoom factor Y does not need a change');
  });

  QUnit.test('_limitCacheSize does not limit if not necessary', function(assert) {
    fabric.perfLimitSizeTotal = 1000000;
    fabric.maxCacheSideLimit = 4096;
    fabric.minCacheSideLimit = 256;
    var object = new fabric.Object({ width: 400, height: 400, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    assert.equal(dims, limitedDims, 'object is mutated');
    assert.equal(dims.width, 402, 'width is in the middle of limits');
    assert.equal(dims.height, 402, 'height is in the middle of limits');
    assert.equal(zoomX, dims.zoomX, 'zoom factor X does not need a change');
    assert.equal(zoomY, dims.zoomY, 'zoom factor Y does not need a change');
  });

  QUnit.test('_limitCacheSize does cap up minCacheSideLimit', function(assert) {
    fabric.perfLimitSizeTotal = 10000;
    fabric.maxCacheSideLimit = 4096;
    fabric.minCacheSideLimit = 256;
    var object = new fabric.Object({ width: 400, height: 400, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var width = dims.width;
    var height = dims.height;
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    assert.equal(dims, limitedDims, 'object is mutated');
    assert.equal(dims.width, 256, 'width is capped to min');
    assert.equal(dims.height, 256, 'height is capped to min');
    assert.equal(zoomX * dims.width / width, dims.zoomX, 'zoom factor X gets updated to represent the shrink');
    assert.equal(zoomY * dims.height / height, dims.zoomY, 'zoom factor Y gets updated to represent the shrink');
  });

  QUnit.test('_limitCacheSize does cap up if necessary', function(assert) {
    fabric.perfLimitSizeTotal = 1000000;
    fabric.maxCacheSideLimit = 4096;
    fabric.minCacheSideLimit = 256;
    var object = new fabric.Object({ width: 2046, height: 2046, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var width = dims.width;
    var height = dims.height;
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    assert.equal(dims, limitedDims, 'object is mutated');
    assert.equal(dims.width, 1000, 'width is capped to max allowed by area');
    assert.equal(dims.height, 1000, 'height is capped to max allowed by area');
    assert.equal(zoomX * dims.width / width, dims.zoomX, 'zoom factor X gets updated to represent the shrink');
    assert.equal(zoomY * dims.height / height, dims.zoomY, 'zoom factor Y gets updated to represent the shrink');
  });

  QUnit.test('_limitCacheSize does cap up if necessary to maxCacheSideLimit', function(assert) {
    fabric.perfLimitSizeTotal = 100000000;
    fabric.maxCacheSideLimit = 4096;
    fabric.minCacheSideLimit = 256;
    var object = new fabric.Object({ width: 8192, height: 8192, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    assert.equal(dims, limitedDims, 'object is mutated');
    assert.equal(dims.width, fabric.maxCacheSideLimit, 'width is capped to max allowed by fabric');
    assert.equal(dims.height, fabric.maxCacheSideLimit, 'height is capped to max allowed by fabric');
    assert.equal(dims.zoomX, zoomX * 4096 / 8194, 'zoom factor X gets updated to represent the shrink');
    assert.equal(dims.zoomY, zoomY * 4096 / 8194, 'zoom factor Y gets updated to represent the shrink');
  });

  QUnit.test('_limitCacheSize does cap up if necessary to maxCacheSideLimit, different AR', function(assert) {
    fabric.perfLimitSizeTotal = 100000000;
    fabric.maxCacheSideLimit = 4096;
    fabric.minCacheSideLimit = 256;
    var object = new fabric.Object({ width: 16384, height: 8192, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var width = dims.width;
    var height = dims.height;
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    assert.equal(dims, limitedDims, 'object is mutated');
    assert.equal(dims.width, fabric.maxCacheSideLimit, 'width is capped to max allowed by fabric');
    assert.equal(dims.height, fabric.maxCacheSideLimit, 'height is capped to max allowed by fabric');
    assert.equal(dims.zoomX, zoomX * fabric.maxCacheSideLimit / width, 'zoom factor X gets updated to represent the shrink');
    assert.equal(dims.zoomY, zoomY * fabric.maxCacheSideLimit / height, 'zoom factor Y gets updated to represent the shrink');
  });

  QUnit.test('_setShadow', function(assert) {
    var el = fabric.document.createElement('canvas');
    el.width = 600; el.height = 600;
    var canvas = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.StaticCanvas(el);
    var context = canvas.contextContainer;
    var object = new fabric.Object({ scaleX: 1, scaleY: 1});
    var group = new fabric.Group();
    group.scaleX = 2;
    group.scaleY = 2;
    object.setShadow({
      color: 'red',
      blur: 10,
      offsetX: 5,
      offsetY: 15
    });
    object._setShadow(context);
    assert.equal(context.shadowOffsetX, object.shadow.offsetX);
    assert.equal(context.shadowOffsetY, object.shadow.offsetY);
    assert.equal(context.shadowBlur, object.shadow.blur);
    object.scaleX = 2;
    object.scaleY = 3;
    object._setShadow(context);
    assert.equal(context.shadowOffsetX, object.shadow.offsetX * object.scaleX);
    assert.equal(context.shadowOffsetY, object.shadow.offsetY * object.scaleY);
    assert.equal(context.shadowBlur, object.shadow.blur * (object.scaleX + object.scaleY) / 2);
    object.group = group;
    object._setShadow(context);
    assert.equal(context.shadowOffsetX, object.shadow.offsetX * object.scaleX * group.scaleX);
    assert.equal(context.shadowOffsetY, object.shadow.offsetY * object.scaleY * group.scaleY);
    assert.equal(context.shadowBlur, object.shadow.blur * (object.scaleX * group.scaleX + object.scaleY * group.scaleY) / 2);
  });

  QUnit.test('willDrawShadow', function(assert) {
    var object = new fabric.Object({ shadow: { offsetX: 0, offsetY: 0 }});
    assert.equal(object.willDrawShadow(), false, 'object will not drawShadow');
    object.shadow.offsetX = 1;
    assert.equal(object.willDrawShadow(), true, 'object will drawShadow');
  });
})();
