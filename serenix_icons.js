/* 
 * The MIT License
 *
 * Copyright 2021 Marc KAMGA Olivier <kamga_marco@yahoo.com;mkamga.olivier@gmail.com>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */



var SVG = (function() { 
    
    




function ext(o, props) {
    for (var name in props) {
        if (hasOwnProp(props, name)) {
            o[name]= props[name];
        }
    }
    return o;
}

var svgRe = /^\s*(?:<\?xml[^>]*>\s*)?(?:<!doctype svg[^>]*\s*(?:\[?(?:\s*<![^>]*>\s*)*\]?)*[^>]*>\s*)?(?:<svg[^>]*>[^]*<\/svg>|<svg[^/>]*\/\s*>)\s*$/i;

function isBinary(buffer) {
    var isBuffer = Buffer.isBuffer(buffer);
    for(var i = 0; i < 24; i++) {
        var code = isBuffer ? buffer[i] : buffer.charCodeAt(i);
        if(code === 65533 || code <= 8) {
            return true;
        }
    }
    return false;
}
var _ = {
    detect : function(input) {
        if(input === undefined||input === null)
            return false;        
        return Boolean(input=input.toString()
                    .replace(/\s*<!Entity\s+\S*\s*(?:"|')[^"]+(?:"|')\s*>/img, '')
                    .replace(/<!--([\s\S]*?)-->/g, '')) 
                && !isBinary(input) 
                && svgRe.test(input);
    },
    /**
     * Returns CSS rules for a given SVG document
     * @static
     * @function
     * @param {SVGDocument} doc SVG document to parse
     * @param {Function} [createObj]
     * @return {Object} CSS rules of this document
     */
    getCSSRules: function(doc, createObj) {
        var styles = doc.getElementsByTagName('style'), i, len,
            allRules = { }, rules, content;
        createObj = typeof (createObj||this.createObject||this.createObj) === 'function' ? createObj||this.createObject||this.createObj : function(obj) {
            return Object.prototype.toString.call(obj) === '[object Object]' ? obj : {};
        };
      // very crude parsing of style contents
      for (i = 0, len = styles.length; i < len; i++) {
        content = styles[i].textContent;
        // remove comments
        content = content.replace(/\/\*[\s\S]*?\*\//g, '');
        if (content.trim() === '') {
          continue;
        }
        rules = content.match(/[^{]*\{[\s\S]*?\}/g);
        rules = rules.map(function(rule) { return rule.trim(); });
        // eslint-disable-next-line no-loop-func
        rules.forEach(function(rule) {
          var match = rule.match(/([\s\S]*?)\s*\{([^}]*)\}/),
              ruleObj = { }, declaration = match[2].trim(),
              propertyValuePairs = declaration.replace(/;$/, '').split(/\s*;\s*/);
          for (i = 0, len = propertyValuePairs.length; i < len; i++) {
            var pair = propertyValuePairs[i].split(/\s*:\s*/),
                property = pair[0],
                value = pair[1];
            ruleObj[property] = value;
          }
          rule = match[1];
          rule.split(',').forEach(function(_rule) {
            _rule = _rule.replace(/^svg/i, '').trim();
            if (_rule === '') {
              return;
            }
            if (allRules[_rule]) {
              ext(allRules[_rule], ruleObj);
            } else {
              allRules[_rule] = createObj(ruleObj);
            }
          });
        });
      }
      return allRules;
    }
};

function blobFromBase64(dataURL){
    var BASE64_MARKER = ";base64,", 
            parts = dataURL.split(BASE64_MARKER), 
            raw = window.atob(parts[1]), 
            rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: "image/png" });
}

function toBase64Png(svg){
    return new Promise(function(res, rej){
      var image = new Image();
      var xml = window.btoa(unescape(encodeURIComponent(svg)));
      image.src = "data:image/svg+xml;base64," + xml;
      var url = "";
      image.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = 280;
        canvas.height = 280;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        url = canvas.toDataURL("image/" + "png");
        res(url);
      };
    });
}

function getImageMimeType(type) {
    var t = type.toLowerCase().replace(/jpg/g, 'jpeg');
    var i = t.indexOf("/");
    if (i >= 0) {
        if (t.substring(0, i) !== 'image') {
            throw new Error("Incorrect image t : ");
        }
        return t;
    }    
    return 'image/' + t;
}

_.getImageMimeType = getImageMimeType;
/**
 * 
 * @param {String} svg
 * @param {String} type
 * @returns {Promise}
 */
function toBase64Img(svg, type){
    if (!type) {
        type = "image/" + "png";
    } else {
        type = getImageMimeType(type);
    }
    return new Promise(function(res, rej){
      var image = new Image();
      var xml = window.btoa(unescape(encodeURIComponent(svg)));
      image.src = "data:image/svg+xml;base64," + xml;
      var url = "";
      image.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = 280;
        canvas.height = 280;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        url = canvas.toDataURL(type);
        res(url);
      };
    });
}

_.toBase64Img = toBase64Img;

function createBlobURL(image) {
    return URL.createObjectURL(image);
};

_.createBlobURL = createBlobURL;

_.toBase64Png = toBase64Png;




function toUrl(SVGString, type) {
    var x, 
        fn = "(function() {var base64 = await (toBase64Img(SVGString, type));return URL.createObjectURL(blobFromBase64(base64));})()";
    try {
        //I use eval insted of direct call to make this function 'compilable' in every IDE
        x = eval(fn);
        return x;
    } catch (ex) {
        /*
         * To launch aynchonously the the function in es5, the following librairies are required:
         * - ../../../../../libs/xregexp-all.js
         * - serenix_object.js
         * - serenix_parser_statements.js
         * - serenix_statement_parser.js
         * - serenix_promise.js
         * - serenix_evaluator.js
         * - serenix_js_generator.js
         */
        return async(function toUrl(SVGString, type) {
            var base64 = await (toBase64Img(SVGString, type));
            return URL.createObjectURL(blobFromBase64(base64));
        }, SVGString, type);
    }
}

function syncUrl(SVGString, type) {
    return createBlobURL(blobFromBase64(toBase64Img(SVGString, type)));
}
/**
 * 
 * @function
 * @param {type} SVGString
 * @param {type} type
 * @returns {Promise}
 */
_.toUrl = toUrl;

_.syncUrl = syncUrl;
return _;
})();

if (typeof SVGICons === 'undefined') {
    function SVGICons() {
        
    }
}

