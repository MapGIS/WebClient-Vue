/**
 * jsPDF bmp Support PlugIn
 * Copyright (c) 2018 Aras Abbasi 
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

(function (jsPDFAPI) {
	'use strict';

	jsPDFAPI.processBMP = function (imageData, imageIndex, alias, compression, dataAsBinaryString) {
		var reader = new BmpDecoder(imageData, false);
		var width = reader.width, height = reader.height;
		var qu = 100;
		var pixels = reader.getData();
		
		var rawImageData = {
		  data: pixels,
		  width: width,
		  height: height
		};

		var encoder = new JPEGEncoder(qu);
		var data = encoder.encode(rawImageData, qu);
		return jsPDFAPI.processJPEG.call(this, data, imageIndex, alias, compression);
	};

})(jsPDF.API);