(function() {

var props = {
    'icon-reset': '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M338.7 174.6L135.3 378.3c-12.5 12.5-12.5 32.8 0 45.3l180.1 180.3c6.2 6.2 14.4 9.4 22.6 9.4 8.2 0 16.4-3.1 22.6-9.4l22.6-22.6L203 400.9l158.2-158.4c12.5-12.5 12.5-32.8 0-45.3l-22.5-22.6z"  /><path d="M654.5 369.4h-496c-17.7 0-32 14.3-32 32s14.3 32 32 32h496c97.2 0 176 78.8 176 176s-78.8 176-176 176h-496c-17.7 0-32 14.3-32 32s14.3 32 32 32h496c132.5 0 240-107.5 240-240s-107.5-240-240-240z"  /></svg>',
    'select-all' : '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M853.333333 768V170.666667H256a85.333333 85.333333 0 0 1 85.333333-85.333334h512a85.333333 85.333333 0 0 1 85.333334 85.333334v512a85.333333 85.333333 0 0 1-85.333334 85.333333zM170.666667 256h512a85.333333 85.333333 0 0 1 85.333333 85.333333v512a85.333333 85.333333 0 0 1-85.333333 85.333334H170.666667a85.333333 85.333333 0 0 1-85.333334-85.333334V341.333333a85.333333 85.333333 0 0 1 85.333334-85.333333z m0 85.333333v512h512V341.333333H170.666667z m395.093333 99.285334l63.146667 57.429333-221.44 243.328-158.890667-146.688 57.898667-62.72 95.744 88.405333 163.541333-179.754666z"  /></svg>',
    '24x24' : {
        checkbox : {
            unchecked : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24zm-6 16.538l-4.592-4.548 4.546-4.587-1.416-1.403-4.545 4.589-4.588-4.543-1.405 1.405 4.593 4.552-4.547 4.592 1.405 1.405 4.555-4.596 4.591 4.55 1.403-1.416z"/></svg>',
            checked : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24zm-5.541 8.409l-1.422-1.409-7.021 7.183-3.08-2.937-1.395 1.435 4.5 4.319 8.418-8.591z"/></svg>'
        },
        'checkbox-unchecked' : '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M896 0l-768 0c-70.41024 0-128 57.61024-128 128l0 768c0 70.41024 57.61024 128 128 128l768 0c70.41024 0 128-57.61024 128-128l0-768c0-70.41024-57.61024-128-128-128zM896 896l-768 0 0-768 768 0 0 768z"  /></svg>',
        tristates_checkbox : {
            indeterminate : '<svg class="checkbox"viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
                + '  <g class="canvas">'
                + '    <path class="outer-rect" id="outer-rect-path" fill="#000000"  d="M10.938 12.5C10.938 11.637 11.637 10.938 12.5 10.938L87.5 10.938C88.363 10.938 89.063 11.637 89.063 12.5L89.063 87.5C89.063 88.363 88.363 89.063 87.5 89.063L12.5 89.063C11.637 89.063 10.938 88.363 10.938 87.5L10.938 12.5z"/>'
                + '    <path class="inner-rect" id="inner-rect-path" fill="#ffffff" d="M14.844 14.844L85.156 14.844L85.156 85.156L14.844 85.156L14.844 14.844z"/>'
                + '    <path class="tick" id="tick-path" fill="#000000"  d="M39.245 66.921C39.139 66.846 39.039 66.762 38.945 66.667L25.687 53.409C24.771 52.494 24.771 51.01 25.687 50.095L29.001 46.78C29.916 45.865 31.4 45.865 32.316 46.78L42.354 56.819L67.236 31.937C68.152 31.021 69.636 31.021 70.551 31.937L73.866 35.251C74.78 36.166 74.78 37.65 73.866 38.566L44.034 68.397C43.119 69.312 41.635 69.312 40.72 68.397L39.245 66.921z"/>'
                + '    <path class="tristates" id="tristates-path" fill="#000000"  d="M28.125 47.656C28.125 46.362 29.174 45.313 30.469 45.313L68.75 45.313C70.045 45.313 71.094 46.362 71.094 47.656L71.094 52.344C71.094 53.638 70.045 54.688 68.75 54.688L30.469 54.688C29.174 54.688 28.125 53.638 28.125 52.344L28.125 47.656z"/>'
                + '  </g>'
                + '</svg>',
            checked : '<svg class="checkbox"viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
                + '  <g class="canvas">'
                + '    <path class="outer-rect" id="outer-rect-path" fill="#000000"  d="M10.938 12.5C10.938 11.637 11.637 10.938 12.5 10.938L87.5 10.938C88.363 10.938 89.063 11.637 89.063 12.5L89.063 87.5C89.063 88.363 88.363 89.063 87.5 89.063L12.5 89.063C11.637 89.063 10.938 88.363 10.938 87.5L10.938 12.5z"/>'
                + '    <path class="inner-rect" id="inner-rect-path" fill="#ffffff" d="M14.844 14.844L85.156 14.844L85.156 85.156L14.844 85.156L14.844 14.844z"/>'
                + '    <path class="tick" id="tick-path" fill="#000000"  d="M39.245 66.921C39.139 66.846 39.039 66.762 38.945 66.667L25.687 53.409C24.771 52.494 24.771 51.01 25.687 50.095L29.001 46.78C29.916 45.865 31.4 45.865 32.316 46.78L42.354 56.819L67.236 31.937C68.152 31.021 69.636 31.021 70.551 31.937L73.866 35.251C74.78 36.166 74.78 37.65 73.866 38.566L44.034 68.397C43.119 69.312 41.635 69.312 40.72 68.397L39.245 66.921z"/>'
                + '    <path class="tristates" id="tristates-path" fill="#000000"  d="M28.125 47.656C28.125 46.362 29.174 45.313 30.469 45.313L68.75 45.313C70.045 45.313 71.094 46.362 71.094 47.656L71.094 52.344C71.094 53.638 70.045 54.688 68.75 54.688L30.469 54.688C29.174 54.688 28.125 53.638 28.125 52.344L28.125 47.656z"/>'
                + '  </g>'
                + '</svg>',
            unchecked : '<svg class="checkbox"viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
                + '  <g class="canvas">'
                + '    <path class="outer-rect" id="outer-rect-path" fill="#000000"  d="M10.938 12.5C10.938 11.637 11.637 10.938 12.5 10.938L87.5 10.938C88.363 10.938 89.063 11.637 89.063 12.5L89.063 87.5C89.063 88.363 88.363 89.063 87.5 89.063L12.5 89.063C11.637 89.063 10.938 88.363 10.938 87.5L10.938 12.5z"/>'
                + '    <path class="inner-rect" id="inner-rect-path" fill="#ffffff" d="M14.844 14.844L85.156 14.844L85.156 85.156L14.844 85.156L14.844 14.844z"/>'
                + '    <path class="tick" id="tick-path" fill="#000000"  d="M39.245 66.921C39.139 66.846 39.039 66.762 38.945 66.667L25.687 53.409C24.771 52.494 24.771 51.01 25.687 50.095L29.001 46.78C29.916 45.865 31.4 45.865 32.316 46.78L42.354 56.819L67.236 31.937C68.152 31.021 69.636 31.021 70.551 31.937L73.866 35.251C74.78 36.166 74.78 37.65 73.866 38.566L44.034 68.397C43.119 69.312 41.635 69.312 40.72 68.397L39.245 66.921z"/>'
                + '    <path class="tristates" id="tristates-path" fill="#000000"  d="M28.125 47.656C28.125 46.362 29.174 45.313 30.469 45.313L68.75 45.313C70.045 45.313 71.094 46.362 71.094 47.656L71.094 52.344C71.094 53.638 70.045 54.688 68.75 54.688L30.469 54.688C29.174 54.688 28.125 53.638 28.125 52.344L28.125 47.656z"/>'
                + '  </g>'
                + '</svg'
        },
        square : {
            checked : '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M921.6 0H102.4C46.08 0 0 46.08 0 102.4v819.2C0 977.92 46.08 1024 102.4 1024h819.2c56.32 0 102.4-46.08 102.4-102.4V102.4C1024 46.08 977.92 0 921.6 0z m51.2 921.6c0 28.237-22.963 51.2-51.2 51.2H102.4c-28.237 0-51.2-22.963-51.2-51.2V102.4c0-28.237 22.963-51.2 51.2-51.2h819.2c28.237 0 51.2 22.963 51.2 51.2v819.2z"  /><path d="M854.746 281.395c-10.394-7.398-24.922-5.094-33.959 3.93l-399.91 399.923L203.558 467.93c-9.241-9.242-24.217-11.776-34.713-4.007-12.826 9.498-13.811 27.891-2.957 38.746l236.877 236.877c9.958 9.958 26.253 9.958 36.198 0l419.123-419.124c10.983-10.956 9.87-29.619-3.34-39.027z"  /></svg>'
        },
        rounded : {
            checked : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.041 17l-4.5-4.319 1.395-1.435 3.08 2.937 7.021-7.183 1.422 1.409-8.418 8.591zm-5.041-15c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-14c0-1.654-1.346-3-3-3h-14zm19 3v14c0 2.761-2.238 5-5 5h-14c-2.762 0-5-2.239-5-5v-14c0-2.761 2.238-5 5-5h14c2.762 0 5 2.239 5 5z"/></svg>',
            unchecked: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 2c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-14c0-1.654-1.346-3-3-3h-14zm19 3v14c0 2.761-2.238 5-5 5h-14c-2.762 0-5-2.239-5-5v-14c0-2.761 2.238-5 5-5h14c2.762 0 5 2.239 5 5z"/></svg>'
            
        },
        double_square_checkbox : {
            checked: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24zm-6 6h-12v12h12v-12z"/></svg>'
        },
        double_circle_checkbox: {
            checked: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 6c-3.313 0-6 2.687-6 6s2.687 6 6 6c3.314 0 6-2.687 6-6s-2.686-6-6-6z"/></svg>'
        },
        rounded_unchecked: '<svg class="svg-icon" style="width: 1.0712890625em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1097 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M865.426286 0h-614.4c-112.64 0-204.8 92.16-204.8 204.8v614.4c0 112.64 92.16 204.8 204.8 204.8h614.4c112.64 0 204.8-92.16 204.8-204.8V204.8c0-112.64-92.16-204.8-204.8-204.8m0 54.857143c82.651429 0 149.942857 67.291429 149.942857 149.942857v614.4c0 82.651429-67.291429 149.942857-149.942857 149.942857h-614.4c-82.651429 0-149.942857-67.291429-149.942857-149.942857V204.8c0-82.651429 67.291429-149.942857 149.942857-149.942857h614.4"  /></svg>',
        fluent_checkbox : {
            unchecked : '<?xml version="1.0" encoding="UTF-8"?>'
                + '<svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve">'
                + '	<!-- Uploaded to SVGRepo https://www.svgrepo.com -->'
                + '	<title>ic_fluent_checkbox_unchecked_24_filled</title>'
                + '	<desc>Created with Sketch.</desc>'
                + '	<g id="ðŸ”-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'
                + '		<g id="ic_fluent_checkbox_unchecked_24_filled" fill="#212121" fill-rule="nonzero">'
                + '			<path d="M6,3 L18,3 C19.6568542,3 21,4.34314575 21,6 L21,18 C21,19.6568542 19.6568542,21 18,21 L6,21 C4.34314575,21 3,19.6568542 3,18 L3,6 C3,4.34314575 4.34314575,3 6,3 Z M6,5 C5.44771525,5 5,5.44771525 5,6 L5,18 C5,18.5522847 5.44771525,19 6,19 L18,19 C18.5522847,19 19,18.5522847 19,18 L19,6 C19,5.44771525 18.5522847,5 18,5 L6,5 Z" id="ðŸŽ¨Color"></path>'
                + '		</g>'
                + '	</g>'
                + '</svg>',
            checked : '<?xml version="1.0" encoding="UTF-8"?>'
                + '<svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve">'
                + '	<!-- Uploaded to SVGRepo https://www.svgrepo.com -->'
                + '	<title>ic_fluent_checkbox_checked_24_regular</title>'
                + '	<desc>Created with Sketch.</desc>'
                + '	<g id="ðŸ”-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'
                + '		<g id="ic_fluent_checkbox_checked_24_regular" fill="#212121" fill-rule="nonzero">'
                + '			<path d="M18.25,3 C19.7687831,3 21,4.23121694 21,5.75 L21,18.25 C21,19.7687831 19.7687831,21 18.25,21 L5.75,21 C4.23121694,21 3,19.7687831 3,18.25 L3,5.75 C3,4.23121694 4.23121694,3 5.75,3 L18.25,3 Z M18.25,4.5 L5.75,4.5 C5.05964406,4.5 4.5,5.05964406 4.5,5.75 L4.5,18.25 C4.5,18.9403559 5.05964406,19.5 5.75,19.5 L18.25,19.5 C18.9403559,19.5 19.5,18.9403559 19.5,18.25 L19.5,5.75 C19.5,5.05964406 18.9403559,4.5 18.25,4.5 Z M10,14.4393398 L16.4696699,7.96966991 C16.7625631,7.6767767 17.2374369,7.6767767 17.5303301,7.96966991 C17.7965966,8.23593648 17.8208027,8.65260016 17.6029482,8.94621165 L17.5303301,9.03033009 L10.5303301,16.0303301 C10.2640635,16.2965966 9.84739984,16.3208027 9.55378835,16.1029482 L9.46966991,16.0303301 L6.46966991,13.0303301 C6.1767767,12.7374369 6.1767767,12.2625631 6.46966991,11.9696699 C6.73593648,11.7034034 7.15260016,11.6791973 7.44621165,11.8970518 L7.53033009,11.9696699 L10,14.4393398 L16.4696699,7.96966991 L10,14.4393398 Z" id="ðŸŽ¨Color"></path>'
                + '		</g>'
                + '	</g>'
                + '</svg>'
        },
        getCheck:function(color) {
            if (!color) {
                color = "#000000";
            }
            return '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
                //+ '<!-- Generator: serenix_icons.js 1.0 - http://www.serenix-ws.com/svg -->'
                + '<title>check</title>'
                + '<desc>Created with serenix_icons.js.</desc>'
                + '<g id="web-app" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'
                + '<g id="check" fill="'+ color + '">'
                + '<polygon id="Shape" points="6 10 4 12 10 18 20 8 18 6 10 14"></polygon>'
                + '</g>'
                + '</g>'
                + '</svg>';
        },
        /**
         * 
         * @param {type} color
         * @returns {String}
         */
        getCheckCircle: function(color) {
            if (!color) {
                color = "#000000";
            }
            return '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve">'
                //+ '<!-- Generator: serenix_icons.js 1.0 - http://www.serenix-ws.com/svg -->'
                + '<title>check-circle</title>'
                + '<desc>Created with serenix_icons.js.</desc>'
                + '<g id="web-app" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'
                + '<g id="check-circle" fill="'+ color + '" fill-rule="nonzero">'
                + '<path d="M12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 Z M8,10 L6,12 L11,17 L18,10 L16,8 L11,13 L8,10 Z" id="Shape"></path>'
                + '</g>'
                + '</g>'
                + '</svg>';
        },
        /**
         * Returns the svg string for outline circle with check 24x24 image 
         * @param {type} color
         * @returns {String}
         */
        getCheckOutlineCircle: function(color) {
            if (!color) {
                color = "#000000";
            }
            return 	'<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
                //+ '<!-- Generator: serenix_icons.js 1.0 - http://www.serenix-ws.com/svg -->'
                + '<title>check-circle-o</title>'
                + '<desc>Created with serenix_icons.js.</desc>'
                + '<g id="web-app" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'
                + '<g id="check-circle-o" fill="'+ color + '" fill-rule="nonzero">'
                + '<path d="M12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.418278,4 12,4 C7.581722,4 4,7.581722 4,12 C4,16.418278 7.581722,20 12,20 Z M12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 Z M8,10 L6,12 L11,17 L18,10 L16,8 L11,13 L8,10 Z" id="Shape"></path>'
                + '</g>'
                + '</g>'
                + '</svg>';
        },
        getCheckVerified : function(color) {
            if (!color) {
                color = "#000000";
            }
            return '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
                //+ '<!-- Generator: serenix_icons.js 1.0 - http://www.serenix-ws.com/svg -->'
                + '<title>check-verified</title>'
                + '<desc>Created with serenix_icons.js.</desc>'
                + '<g id="web-app" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'
                + '<g id="check-verified" fill="'+ color + '">'
                + '<path d="M4.25203497,14 L4,14 C2.8954305,14 2,13.1045695 2,12 C2,10.8954305 2.8954305,10 4,10 L4.25203497,10 C4.44096432,9.26595802 4.73145639,8.57268879 5.10763818,7.9360653 L4.92893219,7.75735931 C4.1478836,6.97631073 4.1478836,5.70998077 4.92893219,4.92893219 C5.70998077,4.1478836 6.97631073,4.1478836 7.75735931,4.92893219 L7.9360653,5.10763818 C8.57268879,4.73145639 9.26595802,4.44096432 10,4.25203497 L10,4 C10,2.8954305 10.8954305,2 12,2 C13.1045695,2 14,2.8954305 14,4 L14,4.25203497 C14.734042,4.44096432 15.4273112,4.73145639 16.0639347,5.10763818 L16.2426407,4.92893219 C17.0236893,4.1478836 18.2900192,4.1478836 19.0710678,4.92893219 C19.8521164,5.70998077 19.8521164,6.97631073 19.0710678,7.75735931 L18.8923618,7.9360653 C19.2685436,8.57268879 19.5590357,9.26595802 19.747965,10 L20,10 C21.1045695,10 22,10.8954305 22,12 C22,13.1045695 21.1045695,14 20,14 L19.747965,14 C19.5590357,14.734042 19.2685436,15.4273112 18.8923618,16.0639347 L19.0710678,16.2426407 C19.8521164,17.0236893 19.8521164,18.2900192 19.0710678,19.0710678 C18.2900192,19.8521164 17.0236893,19.8521164 16.2426407,19.0710678 L16.0639347,18.8923618 C15.4273112,19.2685436 14.734042,19.5590357 14,19.747965 L14,20 C14,21.1045695 13.1045695,22 12,22 C10.8954305,22 10,21.1045695 10,20 L10,19.747965 C9.26595802,19.5590357 8.57268879,19.2685436 7.9360653,18.8923618 L7.75735931,19.0710678 C6.97631073,19.8521164 5.70998077,19.8521164 4.92893219,19.0710678 C4.1478836,18.2900192 4.1478836,17.0236893 4.92893219,16.2426407 L5.10763818,16.0639347 C4.73145639,15.4273112 4.44096432,14.734042 4.25203497,14 Z M9,10 L7,12 L11,16 L17,10 L15,8 L11,12 L9,10 Z" id="Shape"></path>'
                + '</g>'
                + '</g>'
                + '</svg>';
        },
        getClock : function(color) {
            if (!color) {
                color = "#000000";
            }
            return '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
                //+ '<!-- Generator: serenix_icons.js 1.0 - http://www.serenix-ws.com/svg -->'
                + '<title>clock</title>'
                + '<desc>Created with serenix_icons.js.</desc>'
                + '<g id="web-app" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'
                + '<g id="clock" fill="'+ color + '">'
                + '<path d="M12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 Z M20,12 C20,7.581722 16.418278,4 12,4 C7.581722,4 4,7.581722 4,12 C4,16.418278 7.581722,20 12,20 C16.418278,20 20,16.418278 20,12 Z M16,11 C16.5522847,11 17,11.4477153 17,12 C17,12.5522847 16.5522847,13 16,13 C14,13 13,13 13,13 C11.8999996,13 11,12.1000004 11,11 C11,11 11,9.66666667 11,7 C11,6.44771525 11.4477153,6 12,6 C12.5522847,6 13,6.44771525 13,7 L13,11 L16,11 Z" id="Shape"></path>'
                + '</g>'
                + '</g>'
                + '</svg>';
        },
        getClose : function(color) {
            if (!color) {
                color = "#000000";
            }
            return '<svg ' 
                    //+ 'width="24px" height="24px" ' 
                    + 'viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve">'
                //+ '<!-- Generator: serenix_icons.js 1.0 - http://www.serenix-ws.com/svg -->'
                + '<title>close</title>'
                + '<desc>Created with serenix_icons.js.</desc>'
                + '<g id="web-app" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'
                + '<g id="close" fill="'+ color + '">'
                + '<polygon id="Shape" points="10.6568542 12.0710678 5 6.41421356 6.41421356 5 12.0710678 10.6568542 17.7279221 5 19.1421356 6.41421356 13.4852814 12.0710678 19.1421356 17.7279221 17.7279221 19.1421356 12.0710678 13.4852814 6.41421356 19.1421356 5 17.7279221"></polygon>'
                + '</g>'
                + '</g>'
                + '</svg>';
        },
        getCloud : function(color) {
            if (!color) {
                color = "#000000";
            }
            return '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
            //+ '<!-- Generator: serenix_icons.js 1.0 - http://www.serenix-ws.com/svg -->'
            + '<title>cloud</title>'
            + '<desc>Created with serenix_icons.js.</desc>'
            + '<g id="web-app" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'
            + '<g id="cloud" fill="'+ color + '" fill-rule="nonzero">'
            + '<path d="M12.7130554,9.71959095 L11.6402844,11.2615172 L10.0341815,10.2874495 C9.7251575,10.1000329 9.37236458,10 9,10 C7.8954305,10 7,10.8954305 7,12 L7,14 L5,14 C4.44771525,14 4,14.4477153 4,15 C4,15.5522847 4.44771525,16 5,16 L16,16 C18.209139,16 20,14.209139 20,12 C20,9.790861 18.209139,8 16,8 C14.6726138,8 13.4578735,8.64904143 12.7130554,9.71959095 Z M16,6 C19.3137085,6 22,8.6862915 22,12 C22,15.3137085 19.3137085,18 16,18 L5,18 C3.34314575,18 2,16.6568542 2,15 C2,13.3431458 3.34314575,12 5,12 C5,9.790861 6.790861,8 9,8 C9.75820433,8 10.4671377,8.21095427 11.0713082,8.57737108 C12.1550988,7.01960616 13.9584785,6 16,6 Z" id="Shape"></path>'
            + '</g>'
            + '</g>'
            + '</svg>';
        },
        /**
         * 
         * @param {String} color
         * @returns {String}
         */
        getWallet : function(color) {
            if (!color) {
                color = "#000000";
            }
            return '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
                //+ '<!-- Generator: serenix_icons.js 1.0 - http://www.serenix-ws.com/svg -->'
                + '<title>wallet</title>'
                + '<desc>Created with serenix_icons.js.</desc>'
                + '<g id="e-commerce" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'
                + '<g id="wallet" fill="'+ color + '">'
                + '<path d="M20,9 C21.1000004,9 22,9.89999962 22,11 C22,11 22,13 22,13 C22,14.1000004 21.1000004,15 20,15 L20,18 C20,19.1045695 19.1045695,20 18,20 L4,20 C2.8954305,20 2,19.1045695 2,18 L2,6 C2,4.8954305 2.8954305,4 4,4 L18,4 C19.1045695,4 20,4.8954305 20,6 L20,9 Z M18,9 L18,6 L4,6 L4,18 L18,18 L18,15 L16,15 C14.8999996,15 14,13.8999996 14,13 C14,13 14,11.0324063 14,11.0324063 C14,9.89999962 14.8999996,9 16,9 L18,9 Z M16,13 L18,13 L18,11 L16,11 L16,13 Z" id="Shape"></path>'
                + '</g>'
                + '</g>'
                + '</svg>';
        },
        'x-circle-fill': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm8.036-4.024a.75.75 0 00-1.06 1.06L10.939 12l-2.963 2.963a.75.75 0 101.06 1.06L12 13.06l2.963 2.964a.75.75 0 001.061-1.06L13.061 12l2.963-2.964a.75.75 0 10-1.06-1.06L12 10.939 9.036 7.976z"/></svg>',
        'x': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M5.72 5.72a.75.75 0 011.06 0L12 10.94l5.22-5.22a.75.75 0 111.06 1.06L13.06 12l5.22 5.22a.75.75 0 11-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 01-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 010-1.06z"/></svg>',
        'x-circle' : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9.036 7.976a.75.75 0 00-1.06 1.06L10.939 12l-2.963 2.963a.75.75 0 101.06 1.06L12 13.06l2.963 2.964a.75.75 0 001.061-1.06L13.061 12l2.963-2.964a.75.75 0 10-1.06-1.06L12 10.939 9.036 7.976z"/><path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z"/></svg>'
    },
    'x-circle24-fill': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm8.036-4.024a.75.75 0 00-1.06 1.06L10.939 12l-2.963 2.963a.75.75 0 101.06 1.06L12 13.06l2.963 2.964a.75.75 0 001.061-1.06L13.061 12l2.963-2.964a.75.75 0 10-1.06-1.06L12 10.939 9.036 7.976z"/></svg>',
    'x-circle24' : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9.036 7.976a.75.75 0 00-1.06 1.06L10.939 12l-2.963 2.963a.75.75 0 101.06 1.06L12 13.06l2.963 2.964a.75.75 0 001.061-1.06L13.061 12l2.963-2.964a.75.75 0 10-1.06-1.06L12 10.939 9.036 7.976z"/><path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z"/></svg>',
    '512x512' : {
        'x-circle' : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
                    + '  <polygon fill="var(--ci-primary-color, currentColor)" points="348.071 141.302 260.308 229.065 172.545 141.302 149.917 163.929 237.681 251.692 149.917 339.456 172.545 362.083 260.308 274.32 348.071 362.083 370.699 339.456 282.935 251.692 370.699 163.929 348.071 141.302" class="ci-primary"/>'
                    + '  <path fill="var(--ci-primary-color, currentColor)" d="M425.706,86.294A240,240,0,0,0,86.294,425.706,240,240,0,0,0,425.706,86.294ZM256,464C141.309,464,48,370.691,48,256S141.309,48,256,48s208,93.309,208,208S370.691,464,256,464Z" class="ci-primary"/>'
                    + '</svg>'
    },
    arrows: {
        '32x32' : {
            left: '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path id="small-left" d="M21.333,7.334L10.666,16L21.333,24.667L21.333,7.334Z" style="fill-rule:nonzero;"/> </svg>',
            right: '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path id="small-right" d="M10.667,24.666L21.334,16L10.667,7.333L10.667,24.666Z" style="fill-rule:nonzero;"/> </svg>',
            up: '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path id="small-up" d="M7.334,21.333L16,10.666L24.667,21.333L7.334,21.333Z" style="fill-rule:nonzero;"/> </svg>',
            down: '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">i<path id="small-down" d="M7.334,10.667L16,21.334L24.667,10.667L7.334,10.667Z" style="fill-rule:nonzero;"/> </svg>'
        },
        g: {
            left : '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M459.961011 716.805419v114.808727c0 30.281269-35.241148 46.921969-58.628077 27.662251-129.415625-106.530824-258.843893-213.059842-388.273967-319.603309-17.410149-14.339576-17.410149-41.008407 0-55.349789A4672009.166564 4672009.166564 0 0 0 401.332934 164.721796c23.38693-19.248881 58.628078-2.606375 58.628077 27.673089v114.810534h528.205401c19.790747 0 35.8372 16.046454 35.8372 35.8372v337.925599c0 19.790747-16.046454 35.8372-35.8372 35.837201H459.961011zM383.156947 384.000452v-104.836591L100.290336 512 383.156947 744.848782v-104.849234h564.040795V384.000452H383.156947z" fill="#231815" /></svg>',
            right: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M640.844859 640.001355H76.804064V384.000452h564.040795v-104.836591l282.870224 232.836139L640.844859 744.848782v-104.847427z m-76.804064-332.79413H35.835394C16.04826 307.207225 0 323.253679 0 343.044425v337.9256c0 19.790747 16.04826 35.8372 35.835394 35.8372h528.205401v114.808728c0 30.281269 35.241148 46.921969 58.61724 27.662251 129.428268-106.530824 258.858342-213.059842 388.273967-319.603309 17.420987-14.339576 17.420987-41.008407 0-55.34979-129.415625-106.529018-258.845699-213.058035-388.273967-319.601502-23.374286-19.248881-58.61724-2.606375-58.61724 27.673088v114.810534z" fill="#231815" /></svg>'
        }
    },
    
    more: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M487.104 487.04H0V0h487.04v487.04zM107.072 379.968h272.896V107.072H107.072v272.896zM487.104 1020.608H0v-487.04h487.04v487.04z m-380.032-107.136h272.896V640.64H107.072v272.832z" fill="#93A2F9" /><path d="M786.88 17.28l228.48 234.24-234.176 228.416-228.48-234.24z" fill="#6288F4" /><path d="M1018.944 1024H531.84V536.96h487.104V1024z m-380.096-107.072h273.024v-272.96H638.848v272.96z" fill="#93A2F9" /></svg>',
    more2: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M17.655172 70.62069m70.62069 0l282.482759 0q70.62069 0 70.620689 70.620689l0 282.482759q0 70.62069-70.620689 70.62069l-282.482759 0q-70.62069 0-70.62069-70.62069l0-282.482759q0-70.62069 70.62069-70.620689Z" fill="#4A90E2" /><path d="M17.655172 600.09931m70.62069 0l282.482759 0q70.62069 0 70.620689 70.62069l0 282.482759q0 70.62069-70.620689 70.620689l-282.482759 0q-70.62069 0-70.62069-70.620689l0-282.482759q0-70.62069 70.62069-70.62069Z" fill="#4A90E2" /><path d="M547.310345 600.09931m70.620689 0l282.482759 0q70.62069 0 70.62069 70.62069l0 282.482759q0 70.62069-70.62069 70.620689l-282.482759 0q-70.62069 0-70.620689-70.620689l0-282.482759q0-70.62069 70.620689-70.62069Z" fill="#4A90E2" /><path d="M751.333517-0.006165m49.936369 49.936369l174.77729 174.77729q49.936369 49.936369 0 99.872737l-174.77729 174.77729q-49.936369 49.936369-99.872737 0l-174.77729-174.77729q-49.936369-49.936369 0-99.872737l174.77729-174.77729q49.936369-49.936369 99.872737 0Z" fill="#B0D5FF" /></svg>,',
    more3: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 42.666667c258.133333 0 469.333333 211.2 469.333333 469.333333s-211.2 469.333333-469.333333 469.333333S42.666667 770.133333 42.666667 512 253.866667 42.666667 512 42.666667z m0 853.333333c211.2 0 384-172.8 384-384S723.2 128 512 128 128 300.8 128 512s172.8 384 384 384z" fill="#2F3CF4" /><path d="M512 448c-36.266667 0-64 27.733333-64 64s27.733333 64 64 64 64-27.733333 64-64-27.733333-64-64-64M725.333333 448c-36.266667 0-64 27.733333-64 64s27.733333 64 64 64 64-27.733333 64-64-27.733333-64-64-64M298.666667 448c-36.266667 0-64 27.733333-64 64s27.733333 64 64 64 64-27.733333 64-64-27.733333-64-64-64" fill="#2F3CF4" /></svg>',
    more4: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M513.1 66.2c-246.9 0-447 200.1-447 447s200.1 447 447 447 447-200.1 447-447-200.1-447-447-447z m-32.2 692c0 21.2-17.4 38.6-38.6 38.6H262.6c-21.2 0-38.6-17.4-38.6-38.6V578.5c0-21.2 17.4-38.6 38.6-38.6h179.7c21.2 0 38.6 17.4 38.6 38.6v179.7z m0-319.1c0 21.2-17.4 38.6-38.6 38.6H262.6c-21.2 0-38.6-17.4-38.6-38.6V259.4c0-21.2 17.4-38.6 38.6-38.6h179.7c21.2 0 38.6 17.4 38.6 38.6v179.7zM802 758.2c0 21.2-17.4 38.6-38.6 38.6H583.7c-21.2 0-38.6-17.4-38.6-38.6V578.5c0-21.2 17.4-38.6 38.6-38.6h179.7c21.2 0 38.6 17.4 38.6 38.6v179.7z m0-319.1c0 21.2-17.4 38.6-38.6 38.6H583.7c-21.2 0-38.6-17.4-38.6-38.6V259.4c0-21.2 17.4-38.6 38.6-38.6h179.7c21.2 0 38.6 17.4 38.6 38.6v179.7z" fill="#29ABE2" /></svg>',
    setting: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 341.33c-94.1 0-170.67 76.56-170.67 170.67S417.9 682.67 512 682.67 682.67 606.1 682.67 512 606.1 341.33 512 341.33z m0 256c-47.06 0-85.33-38.27-85.33-85.33s38.27-85.33 85.33-85.33 85.33 38.27 85.33 85.33-38.27 85.33-85.33 85.33z" fill="#2F3CF4" /><path d="M942.4 587.83C913.77 573.1 896 544.04 896 512s17.77-61.1 46.4-75.83c17.96-9.25 26.96-29.83 21.58-49.29-21-76.06-61.71-146.46-117.73-203.56-14.15-14.44-36.44-16.98-53.48-6.04-27.06 17.35-61.06 18.19-88.77 2.17-27.85-16.06-44.12-46.1-42.48-78.35 1.04-20.23-12.29-38.4-31.9-43.48-76.42-19.83-158.83-19.83-235.25 0-19.6 5.08-32.94 23.25-31.9 43.48 1.65 32.25-14.62 62.29-42.48 78.35-27.69 16.02-61.69 15.19-88.77-2.17-17.06-10.94-39.35-8.38-53.48 6.04-55.98 57.06-96.69 127.46-117.73 203.54-5.38 19.48 3.62 40.06 21.58 49.31C110.23 450.9 128 479.96 128 512s-17.77 61.1-46.4 75.83c-17.96 9.25-26.96 29.83-21.58 49.31 21.04 76.08 61.75 146.48 117.73 203.54 14.15 14.42 36.44 16.96 53.48 6.04 27.08-17.33 61.08-18.17 88.77-2.17 27.85 16.06 44.12 46.1 42.48 78.35-1.04 20.23 12.29 38.4 31.9 43.48 38.21 9.92 77.77 14.94 117.62 14.94s79.42-5.02 117.62-14.94c19.6-5.08 32.94-23.25 31.9-43.48-1.65-32.25 14.62-62.29 42.48-78.35 27.71-16 61.71-15.17 88.77 2.17 17.04 10.92 39.31 8.35 53.48-6.04 56-57.1 96.71-127.48 117.73-203.56 5.37-19.45-3.63-40.04-21.58-49.29z m-69.96 55.52c-15.23 41.65-37.85 80.67-66.67 115.04-47.06-17.5-99.81-13.52-144.44 12.25-44.88 25.92-74.73 69.85-82.96 119.62-43.62 7.62-89.12 7.62-132.75 0-8.23-49.77-38.08-93.71-82.96-119.62-44.62-25.75-97.42-29.73-144.44-12.25-28.81-34.35-51.42-73.38-66.67-115.04 38.77-32 61.77-79.73 61.77-131.35s-23-99.35-61.77-131.35c15.25-41.67 37.85-80.69 66.67-115.04 47.02 17.48 99.79 13.48 144.44-12.25 44.88-25.92 74.73-69.85 82.96-119.62 43.62-7.63 89.12-7.63 132.75 0 8.23 49.77 38.08 93.71 82.96 119.62 44.62 25.73 97.4 29.75 144.44 12.25 28.83 34.38 51.44 73.4 66.67 115.02-38.77 32.02-61.77 79.75-61.77 131.38s23 99.34 61.77 131.34z" fill="#2F3CF4" /></svg>',
    message :  '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M938.66 85.33H85.33c-23.57 0-42.67 19.11-42.67 42.67v640c0 23.57 19.11 42.67 42.67 42.67h238.33l158.17 158.16c8.33 8.33 19.25 12.5 30.17 12.5s21.84-4.16 30.17-12.5l158.17-158.16h238.32c23.57 0 42.67-19.11 42.67-42.67V128c0-23.57-19.11-42.67-42.67-42.67z m-42.66 640H682.67c-11.32 0-22.17 4.5-30.17 12.5L512 878.33l-140.5-140.5c-8-8-18.86-12.5-30.17-12.5H128V170.67h768v554.66z" fill="#2F3CF4" /><path d="M298.67 384h426.66c23.57 0 42.68-19.1 42.68-42.67s-19.11-42.67-42.67-42.67H298.67c-23.57 0-42.67 19.1-42.67 42.67S275.1 384 298.67 384zM298.67 597.33h256c23.56 0 42.67-19.09 42.67-42.66S578.23 512 554.67 512h-256C275.1 512 256 531.09 256 554.66s19.11 42.67 42.67 42.67z" fill="#2F3CF4" /></svg>',
    collapse: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M213.333333 298.666667v469.333333h640V298.666667H213.333333z m0-85.333334h640a85.333333 85.333333 0 0 1 85.333334 85.333334v469.333333a85.333333 85.333333 0 0 1-85.333334 85.333333H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V298.666667a85.333333 85.333333 0 0 1 85.333333-85.333334z"  /><path d="M725.333333 298.666667v469.333333h128V298.666667h-128z m0-85.333334h128a85.333333 85.333333 0 0 1 85.333334 85.333334v469.333333a85.333333 85.333333 0 0 1-85.333334 85.333333h-128a85.333333 85.333333 0 0 1-85.333333-85.333333V298.666667a85.333333 85.333333 0 0 1 85.333333-85.333334z"  /></svg>',
    
    // icons from https://icomoon.io/app/#/select
    group: '<svg style="display:block-inline;width:1.5em;margin:4px;stroke-width: 0;stroke: currentColor;fill: currentColor;" viewBox="0 0 32 32" >      <path d="M16 0c-8.837 0-16 2.239-16 5v3l12 12v10c0 1.105 1.791 2 4 2s4-0.895 4-2v-10l12-12v-3c0-2.761-7.163-5-16-5zM2.95 4.338c0.748-0.427 1.799-0.832 3.040-1.171 2.748-0.752 6.303-1.167 10.011-1.167s7.262 0.414 10.011 1.167c1.241 0.34 2.292 0.745 3.040 1.171 0.494 0.281 0.76 0.519 0.884 0.662-0.124 0.142-0.391 0.38-0.884 0.662-0.748 0.427-1.8 0.832-3.040 1.171-2.748 0.752-6.303 1.167-10.011 1.167s-7.262-0.414-10.011-1.167c-1.24-0.34-2.292-0.745-3.040-1.171-0.494-0.282-0.76-0.519-0.884-0.662 0.124-0.142 0.391-0.38 0.884-0.662z"></path>      </svg>',
    graph: '<svg style="display:block-inline;width:1.5em;margin:4px;stroke-width: 0;stroke: currentColor;fill: currentColor;" viewBox="0 0 32 32" ><path d="M4 28h28v4h-32v-32h4zM9 26c-1.657 0-3-1.343-3-3s1.343-3 3-3c0.088 0 0.176 0.005 0.262 0.012l3.225-5.375c-0.307-0.471-0.487-1.033-0.487-1.638 0-1.657 1.343-3 3-3s3 1.343 3 3c0 0.604-0.179 1.167-0.487 1.638l3.225 5.375c0.086-0.007 0.174-0.012 0.262-0.012 0.067 0 0.133 0.003 0.198 0.007l5.324-9.316c-0.329-0.482-0.522-1.064-0.522-1.691 0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.657-1.343 3-3 3-0.067 0-0.133-0.003-0.198-0.007l-5.324 9.316c0.329 0.481 0.522 1.064 0.522 1.691 0 1.657-1.343 3-3 3s-3-1.343-3-3c0-0.604 0.179-1.167 0.487-1.638l-3.225-5.375c-0.086 0.007-0.174 0.012-0.262 0.012s-0.176-0.005-0.262-0.012l-3.225 5.375c0.307 0.471 0.487 1.033 0.487 1.637 0 1.657-1.343 3-3 3z"></path></svg>',
    columns: '<svg style="display:block-inline;width:1.5em;margin:4px;stroke-width: 0;stroke: currentColor;fill: currentColor;" viewBox="0 0 32 32" ><g transform="rotate(90 16 16)"><path d="M0 0h8v8h-8zM12 2h20v4h-20zM0 12h8v8h-8zM12 14h20v4h-20zM0 24h8v8h-8zM12 26h20v4h-20z"></path></g></svg>',
    iconExport: '<svg style="display:block-inline;width:1.5em;margin:4px;stroke-width: 0;stroke: currentColor;fill: currentColor;" viewBox="0 0 32 32" ><path d="M23 14l-8 8-8-8h5v-12h6v12zM15 22h-15v8h30v-8h-15zM28 26h-4v-2h4v2z"></path></svg>',
    print: '<svg style="display:block-inline;width:1.5em;margin:4px;stroke-width: 0;stroke: currentColor;fill: currentColor;" viewBox="0 0 32 32" >      <path d="M8 2h16v4h-16v-4z"></path>      <path d="M30 8h-28c-1.1 0-2 0.9-2 2v10c0 1.1 0.9 2 2 2h6v8h16v-8h6c1.1 0 2-0.9 2-2v-10c0-1.1-0.9-2-2-2zM4 14c-1.105 0-2-0.895-2-2s0.895-2 2-2 2 0.895 2 2-0.895 2-2 2zM22 28h-12v-10h12v10z"></path></svg>',
    //end icons from https://icomoon.io/app/#/select
    
    'tabler-download':'<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-download" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">'
   +  '  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>'
   +  '  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />'
   +  '  <polyline points="7 11 12 16 17 11" />'
   +  '  <line x1="12" y1="4" x2="12" y2="16" />'
   +  '</svg>',
    'tabler-columns':'<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-columns" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">'
   +  '  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>'
   +  '  <line x1="4" y1="6" x2="9.5" y2="6" />'
   +  '  <line x1="4" y1="10" x2="9.5" y2="10" />'
   +  '  <line x1="4" y1="14" x2="9.5" y2="14" />'
   +  '  <line x1="4" y1="18" x2="9.5" y2="18" />'
   +  '  <line x1="14.5" y1="6" x2="20" y2="6" />'
   +  '  <line x1="14.5" y1="10" x2="20" y2="10" />'
   +  '  <line x1="14.5" y1="14" x2="20" y2="14" />'
   +  '  <line x1="14.5" y1="18" x2="20" y2="18" />'
   +  '</svg>',
    'tabler-printer' : '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-printer" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">'
    + '  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>'
    + '  <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />'
    + '  <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />'
    + '  <rect x="7" y="13" width="10" height="8" rx="2" />'
    + '</svg>',
    
    'printer512x512-outline-black' : '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 128 128"><g><path d="M85.333,28.583a1.749,1.749,0,0,0,1.75-1.75V16.583a1.75,1.75,0,0,0-3.5,0v10.25A1.749,1.749,0,0,0,85.333,28.583Z"/><path d="M115.5,42.35h-9.94V18a1.751,1.751,0,0,0-1.75-1.75H93.08V6.5a1.75,1.75,0,0,0-1.75-1.75H36.67A1.75,1.75,0,0,0,34.92,6.5v9.75H24.19A1.751,1.751,0,0,0,22.44,18V42.35H12.5A7.759,7.759,0,0,0,4.75,50.1V97.81a7.759,7.759,0,0,0,7.75,7.75H34.917V121.5a1.75,1.75,0,0,0,1.75,1.75H91.333a1.75,1.75,0,0,0,1.75-1.75V105.56H115.5a7.759,7.759,0,0,0,7.75-7.75V50.1A7.759,7.759,0,0,0,115.5,42.35Zm-13.44-22.6v22.6H93.08V19.75ZM38.42,8.25H89.58v34.1H38.42ZM25.94,19.75h8.98v22.6H25.94Zm0,82.31V84.25h8.977v17.81Zm12.477,17.69V84.25H89.583s0,19.55,0,19.56,0,15.94,0,15.94Zm54.666-17.69V84.25h8.977v17.81Zm26.667-4.25a4.255,4.255,0,0,1-4.25,4.25h-9.94V82.5a1.751,1.751,0,0,0-1.75-1.75H24.19a1.751,1.751,0,0,0-1.75,1.75v19.56H12.5a4.255,4.255,0,0,1-4.25-4.25V50.1a4.255,4.255,0,0,1,4.25-4.25h103a4.255,4.255,0,0,1,4.25,4.25Z"/><path d="M40.333,54.346H15.5a1.75,1.75,0,0,0,0,3.5H40.333a1.75,1.75,0,0,0,0-3.5Z"/><path d="M79,89.25H49a1.75,1.75,0,0,0,0,3.5H79a1.75,1.75,0,0,0,0-3.5Z"/><path d="M79,98.25H49a1.75,1.75,0,0,0,0,3.5H79a1.75,1.75,0,0,0,0-3.5Z"/><path d="M79,107.25H49a1.75,1.75,0,0,0,0,3.5H79a1.75,1.75,0,0,0,0-3.5Z"/><path d="M109.5,51.346a4.75,4.75,0,1,0,4.75,4.75A4.756,4.756,0,0,0,109.5,51.346Zm0,6a1.25,1.25,0,1,1,1.25-1.25A1.251,1.251,0,0,1,109.5,57.346Z"/><path d="M97.625,51.346a4.75,4.75,0,1,0,4.75,4.75A4.756,4.756,0,0,0,97.625,51.346Zm0,6a1.25,1.25,0,1,1,1.25-1.25A1.251,1.251,0,0,1,97.625,57.346Z"/><path d="M85.75,51.346A4.75,4.75,0,1,0,90.5,56.1,4.756,4.756,0,0,0,85.75,51.346Zm0,6A1.25,1.25,0,1,1,87,56.1,1.251,1.251,0,0,1,85.75,57.346Z"/></g></svg>',
    
    'printer512x512-black-stroke' : '<svg id="Capa_1" enable-background="new 0 0 512 512" height="512px" viewBox="0 0 512 512" width="512px" xmlns="http://www.w3.org/2000/svg"><g><g><path d="m446.473 220.26h-380.946v-130.955c0-8.281 6.713-14.995 14.995-14.995h350.956c8.281 0 14.995 6.713 14.995 14.995z" fill="#444"/><path d="m403.449 207.597h-294.898v-190.1c0-5.521 4.476-9.997 9.997-9.997h274.905c5.521 0 9.997 4.476 9.997 9.997v190.1z" fill="#d3e1f5"/><path d="m476.424 404.868h-440.848c-15.459 0-27.99-12.532-27.99-27.99v-169.28h496.828v169.28c0 15.458-12.532 27.99-27.99 27.99z" fill="#bfbfbf"/><path d="m71.064 404.868v-111.967c0-6.625 5.371-11.996 11.996-11.996h345.88c6.625 0 11.996 5.371 11.996 11.996v111.967z" fill="#5a5a5a"/><path d="m393.452 504.5h-274.904c-5.521 0-9.997-4.476-9.997-9.997v-180.177h294.898v180.177c0 5.521-4.476 9.997-9.997 9.997z" fill="#d3e1f5"/><path d="m225.254 463.394h-61.979c-2.76 0-4.998-2.238-4.998-4.998v-61.979c0-2.76 2.238-4.998 4.998-4.998h61.979c2.76 0 4.998 2.238 4.998 4.998v61.979c0 2.761-2.238 4.998-4.998 4.998z" fill="#528fd8"/><path d="m464.743 207.597v169.28c0 15.459-12.532 27.99-27.99 27.99h39.671c15.459 0 27.99-12.532 27.99-27.99v-169.28z" fill="#acacac"/><path d="m504.414 236.921h-496.828v-52.643c0-15.459 12.532-27.99 27.99-27.99h440.848c15.459 0 27.99 12.532 27.99 27.99z" fill="#838383"/><path d="m476.424 156.287h-39.671c15.459 0 27.99 12.532 27.99 27.99v52.643h39.671v-52.643c0-15.458-12.532-27.99-27.99-27.99z" fill="#5a5a5a"/><path d="m450.747 210.599h-36.487c-7.729 0-13.995-6.266-13.995-13.995 0-7.729 6.266-13.995 13.995-13.995h36.487c7.729 0 13.995 6.266 13.995 13.995.001 7.729-6.265 13.995-13.995 13.995z" fill="#e94444"/></g><g><path d="m476.424 148.787h-22.451v-59.482c0-12.404-10.091-22.495-22.494-22.495h-20.529v-49.313c-.001-9.648-7.85-17.497-17.498-17.497h-274.905c-9.647 0-17.497 7.849-17.497 17.497v49.313h-20.528c-12.404 0-22.495 10.091-22.495 22.495v59.482h-22.451c-19.569 0-35.49 15.921-35.49 35.49v192.6c0 19.57 15.921 35.491 35.49 35.491h65.475v15.749c0 4.142 3.358 7.5 7.5 7.5s7.5-3.358 7.5-7.5v-23.249-83.042h279.898v83.042 89.635c0 1.376-1.12 2.497-2.497 2.497h-274.905c-1.376 0-2.497-1.12-2.497-2.497v-31.386c0-4.142-3.358-7.5-7.5-7.5s-7.5 3.358-7.5 7.5v31.386c0 9.647 7.849 17.497 17.497 17.497h274.905c9.647 0 17.497-7.849 17.497-17.497v-82.135h65.475c19.569 0 35.49-15.921 35.49-35.491v-40.142c0-4.142-3.357-7.5-7.5-7.5s-7.5 3.358-7.5 7.5v40.142c0 11.299-9.192 20.491-20.49 20.491h-27.987v-104.467c0-10.75-8.746-19.496-19.496-19.496h-345.881c-10.75 0-19.496 8.746-19.496 19.496v104.467h-27.988c-11.298 0-20.49-9.192-20.49-20.491v-132.456h481.828v57.314c0 4.142 3.357 7.5 7.5 7.5s7.5-3.358 7.5-7.5c0-51.502 0-35.473 0-117.458 0-19.569-15.921-35.49-35.49-35.49zm-397.86 144.114c0-2.479 2.017-4.496 4.496-4.496h345.88c2.479 0 4.496 2.017 4.496 4.496v104.467h-22.487v-83.042c0-4.142-3.357-7.5-7.5-7.5h-294.898c-4.142 0-7.5 3.358-7.5 7.5v83.042h-22.487zm332.385-211.091h20.529c4.132 0 7.494 3.362 7.494 7.495v59.482h-28.023zm-294.898-7.5v-56.813c0-1.376 1.12-2.497 2.497-2.497h274.905c1.377 0 2.497 1.12 2.497 2.497v56.813 74.477h-279.899zm-43.024 14.995c0-4.133 3.362-7.495 7.495-7.495h20.529v66.977h-28.024zm423.887 140.115h-481.828v-45.143c0-11.298 9.192-20.49 20.49-20.49h440.848c11.298 0 20.49 9.192 20.49 20.49z"/><path d="m353.723 347.932h-195.446c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5h195.446c4.143 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5z"/><path d="m353.723 383.919h-91.725c-4.143 0-7.5 3.358-7.5 7.5s3.357 7.5 7.5 7.5h91.725c4.143 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5z"/><path d="m353.723 419.907h-91.725c-4.143 0-7.5 3.358-7.5 7.5s3.357 7.5 7.5 7.5h91.725c4.143 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5z"/><path d="m353.723 455.895h-91.725c-4.143 0-7.5 3.358-7.5 7.5s3.357 7.5 7.5 7.5h91.725c4.143 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5z"/><path d="m150.777 458.396c0 6.892 5.607 12.499 12.499 12.499h61.979c6.892 0 12.498-5.607 12.498-12.499v-61.979c0-6.892-5.606-12.498-12.498-12.498h-61.979c-6.892 0-12.499 5.606-12.499 12.498zm15-59.477h56.975v56.975h-56.975z"/><path d="m450.747 175.109h-36.487c-11.853 0-21.495 9.643-21.495 21.495s9.643 21.495 21.495 21.495h36.487c11.853 0 21.495-9.643 21.495-21.495s-9.642-21.495-21.495-21.495zm0 27.99h-36.487c-3.581 0-6.495-2.914-6.495-6.495s2.914-6.495 6.495-6.495h36.487c3.581 0 6.495 2.914 6.495 6.495s-2.914 6.495-6.495 6.495z"/></g></g></svg>',
    printer512x512: '<svg id="Capa_1" enable-background="new 0 0 512 512" height="512px" viewBox="0 0 512 512" width="512px" xmlns="http://www.w3.org/2000/svg"><g><path d="m452.222 219.181h-392.444v-134.907c0-8.531 6.916-15.447 15.447-15.447h361.549c8.531 0 15.447 6.916 15.447 15.447v134.907z" fill="#444"/><path d="m407.899 206.137h-303.798v-195.839c0-5.687 4.611-10.298 10.298-10.298h283.202c5.688 0 10.298 4.611 10.298 10.298z" fill="#d3e1f5"/><path d="m483.076 409.361h-454.152c-15.925 0-28.835-12.91-28.835-28.835v-174.389h511.823v174.389c-.001 15.925-12.91 28.835-28.836 28.835z" fill="#bfbfbf"/><path d="m65.482 409.361v-115.346c0-6.825 5.533-12.358 12.358-12.358h356.32c6.825 0 12.358 5.533 12.358 12.358v115.346z" fill="#5a5a5a"/><path d="m397.601 512h-283.202c-5.688 0-10.298-4.611-10.298-10.298v-185.615h303.798v185.615c0 5.687-4.611 10.298-10.298 10.298z" fill="#d3e1f5"/><g><path d="m356.672 366.156h-201.344c-4.266 0-7.724-3.458-7.724-7.724s3.458-7.724 7.724-7.724h201.345c4.266 0 7.724 3.458 7.724 7.724s-3.458 7.724-7.725 7.724z" fill="#528fd8"/></g><g><path d="m356.672 403.23h-94.493c-4.266 0-7.724-3.458-7.724-7.724s3.458-7.724 7.724-7.724h94.493c4.266 0 7.724 3.458 7.724 7.724s-3.457 7.724-7.724 7.724z" fill="#528fd8"/></g><g><path d="m356.672 440.304h-94.493c-4.266 0-7.724-3.458-7.724-7.724s3.458-7.724 7.724-7.724h94.493c4.266 0 7.724 3.458 7.724 7.724s-3.457 7.724-7.724 7.724z" fill="#528fd8"/></g><g><path d="m356.672 477.377h-94.493c-4.266 0-7.724-3.458-7.724-7.724s3.458-7.724 7.724-7.724h94.493c4.266 0 7.724 3.458 7.724 7.724s-3.457 7.724-7.724 7.724z" fill="#528fd8"/></g><path d="m224.326 469.654h-63.849c-2.844 0-5.149-2.305-5.149-5.149v-63.849c0-2.844 2.305-5.149 5.149-5.149h63.849c2.844 0 5.149 2.305 5.149 5.149v63.849c0 2.843-2.305 5.149-5.149 5.149z" fill="#528fd8"/><path d="m471.043 206.136v174.389c0 15.925-12.91 28.835-28.835 28.835h40.869c15.925 0 28.835-12.91 28.835-28.835v-174.389z" fill="#acacac"/><path d="m511.911 236.345h-511.822v-54.232c0-15.925 12.91-28.835 28.835-28.835h454.153c15.925 0 28.835 12.91 28.835 28.835v54.232z" fill="#838383"/><path d="m483.076 153.277h-40.869c15.925 0 28.835 12.91 28.835 28.835v54.232h40.869v-54.232c0-15.924-12.909-28.835-28.835-28.835z" fill="#5a5a5a"/><path d="m456.625 209.229h-37.589c-7.963 0-14.418-6.455-14.418-14.418 0-7.963 6.455-14.418 14.418-14.418h37.589c7.963 0 14.418 6.455 14.418 14.418 0 7.963-6.455 14.418-14.418 14.418z" fill="#e94444"/></g></svg>',
    user: '<!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\' \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'>'
        + '<svg style="enable-background:new 0 0 24 32" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="32px" width="24px" version="1.1" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 32">'
        + '	<g fill="#010101">'
        + '		<path d="m12 16c-6.6 0-12 5-12 12 0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4 0-7-5-12-12-12z"/>'
        + '		<circle cx="12" r="6" cy="6"/>'
        + '	</g>'
        + '</svg>',
    uplaod: '<!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\' \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'>'
        + '<svg style="enable-background:new 0 0 24 32" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="32px" width="24px" version="1.1" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 32">'
        + '	<g fill="#010101">'
        + '		<rect width="24" height="4.6"/>'
        + '		<polygon points="8 14 8 32 16 32 16 14 20 14 12 4.6 4 14"/>'
        + '	</g>'
        + '</svg>',
    umbrella: '<!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\' \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'>'
        + '<svg style="enable-background:new 0 0 31.998 32" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="32px" width="32px" version="1.1" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 31.998 32">'
        + '	<path d="m16 0c-8.8 0-16 7.2-16 16h4c0-0.83 0.68-1.5 1.5-1.5 0.8 0 1.5 1 1.5 2h4c0-0.83 0.68-1.5 1.5-1.5 0.83 0 1.5 0.67 1.5 1.5v10c0 1.1-0.9 2-2 2s-2-0.9-2-2h-4c0 3.3 2.7 6 6 6s6-2.7 6-6v-10c0-0.83 0.68-1.5 1.5-1.5 0.83 0 1.5 0.67 1.5 1.5h4c0-0.83 0.68-1.5 1.5-1.5 0.83 0 1.5 0.67 1.5 1.5h4c-2-8.8-9-16-18-16z" fill="#010101"/>'
        + '</svg>',
    reload: '<!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\'  \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'>'
        + '<svg style="enable-background:new 0 0 24 28" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="28px" width="24px" version="1.1" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 28">'
        + '		<path d="m20 16c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8l2.4 0.027-1.2 1.2 2.8 2.8 6-6-6-6-2.8 2.8 1 1.2h-2c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12h-4z" fill="#010101"/>'
        + '</svg>',
    unloack: { 
        fill: '<!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\' \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'>'
            + '<svg style="enable-background:new 0 0 24 32" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="32px" width="24px" version="1.1" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 32">'
            + '	<path d="m14 0c-5.5 0-10 4.5-10 10h4c0-3.3 2.7-6 6-6 3 0 6 2.7 6 6v2h-20v14c0 3.3 2.7 6 6 6h12c3.3 0 6-2.7 6-6v-16c0-5.5-4-10-10-10zm-2 24c-1.1 0-2-0.9-2-2s0.9-2 2-2c1.1 0 2 0.9 2 2s-1 2-2 2z" fill="#010101"/>'
            + '</svg>', 
        stroke: '<!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\' \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'>'
            + '<svg style="enable-background:new 0 0 24 32" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="32px" width="24px" version="1.1" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 32">'
            + '	<g fill="#010101">'
            + '		<path d="m14 0c-5.5 0-10 4.5-10 10h4c0-3.3 2.7-6 6-6s6 2.7 6 6v2h-20v14c0 3.3 2.7 6 6 6h12c3.3 0 6-2.7 6-6v-16c0-5.5-4-10-10-10zm4 28h-12c-1.1 0-2-0.9-2-2v-10h16v10c0 1-1 2-2 2z"/>'
            + '		<path d="m14 22c0 1.1-0.9 2-2 2s-2-0.89-2-2c0-1.1 0.9-2 2-2s2 1 2 2z"/>'
            + '	</g>'
            + '</svg>'
    },
    sun: {
        fill: '<!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\'  \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'>'
            + '<svg style="enable-background:new 0 0 31.998 32" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="32px" width="32px" version="1.1" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 31.998 32">'
            + '	<g fill="#010101">'
            + '		<path d="m16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8c4.4 0 8-3.6 8-8s-4-8-8-8z"/>'
            + '		<path d="m18 2c0 1.1-0.9 2-2 2s-2-0.9-2-2 0.89-2 2-2c1 0 2 0.9 2 2z"/>'
            + '		<circle cx="6" r="2" cy="6"/>'
            + '		<path d="m2 14c1.1 0 2 0.9 2 2s-0.9 2-2 2-2-0.89-2-2c0-1 0.89-2 2-2z"/>'
            + '		<circle cx="6" r="2" cy="26"/>'
            + '		<path d="m14 30c0-1.1 0.89-2 2-2s2 0.89 2 2c0 1.1-0.89 2-2 2s-2-1-2-2z"/>'
            + '		<path d="m25 27c-0.78-0.78-0.78-2 0-2.8s2-0.78 2.8 0c0.79 0.78 0.79 2 0 2.8-1 1-3 1-3 0z"/>'
            + '		<path d="m30 18c-1.1 0-2-0.9-2-2s0.9-2 2-2 2 0.89 2 2c0 1-1 2-2 2z"/>'
            + '		<path d="m27 7.4c-0.78 0.78-2 0.78-2.8 0-0.78-0.78-0.78-2 0-2.8 0.78-0.78 2-0.78 2.8 0.002 1 0.8 1 2 0 2.8z"/>'
            + '	</g>'
            + '</svg>',
        stroke: '<!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\'  \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'>'
            + '<svg style="enable-background:new 0 0 31.998 32" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="32px" width="32px" version="1.1" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 31.998 32">'
            + '	<g fill="#010101">'
            + '		<path d="m16 12c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 2-4 4-4m0-4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-4-8-8-8z"/>'
            + '		<circle cx="16" r="2" cy="2"/>'
            + '		<circle cx="6" r="2" cy="6"/>'
            + '		<path d="m2 14c1.1 0 2 0.9 2 2s-0.9 2-2 2-2-0.89-2-2c0-1 0.9-2 2-2z"/>'
            + '		<circle cx="6" r="2" cy="26"/>'
            + '		<path d="m14 30c0-1.1 0.9-2 2-2s2 0.89 2 2-0.89 2-2 2c-1 0-2-1-2-2z"/>'
            + '		<path d="m25 27c-0.78-0.78-0.78-2 0-2.8 0.79-0.78 2-0.78 2.8 0s0.79 2 0 2.8c-1 1-3 1-3 0z"/>'
            + '		<path d="m30 18c-1.1 0-2-0.9-2-2s0.89-2 2-2 2 0.89 2 2c0 1-1 2-2 2z"/>'
            + '		<path d="m27 7.4c-0.78 0.78-2 0.78-2.8 0-0.78-0.78-0.78-2 0-2.8 0.78-0.78 2-0.78 2.8 0.002 1 0.8 1 2 0 2.8z"/>'
            + '	</g>'
            + '</svg>'
    },
    tag : {
        stroke: '<!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\'  \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'>'
            + '<svg style="enable-background:new 0 0 32 32" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="32px" width="32px" version="1.1" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">'
            + '		<path d="m12 8.6c0 1.7-1.4 3.1-3.1 3.1s-3.1-1.4-3.1-3.1 1.4-3.1 3.1-3.1c1.1-0.3 3.1 1.1 3.1 2.8z" fill="#010101"/>'
            + '			<path d="m0 0v13l19 19v-13h13l-19-19h-13zm12 3.6l12 12h-8.2s0 5.1 0 8.2c-5-4-12-11-12-12v-8.2c1.8-0.2 7-0.2 8-0.2z" fill="#010101"/>'
            + '</svg>',
        fill: '<!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\'  \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'>'
            + '<svg style="enable-background:new 0 0 32 32" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="32px" width="32px" version="1.1" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">'
            + '	<path d="m13 0h-13v13l19 19v-13h13l-19-19zm-5.7 11c-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8 3.8 1.7 3.8 3.8-1.6 3.8-3.7 3.8z" fill="#010101"/>'
            + '</svg>'
    },
    star: '<!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\'  \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'>'
            + '<svg style="enable-background:new 0 0 32 32" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="32px" width="32px" version="1.1" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">'
            + '	<polygon points="22 20 32 12 20 12 16 0 12 12 0 12 9.9 20 6 32 16 24 26 32" fill="#010101"/>'
            + '</svg>',
    target: '<!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\'  \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'>'
        + '<svg style="enable-background:new 0 0 32 32" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="32px" width="32px" version="1.1" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">'
        + '				<path d="m18 14h5.8c-0.73-2.8-3-5.1-5.8-5.8v5.8z" fill="#010101"/>'
        + '				<path d="m18 18v5.8c2.8-0.73 5.1-3 5.8-5.8h-6z" fill="#010101"/>'
        + '				<path d="m14 14v-5.8c-2.8 0.73-5.1 3-5.8 5.8h5.8z" fill="#010101"/>'
        + '				<path d="m14 18h-5.8c0.73 2.8 3 5.1 5.8 5.8v-6z" fill="#010101"/>'
        + '		<g fill="#010101">'
        + '			<path d="m18 4.1c5.1 0.86 9.1 4.8 9.9 9.9h4c-1-7.3-7-13-14-14v4.1z"/>'
        + '			<path d="m4.1 14c0.8-5.1 4.8-9.1 9.9-9.9v-4.1c-7.3 0.92-13 6.7-14 14h4.1z"/>'
        + '			<path d="m14 28c-5.1-0.86-9.1-4.8-9.9-9.9h-4.1c0.92 7 6.7 13 14 14v-4z"/>'
        + '			<path d="m28 18c-0.86 5.1-4.8 9.1-9.9 9.9v4c7-1 13-7 14-14h-4z"/>'
        + '		</g>'
        + '</svg>',
    rss: {
        rss : '<!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\'  \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'>'
            + '<svg style="enable-background:new 0 0 32 32" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="32px" width="32px" version="1.1" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">'
            + '		<circle cx="4" r="4" cy="28" fill="#010101"/>'
            + '			<path d="m6 20c3.3 0 6 2.7 6 6h4c0-6-4-10-10-10v4z" fill="#010101"/>'
            + '			<path d="m6 12c8 0 14 6 14 14h4c0-10-8-18-18-18v4z" fill="#010101"/>'
            + '			<path d="m6 4c12 0 22 10 22 22h4c0-14-12-26-26-26v4z" fill="#010101"/>'
            + '</svg>',
        alt: '<!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\'  \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'>'
            + '<svg style="enable-background:new 0 0 32 32" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="32px" width="32px" version="1.1" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">'
            + '	<g fill="#010101">'
            + '		<path d="m32 32h-4.6c0-15-12-27-27-27v-5c18 0 32 14 32 32z"/>'
            + '		<path d="m23 32h-4.6c0-10-8.2-18-18-18v-4.9c13 0 23 9.9 23 23z"/>'
            + '		<path d="m14 32h-4.9c0-5-4.1-9.1-9.1-9.1v-4.6c7.6 0 14 6 14 14z"/>'
            + '		<path d="m4.6 32c0-2.5-2-4.6-4.6-4.6v5h4.6z"/>'
            + '	</g>'
            + '</svg>'
    },
    transfer: '!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\'  \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'>'
            + '<svg style="enable-background:new 0 0 31.998 24" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="24px" width="32px" version="1.1" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 31.998 24">'
            + '	<g fill="#010101">'
            + '		<polygon points="32 20 8 20 8 24 0 18 8 12 8 16 32 16"/>'
            + '		<polygon points="0 8 24 8 24 12 32 6 24 0 24 4 0 4"/>'
            + '	</g>'
            + '</svg>',
    //
    
    dropdown : '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M227.328 664.362667l-3.626667 3.669333L0 444.330667 60.330667 384l166.997333 166.997333L394.368 384l60.330667 60.330667-223.701334 223.701333-3.669333-3.669333z"  /></svg>',
    export: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M699.434667 469.333333l-74.965334-74.965333 60.330667-60.373333 181.034667 181.034666-60.330667 60.330667-120.704 120.704-60.330667-60.373333 81.066667-81.024H426.666667v-85.333334h272.768z"  /><path d="M298.666667 341.333333v341.333334h256v85.333333H213.333333V341.333333h85.333334z m0 341.333334v85.333333l-85.333334-85.333333h85.333334z m0-341.333334V256h256v85.333333H298.666667z m0 0v341.333334h256v85.333333H213.333333V341.333333h85.333334z m0 341.333334v85.333333l-85.333334-85.333333h85.333334zM213.333333 341.333333V256h341.333334v85.333333H213.333333z"  /></svg>',
    delete: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M858.368214 288.59126 159.309962 288.59126c-8.082903 0-14.630507-6.547603-14.630507-14.630507s6.547603-14.630507 14.630507-14.630507l699.103409 0c8.082903 0 14.630507 6.547603 14.630507 14.630507S866.451118 288.59126 858.368214 288.59126z"  /><path d="M657.83093 173.895312 359.847246 173.895312c-8.082903 0-14.630507-6.547603-14.630507-14.630507s6.547603-14.630507 14.630507-14.630507l297.983684 0c8.082903 0 14.630507 6.547603 14.630507 14.630507S665.913833 173.895312 657.83093 173.895312z"  /><path d="M764.353662 880.043039 253.324514 880.043039c-8.44415 0-15.353001-6.90885-15.353001-15.353001L237.971513 383.012215c0-8.44415 6.90885-15.353001 15.353001-15.353001 7.992592 0 14.449883 6.457292 14.449883 14.449883 0 1.76108-0.316091 3.477003-0.903118 5.057459l0 464.021872 483.935618 0L750.806897 387.121401c-0.587027-1.580456-0.903118-3.251224-0.903118-5.057459 0-7.992592 6.457292-14.449883 14.449883-14.449883 8.44415 0 15.353001 6.90885 15.353001 15.353001l0 481.722979C779.706663 873.179345 772.842969 880.043039 764.353662 880.043039z"  /><path d="M413.808528 748.233011c-7.992592 0-14.449883-6.457292-14.449883-14.449883l0-257.343388c0-7.992592 6.457292-14.449883 14.449883-14.449883s14.449883 6.457292 14.449883 14.449883L428.258412 733.783128C428.258412 741.77572 421.80112 748.233011 413.808528 748.233011z"  /><path d="M603.418089 748.233011c-7.992592 0-14.449883-6.457292-14.449883-14.449883l0-257.343388c0-7.992592 6.457292-14.449883 14.449883-14.449883s14.449883 6.457292 14.449883 14.449883L617.867972 733.783128C617.867972 741.77572 611.41068 748.233011 603.418089 748.233011z"  /></svg>',
    drag: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M170.666667 426.666667a85.333333 85.333333 0 1 1 0-170.666667 85.333333 85.333333 0 0 1 0 170.666667z m341.333333 0a85.333333 85.333333 0 1 1 0-170.666667 85.333333 85.333333 0 0 1 0 170.666667z m341.333333 0a85.333333 85.333333 0 1 1 0-170.666667 85.333333 85.333333 0 0 1 0 170.666667zM170.666667 768a85.333333 85.333333 0 1 1 0-170.666667 85.333333 85.333333 0 0 1 0 170.666667z m341.333333 0a85.333333 85.333333 0 1 1 0-170.666667 85.333333 85.333333 0 0 1 0 170.666667z m341.333333 0a85.333333 85.333333 0 1 1 0-170.666667 85.333333 85.333333 0 0 1 0 170.666667z"  /></svg>',
    drag_gray : '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M170.666667 426.666667a85.333333 85.333333 0 1 1 0-170.666667 85.333333 85.333333 0 0 1 0 170.666667z m341.333333 0a85.333333 85.333333 0 1 1 0-170.666667 85.333333 85.333333 0 0 1 0 170.666667z m341.333333 0a85.333333 85.333333 0 1 1 0-170.666667 85.333333 85.333333 0 0 1 0 170.666667zM170.666667 768a85.333333 85.333333 0 1 1 0-170.666667 85.333333 85.333333 0 0 1 0 170.666667z m341.333333 0a85.333333 85.333333 0 1 1 0-170.666667 85.333333 85.333333 0 0 1 0 170.666667z m341.333333 0a85.333333 85.333333 0 1 1 0-170.666667 85.333333 85.333333 0 0 1 0 170.666667z"  /></svg>',
    dropdown_blue: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M227.328 664.362667l-3.626667 3.669333L0 444.330667 60.330667 384l166.997333 166.997333L394.368 384l60.330667 60.330667-223.701334 223.701333-3.669333-3.669333z"  /></svg>',
    grid: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M320 320v42.666667h42.666667v-42.666667h-42.666667z m170.666667 0v42.666667h42.666666v-42.666667h-42.666666z m170.666666 0v42.666667h42.666667v-42.666667h-42.666667z m-341.333333 170.666667v42.666666h42.666667v-42.666666h-42.666667z m170.666667 0v42.666666h42.666666v-42.666666h-42.666666z m170.666666 0v42.666666h42.666667v-42.666666h-42.666667z m-341.333333 170.666666v42.666667h42.666667v-42.666667h-42.666667z m170.666667 0v42.666667h42.666666v-42.666667h-42.666666z m170.666666 0v42.666667h42.666667v-42.666667h-42.666667z"  /></svg>',
    clock_blue: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 42.67C253.21 42.67 42.67 253.21 42.67 512S253.21 981.33 512 981.33 981.33 770.79 981.33 512 770.79 42.67 512 42.67zM512 896c-211.73 0-384-172.27-384-384s172.27-384 384-384 384 172.27 384 384-172.27 384-384 384z" fill="#2F3CF4" /><path d="M682.67 469.33h-128V256c0-23.56-19.1-42.67-42.67-42.67s-42.67 19.1-42.67 42.67v256c0 23.56 19.1 42.67 42.67 42.67h170.67c23.56 0 42.67-19.1 42.67-42.67s-19.11-42.67-42.67-42.67z" fill="#2F3CF4" /></svg>',
    copy: {
        1: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M96 192h512A96 96 0 0 1 704 288v640A96 96 0 0 1 608 1024h-512A96 96 0 0 1 0 928v-640A96 96 0 0 1 96 192z m0 64a32 32 0 0 0-32 32v640a32 32 0 0 0 32 32h512a32 32 0 0 0 32-32v-640a32 32 0 0 0-32-32h-512z m298.688-183.872a32 32 0 0 1-42.752-47.616A95.744 95.744 0 0 1 416 0h512A96 96 0 0 1 1024 96v640a96 96 0 0 1-96 96h-69.952a32 32 0 1 1 0-64H928a32 32 0 0 0 32-32v-640a32 32 0 0 0-32-32h-512a31.744 31.744 0 0 0-21.312 8.128zM160 704a32 32 0 1 1 0-64h384a32 32 0 1 1 0 64h-384z m0 128a32 32 0 1 1 0-64h384a32 32 0 1 1 0 64h-384z m0-256a32 32 0 0 1 0-64h384a32 32 0 0 1 0 64h-384z"  /></svg>',
        2: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M857.373005 65.290005 469.604424 65.290005c-34.211173 0-62.044078 27.832905-62.044078 62.043055l0 10.340509-63.076594 0c-25.993001 0-48.228421 16.346293-57.001225 39.293935L166.626995 176.967504c-34.21015 0-62.043055 27.832905-62.043055 62.043055l0 657.655358c0 34.21015 27.832905 62.043055 62.043055 62.043055l550.115086 0c34.21015 0 62.043055-27.832905 62.043055-62.043055l0-49.634444 78.587869 0c34.21015 0 62.043055-27.832905 62.043055-62.043055L919.41606 127.33306C919.41606 93.122911 891.583155 65.290005 857.373005 65.290005zM344.483752 179.035606l194.402595 0c10.833743 0 19.646456 8.813736 19.646456 19.646456 0 10.833743-8.813736 19.646456-19.646456 19.646456L344.483752 218.328517c-10.833743 0-19.646456-8.813736-19.646456-19.646456C324.836273 187.849342 333.650009 179.035606 344.483752 179.035606zM737.423099 896.665917c0 11.402701-9.278317 20.681018-20.681018 20.681018L166.626995 917.346935c-11.403724 0-20.681018-9.278317-20.681018-20.681018L145.945977 239.010559c0-11.402701 9.277294-20.681018 20.681018-20.681018l120.111588 0c8.197706 24.02723 30.977525 41.362037 57.744145 41.362037l194.402595 0c26.767644 0 49.54644-17.334807 57.744145-41.362037l120.111588 0c11.402701 0 20.681018 9.278317 20.681018 20.681018L737.422076 896.665917zM878.054023 784.988418c0 11.402701-9.278317 20.681018-20.681018 20.681018l-78.587869 0L778.785136 239.010559c0-34.21015-27.832905-62.043055-62.043055-62.043055L595.886549 176.967504c-8.771781-22.947641-31.007201-39.293935-57.001225-39.293935l-89.963964 0L448.921359 127.33306c0-11.403724 9.278317-20.681018 20.683065-20.681018l387.768581 0c11.402701 0 20.681018 9.277294 20.681018 20.681018L878.054023 784.988418z"  /><path d="M620.597347 334.252737 260.748652 334.252737c-11.422144 0-20.681018 9.259898-20.681018 20.681018s9.258874 20.681018 20.681018 20.681018l359.849718 0c11.42112 0 20.681018-9.259898 20.681018-20.681018S632.018467 334.252737 620.597347 334.252737z"  /><path d="M620.597347 454.201619 260.748652 454.201619c-11.422144 0-20.681018 9.259898-20.681018 20.681018 0 11.42112 9.258874 20.681018 20.681018 20.681018l359.849718 0c11.42112 0 20.681018-9.259898 20.681018-20.681018C641.278365 463.46254 632.018467 454.201619 620.597347 454.201619z"  /><path d="M440.673511 574.151525 260.748652 574.151525c-11.422144 0-20.681018 9.259898-20.681018 20.681018 0 11.42112 9.258874 20.681018 20.681018 20.681018l179.924859 0c11.42112 0 20.681018-9.259898 20.681018-20.681018C461.35453 583.411423 452.093609 574.151525 440.673511 574.151525z"  /></svg>',
        3: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M629.39164 415.032528l-163.616428-163.616428c-7.992021-7.992021-20.947078-7.992021-28.939099 0-7.992021 8.002254-7.992021 20.957311 0 28.949332l128.680754 128.680754-175.548178 0L389.968689 184.082552c0-11.2973-9.168824-20.466124-20.466124-20.466124L21.813818 163.616428c-11.307533 0-20.466124 9.168824-20.466124 20.466124l0 818.08214c0 11.307533 9.15859 20.466124 20.466124 20.466124l593.108273 0c11.307533 0 20.466124-9.15859 20.466124-20.466124L635.388215 429.512311C635.388215 424.078555 633.229039 418.880159 629.39164 415.032528zM594.455967 981.698568l-552.176025 0L42.279942 204.548676l306.756499 0 0 224.963635c0 11.2973 9.15859 20.466124 20.466124 20.466124l224.953402 0L594.455967 981.698568z"  /><path d="M1023.978511 265.895883l0 572.652382c0 11.307533-9.15859 20.466124-20.466124 20.466124l-307.86167 0c-11.2973 0-20.466124-9.15859-20.466124-20.466124 0-11.2973 9.168824-20.466124 20.466124-20.466124l287.395546 0L983.046263 286.362007l-224.953402 0c-11.307533 0-20.466124-9.168824-20.466124-20.466124L737.626737 40.932248l-306.756499 0 0 75.693959c0 11.307533-9.168824 20.466124-20.466124 20.466124-11.307533 0-20.466124-9.15859-20.466124-20.466124L389.93799 20.466124c0-11.2973 9.15859-20.466124 20.466124-20.466124l347.688747 0c11.2973 0 20.466124 9.168824 20.466124 20.466124l0 224.963635 175.548178 0-128.680754-128.680754c-7.992021-7.992021-7.992021-20.947078 0-28.949332 7.992021-7.992021 20.947078-7.992021 28.939099 0l163.616428 163.626661C1021.819334 255.263731 1023.978511 260.462127 1023.978511 265.895883z"  /></svg>',
        4: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M761.088 715.3152a38.7072 38.7072 0 0 1 0-77.4144 37.4272 37.4272 0 0 0 37.4272-37.4272V265.0112a37.4272 37.4272 0 0 0-37.4272-37.4272H425.6256a37.4272 37.4272 0 0 0-37.4272 37.4272 38.7072 38.7072 0 1 1-77.4144 0 115.0976 115.0976 0 0 1 114.8416-114.8416h335.4624a115.0976 115.0976 0 0 1 114.8416 114.8416v335.4624a115.0976 115.0976 0 0 1-114.8416 114.8416z"  /><path d="M589.4656 883.0976H268.1856a121.1392 121.1392 0 0 1-121.2928-121.2928v-322.56a121.1392 121.1392 0 0 1 121.2928-121.344h321.28a121.1392 121.1392 0 0 1 121.2928 121.2928v322.56c1.28 67.1232-54.1696 121.344-121.2928 121.344zM268.1856 395.3152a43.52 43.52 0 0 0-43.8784 43.8784v322.56a43.52 43.52 0 0 0 43.8784 43.8784h321.28a43.52 43.52 0 0 0 43.8784-43.8784v-322.56a43.52 43.52 0 0 0-43.8784-43.8784z"  /></svg>'
    },
    close : {
        black: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M507.733333 447.36l180.992-180.992 60.330667 60.330667-180.992 180.992 180.992 181.034666-60.330667 60.330667-181.034666-180.992-180.992 180.992-60.330667-60.330667 180.992-181.034666-180.992-180.992 60.330667-60.330667 180.992 180.992z"  /></svg>',
        black2: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M507.733333 447.36l180.992-180.992 60.330667 60.330667-180.992 180.992 180.992 181.034666-60.330667 60.330667-181.034666-180.992-180.992 180.992-60.330667-60.330667 180.992-181.034666-180.992-180.992 60.330667-60.330667 180.992 180.992z"  /></svg>'
    },
    tasks: {
        task: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M896 128H746.67V85.33c0-23.57-19.11-42.67-42.67-42.67H320c-23.57 0-42.67 19.11-42.67 42.67v42.66H128c-23.57 0-42.67 19.11-42.67 42.67v768c0 23.57 19.11 42.67 42.67 42.67h768c23.56 0 42.67-19.1 42.67-42.66v-768c0-23.57-19.11-42.67-42.67-42.67z m-533.33 0h298.67v42.26c0 0.13-0.01 0.26-0.01 0.4s0.01 0.26 0.01 0.4v42.27H362.67V128z m490.67 768H170.67V213.33h106.66V256c0 23.57 19.11 42.67 42.67 42.67h384c23.56 0 42.67-19.11 42.67-42.67v-42.67h106.67V896z" fill="#2F3CF4" /><path d="M652.5 417.83L469.32 600.99l-97.83-97.82c-16.64-16.67-43.68-16.67-60.33 0-16.67 16.65-16.67 43.67 0 60.33l128 128c8.33 8.33 19.25 12.5 30.17 12.5 10.92 0 21.85-4.17 30.17-12.5l213.33-213.34c16.67-16.65 16.67-43.67 0-60.33-16.64-16.67-43.68-16.67-60.33 0z" fill="#2F3CF4" /></svg>'
    },
    shares: {
        share: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M789.33 682.67c-38.77 0-74.02 14.98-100.6 39.29L419.59 560.33c4.54-15.34 7.08-31.54 7.08-48.33s-2.54-32.99-7.08-48.33l269.15-161.63c26.57 24.31 61.83 39.29 100.6 39.29 82.33 0 149.33-66.99 149.33-149.33s-67-149.33-149.33-149.33S640 109.66 640 192c0 12.75 1.78 25.07 4.8 36.9L375.66 390.51c-30.83-30.37-73.08-49.17-119.66-49.17-94.1 0-170.67 76.56-170.67 170.67S161.9 682.67 256 682.67c46.59 0 88.84-18.81 119.66-49.17L644.8 795.1c-3.02 11.83-4.8 24.14-4.8 36.9 0 82.34 67 149.33 149.33 149.33S938.67 914.34 938.67 832s-67-149.33-149.34-149.33z m0-554.67c35.29 0 64 28.71 64 64s-28.71 64-64 64-64-28.71-64-64 28.71-64 64-64zM256 597.33c-47.06 0-85.33-38.28-85.33-85.33s38.27-85.33 85.33-85.33 85.33 38.28 85.33 85.33-38.27 85.33-85.33 85.33zM789.33 896c-35.29 0-64-28.71-64-64s28.71-64 64-64 64 28.71 64 64-28.71 64-64 64z" fill="#2F3CF4" /></svg>',
        share2: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M5.064339 94.782119l0-74.338917 494.595401 0c17.302383 0 31.352438 16.614748 31.352438 37.206628 0 20.517541-14.050055 37.132289-31.352438 37.132289L5.064339 94.782119M1008.639721 1024l-74.338917 0L934.300804 529.404599c0-17.302383 16.614748-31.352438 37.206628-31.352438 20.517541 0 37.132289 14.050055 37.132289 31.352438L1008.639721 1024M1008.639721 20.443202 945.972014 20.443202 1008.639721 20.443202ZM1008.639721 83.129494 1008.639721 20.443202 1008.639721 83.129494ZM5.064339 83.129494 5.064339 20.443202 67.750631 20.443202 5.064339 20.443202 5.064339 83.129494ZM5.064339 1024 5.064339 961.332293 5.064339 1024ZM67.750631 1024 5.064339 1024 67.750631 1024ZM1008.639721 1024 945.972014 1024 1008.639721 1024ZM1008.639721 1024 1008.639721 961.332293 1008.639721 1024ZM934.300804 20.443202l74.338917 0 0 263.438538c0 17.302383-16.614748 31.371023-37.132289 31.371023-20.610465 0-37.206628-14.06864-37.206628-31.371023L934.300804 20.443202M726.393437 94.782119c-17.339552 0-31.371023-16.614748-31.371023-37.132289 0-20.573295 14.031471-37.206628 31.371023-37.206628l282.227699 0 0 74.338917L726.393437 94.782119M79.403256 1024 5.064339 1024 5.064339 20.443202 79.403256 20.443202 79.403256 1024ZM1008.639721 949.661083 1008.639721 1024 5.064339 1024 5.064339 949.661083 1008.639721 949.661083ZM947.941995 28.564729c12.210167-12.265921 33.935716-10.426033 48.431805 4.107225 14.551843 14.477504 16.391731 36.221637 4.107225 48.431805L288.425706 793.214831c-12.265921 12.321676-33.9543 10.481787-48.506143-4.12581-14.533258-14.458919-16.373147-36.221637-4.107225-48.394635L947.941995 28.564729"  /></svg>',
        share3: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M232.675556 1023.81037c-61.231407 0-118.632296-23.665778-161.621333-66.635852l-4.228741-4.209778c-89.088-89.125926-89.088-234.116741 0-323.242667l181.096296-181.077333c3.470222 25.372444 9.557333 50.422519 18.090667 74.600296l-152.822519 152.841481c-63.525926 63.544889-63.525926 166.930963 0 230.494815l4.266667 4.266667c30.72 30.72 71.642074 47.634963 115.218963 47.634963s84.517926-16.933926 115.256889-47.672889l228.882963-228.882963c63.525926-63.544889 63.525926-166.949926 0-230.494815l-4.266667-4.247704c-2.066963-2.066963-4.190815-4.077037-6.409481-6.049185l46.40237-46.40237c2.180741 2.010074 4.304593 4.039111 6.371556 6.106074l4.266667 4.247704c89.088 89.088 89.069037 234.078815-0.018963 323.204741L394.296889 957.174519C351.326815 1000.144593 293.925926 1023.81037 232.675556 1023.81037zM411.45837 629.266963c-2.180741-2.029037-4.304593-4.058074-6.352593-6.106074l-4.247704-4.247704c-43.083852-43.102815-66.825481-100.484741-66.825481-161.60237 0-61.11763 23.74163-118.499556 66.825481-161.60237l228.864-228.882963C672.673185 23.855407 730.074074 0.18963 791.324444 0.18963c61.25037 0 118.651259 23.665778 161.621333 66.635852l4.171852 4.209778C1000.25837 114.138074 1024 171.557926 1024 232.675556c0 61.11763-23.722667 118.518519-66.825481 161.621333l-181.077333 181.096296c-3.489185-25.41037-9.557333-50.479407-18.090667-74.619259l152.822519-152.841481c63.544889-63.544889 63.544889-166.949926 0-230.494815l-4.28563-4.266667c-30.72-30.72-71.642074-47.634963-115.218963-47.634963-43.557926 0-84.498963 16.933926-115.237926 47.691852l-228.882963 228.864c-30.738963 30.738963-47.672889 71.68-47.672889 115.256889 0 43.576889 16.933926 84.517926 47.672889 115.237926l4.228741 4.247704c2.029037 2.048 4.171852 4.077037 6.428444 6.068148L411.45837 629.266963z"  /></svg>'
    },
    success: {
        outline: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 947.2c-240.64 0-435.2-194.56-435.2-435.2S271.36 76.8 512 76.8s435.2 194.56 435.2 435.2-194.56 435.2-435.2 435.2z m266.24-578.56c0 10.24-5.12 20.48-10.24 25.6l-286.72 286.72c-5.12 5.12-15.36 10.24-25.6 10.24s-20.48-5.12-25.6-10.24l-163.84-163.84c-15.36-5.12-20.48-15.36-20.48-25.6 0-20.48 15.36-40.96 40.96-40.96 10.24 5.12 20.48 10.24 25.6 15.36l138.24 138.24 261.12-261.12c5.12-5.12 15.36-10.24 25.6-10.24 20.48-5.12 40.96 15.36 40.96 35.84z" fill="#6BC839" /></svg>',
        success: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 981.333333C252.8 981.333333 42.666667 771.2 42.666667 512S252.8 42.666667 512 42.666667s469.333333 210.133333 469.333333 469.333333-210.133333 469.333333-469.333333 469.333333z m-50.432-326.101333L310.613333 504.32a32 32 0 0 0-45.226666 45.226667l174.72 174.762666a32.341333 32.341333 0 0 0 0.341333 0.341334l0.256 0.213333a32 32 0 0 0 50.048-6.144l337.450667-379.605333a32 32 0 1 0-47.872-42.496l-318.762667 358.613333z" fill="#52C41A" /></svg>',
        blue: '<svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M892.723 203.709c15.624-15.617 40.951-15.611 56.568 0.014 15.617 15.624 15.611 40.951-0.014 56.568L390.962 818.333c-15.68 15.673-41.116 15.603-56.71-0.155L76.568 557.783c-15.539-15.702-15.406-41.029 0.296-56.568 15.703-15.539 41.029-15.406 56.568 0.296L362.84 733.332 892.723 203.71z" fill="#2F54EB" /></svg>'
    },
    /**
     * 
     * @param {String|Array&lt;Number|String&gt;} path
     * @param {Number} factor
     * @returns {String|Array}
     */
    zoom: function(path, factor) {
        if (!factor) factor = 1;
        if (!path) return "";
        function replace(v, re) {
            var i;
            re.lastIndex = i = 0;
            var p = "";
            while (i < v.length) {
                if ((match=re.exec(v))) {
                    p += v.substring(i, re.lastIndex - match[0].length) + (parseFloat(match[0])*factor);
                    i = re.lastIndex;
                } else {
                    p += v.substring(i);
                    break;
                }
            }
            return p;
        }
        var _path = "", v;
        var re = /\d+(?:\.\d+)/g;
        if (typeof path === 'string') {
            _path = replace(path, re);
        } else if (isArray(path)) {
            _path = [];            
            var p;
            for (var k = 0, len = path.length; k < len; k++) {
                v = path[k];
                if (v instanceof Number || v instanceof String) {
                    v = v.valueOf();
                }
                if (typeof v === 'number') {
                    _path[k] = v * factor;
                } else {                    
                    _path[k] = replace(v, re);
                }
            }
        }
        return _path;
    },
    zoomSVG: function(svg, newSize, height, opts) {
        function _escape($0) {
            if ($0 === '\n') {
                return "\\n";
            } else if ($0 === '\t') {
                return "\\t";
            } else if ($0 === '\r') {
                return "\\r";
            } else if ($0 === '\r\n') {
                return "\\r\\n";
            }
        }
        if (Object.prototype.toString.call(opts) !== '[object Object]') {
            opts = {};
        }
        /*fill="#51AECD" stroke="#51AECD" stroke-width="4" stroke-miterlimit="10"*/
        var color = "(?:" + COLOR_REGEX.source.replace(/\([^?]/g, function($0, $1) {
            return "(?:" + $0[1];
        }).replace(/[\n\t]|(?:\r\n?)/g, _escape) + ")";
        var fill = new RegExp("\\bfill[ \\t\\n\\r]*=[ \\t\\n\\r]*(\"" + color + "\"|'" + color + "')");
        var stroke = new RegExp("\\bstroke[ \\t\\n\\r]*=[ \\t\\n\\r]*(\"" + color + "\"|'" + color + "')");
        var strokeWidth = new RegExp("\\bstroke-width[ \\t\\n\\r]*=[ \\t\\n\\r]*(\"\\d+(?:\\.\\d+)?\"|'\\d+(?:\\.\\d+)?')");
        if (typeof height === 'string') {
            height = ['height', 'h'].indexOf(height.toLowerCase()) >= 0;
        }
        function pcoeff(pixels, field, newSize) {
            var w = (typeof toPx === 'function' ? toPx(pixels.width) : parseInt(pixels.width)),
                h = (typeof toPx === 'function' ? toPx(pixels.height) : parseInt(pixels.height));
            var f = newSize/(field === 'height' ? h : w);
            pixels.height = Math.round(f*h) + 'px';
            pixels.width  = Math.round(f*w) + 'px';
            return f;
        }  
        function coeff(dims, field, newSize, pixels) {
            var f = newSize/(field === 'width' ? dims.width : dims.height);
            dims.width *= f;
            dims.height *= f;
            if (pixels) {
                var w = (typeof toPx === 'function' ? toPx(pixels.width) : parseInt(pixels.width)),
                h = (typeof toPx === 'function' ? toPx(pixels.height) : parseInt(pixels.height));
                pixels.height = Math.round(f*h) + 'px';
                pixels.width  = Math.round(f*w) + 'px';
            }
            return f;
        }
        /*var re1 =/\bviewBox[ \t\n\r]*=[ \t\n\r]*"\d+(?:\.\d+)?[ \t\n\r]+\d+(?:\.\d+)?[ \t\n\r]+(\d+(?:\.\d+)?)[ \t\n\r]+(\d+(?:\.\d+)?)"/g;
        var re2 = /\bbackground[ \t\n\r]*:[ \t\n\r]*new[ \t\n\r]+\d+(?:\.\d+)?[ \t\n\r]+\d+(?:\.\d+)?[ \t\n\r]+(\d+(?:\.\d+)?)[ \t\n\r]+(\d+(?:\.\d+)?);/;
        var re3 = /\b(?:width[ \t\n\r]*=[ \t\n\r]*"(\d+(?:px|pc|pt|%|em|en|mm|cm))"|height[ \t\n\r]*=[ \t\n\r]*"(\d+(?:px|pc|pt|%|em|en|mm|cm))")/;
        var re4 = /<path[ \t\n\r]+((?:.)*)\bd[ \t\n\r]*=[ \t\n\r]*(?:"([^"]+)"|'([^']+)')/;
        var re5 = /\bpoints=[ \t\n\r]*=[ \t\n\r]*(?:"([^"]+)"|'([^']+)')/;*/
        var re5 = /\bpoints\s*=\s*(?:"([^"]+)"|'([^']+)')/;
        var re =/\bviewBox[ \t\n\r]*=[ \t\n\r]*"(\d+(?:\.\d+)?)[ \t\n\r]+(\d+(?:\.\d+)?)[ \t\n\r]+(\d+(?:\.\d+)?)[ \t\n\r]+(\d+(?:\.\d+)?)"|\bbackground:new[ \t\n\r]+(\d+(?:\.\d+)?)[ \t\n\r]+(\d+(?:\.\d+)?)[ \t\n\r]+(\d+(?:\.\d+)?)[ \t\n\r]+(\d+(?:\.\d+)?);|\bwidth="(\d+(?:px|pc|pt|%|em|en|mm|cm))"|\bheight="(\d+(?:px|pc|pt|%|em|en|mm|cm))"|<path[ \t\n\r]+((?:.)*)\bd[ \t\n\r]*=[ \t\n\r]*(?:"([^"]+)"|'([^']+)')/;
        re = new RegExp(re.source + "|" + fill.source + "|" + stroke.source + "|" + strokeWidth.source + "|" + re5.source, 'g');
        
        var match, mpath, w, h, matches = [], ndx, dims, pixels, __fill, __stroke, __strokeWidth, _fill, _stroke, _strokeWidth;
        (function split(svg, matches) {
            var i;
            re.lastIndex = i = 0;
            while ((match=re.exec(svg))) {
                matches.push(svg.substring(i, (ndx = re.lastIndex - match[0].length)));

                w = match[3]||match[7];
                if (w) {
                    h = match[4]||match[8];
                    matches.push({ name: match[3] ? 'viewBox' : 'background:new', value: [match[1]||match[5], match[2]||match[6], w, h]});
                    if (!dims) {
                        dims = { width: w, height: h };
                    } else {
                        dims.width = Math.max(dims.width, w);
                        dims.height = Math.max(dims.height, h);
                    }
                } else {
                    w = match[9]; //width with unit
                    if (w) {
                        matches.push({ name: 'width', value: w});
                        if (!pixels) {
                            pixels = {};
                        }
                        pixels.width = w;
                    } else {
                        h = match[10]; //width with unit 
                        if (h) {
                            matches.push({ name: 'height', value: h});
                            if (!pixels) {
                                pixels = {};
                            }
                            pixels.height = h;
                        }
                    }
                }
                mpath = match[12]||match[13];
                if (mpath) {
                   var properties = (match[11]||"").trim(), _matches;
                   if (properties) {
                       var _lastIndex = re.lastIndex;
                       split(properties, _matches = []);
                       re.lastIndex = _lastIndex;
                   }
                   matches.push({ name: 'path', value: mpath, properties : _matches}); 
                } else if (match[14]) { //fill
                    matches.push({ name: 'fill', value: normalizeColor(match[14])});
                    __fill = true;
                } else if (match[15]) { //stroke
                    matches.push({ name: 'stroke', value: normalizeColor(match[15])});
                     __stroke = true;
                } else if (match[16]) { //stroke-width
                    matches.push({ name: 'stroke-width', value: match[16]});
                    __strokeWidth = true;
                } else if (match[17]||match[18]) { //points
                    matches.push({ name: 'points', value: match[17]||match[18]});
                    __strokeWidth = true;
                }
                i = re.lastIndex;
            }
            if (i < svg.length) {
                matches.push(svg.substring(i));
            }
        })(svg, matches);
        var factor;
        if (height) {
            if (dims) {
                factor = coeff(dims, 'height', newSize, pixels);
            } else {                
                factor = pcoeff(pixels, 'height', newSize);
            }
        } else {
            if (dims) {
                factor = coeff(dims, 'width', newSize, pixels);
            } else {
                factor = pcoeff(pixels, 'width', newSize);
            }
        }
        
        _fill = opts.fill||opts.fillColor||opts.Fill||opts.FillColor;
        _stroke = opts.stroke||opts.strokeColor||opts.Stroke||opts.StrokeColor;
        var _svg = (function join(matches, self) {
            var _svg = "", p;
            var props, v, re, m;
            for (var i = 0, n = matches.length; i < n; i++) {
                p = matches[i];
                if (typeof p === 'string') {
                    _svg += p;
                } else {
                    switch(p.name) {
                        case 'viewBox':
                            p.value[2] *= factor;
                            p.value[3] *= factor;
                            _svg += p.name + '="' +  p.value.join(" ") + '"';
                            break;
                        case 'width':
                        case 'height':                            
                            m = /^(\d+(?:\.\d+)?)([a-z]+)?$/.exec(p.value);
                            _svg += p.name + '="' +  ((parseFloat(m[1], 10)*factor)+(m[2]||"")) + '"';
                            break;
                        case 'background:new':
                            p.value[2] *= factor;
                            p.value[3] *= factor;
                            _svg += p.name + ' ' +  p.value.join(" ") + ';';
                            break;
                        case 'path':
                            props = Array.isArray(props = p.properties) ? join(props, self).trim() : "";
                            _svg += '<path' + (props ? ' ' + props : '') + ' d="' + self.zoom(p.value, factor) + '"';                        
                            break;
                        case 'points':
                            _svg += ' points="' + self.zoom(p.value, factor) + '"';
                            break;
                        case 'stroke-width':
                            p.value *= factor;
                            _svg += ' ' + p.name + '="' +  p.value + '"';
                            __strokeWidth = false;
                            break;
                        case 'stroke':
                            if (_stroke)
                                p.value = _stroke;
                            _svg += ' ' + p.name + '="' +  p.value + '"';
                            __stroke = false;
                            break;
                        case 'fill':
                            if (_fill)
                                p.value = _fill;
                            __fill = false;
                            _svg += ' ' + p.name + '="' +  p.value + '"';
                            break;
                        default:
                            _svg += p.name + '="' + p.value + '"';
                    }
                }
            }
            return _svg;
        })(matches, this);
        if ((_fill && (__fill || __fill === undefined)) || 
                (_stroke && (__stroke || __stroke === undefined)) 
                || (_strokeWidth && (__strokeWidth || __strokeWidth === undefined))) {
            _svg = _svg.replace(/<path([ \t\n\r]+|\/|>)/g, 
                /**
                 * 
                 * @param {type} match
                 * @param {type} $1  substring following '<path' in the svg text
                 * @returns {String}
                 */
                function(match, $1) {
                    var p = '<path '; 
                    p += (((__fill || __fill === undefined) && _fill ? 'fill="' + _fill + '"' : "")  || "");
                    p += (((__stroke || __stroke === undefined) && _stroke ? 'stroke="' + _stroke + '"' : "")  || "");
                    p += (((__strokeWidth || __strokeWidth === undefined)  && _strokeWidth ? 'stroke-width="' + _strokeWidth + '"' : "")   || "");
                    p += ($1 = $1.trim()) ? ' ' : $1;
                    return p;
                }
            );
        }
            
        return _svg;
    },
    /**
     * Creates the svg string from the given path and the given options
     * @param {Array|String} path  The single path data (value to get/generate 'd' attribite of 'path' node)
     * @returns {String}
     */
    svgFromPath : function(path) {
        var color, w, h, args = [].slice.call(arguments), m, title= "", close, i = 1, t, 
                fill,
                stroke = false, strokeColor;
        if (typeof (m = args[i++]) === 'boolean') {
            close = m;
            t = typeof (m=args[i++]);
        }
        if (t === 'string') { 
            //require serenix_color_utils.js
            if ((color = normalizeColor(m))) {
                m = args[i++];
                if (isPlainObject(m)) {
                    w = m.width||m.Width;
                    h = m.height||m.Height;
                    title = m.title;
                    if (!title && title !== 0) {
                        title = m.Title;
                    }
                    if (!title && title !==0) {
                        title = "";
                    } else {
                        title = '' + title;
                    }
                    var f = m.fill, t = typeof f;
                    if (t === 'string'  && f) {
                        fill = f;
                    } else if (t === 'object'  && f) {
                        fill = f.color||f.Color ? f.color||f.Color : true;
                    } else if (typeof f !== 'undefined') {
                        fill = !!f;
                    }
                    stroke = m.stroke||m.Stroke||false;
                    if (isPlainObject(stroke)) {
                        strokeColor = stroke.color||stroke.Color;
                        stroke = stroke.width||stroke.Width||1;
                    } else if (typeof stroke === 'string' && stroke) {
                        if (/^\d+(?:px)?$/.test(stroke)) {
                            stroke = parseInt(stroke);
                        } else {
                            strokeColor = stroke;
                        }
                    }
                } else if (arguments.length > i && !isNaN(m = parseInt(m)) === 'number') {
                    w = m;
                    h = isNaN(m = parseInt(args[i])) ?  w: m;
                }
            } else {                    
                if (isNaN(w = parseInt(m))) {
                    title = w;
                    if (isNaN(w = parseInt(args[i++]))) {
                        w = undefined;
                    } else {
                        h = args.length > i ? parseInt(args[i]): w;
                    }
                } else {
                    h = args.length > i ? parseInt(args[i]): w;
                }
            }
        } else if (t === 'number') {
            w = m;
            h = args.length > i ? parseInt(args[i]): w;
        } else if (isPlainObject(m)) {
            color = m.color||m.color;
            w = m.width||m.Width;
            h = m.height||m.Height;
        }
        if (w === undefined || w === null) {
            w = 24;
        }
        if (h === undefined || h === null) {
            h = 24;
        }
        if (close !== true && close !== false) {
            close = args[i];
        }
        if (close === undefined || close === null) {
            close = true;
        } 

        if (!stroke && !strokeColor && color) {
            fill = true;
        } else if (stroke && !strokeColor && !fill) {
            strokeColor = color||'#000000';
        }
        if (!color && !strokeColor) {
            color = '#000000';
        }
        var _path;
        if (path instanceof String) {
            path = path.valueOf();
        }
        if (isArray(path)) {
            var n = path.length, p;
            _path = "";
            if (n && typeof path[0] === 'number') {
                n = (n - (n%2))/2;
                for (i = 0; i < n; i++) {
                    _path += (i === 0 ? "M" : " L") + path[2*i] + "," + path[2*i+1];
                }
                if (close) {
                    _path += " L" + path[0] + "," + path[1];
                }
            } else if (n) {
                function append(p) {
                    if (p instanceof String) {
                        p = p.valueOf();
                    }
                    if (isArray(p)) {
                        _path += (_path ? " L" : "M") + p[0] + "," + (p[1]||0);
                    } else if (isPlainObject(p)) {
                        x = p.x||p.X||0;
                        y = p.y||p.Y||0;
                        cmd = p.command||p.cmd||p.Command||p.Cmd||(i === 0 ? "M": "L");
                        _path += (_path ? " " : "") + cmd + x + "," + y;
                    } else if (typeof p === 'string' && p) {

                    }
                }
                var x, y, cmd;
                for (i = 0; i < n; i++) {
                    append(path[i]);
                }
                if (close) {
                    append(path[0]);
                }
            }
            _path = 'd="' + _path + '"';
        } else if (typeof path === 'string') {
            _path = path.startsWidth('d=') ? path : 'd="' - path + '"';
        }
        var ext = "";
        if (fill === true) {
            ext += ' fill="' + color + '"';
        } else if (fill) {
            ext += ' fill="' + fill + '"';
        }
        if (stroke) {
            ext += ' stroke="' + stroke + '"';
            if (strokeColor) {
                ext += ' stroke-color="' + strokeColor + '"';
            }
        }
        return '<svg  width="'+ w + 'px" height="' + h + 'px" role="img" viewBox="0 0 ' + w +' '+ h + '" xmlns="http://www.w3.org/2000/svg"><title>'+title+'</title><path ' + _path + ext + '/></svg>';
    },
    'ui-grid': {
        'asc': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="asc" d="M5.333,16L7.213,17.88L14.666,10.44L14.666,26.667L17.333,26.667L17.333,10.44L24.773,17.893L26.666,16L15.999,5.333L5.332,16L5.333,16Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        'cancel': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="cancel" d="M16,2.667C8.627,2.667 2.667,8.627 2.667,16C2.667,23.373 8.627,29.333 16,29.333C23.373,29.333 29.333,23.373 29.333,16C29.333,8.627 23.373,2.667 16,2.667ZM22.667,20.787L20.787,22.667L16,17.88L11.213,22.667L9.333,20.787L14.12,16L9.333,11.213L11.213,9.333L16,14.12L20.787,9.333L22.667,11.213L17.88,16L22.667,20.787Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        'chart': '<?xml version="1.0" encoding="UTF-8"?>'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
            + '<!-- Generator: Sketch 51.3 (57544) - http://www.bohemiancoding.com/sketch -->'
            + '<title>chart</title>'
            + '<desc>Created with Sketch.</desc>'
            + '<defs></defs>'
            + '<g id="chart" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'
            + '<rect id="Rectangle-10" fill="#000000" fill-rule="nonzero" x="14" y="7" width="4" height="18"></rect>'
            + '<rect id="Rectangle-10-Copy" fill="#000000" fill-rule="nonzero" x="8" y="17" width="4" height="8"></rect>'
            + '<rect id="Rectangle-10-Copy-2" fill="#000000" fill-rule="nonzero" x="20" y="13" width="4" height="12"></rect>'
            + '</g>'
            + '</svg>',
        'checkbox-checked': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="checkbox-checked" d="M28.444,0L3.556,0C1.583,0 0,1.6 0,3.556L0,28.444C0,30.4 1.583,32 3.556,32L28.444,32C30.417,32 32,30.4 32,28.444L32,3.556C32,1.6 30.417,0 28.444,0ZM12.445,24.888L3.556,15.999L6.062,13.493L12.445,19.857L25.938,6.364L28.444,8.888L12.445,24.887L12.445,24.888Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        'checkbox-indeterminate': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="checkbox-indeterminate" d="M28.444,0L3.556,0C1.6,0 0,1.6 0,3.556L0,28.444C0,30.4 1.6,32 3.556,32L28.444,32C30.4,32 32,30.4 32,28.444L32,3.556C32,1.6 30.4,0 28.444,0ZM24.89,17.777L7.113,17.777L7.113,14.221L24.89,14.221L24.89,17.777Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        'checkbox-unchecked': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="checkbox-unchecked" d="M28.444,3.556L28.444,28.444L3.556,28.444L3.556,3.556L28.444,3.556ZM28.444,0L3.556,0C1.6,0 0,1.6 0,3.556L0,28.444C0,30.4 1.6,32 3.556,32L28.444,32C30.4,32 32,30.4 32,28.444L32,3.556C32,1.6 30.4,0 28.444,0Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        'columns': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<g id="columns" transform="matrix(1,0,0,1,0,-1)">'
            + '<path d="M26,25L6,25L6,7L26,7L26,25ZM12,11L8,11L8,23L12,23L12,11ZM18,11L14,11L14,23L18,23L18,11ZM24,23L24,11L20,11L20,23L24,23Z" style="fill-rule:nonzero;"/>'
            + '</g>'
            + '</svg>',
        'copy': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="copy" d="M22,1.333L6,1.333C4.533,1.333 3.333,2.533 3.333,4L3.333,22.667L6,22.667L6,4L22,4L22,1.333ZM26,6.667L11.333,6.667C9.866,6.667 8.666,7.867 8.666,9.334L8.666,28.001C8.666,29.468 9.866,30.668 11.333,30.668L26,30.668C27.467,30.668 28.667,29.468 28.667,28.001L28.667,9.334C28.667,7.867 27.467,6.667 26,6.667ZM26,28L11.333,28L11.333,9.333L26,9.333L26,28Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        'csv': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<g id="csv" transform="matrix(0.0628455,0,0,0.0628455,3.93367,-0.0538814)">'
            + '<path d="M384,131.9C376.247,123.467 273.575,3.427 269.1,-1.1L48,-0.1C21.5,0 0,21.5 0,48L0,464C0,490.5 21.5,512 48,512L336,512C362.5,512 384,490.5 384,464L384,131.9ZM348.1,134L257,134L257,27.9L348.1,134ZM30,479L30,27L230,27L231,132C231,145.3 229.7,161 243,161L354,161L355,479L30,479Z" style="fill-rule:nonzero;"/>'
            + '<g transform="matrix(1.39197,0,0,2.06442,-182.891,-281.022)">'
            + '<g transform="matrix(96,0,0,96,167.839,336.768)">'
            + '<path d="M0.688,-0.226C0.688,-0.203 0.682,-0.179 0.671,-0.152C0.66,-0.126 0.642,-0.1 0.618,-0.074C0.594,-0.048 0.563,-0.028 0.526,-0.012C0.488,0.004 0.445,0.012 0.395,0.012C0.357,0.012 0.323,0.009 0.292,0.001C0.261,-0.006 0.233,-0.017 0.208,-0.032C0.183,-0.047 0.159,-0.067 0.138,-0.092C0.119,-0.114 0.103,-0.139 0.09,-0.167C0.076,-0.195 0.066,-0.225 0.06,-0.256C0.053,-0.288 0.05,-0.321 0.05,-0.357C0.05,-0.415 0.058,-0.466 0.075,-0.512C0.092,-0.557 0.116,-0.596 0.147,-0.629C0.178,-0.661 0.215,-0.686 0.257,-0.703C0.299,-0.72 0.344,-0.728 0.391,-0.728C0.449,-0.728 0.501,-0.716 0.546,-0.693C0.591,-0.67 0.626,-0.642 0.65,-0.608C0.674,-0.574 0.686,-0.542 0.686,-0.511C0.686,-0.495 0.68,-0.48 0.668,-0.467C0.657,-0.455 0.643,-0.448 0.626,-0.448C0.607,-0.448 0.594,-0.453 0.584,-0.461C0.575,-0.47 0.565,-0.485 0.553,-0.507C0.534,-0.542 0.512,-0.569 0.487,-0.586C0.461,-0.604 0.43,-0.613 0.392,-0.613C0.333,-0.613 0.285,-0.59 0.25,-0.545C0.214,-0.5 0.197,-0.435 0.197,-0.352C0.197,-0.296 0.205,-0.25 0.22,-0.213C0.236,-0.176 0.258,-0.149 0.287,-0.13C0.315,-0.112 0.349,-0.103 0.387,-0.103C0.429,-0.103 0.464,-0.113 0.493,-0.134C0.522,-0.155 0.543,-0.185 0.558,-0.225C0.564,-0.244 0.572,-0.259 0.581,-0.271C0.59,-0.283 0.605,-0.289 0.625,-0.289C0.642,-0.289 0.657,-0.283 0.669,-0.271C0.682,-0.259 0.688,-0.244 0.688,-0.226Z" style="fill-rule:nonzero;"/>'
            + '</g>'
            + '<g transform="matrix(96,0,0,96,238.902,336.768)">'
            + '<path d="M0.622,-0.215C0.622,-0.172 0.611,-0.133 0.589,-0.098C0.566,-0.064 0.534,-0.037 0.491,-0.017C0.448,0.002 0.397,0.012 0.338,0.012C0.267,0.012 0.209,-0.001 0.163,-0.028C0.131,-0.047 0.104,-0.073 0.084,-0.105C0.063,-0.137 0.053,-0.168 0.053,-0.198C0.053,-0.216 0.059,-0.231 0.072,-0.243C0.084,-0.256 0.099,-0.262 0.118,-0.262C0.133,-0.262 0.146,-0.257 0.157,-0.248C0.168,-0.238 0.177,-0.223 0.184,-0.204C0.193,-0.181 0.203,-0.162 0.214,-0.147C0.224,-0.132 0.239,-0.119 0.258,-0.109C0.278,-0.099 0.303,-0.094 0.334,-0.094C0.377,-0.094 0.412,-0.104 0.439,-0.124C0.466,-0.144 0.479,-0.169 0.479,-0.199C0.479,-0.223 0.472,-0.242 0.457,-0.257C0.443,-0.272 0.424,-0.283 0.401,-0.291C0.378,-0.299 0.347,-0.307 0.309,-0.316C0.258,-0.328 0.215,-0.342 0.18,-0.358C0.145,-0.374 0.118,-0.396 0.097,-0.424C0.077,-0.452 0.067,-0.486 0.067,-0.528C0.067,-0.567 0.078,-0.602 0.099,-0.633C0.121,-0.663 0.152,-0.687 0.192,-0.703C0.233,-0.72 0.281,-0.728 0.336,-0.728C0.38,-0.728 0.418,-0.723 0.45,-0.712C0.482,-0.701 0.509,-0.686 0.53,-0.668C0.551,-0.65 0.566,-0.631 0.576,-0.611C0.586,-0.591 0.591,-0.572 0.591,-0.553C0.591,-0.536 0.585,-0.52 0.573,-0.507C0.56,-0.493 0.545,-0.486 0.527,-0.486C0.51,-0.486 0.498,-0.49 0.489,-0.498C0.48,-0.507 0.471,-0.52 0.461,-0.539C0.448,-0.566 0.432,-0.587 0.414,-0.602C0.396,-0.617 0.367,-0.625 0.326,-0.625C0.289,-0.625 0.259,-0.617 0.236,-0.6C0.213,-0.584 0.201,-0.564 0.201,-0.541C0.201,-0.527 0.205,-0.514 0.213,-0.504C0.221,-0.493 0.231,-0.485 0.245,-0.477C0.259,-0.47 0.273,-0.464 0.287,-0.459C0.301,-0.455 0.324,-0.449 0.356,-0.441C0.396,-0.431 0.433,-0.421 0.466,-0.41C0.498,-0.398 0.526,-0.384 0.549,-0.368C0.572,-0.352 0.59,-0.331 0.603,-0.306C0.616,-0.281 0.622,-0.251 0.622,-0.215Z" style="fill-rule:nonzero;"/>'
            + '</g>'
            + '<g transform="matrix(96,0,0,96,302.933,336.768)">'
            + '<path d="M0.184,-0.633L0.346,-0.153L0.509,-0.636C0.517,-0.662 0.524,-0.679 0.528,-0.689C0.532,-0.699 0.539,-0.708 0.549,-0.716C0.559,-0.724 0.572,-0.728 0.589,-0.728C0.601,-0.728 0.613,-0.725 0.623,-0.719C0.634,-0.713 0.642,-0.704 0.648,-0.694C0.654,-0.684 0.657,-0.674 0.657,-0.663C0.657,-0.656 0.656,-0.648 0.654,-0.64C0.652,-0.632 0.65,-0.623 0.647,-0.615C0.644,-0.608 0.641,-0.599 0.638,-0.591L0.465,-0.123C0.459,-0.105 0.452,-0.088 0.446,-0.072C0.44,-0.056 0.433,-0.042 0.425,-0.03C0.417,-0.017 0.406,-0.007 0.392,0C0.379,0.008 0.362,0.012 0.343,0.012C0.323,0.012 0.307,0.008 0.293,0.001C0.28,-0.007 0.269,-0.017 0.26,-0.03C0.252,-0.042 0.245,-0.056 0.239,-0.072C0.233,-0.088 0.226,-0.105 0.22,-0.123L0.05,-0.587C0.047,-0.595 0.044,-0.604 0.041,-0.612C0.038,-0.62 0.035,-0.629 0.033,-0.638C0.031,-0.648 0.03,-0.656 0.03,-0.662C0.03,-0.679 0.036,-0.694 0.05,-0.708C0.063,-0.721 0.08,-0.728 0.1,-0.728C0.125,-0.728 0.142,-0.72 0.153,-0.705C0.163,-0.69 0.173,-0.666 0.184,-0.633Z" style="fill-rule:nonzero;"/>'
            + '</g>'
            + '</g>'
            + '</g>'
            + '</svg>',
        'desc': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="desc" d="M26.667,16L24.787,14.12L17.334,21.56L17.334,5.333L14.667,5.333L14.667,21.56L7.227,14.107L5.334,16L16.001,26.667L26.668,16L26.667,16Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        'excel': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<g id="excel" transform="matrix(0.0628455,0,0,0.0628455,3.93367,-0.0538814)">'
            + '<path d="M384,131.9C376.247,123.467 273.575,3.427 269.1,-1.1L48,-0.1C21.5,0 0,21.5 0,48L0,464C0,490.5 21.5,512 48,512L336,512C362.5,512 384,490.5 384,464L384,131.9ZM348.1,134L257,134L257,27.9L348.1,134ZM30,479L30,27L230,27L231,132C231,145.3 229.7,161 243,161L354,161L355,479L30,479Z" style="fill-rule:nonzero;"/>'
            + '<g transform="matrix(2.95515,0,0,2.73617,-393.555,-508.033)">'
            + '<g transform="matrix(96,0,0,96,167.839,336.768)">'
            + '<path d="M0.052,-0.139L0.212,-0.373L0.077,-0.581C0.064,-0.601 0.055,-0.619 0.049,-0.633C0.042,-0.648 0.039,-0.661 0.039,-0.675C0.039,-0.688 0.045,-0.701 0.057,-0.712C0.07,-0.723 0.084,-0.728 0.102,-0.728C0.122,-0.728 0.138,-0.722 0.149,-0.71C0.16,-0.698 0.176,-0.676 0.196,-0.644L0.303,-0.47L0.418,-0.644C0.427,-0.659 0.435,-0.671 0.442,-0.682C0.449,-0.692 0.455,-0.701 0.461,-0.708C0.468,-0.714 0.475,-0.719 0.482,-0.723C0.49,-0.726 0.499,-0.728 0.509,-0.728C0.527,-0.728 0.542,-0.723 0.553,-0.712C0.565,-0.701 0.571,-0.688 0.571,-0.673C0.571,-0.651 0.558,-0.621 0.533,-0.584L0.392,-0.373L0.544,-0.139C0.558,-0.119 0.568,-0.102 0.574,-0.088C0.58,-0.075 0.583,-0.062 0.583,-0.05C0.583,-0.038 0.58,-0.028 0.575,-0.019C0.569,-0.009 0.561,-0.002 0.551,0.004C0.541,0.009 0.53,0.012 0.517,0.012C0.503,0.012 0.492,0.009 0.482,0.004C0.473,-0.002 0.465,-0.009 0.459,-0.018C0.454,-0.026 0.443,-0.042 0.427,-0.067L0.301,-0.265L0.167,-0.061C0.157,-0.045 0.149,-0.033 0.145,-0.027C0.14,-0.02 0.135,-0.014 0.129,-0.008C0.123,-0.002 0.115,0.003 0.107,0.007C0.098,0.01 0.089,0.012 0.077,0.012C0.06,0.012 0.045,0.007 0.033,-0.004C0.022,-0.015 0.016,-0.03 0.016,-0.051C0.016,-0.075 0.028,-0.104 0.052,-0.139Z" style="fill-rule:nonzero;"/>'
            + '</g>'
            + '</g>'
            + '</g>'
            + '</svg>',
        'expanded': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<g id="expanded" transform="matrix(-2,-2.4493e-16,2.4493e-16,-2,36,30)">'
            + '<path d="M8,2L13,7L8,12L7,11L11,7L7,3L8,2Z"/>'
            + '</g>'
            + '</svg>',
        eye24x24: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">'
            + '  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>'
            + '  <circle cx="12" cy="12" r="2" />'
            + '  <path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" />'
            + '</svg>',
        'eye': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<g id="eye">'
            + '<path id="Combined-Shape" d="M16.5,23C21.124,23 25.206,20.177 26.852,16C25.206,11.823 21.124,9 16.5,9C11.876,9 7.794,11.823 6.148,16C7.794,20.177 11.876,23 16.5,23ZM4.119,15.667C5.958,10.515 10.892,7 16.5,7C22.108,7 27.042,10.515 28.881,15.667L29,16L28.881,16.333C27.042,21.485 22.108,25 16.5,25C10.892,25 5.958,21.485 4.119,16.333L4,16L4.119,15.667ZM16.5,21C19.289,21 21.549,18.761 21.549,16C21.549,13.239 19.289,11 16.5,11C13.711,11 11.451,13.239 11.451,16C11.451,18.761 13.711,21 16.5,21Z" style="fill-rule:nonzero;"/>'
            + '</g>'
            + '</svg>',
        'filter': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<g id="filter">'
            + '<path d="M28,8L20,16L20,21L14,27L14,16L6,8L6,6L28,6L28,8ZM9,8L16,15L16,22L18,20L18,15L25,8L9,8Z" style="fill-rule:nonzero;"/>'
            + '</g>'
            + '</svg>',
        'first': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="first" d="M24.273,22.12L18.153,16L24.273,9.88L22.393,8L14.393,16L22.393,24L24.273,22.12ZM7.727,8L10.394,8L10.394,24L7.727,24L7.727,8Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        'group': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<g id="group" transform="matrix(2,0,0,2,0,-2)">'
            + '<path d="M14,7L14,8L9,8L9,7L14,7ZM14,4L14,5L5.001,5L5.001,4L14,4ZM7,11L5,11L5,10L7,10L7,11ZM7,8L5,8L5,7L7,7L7,8ZM3,5L1,5L1,4L3,4L3,5ZM14,10L14,11L9,11L9,10L14,10ZM7,14L5,14L5,13L7,13L7,14ZM14,13L14,14L9,14L9,13L14,13Z" style="fill-rule:nonzero;"/>'
            + '</g>'
            + '</svg>',
        'last': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="last" d="M7.727,9.88L13.847,16L7.727,22.12L9.607,24L17.607,16L9.607,8L7.727,9.88ZM21.607,8L24.274,8L24.274,24L21.607,24L21.607,8Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        'left': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="left" d="M26.667,14.667L10.44,14.667L17.893,7.214L16,5.334L5.333,16.001L16,26.668L17.88,24.788L10.44,17.335L26.667,17.335L26.667,14.667Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        'linked': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="linked" d="M5.2,16C5.2,13.72 7.053,11.867 9.333,11.867L14.666,11.867L14.666,9.334L9.333,9.334C5.653,9.334 2.666,12.321 2.666,16.001C2.666,19.681 5.653,22.668 9.333,22.668L14.666,22.668L14.666,20.135L9.333,20.135C7.053,20.135 5.2,18.282 5.2,16.002L5.2,16ZM10.667,17.333L21.334,17.333L21.334,14.666L10.667,14.666L10.667,17.333ZM22.667,9.333L17.334,9.333L17.334,11.866L22.667,11.866C24.947,11.866 26.8,13.719 26.8,15.999C26.8,18.279 24.947,20.132 22.667,20.132L17.334,20.132L17.334,22.665L22.667,22.665C26.347,22.665 29.334,19.678 29.334,15.998C29.334,12.318 26.347,9.331 22.667,9.331L22.667,9.333Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        'loading': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<g id="loading" transform="matrix(1.23077,0,0,1.23077,-3.69231,-3.69231)">'
            + '<path d="M17,29L15,29L15,21L17,21L17,29ZM13.414,20L7,26.414L5.586,25L12,18.586C12.472,19.058 12.942,19.528 13.414,20ZM26.414,25L25,26.414L18.586,20L20,18.586C22.138,20.724 24.276,22.862 26.414,25ZM29,17L21,17L21,15L29,15L29,17ZM11,17L3,17L3,15L11,15L11,17ZM13.414,12L12,13.414L5.586,7L7,5.586C9.138,7.724 11.276,9.862 13.414,12ZM26.414,7L20,13.414L18.586,12L25,5.586C25.472,6.058 25.942,6.528 26.414,7ZM17,11L15,11L15,3L17,3L17,11Z" style="fill-rule:nonzero;"/>'
            + '</g>'
            + '</svg>',
        'next': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<g id="next" transform="matrix(1,0,0,1,1,0)">'
            + '<path d="M10.94,6L9.06,7.88L17.167,16L9.06,24.12L10.94,26L20.94,16L10.94,6Z" style="fill-rule:nonzero;"/>'
            + '</g>'
            + '</svg>',
        'paste': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="paste" d="M25.334,4L19.76,4C19.2,2.453 17.733,1.333 16,1.333C14.267,1.333 12.8,2.453 12.24,4L6.667,4C5.2,4 4,5.2 4,6.667L4,28C4,29.467 5.2,30.667 6.667,30.667L25.334,30.667C26.801,30.667 28.001,29.467 28.001,28L28.001,6.667C28.001,5.2 26.801,4 25.334,4ZM16,4C16.733,4 17.333,4.6 17.333,5.333C17.333,6.066 16.733,6.666 16,6.666C15.267,6.666 14.667,6.066 14.667,5.333C14.667,4.6 15.267,4 16,4ZM25.333,28L6.666,28L6.666,6.667L9.333,6.667L9.333,10.667L22.666,10.667L22.666,6.667L25.333,6.667L25.333,28Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        'pivot': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="pivot" d="M25.128,2.002C27.688,2.098 29.9,4.294 29.998,6.872C30.076,12.956 30.076,19.044 29.998,25.128C29.902,27.688 27.706,29.9 25.128,29.998C19.044,30.076 12.956,30.076 6.872,29.998C4.314,29.902 2.1,27.708 2.002,25.128C1.924,19.044 1.924,12.956 2.002,6.872C2.098,4.312 4.294,2.1 6.872,2.002C12.956,1.924 19.044,1.924 25.128,2.002ZM28.094,9.956L9.892,9.956L9.892,28.092C14.978,28.222 20.072,28.19 25.156,27.996C26.636,27.902 27.902,26.646 27.996,25.156C28.188,20.092 28.222,15.022 28.094,9.956ZM3.968,24.1C3.978,24.452 3.99,24.804 4.004,25.156C4.098,26.64 5.358,27.902 6.844,27.996C7.182,28.008 7.518,28.02 7.856,28.032L7.856,24.1L3.968,24.1ZM22,15.414L21.708,15.708L20.292,14.292L23,11.586C23.902,12.488 24.804,13.39 25.708,14.292L24.292,15.708L24,15.414L24,19.006C23.968,21.61 21.754,23.898 19.128,23.998L15.414,24L15.708,24.292L14.292,25.708L11.586,23L14.292,20.292C14.764,20.764 15.236,21.236 15.708,21.708L15.386,22.028C18.758,22.058 21.964,21.864 22,18.994L22,15.414ZM3.88,18.038C3.882,19.384 3.892,20.732 3.918,22.078L7.856,22.078L7.856,18.038L3.88,18.038ZM3.93,11.976C3.912,13.324 3.896,14.67 3.886,16.018L7.856,16.018L7.856,11.976L3.93,11.976ZM9.892,3.986C8.93,3.994 7.968,4 7.006,4C5.436,4.02 4.06,5.348 4.002,6.922C3.99,7.934 3.974,8.944 3.96,9.956L7.856,9.956L7.856,7.936L9.892,7.936L9.892,3.986ZM24.136,3.97L24.136,7.936L28.034,7.936C28.022,7.572 28.01,7.208 27.996,6.844C27.902,5.364 26.646,4.098 25.156,4.004C24.816,3.992 24.476,3.98 24.136,3.97ZM15.996,3.916C14.64,3.93 13.282,3.948 11.926,3.964L11.926,7.936L15.996,7.936L15.996,3.916ZM22.102,3.924C20.744,3.902 19.388,3.898 18.032,3.902L18.032,7.936L22.102,7.936L22.102,3.924Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        'previous': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="previous" d="M21.94,7.88L20.06,6L10.06,16L20.06,26L21.94,24.12L13.833,16L21.94,7.88Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        'radio-button-off': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<g id="radio-button-off" transform="matrix(1.20003,0,0,1.20003,-3.20048,-3.20048)">'
            + '<path d="M16,2.667C8.64,2.667 2.667,8.64 2.667,16C2.667,23.36 8.64,29.333 16,29.333C23.36,29.333 29.333,23.36 29.333,16C29.333,8.64 23.36,2.667 16,2.667ZM16,26.667C10.107,26.667 5.333,21.894 5.333,16C5.333,10.106 10.106,5.333 16,5.333C21.893,5.333 26.667,10.106 26.667,16C26.667,21.894 21.894,26.667 16,26.667Z" style="fill-rule:nonzero;"/>'
            + '</g>'
            + '</svg>',
        'radio-button-on': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<g id="radio-button-on" transform="matrix(1.20003,0,0,1.20003,-3.20048,-3.20048)">'
            + '<path d="M16,9.333C12.32,9.333 9.333,12.32 9.333,16C9.333,19.68 12.32,22.667 16,22.667C19.68,22.667 22.667,19.68 22.667,16C22.667,12.32 19.68,9.333 16,9.333ZM16,2.667C8.64,2.667 2.667,8.64 2.667,16C2.667,23.36 8.64,29.333 16,29.333C23.36,29.333 29.333,23.36 29.333,16C29.333,8.64 23.36,2.667 16,2.667ZM16,26.667C10.107,26.667 5.333,21.894 5.333,16C5.333,10.106 10.106,5.333 16,5.333C21.893,5.333 26.667,10.106 26.667,16C26.667,21.894 21.894,26.667 16,26.667Z" style="fill-rule:nonzero;"/>'
            + '</g>'
            + '</svg>',
        'right': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="right" d="M16,5.333L14.12,7.213L21.56,14.666L5.333,14.666L5.333,17.333L21.56,17.333L14.12,24.786L16,26.666L26.667,15.999L16,5.332L16,5.333Z" style="fill-rule:nonzero;"/>'
            + '</svg>',
        'save': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<g id="save">'
            + '<g id="small-down" transform="matrix(1,0,0,1,8,14)">'
            + '<path id="Shape" d="M15.708,2.355L8,10.061L0.292,2.355L1.708,0.939L8,7.233L14.292,0.939C14.764,1.411 15.236,1.883 15.708,2.355Z" style="fill-rule:nonzero;"/>'
            + '</g>'
            + '<rect id="Rectangle" x="5" y="26" width="22" height="2"/>'
            + '<rect id="Rectangle-Copy" x="15" y="4" width="2" height="18"/>'
            + '</g>'
            + '</svg>',
        'unlinked': '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
            + '<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">'
            + '<path id="unlinked" d="M22.667,9.333L17.334,9.333L17.334,11.866L22.667,11.866C24.947,11.866 26.8,13.719 26.8,15.999C26.8,17.906 25.493,19.506 23.72,19.972L25.667,21.919C27.84,20.812 29.334,18.599 29.334,15.999C29.334,12.319 26.347,9.332 22.667,9.332L22.667,9.333ZM21.333,14.667L18.413,14.667L21.08,17.334L21.333,17.334L21.333,14.667ZM2.667,5.693L6.814,9.84C4.387,10.827 2.667,13.213 2.667,16C2.667,19.68 5.654,22.667 9.334,22.667L14.667,22.667L14.667,20.134L9.334,20.134C7.054,20.134 5.201,18.281 5.201,16.001C5.201,13.881 6.814,12.134 8.881,11.908L11.641,14.668L10.668,14.668L10.668,17.335L14.308,17.335L17.335,20.362L17.335,22.669L19.642,22.669L24.989,28.002L26.669,26.322L4.362,4.002L2.669,5.695L2.667,5.693Z" style="fill-rule:nonzero;"/>'
            + '</svg>'
    },
    printer: '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
            + '<!-- Created with Inkscape (http://www.inkscape.org/) -->'
            + '<svg '
            + '   xmlns:dc="http://purl.org/dc/elements/1.1/"'
            + '   xmlns:cc="http://creativecommons.org/ns#"'
            + '   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"'
            + '   xmlns:svg="http://www.w3.org/2000/svg"'
            + '   xmlns="http://www.w3.org/2000/svg"'
            + '   xmlns:xlink="http://www.w3.org/1999/xlink"'
            + '   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"'
            + '   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"'
            + '   sodipodi:docname="printer.svg"'
            + '   sodipodi:docbase="/home/jimmac/src/cvs/tango-icon-theme/scalable/devices"'
            + '   inkscape:version="0.46"'
            + '   sodipodi:version="0.32"'
            + '   id="svg2994"'
            + '   height="48px"'
            + '   width="48px"'
            + '   inkscape:output_extension="org.inkscape.output.svg.inkscape">'
            + '  <defs'
            + '	 id="defs3">'
            + '	<inkscape:perspective'
            + '	   sodipodi:type="inkscape:persp3d"'
            + '	   inkscape:vp_x="0 : 24 : 1"'
            + '	   inkscape:vp_y="0 : 1000 : 0"'
            + '	   inkscape:vp_z="48 : 24 : 1"'
            + '	   inkscape:persp3d-origin="24 : 16 : 1"'
            + '	   id="perspective79" />'
            + '	<radialGradient'
            + '	   inkscape:collect="always"'
            + '	   xlink:href="#linearGradient5060"'
            + '	   id="radialGradient6719"'
            + '	   gradientUnits="userSpaceOnUse"'
            + '	   gradientTransform="matrix(-2.774389,0,0,1.969706,112.7623,-872.8854)"'
            + '	   cx="605.71429"'
            + '	   cy="486.64789"'
            + '	   fx="605.71429"'
            + '	   fy="486.64789"'
            + '	   r="117.14286" />'
            + '	<linearGradient'
            + '	   inkscape:collect="always"'
            + '	   id="linearGradient5060">'
            + '	  <stop'
            + '		 style="stop-color:black;stop-opacity:1;"'
            + '		 offset="0"'
            + '		 id="stop5062" />'
            + '	  <stop'
            + '		 style="stop-color:black;stop-opacity:0;"'
            + '		 offset="1"'
            + '		 id="stop5064" />'
            + '	</linearGradient>'
            + '	<radialGradient'
            + '	   inkscape:collect="always"'
            + '	   xlink:href="#linearGradient5060"'
            + '	   id="radialGradient6717"'
            + '	   gradientUnits="userSpaceOnUse"'
            + '	   gradientTransform="matrix(2.774389,0,0,1.969706,-1891.633,-872.8854)"'
            + '	   cx="605.71429"'
            + '	   cy="486.64789"'
            + '	   fx="605.71429"'
            + '	   fy="486.64789"'
            + '	   r="117.14286" />'
            + '	<linearGradient'
            + '	   id="linearGradient5048">'
            + '	  <stop'
            + '		 style="stop-color:black;stop-opacity:0;"'
            + '		 offset="0"'
            + '		 id="stop5050" />'
            + '	  <stop'
            + '		 id="stop5056"'
            + '		 offset="0.5"'
            + '		 style="stop-color:black;stop-opacity:1;" />'
            + '	  <stop'
            + '		 style="stop-color:black;stop-opacity:0;"'
            + '		 offset="1"'
            + '		 id="stop5052" />'
            + '	</linearGradient>'
            + '	<linearGradient'
            + '	   inkscape:collect="always"'
            + '	   xlink:href="#linearGradient5048"'
            + '	   id="linearGradient6715"'
            + '	   gradientUnits="userSpaceOnUse"'
            + '	   gradientTransform="matrix(2.774389,0,0,1.969706,-1892.179,-872.8854)"'
            + '	   x1="302.85715"'
            + '	   y1="366.64789"'
            + '	   x2="302.85715"'
            + '	   y2="609.50507" />'
            + '	<linearGradient'
            + '	   id="linearGradient4762">'
            + '	  <stop'
            + '		 style="stop-color:#ffffff;stop-opacity:0.12371134;"'
            + '		 offset="0.0000000"'
            + '		 id="stop4764" />'
            + '	  <stop'
            + '		 id="stop4768"'
            + '		 offset="0.10344828"'
            + '		 style="stop-color:#ffffff;stop-opacity:1.0000000;" />'
            + '	  <stop'
            + '		 style="stop-color:#ffffff;stop-opacity:0;"'
            + '		 offset="1"'
            + '		 id="stop4766" />'
            + '	</linearGradient>'
            + '	<linearGradient'
            + '	   id="linearGradient4741">'
            + '	  <stop'
            + '		 id="stop4743"'
            + '		 offset="0.0000000"'
            + '		 style="stop-color:#dcdcda;stop-opacity:1.0000000;" />'
            + '	  <stop'
            + '		 id="stop4745"'
            + '		 offset="1.0000000"'
            + '		 style="stop-color:#bab9b7;stop-opacity:1.0000000;" />'
            + '	</linearGradient>'
            + '	<linearGradient'
            + '	   id="linearGradient4733">'
            + '	  <stop'
            + '		 id="stop4735"'
            + '		 offset="0.0000000"'
            + '		 style="stop-color:#000000;stop-opacity:0.23711340;" />'
            + '	  <stop'
            + '		 id="stop4737"'
            + '		 offset="1"'
            + '		 style="stop-color:#000000;stop-opacity:0;" />'
            + '	</linearGradient>'
            + '	<linearGradient'
            + '	   id="linearGradient4698">'
            + '	  <stop'
            + '		 id="stop4700"'
            + '		 offset="0.0000000"'
            + '		 style="stop-color:#fffffd;stop-opacity:1.0000000;" />'
            + '	  <stop'
            + '		 style="stop-color:#bbbbb9;stop-opacity:1.0000000;"'
            + '		 offset="0.50000000"'
            + '		 id="stop4706" />'
            + '	  <stop'
            + '		 id="stop4702"'
            + '		 offset="1.0000000"'
            + '		 style="stop-color:#000000;stop-opacity:1.0000000;" />'
            + '	</linearGradient>'
            + '	<linearGradient'
            + '	   id="linearGradient4688">'
            + '	  <stop'
            + '		 id="stop4690"'
            + '		 offset="0.0000000"'
            + '		 style="stop-color:#666666;stop-opacity:1.0000000;" />'
            + '	  <stop'
            + '		 id="stop4692"'
            + '		 offset="1"'
            + '		 style="stop-color:#000000;stop-opacity:0;" />'
            + '	</linearGradient>'
            + '	<linearGradient'
            + '	   id="linearGradient4680"'
            + '	   inkscape:collect="always">'
            + '	  <stop'
            + '		 id="stop4682"'
            + '		 offset="0"'
            + '		 style="stop-color:#f7f6f5;stop-opacity:1;" />'
            + '	  <stop'
            + '		 id="stop4684"'
            + '		 offset="1"'
            + '		 style="stop-color:#f7f6f5;stop-opacity:0;" />'
            + '	</linearGradient>'
            + '	<linearGradient'
            + '	   id="linearGradient4668">'
            + '	  <stop'
            + '		 id="stop4670"'
            + '		 offset="0"'
            + '		 style="stop-color:#8e8d87;stop-opacity:1;" />'
            + '	  <stop'
            + '		 style="stop-color:#cbc9c1;stop-opacity:1.0000000;"'
            + '		 offset="0.27586207"'
            + '		 id="stop4676" />'
            + '	  <stop'
            + '		 id="stop4672"'
            + '		 offset="1.0000000"'
            + '		 style="stop-color:#8e8d87;stop-opacity:1.0000000;" />'
            + '	</linearGradient>'
            + '	<linearGradient'
            + '	   id="linearGradient259">'
            + '	  <stop'
            + '		 id="stop260"'
            + '		 offset="0.0000000"'
            + '		 style="stop-color:#e0e0e0;stop-opacity:1.0000000;" />'
            + '	  <stop'
            + '		 style="stop-color:#ffffff;stop-opacity:1.0000000;"'
            + '		 offset="0.40546969"'
            + '		 id="stop4886" />'
            + '	  <stop'
            + '		 style="stop-color:#cdcdcd;stop-opacity:1.0000000;"'
            + '		 offset="0.53448278"'
            + '		 id="stop4884" />'
            + '	  <stop'
            + '		 id="stop261"'
            + '		 offset="1.0000000"'
            + '		 style="stop-color:#494949;stop-opacity:1.0000000;" />'
            + '	</linearGradient>'
            + '	<linearGradient'
            + '	   id="linearGradient15662">'
            + '	  <stop'
            + '		 id="stop15664"'
            + '		 offset="0.0000000"'
            + '		 style="stop-color:#ffffff;stop-opacity:0.0000000;" />'
            + '	  <stop'
            + '		 id="stop15666"'
            + '		 offset="1.0000000"'
            + '		 style="stop-color:#f8f8f8;stop-opacity:1.0000000;" />'
            + '	</linearGradient>'
            + '	<radialGradient'
            + '	   r="2.1227016"'
            + '	   fy="26.925594"'
            + '	   fx="9.1295490"'
            + '	   cy="26.925594"'
            + '	   cx="9.1295490"'
            + '	   gradientUnits="userSpaceOnUse"'
            + '	   id="radialGradient1433"'
            + '	   xlink:href="#linearGradient4698"'
            + '	   inkscape:collect="always" />'
            + '	<linearGradient'
            + '	   y2="72.064316"'
            + '	   x2="9.9128132"'
            + '	   y1="57.227650"'
            + '	   x1="9.8698082"'
            + '	   gradientTransform="matrix(2.772086,0.000000,0.000000,0.360739,0.618718,2.883883)"'
            + '	   gradientUnits="userSpaceOnUse"'
            + '	   id="linearGradient1447"'
            + '	   xlink:href="#linearGradient4733"'
            + '	   inkscape:collect="always" />'
            + '	<linearGradient'
            + '	   y2="54.136139"'
            + '	   x2="10.338233"'
            + '	   y1="64.652260"'
            + '	   x1="10.338233"'
            + '	   gradientTransform="matrix(2.369844,0.000000,0.000000,0.421969,0.000000,2.000000)"'
            + '	   gradientUnits="userSpaceOnUse"'
            + '	   id="linearGradient1451"'
            + '	   xlink:href="#linearGradient4680"'
            + '	   inkscape:collect="always" />'
            + '	<linearGradient'
            + '	   y2="62.282467"'
            + '	   x2="9.7052784"'
            + '	   y1="70.724976"'
            + '	   x1="9.7316532"'
            + '	   gradientTransform="matrix(2.369844,0.000000,0.000000,0.421969,0.000000,2.000000)"'
            + '	   gradientUnits="userSpaceOnUse"'
            + '	   id="linearGradient1453"'
            + '	   xlink:href="#linearGradient4688"'
            + '	   inkscape:collect="always" />'
            + '	<linearGradient'
            + '	   y2="19.337463"'
            + '	   x2="20.717800"'
            + '	   y1="25.140253"'
            + '	   x1="20.771229"'
            + '	   gradientTransform="matrix(1.198769,0,0,0.853565,-0.143086,2.034513)"'
            + '	   gradientUnits="userSpaceOnUse"'
            + '	   id="linearGradient1456"'
            + '	   xlink:href="#linearGradient15662"'
            + '	   inkscape:collect="always" />'
            + '	<linearGradient'
            + '	   y2="25.247311"'
            + '	   x2="24.789707"'
            + '	   y1="3.6785457"'
            + '	   x1="25.056711"'
            + '	   gradientTransform="matrix(0.94571,0,0,1.076032,5.016683e-2,4.095404)"'
            + '	   gradientUnits="userSpaceOnUse"'
            + '	   id="linearGradient1459"'
            + '	   xlink:href="#linearGradient259"'
            + '	   inkscape:collect="always" />'
            + '	<linearGradient'
            + '	   y2="58.831264"'
            + '	   x2="15.487823"'
            + '	   y1="32.539238"'
            + '	   x1="15.387969"'
            + '	   gradientTransform="matrix(1.492569,0,0,0.668741,8.188072e-2,2)"'
            + '	   gradientUnits="userSpaceOnUse"'
            + '	   id="linearGradient1464"'
            + '	   xlink:href="#linearGradient4762"'
            + '	   inkscape:collect="always" />'
            + '	<linearGradient'
            + '	   y2="88.294930"'
            + '	   x2="18.972126"'
            + '	   y1="88.294930"'
            + '	   x1="1.8456430"'
            + '	   gradientTransform="matrix(2.291824,0,0,0.434269,8.855179e-2,2)"'
            + '	   gradientUnits="userSpaceOnUse"'
            + '	   id="linearGradient1468"'
            + '	   xlink:href="#linearGradient4741"'
            + '	   inkscape:collect="always" />'
            + '	<linearGradient'
            + '	   y2="88.294933"'
            + '	   x2="18.972126"'
            + '	   y1="88.294933"'
            + '	   x1="1.8456431"'
            + '	   gradientTransform="matrix(2.30272,0,0,0.437918,0,0.584034)"'
            + '	   gradientUnits="userSpaceOnUse"'
            + '	   id="linearGradient1471"'
            + '	   xlink:href="#linearGradient4668"'
            + '	   inkscape:collect="always" />'
            + '  </defs>'
            + '  <sodipodi:namedview'
            + '	 inkscape:window-y="160"'
            + '	 inkscape:window-x="491"'
            + '	 inkscape:window-height="688"'
            + '	 inkscape:window-width="872"'
            + '	 inkscape:guide-bbox="true"'
            + '	 showguides="true"'
            + '	 inkscape:document-units="px"'
            + '	 inkscape:grid-bbox="true"'
            + '	 showgrid="false"'
            + '	 inkscape:current-layer="layer1"'
            + '	 inkscape:cy="4.6034265"'
            + '	 inkscape:cx="29.124539"'
            + '	 inkscape:zoom="1"'
            + '	 inkscape:pageshadow="2"'
            + '	 inkscape:pageopacity="0.0"'
            + '	 borderopacity="0.090196078"'
            + '	 bordercolor="#666666"'
            + '	 pagecolor="#ffffff"'
            + '	 id="base"'
            + '	 inkscape:showpageshadow="false" />'
            + '  <metadata'
            + '	 id="metadata4">'
            + '	<rdf:RDF>'
            + '	  <cc:Work'
            + '		 rdf:about="">'
            + '		<dc:format>image/svg+xml</dc:format>'
            + '		<dc:type'
            + '		   rdf:resource="http://purl.org/dc/dcmitype/StillImage" />'
            + '		<dc:title>Printer</dc:title>'
            + '		<dc:creator>'
            + '		  <cc:Agent>'
            + '			<dc:title>Jakub Steiner</dc:title>'
            + '		  </cc:Agent>'
            + '		</dc:creator>'
            + '		<cc:license'
            + '		   rdf:resource="http://creativecommons.org/licenses/publicdomain/" />'
            + '		<dc:source>http://jimmac.musichall.cz</dc:source>'
            + '		<dc:subject>'
            + '		  <rdf:Bag>'
            + '			<rdf:li>printer</rdf:li>'
            + '			<rdf:li>local</rdf:li>'
            + '			<rdf:li>laser</rdf:li>'
            + '			<rdf:li>bubblejet</rdf:li>'
            + '			<rdf:li>inkjet</rdf:li>'
            + '			<rdf:li>print</rdf:li>'
            + '			<rdf:li>output</rdf:li>'
            + '			<rdf:li>cups</rdf:li>'
            + '			<rdf:li>lpd</rdf:li>'
            + '		  </rdf:Bag>'
            + '		</dc:subject>'
            + '	  </cc:Work>'
            + '	  <cc:License'
            + '		 rdf:about="http://creativecommons.org/licenses/publicdomain/">'
            + '		<cc:permits'
            + '		   rdf:resource="http://creativecommons.org/ns#Reproduction" />'
            + '		<cc:permits'
            + '		   rdf:resource="http://creativecommons.org/ns#Distribution" />'
            + '		<cc:permits'
            + '		   rdf:resource="http://creativecommons.org/ns#DerivativeWorks" />'
            + '	  </cc:License>'
            + '	</rdf:RDF>'
            + '  </metadata>'
            + '  <g'
            + '	 inkscape:groupmode="layer"'
            + '	 inkscape:label="Layer 1"'
            + '	 id="layer1">'
            + '	<g'
            + '	   transform="matrix(2.311016e-2,0,0,2.271533e-2,44.68502,39.36099)"'
            + '	   id="g6707">'
            + '	  <rect'
            + '		 style="opacity:0.40206185;color:black;fill:url(#linearGradient6715);fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:round;stroke-linejoin:miter;marker:none;marker-start:none;marker-mid:none;marker-end:none;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;visibility:visible;display:inline;overflow:visible"'
            + '		 id="rect6709"'
            + '		 width="1339.6335"'
            + '		 height="478.35718"'
            + '		 x="-1559.2523"'
            + '		 y="-150.69685" />'
            + '	  <path'
            + '		 style="opacity:0.40206185;color:black;fill:url(#radialGradient6717);fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:round;stroke-linejoin:miter;marker:none;marker-start:none;marker-mid:none;marker-end:none;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;visibility:visible;display:inline;overflow:visible"'
            + '		 d="M -219.61876,-150.68038 C -219.61876,-150.68038 -219.61876,327.65041 -219.61876,327.65041 C -76.744594,328.55086 125.78146,220.48075 125.78138,88.454235 C 125.78138,-43.572302 -33.655436,-150.68036 -219.61876,-150.68038 z "'
            + '		 id="path6711"'
            + '		 sodipodi:nodetypes="cccc" />'
            + '	  <path'
            + '		 sodipodi:nodetypes="cccc"'
            + '		 id="path6713"'
            + '		 d="M -1559.2523,-150.68038 C -1559.2523,-150.68038 -1559.2523,327.65041 -1559.2523,327.65041 C -1702.1265,328.55086 -1904.6525,220.48075 -1904.6525,88.454235 C -1904.6525,-43.572302 -1745.2157,-150.68036 -1559.2523,-150.68038 z "'
            + '		 style="opacity:0.40206185;color:black;fill:url(#radialGradient6719);fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:round;stroke-linejoin:miter;marker:none;marker-start:none;marker-mid:none;marker-end:none;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;visibility:visible;display:inline;overflow:visible" />'
            + '	</g>'
            + '	<rect'
            + '	   ry="1.7115477"'
            + '	   rx="1.7115483"'
            + '	   y="36.004189"'
            + '	   x="4.75"'
            + '	   height="6.4915943"'
            + '	   width="38.4375"'
            + '	   id="rect4652"'
            + '	   style="fill:url(#linearGradient1471);fill-opacity:1;stroke:#595959;stroke-width:0.99999982;stroke-miterlimit:4;stroke-opacity:1" />'
            + '	<path'
            + '	   sodipodi:nodetypes="cssssssssssss"'
            + '	   id="rect4609"'
            + '	   d="M 7.1308961,21.5 L 40.870615,21.5 C 41.255661,21.5 41.747648,21.788155 42.051049,22.223919 C 42.354451,22.659684 43.787518,24.83394 44.109448,25.297964 C 44.431378,25.761987 44.502397,26.201852 44.502397,26.774049 L 44.502397,38.850951 C 44.502397,39.764524 43.770402,40.5 42.861152,40.5 L 5.1403596,40.5 C 4.2311094,40.5 3.4991138,39.764524 3.4991138,38.850951 L 3.4991138,26.774049 C 3.4991138,26.280031 3.6002798,25.571641 3.9455202,25.120718 C 4.3811666,24.551713 5.5498664,22.57277 5.8581276,22.153118 C 6.1663887,21.733467 6.7324461,21.5 7.1308961,21.5 z "'
            + '	   style="color:#000000;fill:url(#linearGradient1468);fill-opacity:1;fill-rule:nonzero;stroke:#676767;stroke-width:1.00000036;stroke-linecap:butt;stroke-linejoin:miter;marker:none;marker-start:none;marker-mid:none;marker-end:none;stroke-miterlimit:4;stroke-dashoffset:0;stroke-opacity:1;visibility:visible;display:inline;overflow:visible" />'
            + '	<path'
            + '	   sodipodi:nodetypes="cssssssss"'
            + '	   id="path4718"'
            + '	   d="M 7.4246212,21.975532 C 6.9218931,21.975532 6.3048776,22.053784 6.0546019,22.46703 L 4.1542523,25.604816 C 3.8721285,26.070648 4.1881986,26.868141 5.0873106,26.868141 L 42.730786,26.868141 C 44.040732,26.868141 43.950533,25.858073 43.663844,25.428039 L 41.896077,22.776389 C 41.575544,22.295589 41.459199,21.975532 40.65864,21.975532 L 7.4246212,21.975532 z "'
            + '	   style="fill:#fbfbfb;fill-opacity:1.0000000;fill-rule:evenodd;stroke:none;stroke-width:1.0000000px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1.0000000" />'
            + '	<path'
            + '	   style="color:#000000;fill:none;fill-opacity:1;fill-rule:nonzero;stroke:url(#linearGradient1464);stroke-width:0.94696712;stroke-linecap:butt;stroke-linejoin:miter;marker:none;marker-start:none;marker-mid:none;marker-end:none;stroke-miterlimit:4;stroke-dashoffset:0;stroke-opacity:1;visibility:visible;display:inline;overflow:visible"'
            + '	   d="M 7.60536,22.445756 L 40.432673,22.445756 C 40.798351,22.445756 41.265592,22.718629 41.553733,23.131283 C 41.841873,23.543938 42.849964,25.160945 43.155701,25.60036 C 43.461437,26.039775 43.59127,26.456312 43.59127,26.998164 L 43.59127,38.279261 C 43.59127,39.144385 43.457547,39.528356 42.594031,39.528356 L 5.5322268,39.528356 C 4.6687108,39.528356 4.4726047,39.144385 4.4726047,38.279261 L 4.4726047,26.998164 C 4.4726047,26.530345 4.6934498,25.859523 5.0213249,25.432514 C 5.435059,24.893685 6.1038541,23.461633 6.3966101,23.064237 C 6.6893662,22.666841 7.2269515,22.445756 7.60536,22.445756 z "'
            + '	   id="path4750"'
            + '	   sodipodi:nodetypes="cssssssssssss" />'
            + '	<path'
            + '	   sodipodi:nodetypes="ccccccc"'
            + '	   id="rect15391"'
            + '	   d="M 11.672962,4.4999475 L 36.325116,4.4999475 C 36.975881,4.4999475 37.49978,5.0100777 37.49978,5.6437371 L 37.49978,24.348176 L 10.498298,24.348176 L 10.498298,5.6437371 C 10.498298,5.0100777 11.022197,4.4999475 11.672962,4.4999475 z "'
            + '	   style="color:#000000;fill:url(#linearGradient1459);fill-opacity:1;fill-rule:nonzero;stroke:#898989;stroke-width:1.00000036;stroke-linecap:round;stroke-linejoin:miter;marker:none;marker-start:none;marker-mid:none;marker-end:none;stroke-miterlimit:4;stroke-dashoffset:0;stroke-opacity:1;visibility:visible;display:block;overflow:visible" />'
            + '	<rect'
            + '	   style="color:#000000;fill:none;fill-opacity:1;fill-rule:nonzero;stroke:url(#linearGradient1456);stroke-width:1.00000024;stroke-linecap:round;stroke-linejoin:round;marker:none;marker-start:none;marker-mid:none;marker-end:none;stroke-miterlimit:4;stroke-dashoffset:0;stroke-opacity:1;visibility:visible;display:block;overflow:visible"'
            + '	   id="rect15660"'
            + '	   width="25.000576"'
            + '	   height="18.836374"'
            + '	   x="11.498513"'
            + '	   y="5.4992466"'
            + '	   ry="0.17677675"'
            + '	   rx="0.17677672" />'
            + '	<rect'
            + '	   ry="1.7115483"'
            + '	   rx="1.7115483"'
            + '	   y="27.375000"'
            + '	   x="6.8750000"'
            + '	   height="5.1875000"'
            + '	   width="33.750000"'
            + '	   id="rect4678"'
            + '	   style="fill:url(#linearGradient1451);fill-opacity:1.0000000;stroke:url(#linearGradient1453);stroke-width:1.0000000;stroke-miterlimit:4.0000000;stroke-opacity:1.0000000" />'
            + '	<path'
            + '	   transform="translate(0.000000,2.000000)"'
            + '	   d="M 10.871767 27.626486 A 1.2816310 1.2816310 0 1 1  8.3085046,27.626486 A 1.2816310 1.2816310 0 1 1  10.871767 27.626486 z"'
            + '	   sodipodi:ry="1.2816310"'
            + '	   sodipodi:rx="1.2816310"'
            + '	   sodipodi:cy="27.626486"'
            + '	   sodipodi:cx="9.5901356"'
            + '	   id="path4696"'
            + '	   style="fill:url(#radialGradient1433);fill-opacity:1.0000000;stroke:none;stroke-width:1.0000000;stroke-miterlimit:4.0000000;stroke-opacity:1.0000000"'
            + '	   sodipodi:type="arc" />'
            + '	<path'
            + '	   sodipodi:nodetypes="csscssssc"'
            + '	   id="path4731"'
            + '	   d="M 11.743718,25.416053 L 37.306218,25.478553 C 37.993716,25.480234 38.294038,25.107558 38.243718,24.478553 L 38.118718,22.916053 L 39.984835,22.916053 C 40.797335,22.916053 40.975035,23.108616 41.172335,23.478553 L 41.672335,24.416053 C 42.199130,25.403793 43.483508,26.390165 42.170495,26.390165 C 37.667784,26.390165 13.993718,26.041053 11.743718,25.416053 z "'
            + '	   style="fill:url(#linearGradient1447);fill-opacity:1.0000000;fill-rule:evenodd;stroke:none;stroke-width:1.0000000px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1.0000000;opacity:0.36571429" />'
            + '	<path'
            + '	   style="fill:none;fill-opacity:0.75;fill-rule:evenodd;stroke:#ffffff;stroke-width:0.99999994px;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:1"'
            + '	   d="M 43.488808,26.5 L 4.5111805,26.5"'
            + '	   id="path4760"'
            + '	   sodipodi:nodetypes="cc" />'
            + '	<g'
            + '	   transform="translate(0.000000,2.000000)"'
            + '	   style="opacity:0.43575415"'
            + '	   id="g4849">'
            + '	  <rect'
            + '		 y="7.0000000"'
            + '		 x="14.000000"'
            + '		 height="1.0000000"'
            + '		 width="19.000000"'
            + '		 id="rect4833"'
            + '		 style="color:#000000;fill:#000000;fill-opacity:0.29239765;fill-rule:nonzero;stroke:none;stroke-width:1.0000000;stroke-linecap:round;stroke-linejoin:round;marker:none;marker-start:none;marker-mid:none;marker-end:none;stroke-miterlimit:4.0000000;stroke-dashoffset:0.0000000;stroke-opacity:1.0000000;visibility:visible;display:inline;overflow:visible" />'
            + '	  <rect'
            + '		 style="color:#000000;fill:#000000;fill-opacity:0.29239765;fill-rule:nonzero;stroke:none;stroke-width:1.0000000;stroke-linecap:round;stroke-linejoin:round;marker:none;marker-start:none;marker-mid:none;marker-end:none;stroke-miterlimit:4.0000000;stroke-dashoffset:0.0000000;stroke-opacity:1.0000000;visibility:visible;display:inline;overflow:visible"'
            + '		 id="rect4835"'
            + '		 width="19.000000"'
            + '		 height="1.0000000"'
            + '		 x="14.000000"'
            + '		 y="9.0000000" />'
            + '	  <rect'
            + '		 y="11.000000"'
            + '		 x="14.000000"'
            + '		 height="1.0000000"'
            + '		 width="19.000000"'
            + '		 id="rect4837"'
            + '		 style="color:#000000;fill:#000000;fill-opacity:0.29239765;fill-rule:nonzero;stroke:none;stroke-width:1.0000000;stroke-linecap:round;stroke-linejoin:round;marker:none;marker-start:none;marker-mid:none;marker-end:none;stroke-miterlimit:4.0000000;stroke-dashoffset:0.0000000;stroke-opacity:1.0000000;visibility:visible;display:inline;overflow:visible" />'
            + '	  <rect'
            + '		 style="color:#000000;fill:#000000;fill-opacity:0.29239765;fill-rule:nonzero;stroke:none;stroke-width:1.0000000;stroke-linecap:round;stroke-linejoin:round;marker:none;marker-start:none;marker-mid:none;marker-end:none;stroke-miterlimit:4.0000000;stroke-dashoffset:0.0000000;stroke-opacity:1.0000000;visibility:visible;display:inline;overflow:visible"'
            + '		 id="rect4839"'
            + '		 width="11.000000"'
            + '		 height="1.0000000"'
            + '		 x="14.000000"'
            + '		 y="13.000000" />'
            + '	  <rect'
            + '		 style="color:#000000;fill:#000000;fill-opacity:0.29239765;fill-rule:nonzero;stroke:none;stroke-width:1.0000000;stroke-linecap:round;stroke-linejoin:round;marker:none;marker-start:none;marker-mid:none;marker-end:none;stroke-miterlimit:4.0000000;stroke-dashoffset:0.0000000;stroke-opacity:1.0000000;visibility:visible;display:inline;overflow:visible"'
            + '		 id="rect4843"'
            + '		 width="19.000000"'
            + '		 height="1.0000000"'
            + '		 x="14.000000"'
            + '		 y="17.000000" />'
            + '	  <rect'
            + '		 y="19.000000"'
            + '		 x="14.000000"'
            + '		 height="1.0000000"'
            + '		 width="19.000000"'
            + '		 id="rect4845"'
            + '		 style="color:#000000;fill:#000000;fill-opacity:0.29239765;fill-rule:nonzero;stroke:none;stroke-width:1.0000000;stroke-linecap:round;stroke-linejoin:round;marker:none;marker-start:none;marker-mid:none;marker-end:none;stroke-miterlimit:4.0000000;stroke-dashoffset:0.0000000;stroke-opacity:1.0000000;visibility:visible;display:inline;overflow:visible" />'
            + '	</g>'
            + '  </g>'
            + '</svg>',
    'chevron-bottom': '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill:#030104;" viewBox="0 0 32 32" class="icon icon-chevron-bottom" aria-hidden="true"><path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"/></svg>',
    'chevron-down': '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill:#030104;" viewBox="0 0 32 32" class="icon icon-chevron-bottom" aria-hidden="true"><path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"/></svg>',
    'chevron-left': '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill:#030104;" viewBox="0 0 32 32" class="icon icon-chevron-left" aria-hidden="true"><path d="M14.19 16.005l7.869 7.868-2.129 2.129-9.996-9.997L19.937 6.002l2.127 2.129z"/></svg>',
    'chevron-right': '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill:#030104;" viewBox="0 0 32 32" class="icon icon-chevron-right" aria-hidden="true"><path d="M18.629 15.997l-7.083-7.081L13.462 7l8.997 8.997L13.457 25l-1.916-1.916z"/></svg>',
    'chevron-top': '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill:#030104;" viewBox="0 0 32 32" class="icon icon-chevron-top" aria-hidden="true"><path style="fill:#030104;" d="M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z"/></svg>',
    'chevron-up': '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill:#030104;" viewBox="0 0 32 32" class="icon icon-chevron-top" aria-hidden="true"><path style="fill:#030104;" d="M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z"/></svg>',
    'chevrons': {
        'bottom': '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill:#030104;" viewBox="0 0 32 32" class="icon icon-chevron-bottom" aria-hidden="true"><path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"/></svg>',
        /**
         * Identical to bottom
         * @type String
         */
        'down': '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill:#030104;" viewBox="0 0 32 32" class="icon icon-chevron-bottom" aria-hidden="true"><path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"/></svg>',
        'left': '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill:#030104;" viewBox="0 0 32 32" class="icon icon-chevron-left" aria-hidden="true"><path d="M14.19 16.005l7.869 7.868-2.129 2.129-9.996-9.997L19.937 6.002l2.127 2.129z"/></svg>',
        'right': '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill:#030104;" viewBox="0 0 32 32" class="icon icon-chevron-right" aria-hidden="true"><path d="M18.629 15.997l-7.083-7.081L13.462 7l8.997 8.997L13.457 25l-1.916-1.916z"/></svg>',
        'top': '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill:#030104;" viewBox="0 0 32 32" class="icon icon-chevron-top" aria-hidden="true"><path style="fill:#030104;" d="M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z"/></svg>',
        /**
         * Identical to top
         * @type String
         */
        'up': '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill:#030104;" viewBox="0 0 32 32" class="icon icon-chevron-top" aria-hidden="true"><path style="fill:#030104;" d="M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z"/></svg>'
    },
    'chevrons24dp': {
        rounded : {
            'right': '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.29 6.71c-.39.39-.39 1.02 0 1.41L13.17 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z"/></svg>',
            'left': '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.71 6.71c-.39-.39-1.02-.39-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L10.83 12l3.88-3.88c.39-.39.38-1.03 0-1.41z"/></svg>',
            'up': '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.29 8.71L6.7 13.3c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 10.83l3.88 3.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.7 8.71c-.38-.39-1.02-.39-1.41 0z"/></svg>',
            'down': '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M15.88 9.29L12 13.17 8.12 9.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z"/></svg>'
        },
        simple: {
            
        }
    }
};

for (var name in props) {
    SVGICons[name] = props[name];
}


})();

SVGICons.__CLASS__ = SVGICons.prototype.__CLASS__ = SVGICons;
SVGICons.__CLASS_NAME__ = SVGICons.prototype.__CLASS_NAME__ = "SVGICons";

SVGICons['prev-tab'] = SVGICons['arrows']['32x32']['left'];
SVGICons['next-tab'] = SVGICons['arrows']['32x32']['right'];
SVGICons['popup-tab'] = SVGICons['arrows']['32x32']['down'];

var SVGIcons = SVGICons;

//copied from internet
//Source: https://github.com/evoluteur/react-crud-icons
//(c) 2020 Olivier Giulieri
var SVG_CRUD_PATHS = {
    apps: 'M16,20H20V16H16M16,14H20V10H16M10,8H14V4H10M16,8H20V4H16M10,14H14V10H10M4,14H8V10H4M4,20H8V16H4M10,20H14V16H10M4,8H8V4H4V8Z',
    edit: 'M16.84,2.73C16.45,2.73 16.07,2.88 15.77,3.17L13.65,5.29L18.95,10.6L21.07,8.5C21.67,7.89 21.67,6.94 21.07,6.36L17.9,3.17C17.6,2.88 17.22,2.73 16.84,2.73M12.94,6L4.84,14.11L7.4,14.39L7.58,16.68L9.86,16.85L10.15,19.41L18.25,11.3M4.25,15.04L2.5,21.73L9.2,19.94L8.96,17.78L6.65,17.61L6.47,15.29',
    browse: 'M12,9C10.34,9 9,10.34 9,12C9,13.66 10.34,15 12,15C13.66,15 15,13.66 15,12C15,10.34 13.66,9 12,9M12,17C9.24,17 7,14.76 7,12C7,9.24 9.24,7 12,7C14.76,7 17,9.24 17,12C17,14.76 14.76,17 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z',
    "delete": 'M9,3V4H4V6H5V19C5,20.1 5.9,21 7,21H17C18.1,21 19,20.1 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z',
    save: 'M5,3C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5.5L18.5,3H17V9C17,9.55 16.55,10 16,10H8C7.45,10 7,9.55 7,9V3H5M12,4V9H15V4H12M7,12H17C17.55,12 18,12.45 18,13V19H6V13C6,12.45 6.45,12 7,12Z',
    add: 'M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z',
    add2: 'M20 14H14V20H10V14H4V10H10V4H14V10H20V14Z',
    remove: 'M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z',
    close: 'M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z',
    search: 'M9.5,3C13.09,3 16,5.91 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16C5.91,16 3,13.09 3,9.5C3,5.91 5.91,3 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z',
    //filter: 'M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z',
    filter: "M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z",
    sort: "M19 17H22L18 21L14 17H17V3H19M2 17H12V19H2M6 5V7H2V5M2 11H9V13H2V11Z",
    list: 'M3,4H21V8H3V4M3,10H21V14H3V10M3,16H21V20H3V16Z',
    //list4: 'M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z',
    //cols: 'M4,21V3H8V21H4M10,21V3H14V21H10M16,21V3H20V21H16Z',
    cards: 'M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3',

    dashboard: 'M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z',
    pie: 'M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z',
    bars: 'M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z',
    treemap: 'M14,6H22V22H14V6M2,4H22V2H2V4M2,8H12V6H2V8M9,22H12V10H9V22M2,22H7V10H2V22Z',
    stats: 'M4.38,20.9C3.78,20.71 3.3,20.23 3.1,19.63L19.63,3.1C20.23,3.3 20.71,3.78 20.9,4.38L4.38,20.9M20,16V18H13V16H20M3,6H6V3H8V6H11V8H8V11H6V8H3V6Z',

    compare: 'M3,1C1.89,1 1,1.89 1,3V14C1,15.11 1.89,16 3,16H5V14H3V3H14V5H16V3C16,1.89 15.11,1 14,1H3M9,7C7.89,7 7,7.89 7,9V11H9V9H11V7H9M13,7V9H14V10H16V7H13M18,7V9H20V20H9V18H7V20C7,21.11 7.89,22 9,22H20C21.11,22 22,21.11 22,20V9C22,7.89 21.11,7 20,7H18M14,12V14H12V16H14C15.11,16 16,15.11 16,14V12H14M7,13V16H10V14H9V13H7Z',
    upload: 'M14,13V17H10V13H7L12,8L17,13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z',
    download: 'M17,13L12,18L7,13H10V9H14V13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z',
    "import": 'M1,12H10.76L8.26,9.5L9.67,8.08L14.59,13L9.67,17.92L8.26,16.5L10.76,14H1V12M19,3C20.11,3 21,3.9 21,5V19C21,20.1 20.1,21 19,21H5C3.89,21 3,20.1 3,19V16H5V19H19V7H5V10H3V5C3,3.9 3.9,3 5,3H19Z',
    "export": 'M8,12H17.76L15.26,9.5L16.67,8.08L21.59,13L16.67,17.92L15.26,16.5L17.76,14H8V12M19,3C20.11,3 21,3.9 21,5V9.67L19,7.67V7H5V19H19V18.33L21,16.33V19C21,20.1 20.1,21 19,21H5C3.89,21 3,20.1 3,19V5C3,3.9 3.9,3 5,3H19Z',
    json: 'M5,3H7V5H5V10C5,11.1 4.1,12 3,12C4.1,12 5,12.9 5,14V19H7V21H5C3.93,20.73 3,20.1 3,19V15C3,13.9 2.1,13 1,13H0V11H1C2.1,11 3,10.1 3,9V5C3,3.9 3.9,3 5,3M19,3C20.1,3 21,3.9 21,5V9C21,10.1 21.9,11 23,11H24V13H23C21.9,13 21,13.9 21,15V19C21,20.1 20.1,21 19,21H17V19H19V14C19,12.9 19.9,12 21,12C19.9,12 19,11.1 19,10V5H17V3H19M12,15C12.55,15 13,15.45 13,16C13,16.55 12.55,17 12,17C11.45,17 11,16.55 11,16C11,15.45 11.45,15 12,15M8,15C8.55,15 9,15.45 9,16C9,16.55 8.55,17 8,17C7.45,17 7,16.55 7,16C7,15.45 7.45,15 8,15M16,15C16.55,15 17,15.45 17,16C17,16.55 16.55,17 16,17C15.45,17 15,16.55 15,16C15,15.45 15.45,15 16,15Z',
    undo: 'M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z',
    check: 'M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z',
    favorite: 'M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z',

    help: 'M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7C10.9,7 10,7.9 10,9H8C8,6.79 9.79,5 12,5C14.21,5 16,6.79 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.47 17.5,2 12,2Z',
    alert: 'M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z',
    info: 'M13,9H11V7H13M13,17H11V11H13M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z',
    error: 'M2.2,16.06L3.88,12L2.2,7.94L6.26,6.26L7.94,2.2L12,3.88L16.06,2.2L17.74,6.26L21.8,7.94L20.12,12L21.8,16.06L17.74,17.74L16.06,21.8L12,20.12L7.94,21.8L6.26,17.74L2.2,16.06M13,17V15H11V17H13M13,13V7H11V13H13Z',

    up: 'M7,15L12,10L17,15H7Z',
    down: 'M7,10L12,15L17,10H7Z',
    up2: 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z',
    down2: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z',
    expand: 'M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z',
    collapse: 'M19.5,3.09L15,7.59V4H13V11H20V9H16.41L20.91,4.5L19.5,3.09M4,13V15H7.59L3.09,19.5L4.5,20.91L9,16.41V20H11V13H4Z',
    show: 'M12,9C10.34,9 9,10.34 9,12C9,13.66 10.34,15 12,15C13.66,15 15,13.66 15,12C15,10.34 13.66,9 12,9M12,17C9.24,17 7,14.76 7,12C7,9.24 9.24,7 12,7C14.76,7 17,9.24 17,12C17,14.76 14.76,17 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z',
    hide: 'M11.83,9L15,12.16C15,12.11 15,12.05 15,12C15,10.34 13.66,9 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12C9,13.66 10.34,15 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17C9.24,17 7,14.76 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7C14.76,7 17,9.24 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z',

    account: 'M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z',
    settings: 'M12,15.5C10.07,15.5 8.5,13.93 8.5,12C8.5,10.07 10.07,8.5 12,8.5C13.93,8.5 15.5,10.07 15.5,12C15.5,13.93 13.93,15.5 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z',
    comment: 'M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M5,5V7H19V5H5M5,9V11H13V9H5M5,13V15H15V13H5Z',
    comments: 'M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M9,9V11H19V9H9M9,13V15H17V13H9Z',

    paperclip: 'M16.5,6V17.5C16.5,19.71 14.71,21.5 12.5,21.5C10.29,21.5 8.5,19.71 8.5,17.5V5C8.5,3.62 9.62,2.5 11,2.5C12.38,2.5 13.5,3.62 13.5,5V15.5C13.5,16.05 13.05,16.5 12.5,16.5C11.95,16.5 11.5,16.05 11.5,15.5V6H10V15.5C10,16.88 11.12,18 12.5,18C13.88,18 15,16.88 15,15.5V5C15,2.79 13.21,1 11,1C8.79,1 7,2.79 7,5V17.5C7,20.54 9.46,23 12.5,23C15.54,23 18,20.54 18,17.5V6H16.5Z',
    dots: 'M16,12C16,10.9 16.9,10 18,10C19.1,10 20,10.9 20,12C20,13.1 19.1,14 18,14C16.9,14 16,13.1 16,12M10,12C10,10.9 10.9,10 12,10C13.1,10 14,10.9 14,12C14,13.1 13.1,14 12,14C10.9,14 10,13.1 10,12M4,12C4,10.9 4.9,10 6,10C7.1,10 8,10.9 8,12C8,13.1 7.1,14 6,14C4.9,14 4,13.1 4,12Z',
    "dots-v": 'M12,16C13.1,16 14,16.9 14,18C14,19.1 13.1,20 12,20C10.9,20 10,19.1 10,18C10,16.9 10.9,16 12,16M12,10C13.1,10 14,10.9 14,12C14,13.1 13.1,14 12,14C10.9,14 10,13.1 10,12C10,10.9 10.9,10 12,10M12,4C13.1,4 14,4.9 14,6C14,7.1 13.1,8 12,8C10.9,8 10,7.1 10,6C10,4.9 10.9,4 12,4Z',
    drag: 'M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z'
};



(function() {
    var arr, icons = [];
    
    //SERENIX_SVG_ICON_NAMES requires serenix_icon_names.js
    
    if (typeof SERENIX_SVG_ICON_NAMES !== 'undefined' && Array.isArray(SERENIX_SVG_ICON_NAMES)) {
        arr = Object.keys(SVG_CRUD_PATHS);
        SERENIX_CRUD_SVG_ICONS_MAP = {};
        arr.forEach(function(n) {
            SERENIX_SVG_ICON_NAMES.push(n);
            icons.push(SERENIX_CRUD_SVG_ICONS_MAP[n] = '<svg xmlns="http://www.w3.org/2000/svg"' 
                + ' viewBox: "0 0 24 24" ' 
                + ' height="24px" width="24px"' 
                + ' xml:space="preserve"'
                + ' aria-hidden="true" '
                + 'role="presentation"' 
                + ' fill="currentColor">'
                +   '<path d="' + SVG_CRUD_PATHS[n] + '"></path>'
                + '</svg>');
        });
        SERENIX_SVG_ICON_GROUPS['Crud'] = SERENIX_SVG_ICON_GROUPS['crud'] = arr;
        
        SERENIX_CRUD_SVG_ICONS = icons;
    }
    
    SVGICons.crud24x24 = {};
    var crud = SVGICons.crud24x24 = {};
    var fills = {black: "#000000", navy: "#000080", websafeNavy: "#000099", blue : '#0000ff', green : "#00ff00" }, fill;
    for (var name in SVG_CRUD_PATHS) {
        for (var fname in fills) {
            (crud[fname]||(crud[fname] = {}))[name] = 
                '<svg xmlns="http://www.w3.org/2000/svg"' 
                + ' viewBox: "0 0 24 24" ' 
                //+ ' height="24px" width="24px"' 
                + ' xml:space="preserve"'
                + ' aria-hidden="true" '
                + 'role="presentation" fill="' + fills[fname] + '">'
                +   '<path d="' + SVG_CRUD_PATHS[name] + '"></path>'
                + '</svg>';
        }
    }
    
})();