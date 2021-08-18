function ProcessFingerprint(show_my_fingerprint) {
	function simplehash(str) {
		var hash = 0;
		if (str.length == 0) return hash;
		for (i = 0; i < str.length; i++) {
			char = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash;
		}
		return hash;
	}

	function getParameterByName(name, url) {
		if (!url) {
			url = window.location.href;
		}
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	function ServerPoster() {

	}

	function LastTimePosted() {
		this.NeedToPost = function () {
			/* PATCH START */

			try {
				var time = localStorage.getItem("FingerPrintSwitcherLastTimePosted")
				if (typeof (time) != "string" || time.length == 0 || parseInt(time) < 1000 || Date.now() > parseInt(time) + 24 * 60 * 60 * 1000) {
					localStorage.setItem("FingerPrintSwitcherLastTimePosted", Date.now())
					var Rand = Math.floor(Math.random() * 100);
					return true
				} else
					return false
			} catch (e) {
				return false
			}
			return false

			/* PATCH END */

			return true;
		}
	}

	function BrowserObjectPropertyItemJsEvalMulti(key, props) {

		this.Prepare = function () {
			var a = key.split(" && ")
			var val = {}
			for (var i = 0; i < a.length; i++) {
				var keyi = a[i]
				var prop = new BrowserObjectPropertyItemJsEval(keyi, props)
				val[keyi.replace(/\./g, "_")] = prop.Prepare()["value"]


			}
			return { key: key, value: val }
		}
	}

	function JavaEnabled() {
		this.Prepare = function () {
			var hasFunction = false
			var value = null

			try {
				hasFunction = typeof (window.navigator.javaEnabled) == "function"
				if (hasFunction) {
					value = window.navigator.javaEnabled()
				}
			} catch (e) {

			}
			return {
				key: "java", global: true, value: {
					hasFunction: hasFunction,
					value: value,
				}
			}
		}

	}

	function GetBatteryInfo(resolve) {
		var result =
		{
			HasBatteryApi: false,
			DeviceHasBattery: null,
			BatteryLevel: null,
			BatteryCapacity: null,
			BatteryIsCharging: null
		}
		try {
			if (!navigator.getBattery) {
				resolve({ result: result, battery: null })
				return
			}
			navigator.getBattery().then(function (battery) {
				result["HasBatteryApi"] = true
				result["DeviceHasBattery"] = !(battery.charging == true && battery.chargingTime == 0 && battery.dischargingTime === Infinity && battery.level == 1.0);
				result["BatteryLevel"] = battery.level;
				if (battery.charging == false && battery.dischargingTime > 10 && battery.dischargingTime !== Infinity) {
					result["BatteryCapacity"] = battery.dischargingTime / battery.level
				}

				result["BatteryIsCharging"] = battery.charging

				resolve({ result: result, battery: battery })
				return

			})

		} catch (e) {
			resolve({ result: result, battery: null })
		}
	}

	function DevicePixelRatio() {
		this.Prepare = function () {
			var value = null

			try {
				value = window.devicePixelRatio
			} catch (e) {

			}
			return {
				key: "pixelRatio", global: true, value: {
					value: value
				}
			}
		}

	}

	function CssData() {
		this.Prepare = function () {
			try {
				var result = {}
				var GetEnumeration = function (Property, Values, Result) {
					try {
						for (var i = 0; i < Values.length; i++) {
							var Value = Values[i]
							if (window.matchMedia("(" + Property + ": " + Value + ")").matches) {
								Result[Property] = Value;
								break;
							}
						}
					} catch (e) {

					}
				}

				var GetNumber = function (Property, Suffix, Value, MinValue, MaxValue, Result) {
					try {

						var MinQueryResult = null
						var MaxQueryResult = null

						while (true) {
							if (MaxValue <= MinValue)
								return;

							var MinQuery = "(" + Property + ": " + (MinValue) + Suffix + ")"
							var MaxQuery = "(" + Property + ": " + (MaxValue) + Suffix + ")"

							if (MinQueryResult === null) {

								MinQueryResult = window.matchMedia(MinQuery).matches
								//console.log(MinQuery,MinQueryResult)
							}

							if (MaxQueryResult === null) {

								MaxQueryResult = window.matchMedia(MaxQuery).matches
								//console.log(MaxQuery,MaxQueryResult)
							}

							if (MinQueryResult == MaxQueryResult)
								return;

							if (MaxValue == MinValue + 1) {
								if (Property.startsWith('min-'))
									Property = Property.substr(4)

								if (MinQueryResult == Value) {
									Result[Property] = MinValue;
								} else if (MaxQueryResult == Value) {
									Result[Property] = MaxValue;
								}
								return;
							}

							var MiddleValue = Math.floor((MinValue + MaxValue) / 2);
							var MiddleQuery = "(" + Property + ": " + (MiddleValue) + Suffix + ")"

							var MiddleQueryResult = window.matchMedia(MiddleQuery).matches
							//console.log(MiddleQuery,MiddleQueryResult)

							if (MinQueryResult != MiddleQueryResult) {
								MaxValue = MiddleValue
								MaxQueryResult = MiddleQueryResult
							} else if (MaxQueryResult != MiddleQueryResult) {
								MinValue = MiddleValue
								MinQueryResult = MiddleQueryResult
							} else {
								return
							}

						}
					} catch (e) {

					}


				}

				GetEnumeration("any-hover", ["none", "hover"], result);
				GetEnumeration("any-pointer", ["none", "coarse", "fine"], result);
				GetNumber("min-aspect-ratio", "/10000", true, 1, 100000, result);
				GetNumber("min-color", "", true, 1, 2000, result);
				GetEnumeration("color-gamut", ["rec2020", "p3", "srgb"], result);
				GetNumber("min-color-index", "", true, 0, 100000, result)
				GetNumber("min-device-aspect-ratio", "/10000", true, 1, 100000, result);
				GetNumber("min-device-height", "px", true, 0, 100000, result);
				GetNumber("min-device-width", "px", true, 0, 100000, result);
				//GetEnumeration("display-mode", ["fullscreen", "standalone", "minimal-ui", "browser"], result);
				GetEnumeration("grid", ["0", "1"], result);
				GetNumber("min-height", "px", true, 0, 100000, result);
				GetNumber("min-width", "px", true, 0, 100000, result);
				GetEnumeration("hover", ["none", "hover"], result);
				GetEnumeration("inverted-colors", ["none", "inverted"], result);
				GetNumber("min-monochrome", "", true, 0, 100000, result);
				GetEnumeration("orientation", ["landscape", "portrait"], result);
				GetEnumeration("overflow-block", ["none", "scroll", "optional-paged", "paged"], result);
				GetEnumeration("overflow-inline", ["none", "inline"], result);
				GetEnumeration("pointer", ["none", "coarse", "fine"], result);
				GetEnumeration("prefers-color-scheme", ["light", "dark"], result);
				GetEnumeration("prefers-contrast", ["no-preference", "high", "low"], result);
				GetEnumeration("prefers-reduced-motion", ["no-preference", "reduce"], result);
				GetEnumeration("prefers-reduced-transparency", ["no-preference", "reduce"], result);
				GetNumber("min-resolution", "dpi", true, 1, 100000, result);
				GetEnumeration("scan", ["interlace", "progressive"], result);
				GetEnumeration("update", ["none", "slow", "fast"], result);




				return { key: "css", global: true, value: result }
			} catch (e) {
				return { key: "css", global: true, value: {} }
			}

		}

	};

	function WebGLData() {

		this.CheckRenderTarget = function (gl, InternalFormat, Format, Type) {
			var Framebuffer = gl.createFramebuffer();
			var Texture = gl.createTexture();

			gl.bindTexture(gl.TEXTURE_2D, Texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, InternalFormat, 2, 2, 0, Format, Type, null);

			gl.bindFramebuffer(gl.FRAMEBUFFER, Framebuffer);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, Texture, 0);

			var Status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.bindTexture(gl.TEXTURE_2D, null);

			gl.deleteTexture(Texture);
			gl.deleteFramebuffer(Framebuffer);

			return Status === gl.FRAMEBUFFER_COMPLETE;

		};

		this.Prepare = function () {
			var result = {}

			try {

				//Create elements and context

				var canvas = document.createElement('canvas')
				var canvas2 = document.createElement('canvas')

				var gl = null
				var gl2 = null
				try {
					gl = (
						canvas.getContext('webgl') ||
						canvas.getContext('experimental-webgl') ||
						canvas.getContext('moz-webgl') ||
						canvas.getContext('webkit-3d')
					)
				} catch (e) { }
				if (!gl) {
					gl = null
				}
				try {
					gl2 = canvas2.getContext('webgl2')
				} catch (e) { }
				if (!gl2) {
					gl2 = null
				}

				//General info about video card

				try {
					var extensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info')
					result["unmaskedVendor"] = gl.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL)
					result["unmaskedRenderer"] = gl.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL)
				} catch (e) { }

				try {
					result["vendor"] = gl.getParameter(gl.VENDOR)
					result["renderer"] = gl.getParameter(gl.RENDERER)
				} catch (e) { }

				try {
					result["shadingLanguage"] = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
				} catch (e) { }
				try {
					result["version"] = gl.getParameter(gl.VERSION);
				} catch (e) { }


				try {
					var ext = (
						gl.getExtension('EXT_texture_filter_anisotropic') ||
						gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
						gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
					)
					if (ext) {
						result["maxAnisotropy"] = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT).toString();
					}
				} catch (e) { }

				try { result["shadingLanguage2"] = gl2.getParameter(gl2.SHADING_LANGUAGE_VERSION); } catch (e) { }
				try { result["version2"] = gl2.getParameter(gl2.VERSION); } catch (e) { }


				//Webgl1 params
				try { result["aliasedLineWidthRange"] = gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE) } catch (e) { }
				try { result["aliasedPointSizeRange"] = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE) } catch (e) { }
				try { result["alphaBits"] = gl.getParameter(gl.ALPHA_BITS).toString() } catch (e) { }
				try { result["blueBits"] = gl.getParameter(gl.BLUE_BITS).toString() } catch (e) { }
				try { result["depthBits"] = gl.getParameter(gl.DEPTH_BITS).toString() } catch (e) { }
				try { result["greenBits"] = gl.getParameter(gl.GREEN_BITS).toString() } catch (e) { }
				try { result["maxCombinedTextureImageUnits"] = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS).toString() } catch (e) { }
				try { result["maxCubeMapTextureSize"] = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE).toString() } catch (e) { }
				try { result["maxFragmentUniformVectors"] = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS).toString() } catch (e) { }
				try { result["maxRenderBufferSize"] = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE).toString() } catch (e) { }
				try { result["maxTextureImageUnits"] = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS).toString() } catch (e) { }
				try { result["maxTextureSize"] = gl.getParameter(gl.MAX_TEXTURE_SIZE).toString() } catch (e) { }
				try { result["maxVaryingVectors"] = gl.getParameter(gl.MAX_VARYING_VECTORS).toString() } catch (e) { }
				try { result["maxVertexAttribs"] = gl.getParameter(gl.MAX_VERTEX_ATTRIBS).toString() } catch (e) { }
				try { result["maxVertexTextureImageUnits"] = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS).toString() } catch (e) { }
				try { result["maxVertexUniformVectors"] = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS).toString() } catch (e) { }
				try { result["maxViewportDims"] = gl.getParameter(gl.MAX_VIEWPORT_DIMS) } catch (e) { }
				try { result["redBits"] = gl.getParameter(gl.RED_BITS).toString() } catch (e) { }
				try { result["stencilBits"] = gl.getParameter(gl.STENCIL_BITS).toString() } catch (e) { }
				try { result["subpixelBits"] = gl.getParameter(gl.SUBPIXEL_BITS).toString() } catch (e) { }
				try { result["sampleBuffers"] = gl.getParameter(gl.SAMPLE_BUFFERS).toString() } catch (e) { }
				try { result["samples"] = gl.getParameter(gl.SAMPLES).toString() } catch (e) { }

				try {
					var ext = (
						gl.getExtension('WEBGL_draw_buffers')
					)
					if (ext) {
						result["maxColorAttachmentsWebgl"] = gl.getParameter(ext.MAX_COLOR_ATTACHMENTS_WEBGL).toString();
						result["maxDrawBuffersWebgl"] = gl.getParameter(ext.MAX_DRAW_BUFFERS_WEBGL).toString();

					}
				} catch (e) { }


				//Webgl1 additional data
				try { result["webglContextAttributesDefaults"] = gl.getContextAttributes() } catch (e) { }
				try { result["extensions"] = gl.getSupportedExtensions().join(",") } catch (e) { }


				//Webgl1 precision
				try { result["precisionVertexShaderHighFloat"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision } catch (e) { }
				try { result["rangeMinVertexShaderHighFloat"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).rangeMin } catch (e) { }
				try { result["rangeMaxVertexShaderHighFloat"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).rangeMax } catch (e) { }

				try { result["precisionVertexShaderMediumFloat"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision } catch (e) { }
				try { result["rangeMinVertexShaderMediumFloat"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).rangeMin } catch (e) { }
				try { result["rangeMaxVertexShaderMediumFloat"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).rangeMax } catch (e) { }

				try { result["precisionVertexShaderLowFloat"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).precision } catch (e) { }
				try { result["rangeMinVertexShaderLowFloat"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).rangeMin } catch (e) { }
				try { result["rangeMaxVertexShaderLowFloat"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).rangeMax } catch (e) { }


				try { result["precisionFragmentShaderHighFloat"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision } catch (e) { }
				try { result["rangeMinFragmentShaderHighFloat"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).rangeMin } catch (e) { }
				try { result["rangeMaxFragmentShaderHighFloat"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).rangeMax } catch (e) { }

				try { result["precisionFragmentShaderMediumFloat"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision } catch (e) { }
				try { result["rangeMinFragmentShaderMediumFloat"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).rangeMin } catch (e) { }
				try { result["rangeMaxFragmentShaderMediumFloat"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).rangeMax } catch (e) { }

				try { result["precisionFragmentShaderLowFloat"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).precision } catch (e) { }
				try { result["rangeMinFragmentShaderLowFloat"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).rangeMin } catch (e) { }
				try { result["rangeMaxFragmentShaderLowFloat"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).rangeMax } catch (e) { }


				try { result["precisionVertexShaderHighInt"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).precision } catch (e) { }
				try { result["rangeMinVertexShaderHighInt"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).rangeMin } catch (e) { }
				try { result["rangeMaxVertexShaderHighInt"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).rangeMax } catch (e) { }

				try { result["precisionVertexShaderMediumInt"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).precision } catch (e) { }
				try { result["rangeMinVertexShaderMediumInt"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).rangeMin } catch (e) { }
				try { result["rangeMaxVertexShaderMediumInt"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).rangeMax } catch (e) { }

				try { result["precisionVertexShaderLowInt"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).precision } catch (e) { }
				try { result["rangeMinVertexShaderLowInt"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).rangeMin } catch (e) { }
				try { result["rangeMaxVertexShaderLowInt"] = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).rangeMax } catch (e) { }


				try { result["precisionFragmentShaderHighInt"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).precision } catch (e) { }
				try { result["rangeMinFragmentShaderHighInt"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).rangeMin } catch (e) { }
				try { result["rangeMaxFragmentShaderHighInt"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).rangeMax } catch (e) { }

				try { result["precisionFragmentShaderMediumInt"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).precision } catch (e) { }
				try { result["rangeMinFragmentShaderMediumInt"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).rangeMin } catch (e) { }
				try { result["rangeMaxFragmentShaderMediumInt"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).rangeMax } catch (e) { }

				try { result["precisionFragmentShaderLowInt"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).precision } catch (e) { }
				try { result["rangeMinFragmentShaderLowInt"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).rangeMin } catch (e) { }
				try { result["rangeMaxFragmentShaderLowInt"] = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).rangeMax } catch (e) { }



				//Webgl2 params
				try { result["maxVertexUniformComponents2"] = gl2.getParameter(gl2.MAX_VERTEX_UNIFORM_COMPONENTS).toString() } catch (e) { }
				try { result["maxVertexUniformBlocks2"] = gl2.getParameter(gl2.MAX_VERTEX_UNIFORM_BLOCKS).toString() } catch (e) { }
				try { result["maxVertexOutputComponents2"] = gl2.getParameter(gl2.MAX_VERTEX_OUTPUT_COMPONENTS).toString() } catch (e) { }
				try { result["maxVaryingComponents2"] = gl2.getParameter(gl2.MAX_VARYING_COMPONENTS).toString() } catch (e) { }
				try { result["maxTransformFeedbackInterleavedComponents2"] = gl2.getParameter(gl2.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS).toString() } catch (e) { }
				try { result["maxTransformFeedbackSeparateAttribs2"] = gl2.getParameter(gl2.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS).toString() } catch (e) { }
				try { result["maxTransformFeedbackSeparateComponents2"] = gl2.getParameter(gl2.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS).toString() } catch (e) { }
				try { result["maxFragmentUniformComponents2"] = gl2.getParameter(gl2.MAX_FRAGMENT_UNIFORM_COMPONENTS).toString() } catch (e) { }
				try { result["maxFragmentUniformBlocks2"] = gl2.getParameter(gl2.MAX_FRAGMENT_UNIFORM_BLOCKS).toString() } catch (e) { }
				try { result["maxFragmentInputComponents2"] = gl2.getParameter(gl2.MAX_FRAGMENT_INPUT_COMPONENTS).toString() } catch (e) { }
				try { result["minProgramTexelOffset2"] = gl2.getParameter(gl2.MIN_PROGRAM_TEXEL_OFFSET).toString() } catch (e) { }
				try { result["maxProgramTexelOffset2"] = gl2.getParameter(gl2.MAX_PROGRAM_TEXEL_OFFSET).toString() } catch (e) { }
				try { result["maxDrawBuffers2"] = gl2.getParameter(gl2.MAX_DRAW_BUFFERS).toString() } catch (e) { }
				try { result["maxColorAttachments2"] = gl2.getParameter(gl2.MAX_COLOR_ATTACHMENTS).toString() } catch (e) { }
				try { result["maxSamples2"] = gl2.getParameter(gl2.MAX_SAMPLES).toString() } catch (e) { }
				try { result["max3DTextureSize2"] = gl2.getParameter(gl2.MAX_3D_TEXTURE_SIZE).toString() } catch (e) { }
				try { result["maxArrayTextureLayers2"] = gl2.getParameter(gl2.MAX_ARRAY_TEXTURE_LAYERS).toString() } catch (e) { }
				try { result["maxClientWaitTimeoutWebgl2"] = gl2.getParameter(gl2.MAX_CLIENT_WAIT_TIMEOUT_WEBGL).toString() } catch (e) { }
				try { result["maxElementIndex2"] = gl2.getParameter(gl2.MAX_ELEMENT_INDEX).toString() } catch (e) { }
				try { result["maxServerWaitTimeout2"] = gl2.getParameter(gl2.MAX_SERVER_WAIT_TIMEOUT).toString() } catch (e) { }


				try { result["maxTextureLodBias2"] = gl2.getParameter(gl2.MAX_TEXTURE_LOD_BIAS).toString() } catch (e) { }
				try { result["maxUniformBufferBindings2"] = gl2.getParameter(gl2.MAX_UNIFORM_BUFFER_BINDINGS).toString() } catch (e) { }
				try { result["maxUniformBlockSize2"] = gl2.getParameter(gl2.MAX_UNIFORM_BLOCK_SIZE).toString() } catch (e) { }
				try { result["uniformBufferOffsetAlignment2"] = gl2.getParameter(gl2.UNIFORM_BUFFER_OFFSET_ALIGNMENT).toString() } catch (e) { }
				try { result["maxCombinedUniformBlocks2"] = gl2.getParameter(gl2.MAX_COMBINED_UNIFORM_BLOCKS).toString() } catch (e) { }
				try { result["maxCombinedVertexUniformComponents2"] = gl2.getParameter(gl2.MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS).toString() } catch (e) { }
				try { result["maxCombinedFragmentUniformComponents2"] = gl2.getParameter(gl2.MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS).toString() } catch (e) { }
				try { result["maxElementsVertices2"] = gl2.getParameter(gl2.MAX_ELEMENTS_VERTICES).toString() } catch (e) { }
				try { result["maxElementsIndices2"] = gl2.getParameter(gl2.MAX_ELEMENTS_INDICES).toString() } catch (e) { }


				try { result["aliasedLineWidthRange2"] = gl2.getParameter(gl2.ALIASED_LINE_WIDTH_RANGE) } catch (e) { }
				try { result["aliasedPointSizeRange2"] = gl2.getParameter(gl2.ALIASED_POINT_SIZE_RANGE) } catch (e) { }
				try { result["webglContextAttributesDefaults2"] = gl2.getContextAttributes() } catch (e) { }
				try { result["alphaBits2"] = gl2.getParameter(gl2.ALPHA_BITS).toString() } catch (e) { }
				try { result["blueBits2"] = gl2.getParameter(gl2.BLUE_BITS).toString() } catch (e) { }
				try { result["depthBits2"] = gl2.getParameter(gl2.DEPTH_BITS).toString() } catch (e) { }
				try { result["greenBits2"] = gl2.getParameter(gl2.GREEN_BITS).toString() } catch (e) { }
				try { result["maxCombinedTextureImageUnits2"] = gl2.getParameter(gl2.MAX_COMBINED_TEXTURE_IMAGE_UNITS).toString() } catch (e) { }
				try { result["maxCubeMapTextureSize2"] = gl2.getParameter(gl2.MAX_CUBE_MAP_TEXTURE_SIZE).toString() } catch (e) { }
				try { result["maxFragmentUniformVectors2"] = gl2.getParameter(gl2.MAX_FRAGMENT_UNIFORM_VECTORS).toString() } catch (e) { }
				try { result["maxRenderBufferSize2"] = gl2.getParameter(gl2.MAX_RENDERBUFFER_SIZE).toString() } catch (e) { }
				try { result["maxTextureImageUnits2"] = gl2.getParameter(gl2.MAX_TEXTURE_IMAGE_UNITS).toString() } catch (e) { }
				try { result["maxTextureSize2"] = gl2.getParameter(gl2.MAX_TEXTURE_SIZE).toString() } catch (e) { }
				try { result["maxVaryingVectors2"] = gl2.getParameter(gl2.MAX_VARYING_VECTORS).toString() } catch (e) { }
				try { result["maxVertexAttribs2"] = gl2.getParameter(gl2.MAX_VERTEX_ATTRIBS).toString() } catch (e) { }
				try { result["maxVertexTextureImageUnits2"] = gl2.getParameter(gl2.MAX_VERTEX_TEXTURE_IMAGE_UNITS).toString() } catch (e) { }
				try { result["maxVertexUniformVectors2"] = gl2.getParameter(gl2.MAX_VERTEX_UNIFORM_VECTORS).toString() } catch (e) { }
				try { result["maxViewportDims2"] = gl2.getParameter(gl2.MAX_VIEWPORT_DIMS) } catch (e) { }
				try { result["redBits2"] = gl2.getParameter(gl2.RED_BITS).toString() } catch (e) { }
				try { result["stencilBits2"] = gl2.getParameter(gl2.STENCIL_BITS).toString() } catch (e) { }
				try { result["subpixelBits2"] = gl2.getParameter(gl2.SUBPIXEL_BITS).toString() } catch (e) { }
				try { result["sampleBuffers2"] = gl2.getParameter(gl2.SAMPLE_BUFFERS).toString() } catch (e) { }
				try { result["samples2"] = gl2.getParameter(gl2.SAMPLES).toString() } catch (e) { }





				//Webgl2 additional data
				try { result["extensions2"] = gl2.getSupportedExtensions().join(",") } catch (e) { }
				try { result["webglContextAttributesDefaults2"] = gl2.getContextAttributes() } catch (e) { }


				//Webgl2 precision
				try { result["precisionVertexShaderHighFloat2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.HIGH_FLOAT).precision } catch (e) { }
				try { result["rangeMinVertexShaderHighFloat2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.HIGH_FLOAT).rangeMin } catch (e) { }
				try { result["rangeMaxVertexShaderHighFloat2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.HIGH_FLOAT).rangeMax } catch (e) { }

				try { result["precisionVertexShaderMediumFloat2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.MEDIUM_FLOAT).precision } catch (e) { }
				try { result["rangeMinVertexShaderMediumFloat2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.MEDIUM_FLOAT).rangeMin } catch (e) { }
				try { result["rangeMaxVertexShaderMediumFloat2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.MEDIUM_FLOAT).rangeMax } catch (e) { }

				try { result["precisionVertexShaderLowFloat2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.LOW_FLOAT).precision } catch (e) { }
				try { result["rangeMinVertexShaderLowFloat2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.LOW_FLOAT).rangeMin } catch (e) { }
				try { result["rangeMaxVertexShaderLowFloat2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.LOW_FLOAT).rangeMax } catch (e) { }


				try { result["precisionFragmentShaderHighFloat2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.HIGH_FLOAT).precision } catch (e) { }
				try { result["rangeMinFragmentShaderHighFloat2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.HIGH_FLOAT).rangeMin } catch (e) { }
				try { result["rangeMaxFragmentShaderHighFloat2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.HIGH_FLOAT).rangeMax } catch (e) { }

				try { result["precisionFragmentShaderMediumFloat2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.MEDIUM_FLOAT).precision } catch (e) { }
				try { result["rangeMinFragmentShaderMediumFloat2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.MEDIUM_FLOAT).rangeMin } catch (e) { }
				try { result["rangeMaxFragmentShaderMediumFloat2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.MEDIUM_FLOAT).rangeMax } catch (e) { }

				try { result["precisionFragmentShaderLowFloat2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.LOW_FLOAT).precision } catch (e) { }
				try { result["rangeMinFragmentShaderLowFloat2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.LOW_FLOAT).rangeMin } catch (e) { }
				try { result["rangeMaxFragmentShaderLowFloat2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.LOW_FLOAT).rangeMax } catch (e) { }


				try { result["precisionVertexShaderHighInt2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.HIGH_INT).precision } catch (e) { }
				try { result["rangeMinVertexShaderHighInt2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.HIGH_INT).rangeMin } catch (e) { }
				try { result["rangeMaxVertexShaderHighInt2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.HIGH_INT).rangeMax } catch (e) { }

				try { result["precisionVertexShaderMediumInt2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.MEDIUM_INT).precision } catch (e) { }
				try { result["rangeMinVertexShaderMediumInt2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.MEDIUM_INT).rangeMin } catch (e) { }
				try { result["rangeMaxVertexShaderMediumInt2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.MEDIUM_INT).rangeMax } catch (e) { }

				try { result["precisionVertexShaderLowInt2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.LOW_INT).precision } catch (e) { }
				try { result["rangeMinVertexShaderLowInt2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.LOW_INT).rangeMin } catch (e) { }
				try { result["rangeMaxVertexShaderLowInt2"] = gl2.getShaderPrecisionFormat(gl2.VERTEX_SHADER, gl2.LOW_INT).rangeMax } catch (e) { }


				try { result["precisionFragmentShaderHighInt2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.HIGH_INT).precision } catch (e) { }
				try { result["rangeMinFragmentShaderHighInt2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.HIGH_INT).rangeMin } catch (e) { }
				try { result["rangeMaxFragmentShaderHighInt2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.HIGH_INT).rangeMax } catch (e) { }

				try { result["precisionFragmentShaderMediumInt2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.MEDIUM_INT).precision } catch (e) { }
				try { result["rangeMinFragmentShaderMediumInt2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.MEDIUM_INT).rangeMin } catch (e) { }
				try { result["rangeMaxFragmentShaderMediumInt2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.MEDIUM_INT).rangeMax } catch (e) { }

				try { result["precisionFragmentShaderLowInt2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.LOW_INT).precision } catch (e) { }
				try { result["rangeMinFragmentShaderLowInt2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.LOW_INT).rangeMin } catch (e) { }
				try { result["rangeMaxFragmentShaderLowInt2"] = gl2.getShaderPrecisionFormat(gl2.FRAGMENT_SHADER, gl2.LOW_INT).rangeMax } catch (e) { }

			} catch (e) {

			}

			return { key: "webgl", global: true, value: result }
		}
	}

	function AudioData() {
		this.Prepare = function () {
			let BaseAudioContext_sampleRate = null
			let AudioContext_baseLatency = null
			let AudioContext_outputLatency = null
			let AudioDestinationNode_maxChannelCount = null

			try {
				let ContextClass = window.AudioContext || window.webkitAudioContext;
				if (typeof (ContextClass) == "function") {
					let Context = new ContextClass
					let Destination = Context.destination
					try {
						BaseAudioContext_sampleRate = Context.sampleRate
					} catch (e) { }
					try {
						AudioContext_baseLatency = Context.baseLatency
					} catch (e) { }
					try {
						AudioContext_outputLatency = Context.outputLatency
					} catch (e) { }
					try {
						AudioDestinationNode_maxChannelCount = Destination.maxChannelCount
					} catch (e) { }

				}
			} catch (e) { }

			return {
				key: "audio", global: true, value: {
					"BaseAudioContextSampleRate": BaseAudioContext_sampleRate,
					"AudioContextBaseLatency": AudioContext_baseLatency,
					"AudioContextOutputLatency": AudioContext_outputLatency,
					"AudioDestinationNodeMaxChannelCount": AudioDestinationNode_maxChannelCount,
				}
			}
		}
	}


	function NativeCodeData() {
		this.Prepare = function () {
			var res = ""

			try {
				res = window.Object.toString()
			} catch (e) { }

			return { key: "nativeCode", global: true, value: res }
		}
	}

	function BrowserPluginsProperties() {

		this.Prepare = function () {
			var plugins = {
				"length": { type: "number", value: window.navigator.plugins.length },
			}

			if (window.navigator.plugins.refresh) {

				plugins["refresh"] = {
					"type": "function",
					"toString": "function refresh() {\n    [native code]\n}"
				}
			}

			try {

				plugins["namedItem"] = {
					"type": "function",
					"toString": window.navigator.plugins.namedItem.toString(),
					"emulate": "function(item){var length=window.navigator.plugins.length;for(var i=0;i<length;i++){var p = window.navigator.plugins[i];if(p.name == item)return p}}"
				}
			} catch (e) { }

			try {

				plugins["item"] = {
					"type": "function",
					"toString": window.navigator.plugins.item.toString(),
					"emulate": "function(item){return window.navigator.plugins[item]}"
				}
			} catch (e) { }


			var mimes = {
				"length": { type: "number", value: window.navigator.mimeTypes.length }
			}
			try {
				mimes["item"] = {
					"type": "function",
					"toString": window.navigator.mimeTypes.item.toString(),
					"emulate": "function(item){return window.navigator.mimeTypes[item]}"
				}
			} catch (e) { }

			try {
				mimes["namedItem"] = {
					"type": "function",
					"toString": window.navigator.mimeTypes.namedItem.toString(),
					"emulate": "function(item){var length=window.navigator.mimeTypes.length;for(var i=0;i<length;i++){var p = window.navigator.mimeTypes[i];if(p.type == item)return p}}"
				}
			} catch (e) { }

			var plugins_table = {}
			var mimes_table = {}

			for (var i = 0; i < window.navigator.plugins.length; i++) {
				var plugin = window.navigator.plugins[i]
				plugins_table[simplehash(plugin.name)] = plugin
				var h = { type: typeof (plugin), ref: simplehash(plugin.name) }
				//if(Object.keys(window.navigator.plugins).indexOf(plugin) >= 0)
				{
					h["enum"] = true
				}
				plugins[i.toString()] = h
				plugins[plugin.name.replace(/\./g, "___")] = h
			}

			for (var i = 0; i < window.navigator.mimeTypes.length; i++) {
				var mime = window.navigator.mimeTypes[i]
				mimes_table[simplehash(mime.type)] = mime
				var h = { type: typeof (mime), ref: simplehash(mime.type) }
				//if(Object.keys(window.navigator.mimeTypes).indexOf(mime) >= 0)
				{
					h["enum"] = true
				}
				mimes[i.toString()] = h
				mimes[mime.type.replace(/\./g, "___")] = h
			}

			Object.keys(plugins_table).forEach(function (plugin_id) {
				var plugin = plugins_table[plugin_id]
				var value = {
					description: { type: "string", value: plugin.description },
					filename: { type: "string", value: plugin.filename },
					version: { type: "string", value: plugin.version },
					name: { type: "string", value: plugin.name },
					length: { type: "number", value: plugin.length },
					item: { type: "function", toString: plugin.item.toString(), emulate: "function(item){return refs[" + plugin_id + "][item]}" },
					namedItem: { type: "function", toString: plugin.namedItem.toString(), emulate: "function(item){var length=refs[" + plugin_id + "].length;for(var i=0;i<length;i++){var p = refs[" + plugin_id + "][i];if(p.type == item)return p}}" }
				}
				for (var i = 0; i < plugin.length; i++) {
					var mime = plugin[i]
					var h = { type: typeof (mime), ref: simplehash(mime.type) }
					//if(Object.keys(plugin).indexOf(mime) >= 0)
					{
						h["enum"] = true
					}
					value[i.toString()] = h
					value[mime.type.replace(/\./g, "___")] = h
				}
				refs[plugin_id] = {
					type: typeof (plugin),
					toString: plugin.toString(),
					value: value
				}
			})

			Object.keys(mimes_table).forEach(function (mime_id) {
				var mime = mimes_table[mime_id]
				var value = {
					description: { type: "string", value: mime.description },
					suffixes: { type: "string", value: mime.suffixes },
					type: { type: "string", value: mime.type },
					enabledPlugin: { type: "object", ref: simplehash(mime.enabledPlugin.name) }
				}
				refs[mime_id] = {
					type: typeof (mime),
					toString: mime.toString(),
					value: value
				}
			})


			var res = { "window_navigator_plugins": { type: typeof (window.navigator.plugins), toString: window.navigator.plugins.toString(), value: plugins }, "window_navigator_mimeTypes": { type: typeof (window.navigator.mimeTypes), toString: window.navigator.mimeTypes.toString(), value: mimes } }

			return { key: "window.navigator.plugins && window.navigator.mimeTypes", value: res }
		}
	}


	var refs = {}
	var aliases = []
	var errors = []

	function convert(obj, depth, find_refs, refs_depth_find, get_object_id, emulate_functions, get_all_properties, get_alias) {
		if (typeof (obj) == "object" && obj) {
			if (depth < 0)
				return { type: typeof (obj), value: null }


			/*if(Object.prototype.toString.call(obj) == "[object Array]")
			{
				var r = []
				for(var i = 0;i < obj.length;i++)
				{
					var c = convert(obj[i], depth - 1, find_refs, refs_depth_find,get_object_id)

					if(c["type"] == "object" && find_refs)
					{
						var c_no_ref = "";
						c_no_ref = get_object_id(obj[i])
						if(c_no_ref.toString() == 0)
							c_no_ref = JSON.stringify(convert(obj[i], refs_depth_find, false,refs_depth_find,get_object_id))

						var hash = simplehash(c_no_ref)

						var in_refs = hash in refs
						
						refs[hash] = c

						if(in_refs)
						{
							c = {type: c["type"], ref:hash}	
						}
					}

					r.push(c)
				}
				
				return {type: "array", value:r}
			}else
			{*/
			var r = {}
			var keys = Object.keys(obj)
			var prop = get_all_properties(obj)
			var length = prop.length
			for (var i = 0; i < length; i++) {
				var p = prop[i]
				var alias = get_alias(obj[p])
				var c;
				if (alias) {
					alias.forEach(function (a) {
						if (aliases.indexOf(a) < 0)
							aliases.push(a)
					})

					c = { alias: alias, type: typeof (obj[p]), toString: obj[p].toString() }
				} else {
					c = convert(obj[p], depth - 1, find_refs, refs_depth_find, get_object_id, emulate_functions, get_all_properties, get_alias);
					if (c["type"] == "object" && find_refs) {
						var c_no_ref = "";
						c_no_ref = get_object_id(obj[p])
						if (c_no_ref.length == 0)
							c_no_ref = JSON.stringify(convert(obj[p], refs_depth_find, false, refs_depth_find, get_object_id, emulate_functions, get_all_properties, get_alias))

						var hash = simplehash(c_no_ref)

						var in_refs = hash in refs

						if (c["value"])
							refs[hash] = c

						if (in_refs) {
							c = { type: c["type"], ref: hash }
						}
					}
				}
				if (keys.indexOf(p) >= 0)
					c["enum"] = true

				r[p.replace(/\./g, "___")] = c

			}
			return { type: "object", value: r, toString: obj.toString() }
			/*}*/

		} else if (typeof (obj) == "function" && obj) {
			var emulate = emulate_functions(obj)
			var res = { type: typeof (obj), toString: obj.toString() }
			if (emulate)
				res["emulate"] = emulate
			return res
		} else
			return { type: typeof (obj), value: obj }
	}


	function BrowserObjectPropertyItemJsEval(key, prop) {

		if (!prop) prop = {}

		var refs_depth = 4
		if (typeof (prop["refs_depth"]) != "undefined")
			refs_depth = prop["refs_depth"]

		var refs_depth_find = 4
		if (typeof (prop["refs_depth_find"]) != "undefined")
			refs_depth_find = prop["refs_depth_find"]

		var get_object_id = function () { return "" }
		if (typeof (prop["get_object_id"]) != "undefined")
			get_object_id = prop["get_object_id"]

		var emulate_functions = function () { return null }
		if (typeof (prop["emulate_functions"]) != "undefined")
			emulate_functions = prop["emulate_functions"]

		var get_alias = function () { return null }
		if (typeof (prop["get_alias"]) != "undefined")
			get_alias = prop["get_alias"]

		var get_all_properties = function (obj) { var res = []; for (var p in obj) { res.push(p) } return res; }
		if (typeof (prop["get_all_properties"]) != "undefined")
			get_all_properties = prop["get_all_properties"]


		this.Prepare = function () {
			var value = null
			var iserror = false
			var message = ""

			try {
				var o = eval(key)
				//console.log(Date.now())
				value = convert(o, refs_depth, true, refs_depth_find, get_object_id, emulate_functions, get_all_properties, get_alias)
				//console.log(Date.now())


			} catch (e) {
				errors.push(e.message)
				iserror = true
				message = e.message
				value = ""
			}

			var res = { key: key, value: value }
			if (iserror) {
				res["iserror"] = iserror
				res["message"] = message
			}
			return res
		}
	}
	function FindAllUsedRefs(dat, all) {
		try {

			if (dat && dat["type"] == "object" && "ref" in dat && all.indexOf(dat["ref"]) < 0) {
				all.push(dat["ref"])
			}
		} catch (e) { errors.push(e.message) }
		for (var prop in dat) {
			if (typeof (dat[prop]) == "object")
				FindAllUsedRefs(dat[prop], all)
		}
	}

	function hasSessionStorage() {
		try {
			return !!window.sessionStorage;
		} catch (e) {
			return true;
		}
	}

	function heapSize() {
		try {
			return (performance.memory.jsHeapSizeLimit).toString();
		} catch (e) {
			return "";
		}
	}

	function hasLocalStorage() {
		try {
			return !!window.localStorage;
		} catch (e) {
			return true;
		}
	}

	function hasIndexedDB() {
		try {
			return !!window.indexedDB;
		} catch (e) {
			return true;
		}
	}

	function hasWebSql() {
		try {
			return !!window.openDatabase;
		} catch (e) {
			return true;
		}
	}

	function GetWindowProperties() {
		var res = {}
		//alert(Object.getOwnPropertyNames(window).sort().join("\n"))
		var key = "Object"
		try {
			var val = { type: typeof (window[key]) };
			if (typeof (window[key]) == "object" || typeof (window[key]) == "function") {
				if (window[key]) {
					val["toString"] = window[key].toString()
				}
				else {
					val["toString"] = ""
				}

			}
			res[btoa(key)] = val
		} catch (e) {

		}



		return res;
	}

	function GetDoNotTrack() {
		if (navigator.doNotTrack) {
			return navigator.doNotTrack;
		} else if (navigator.msDoNotTrack) {
			return navigator.msDoNotTrack;
		} else if (window.doNotTrack) {
			return window.doNotTrack;
		} else {
			return "unknown";
		}
	}

	function GetUserAgentData() {
		var Result = {}
		try {
			Result["brands"] = navigator.userAgentData.brands
			Result["mobile"] = navigator.userAgentData.mobile
			return (new Promise((resolve, reject) => {

				try {
					navigator.userAgentData.getHighEntropyValues(["platform", "platformVersion", "architecture", "model", "uaFullVersion"]).then(function (highEntropyValues) {
						try {
							Result["fullVersion"] = highEntropyValues.uaFullVersion
							Result["platform"] = highEntropyValues.platform
							Result["platformVersion"] = highEntropyValues.platformVersion
							Result["architecture"] = highEntropyValues.architecture
							Result["model"] = highEntropyValues.model
						} catch (e) {
						}

						resolve(btoa(JSON.stringify(Result)))
					})
				} catch (e) {
					resolve("")
				}
			}));

		} catch (e) {
		}
		return Promise.resolve("")
	}


	function GetMediaDevices() {
		try {
			return new Promise(function (resolve, reject) {
				try {
					navigator.mediaDevices.enumerateDevices().then(function (Devices) {
						try {
							var Result = { devices: [], constraints: [] }
							for (var i = 0; i < Devices.length; i++) {
								Result.devices.push(JSON.parse(JSON.stringify(Devices[i])))
							}
							Result.constraints = JSON.parse(JSON.stringify(navigator.mediaDevices.getSupportedConstraints()))
							resolve(Result)
						} catch (e) {
							resolve({ devices: [], constraints: [] })
						}

					})
				}
				catch (e) {
					resolve({ devices: [], constraints: [] })
				}
			})
		} catch (e) {
			return Promise.resolve({ devices: [], constraints: [] })
		}
	};

	function GetVoicesInstant() {
		var voices = window.speechSynthesis.getVoices();
		var results = []

		for (var it = 0; it < voices.length; it++) {
			var voice = voices[it];
			results.push(
				{
					name: voice.name,
					lang: voice.lang,
					localService: voice.localService,
					voiceURI: voice.voiceURI,
					default: voice["default"]
				});
		}

		return results;
	}

	function GetVoices() {
		try {
			return new Promise(function (resolve1, reject1) {
				try {
					var GetVoicesIteration = function (resolve2, reject2, iterator) {
						try {
							var result = GetVoicesInstant()
							if (result.length > 0) {
								resolve2(result)
								return;
							}
							if (iterator > 50) {
								resolve2([])
								return;
							}
							setTimeout(function () {
								resolve2(new Promise(function (resolve3, reject3) {
									GetVoicesIteration(resolve3, reject3, iterator + 1)
								}))
							}, 100)
						} catch (e) {
							resolve2([])
						}

					}

					resolve1(new Promise(function (resolve4, reject4) {
						GetVoicesIteration(resolve4, reject4, 0)
					}))

				} catch (e) {
					resolve1([])
				}


			})
		} catch (e) {
			return Promise.resolve([])
		}
	};


	function GetKeyboardLayout() {
		try {
			return new Promise(function (resolve, reject) {
				try {
					navigator.keyboard.getLayoutMap().then(function (keyboard) {
						try {
							var Result = []
							keyboard.forEach(function (value, key) {
								Result.push(key);
								Result.push(value);
							});
							resolve(Result)
						} catch (e) {
							resolve([])
						}

					})
				}
				catch (e) {
					resolve([])
				}
			})
		} catch (e) {
			return Promise.resolve([])
		}
	};


	function BrowserProperties() {
		var Items = []
		this.AddItem = function (item) {
			Items.push(item)
		}
		this.Prepare = function (Additional) {
			var Res = {}
			Res["version_client"] = "2.0"
			try {
				Res["url"] = window.location.href
			}
			catch (e) { errors.push(e.message) }
			var Dat = {}
			for (var i = 0; i < Items.length; i++) {
				try {
					var item = Items[i]
					var prop = item.Prepare()
					var key = prop["key"]
					if (prop["global"])
						Res[key] = prop["value"]
					else
						Dat[key.replace(/\./g, "_")] = prop["value"]
				} catch (e) { errors.push(e.message) }
			}
			///var now = Date.now()
			//console.log("Stage 1 << " + (Date.now() - now).toString())
			Res["dat"] = Dat
			//console.log("Stage 2 << " + (Date.now() - now).toString())
			Res["dnt"] = GetDoNotTrack() == "1"
			//console.log("Stage 3 << " + (Date.now() - now).toString())
			//console.time("Fonts")
			return new Promise(function (resolve, reject) {
				GetFonts().then(function (Data) {
					//console.timeEnd("Fonts")
					Res["fonts"] = Data
					Res["hasSessionStorage"] = hasSessionStorage();
					var heap = heapSize();
					if (heap)
						Res["heap"] = heap;
					Res["hasLocalStorage"] = hasLocalStorage();
					Res["hasIndexedDB"] = hasIndexedDB();
					Res["hasWebSql"] = hasWebSql();
					//console.log("Stage 5 << " + (Date.now() - now).toString())
					Res["windowProperties"] = GetWindowProperties()
					//console.log("Stage 6 << " + (Date.now() - now).toString())
					var all_used_ref = []
					FindAllUsedRefs(Dat, all_used_ref)
					FindAllUsedRefs(refs, all_used_ref)
					refs_new = {}
					all_used_ref.forEach(function (el) {
						refs_new[el] = refs[el]
					})
					Res["refs"] = refs_new
					Res["aliases"] = aliases

					Object.keys(Additional).forEach(function (Key) {
						Res[Key] = Additional[Key]
					})
					//console.log("Stage 7 << " + (Date.now() - now).toString())
					resolve(JSON.stringify(Res))
				}).catch(function (e) {
					reject(e)
				})

			})



		}

	}

	function createSpan() {

		var s = document.createElement("span");
		s.style.position = "absolute";
		s.style.left = "-9999px";
		s.style.fontSize = "72px";
		s.style.lineHeight = "normal";
		s.innerHTML = "mmmmmmmmmmlli";
		return s;
	}

	function initializeBaseFontsSpans(baseFontsDiv) {
		var baseFonts = ["monospace", "sans-serif", "serif"];

		var spans = [];
		for (var index = 0, length = baseFonts.length; index < length; index++) {
			var s = createSpan();
			s.style.fontFamily = baseFonts[index];
			baseFontsDiv.appendChild(s);
			spans.push(s);
		}
		return spans;
	};

	function GetFontsSync(fontList, defaultWidth, defaultHeight, createdSpans) {
		var baseFonts = ["monospace", "sans-serif", "serif"];

		var available = [];
		for (var i = 0, l = fontList.length; i < l; i++) {
			for (var j = 0, numDefaultFonts = baseFonts.length; j < numDefaultFonts; j++) {
				var s = createdSpans[j]
				s.style.fontFamily = "'" + fontList[i] + "'," + baseFonts[j];
			}

			var detected = false;
			for (var j = 0; j < baseFonts.length; j++) {
				detected = (createdSpans[j].offsetWidth !== defaultWidth[baseFonts[j]] || createdSpans[j].offsetHeight !== defaultHeight[baseFonts[j]]);
				if (detected) {
					break;
				}
			}

			if (detected)
				available.push(fontList[i])
		}

		return available
	}
	function GetFontsFontFaceSet() {
		var fontList = [
			"Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS",
			"Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style",
			"Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New",
			"Garamond", "Geneva", "Georgia",
			"Helvetica", "Helvetica Neue",
			"Impact",
			"Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode",
			"Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO",
			"Palatino", "Palatino Linotype",
			"Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol",
			"Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS",
			"Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"
		];
		var extendedFontList = [
			"Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium", "Algerian", "Amazone BT", "American Typewriter",
			"American Typewriter Condensed", "AmerType Md BT", "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic Typesetting", "ARCHER",
			"ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville",
			"Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD",
			"Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed",
			"Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Californian FB", "Calisto MT", "Calligrapher", "Candara",
			"CaslonOpnface BT", "Castellar", "Centaur", "Cezanne", "CG Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer",
			"ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna MT", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold",
			"Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark",
			"DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC",
			"EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light", "Forte",
			"FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER",
			"Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT", "Gautami", "Geeza Pro", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt BT", "GeoSlab 703 Lt BT",
			"GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD",
			"Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV",
			"Herald", "High Tower Text", "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT",
			"Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT", "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN",
			"Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island",
			"Lydian BT", "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic",
			"Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le",
			"Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Mongolian Baiti",
			"MONO", "MoolBoran", "Mrs Eaves", "MS LineDraw", "MS Mincho", "MS PMincho", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli",
			"Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN",
			"OSAKA", "OzHandicraft BT", "Palace Script MT", "Papyrus", "Parchment", "Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB",
			"Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla",
			"Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold", "SCRIPTINA", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood",
			"Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket",
			"Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen", "Synchro LET", "System", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC",
			"Terminal", "Thonburi", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold",
			"TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium", "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda", "Westminster", "WHITNEY", "Wide Latin",
			"ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"];

		var extendedFontList2 = ["Segoe WP", "FreeMono", "Heiti TC Light", "VNI-Kun", "Liberation Serif", "ML-TTVeenaHeavy", "Brandon Grotesque Light", "Adobe Hebrew Italic", "MMa Etc Bold", "Toledo", "Ubuntu Mono derivative Powerline", "Hannotate TC Regular", "Droid Sans Thai", "Cambria Italic", "Abadi MT Condensed Extra Bold", "Barrio", "ML-TTVishu", "MMa VariableB S", "BurigangaSushreeOMJ", "Pegypta", "Avenir Next Condensed", "TitilliumText22L-Bold", "Corbel Bold Italic", ".VnCourier New", "Trajan Pro 3 Bold", "Futura LT Condensed Light", "FML-TTAmbili", "dbldwrsw", "PingFang HK Light", "Soho Gothic Pro Italic", "Tele-Marines", "Cronos Pro", "Noto Sans Brahmi", "HANA", "VNI Times", "Rakesly El", "WP MultinationalA Roman", "HGSHeiseiKakugothictaiW5", "Avenir Next W1G Medium", "Cambria Bold Italic", "Futura Std Book", "New Renex Terminal", "HGSHeiseiKakugothictaiW9", "KufiStandardGK Regular", "VNI-Bodon-Poster", "eurb9", "MrsEavesRoman", "WP Greek Century", "STIXNonUnicode", "Songti SC Bold", "Kaushan Script", "OpenSymbol", "FML-TTJyotsna", "EngraverTime", "Charter Black Italic", "Arno Pro", "Tahoma Negreta", "Century Schoolbook L", "Circular Std Book Italic", "Tall Boy 3D", "Egyptian710 BT", "ML-NILA03", "ML-NILA02", "ML-NILA01", "Petrucci", "Waseem Regular", "ML-NILA06", "ML-NILA05", "NORMAL", "eusm8", "Z@R120A.tmp", "cmtcsc10", "Merriweather Italic", ".VnSouthernH", "Lantinghei TC Heavy", "C-Medium", "Nightclub BTN UltraCn", "GoraiOMJ", "Avenir Next Ultra Light", "Myanmar Sangam MN", "Droid Sans Mono Dotted for Powerline", "Optima Italic", "TitilliumText22L-Regular", "MelodBold", "cmsl10", "cmsl12", "Linux Libertine Display O", "Manorama", "DecoType Naskh Special", "Caviar Dreams Bold Italic", "Sauce Code Powerline", "Courier New CE", "BurigangaSushreeMJ", "Aileron", "Hiragino Sans", "Smooth", "MMCenturyOldGreek", "Microsoft NeoGothic", "Atzur", "GLYPHICONS Halflings", "Trattatello", "LT-TM-Lakshman", "TeX Gyre Chorus", "Myriad Pro SemiCondensed", "Open Sans Extrabold", "Chaparral Pro Bold", "GrilledCheese BTN Cn", "Bitstream Charter", "Noto Sans Tai Viet", "Georgia Pro SemiBold", "Rotis Sans Serif Std 56 Italic", "ITF Devanagari Marathi Demi", "Avenir Next W1G Thin", "Priori Serif OT", "Times Bold Italic", "BurigangaKamalaOMJ", "Literation Mono Powerline Italic", "Quickpen", "AR BONNIE", "Caviar Dreams", "Avenir Roman", "Pujeeta", "Deepak", "cmmi12", "FML-TTSankara", "Bookman Old Style Italic", ".VnArial", "Antonio", "Linowrite", "GFS Gazis", "FordLineDraw", "ConcursoItalian BTN Wide", "MMa CenturySS", "Laksaman", "Segoe Marker", "Monotype Sorts", "Bienhoa", "Noto Sans Syriac Eastern", "Caviar Dreams Bold", "MMa Arrow Bold Italic", "Diavlo Black", "Proxima Nova", "BhairabOMJ", "WP Phonetic", "Myriad Pro", "VNI-Fato", "Myriad Pro Bold", "MMVariableF Bold", "Julius Sans One", "EuroRoman", "cmcsc9", "cmcsc8", "LaurenScript", "VNI-Commerce", "Freebooter Script", "Math5", ".VnHelvetIns", "Roboto Mono Bold Italic for Powerline", "Vineta BT", "ML-TTPooram", "MMa Extra Bold", "Quangngai", "TAM", "Terminal Greek 737 (437G)", "TITUS Cyberbit Basic", "Kalakaumudi", "Adobe Gurmukhi", "HanziPen SC", "cmff10", "Praxis", "FML-TTVishu", "Microsoft MHei", "VNI Greece", "Sukhumvit Set Semi Bold", "Swiss 721 Roman", "Soho Gothic Pro Ultra Italic", "STLiti", "Marquisette BTN Light", "Arimo Bold Italic for Powerline", "ML-TTJaya", "eusm9", "Kohinoor Devanagari Light", "Century Gothic Italic", "HariSree", "MyriadPro-Semibold", "IPAexGothic", "MS Reference Serif", "eusm7", "HelveticaNeueLT Pro 97 BlkCn", "Quicksand Bold", "Yu Mincho", "VNI-Murray", "ChandrabatiMJ", "Sitka Banner", "MMCenturyOldGreek Italic", ".VnCommercial ScriptH", "Interstate-Regular", "Arimo Bold Italic", "Latienne Pro", "TAC-Valluvar", "FML-Nanditha", "MMa VariableF Bold", "Tekton Pro Bold", "Noto Serif", "AmdtSymbols", "Euclid Symbol", "Songti SC Regular", "Cambria Bold", "Meslo LG S DZ Regular for Powerline", "Nexa Light", "Party LET Plain:1.0", "Minion Pro SmBd", "AV-Font-Kan1", "Clarendon Cn BT", "Yu Mincho Demibold", "Hypatia Sans Pro Semibold", "Seravek Bold Italic", "Nightclub BTN Cn", "Myriad Arabic Italic", "Charter Roman", "spinwerad", "Gill Sans Nova Cond Ultra Bold", "KG Corner of the Sky", "DecoType Naskh Extensions", "MLB-TTAmbili", "YuMincho ", "Futura LT Light", "Latin Modern Roman", "Gotham Narrow Black Italic", "DIN-Light", "VNI-Top", "Giolinh", "Muna Black", "Apple Boy BTN", "Clarendon BT", "DINPro-Light", "Playfair Display SC Black", "Quixley LET", "MMa Pascal Bold", "Interstate-Light", "American Typewriter Condensed Bold", "Skia Condensed", "Latienne Pro Bold", "lcircle10", "ML-IndulekhaHeavy", "Source Serif Pro Semibold", "Tamburo", "Halong", "Normande Italic", "VNI-Book", "MMa Extra Italic", "Heavy", "MMBinary", "PondAllRounder", "Euphemia UCAS Bold", "Avenir Book Oblique", "HP Simplified Light", "HGSHeiseiKakugothictaiW3", "Gill Sans Light", "VNI-Garam", "AlekyaMedium", "Hebar", "Stone Sans Sem ITC TT", "DV1-TTYogesh", "Adobe Arabic", "Rosewood Std Regular", "Marquisette BTN Lined", "Gotham Book", "Sukhumvit Set Medium", ".VnTeknicalH", "Z@R1762.tmp", "MMa Gauss Bold", "Avenir Next Condensed Demi Bold", "Trebuchet MS Bold Italic", "TlwgMono", "Avenir Next W1G Bold", "Flubber", "Opus Figured Bass", "Futura LT Heavy Oblique", "Nova Oval", "Bangla MN", "Opus Function Symbols", "Microsoft JhengHei Light", "STIXSizeOneSym", "Magic School Two", "Type Embellishments One LET Embellishments One LET Plain:1.0", "Avenir Next Heavy", "Palatino Bold", "Candara Italic", "Gujarati MT Bold", "Vinhan", ".VnBahamasBH", "SaiVrishin", "AR ESSENCE", "Frankfurter Venetian TT", "Gillius ADF Cd", "Mishafi Gold", "System Font Medium", "Roboto Mono Medium for Powerline", "SF Distant Galaxy", "Monotype.com", "MMTextBook Bold", "Gill Sans MT Italic", "Tlwg Typewriter", "Soho Gothic Pro ExtraBold", "STIXSizeTwoSym-Bold", "BaluBrush", "System Font Bold", "Roboto Light Italic", "Times New Roman (Arabic)", "Maestro Wide", "Bickham Script Pro 3 Semibold", "STXingkai", "Annie BTN", "AtraiOMJ", "Aileron SemiBold", "cmsy7", "Bookshelf Symbol 3", "Orator Std", "Swis721 BdCnOul BT", "Proxima Nova Bold", "Shree Devanagari 714 Bold Italic", "WP MultinationalA Helve", "Noto Sans", "Lucida Sans Italic", "Phosphate Solid", "Damascus", "DengXian Light", "Notram", "Bordeaux Roman Bold LET Plain", "Lantinghei SC Heavy", "MMa CenturyS Italic", "Noto Sans Phoenician", "System Font", "ADMUI3Sm", "Shree Devanagari 714 Italic", "kroeger 06", "Belfast Light SF", "KacstBook", "PingFang SC Thin", "Futura Condensed Medium", "WP Japanese", "Hiragino Kaku Gothic Std W8", "GaneshBold", "Open Sans Italic", "Aileron Bold", ".VnFreeH", "Swis721 BlkOul BT", ".VnRevueH", "Freehand521 BT", "MMa Arrow Italic", "Opus Chords Sans Condensed", "OR-TTSarala", "Montserrat Black", "VNI-Avo", "System Font Medium P4", "VNI-GlabXb", "HarvestItal", "MMa VariableA S", "Segoe WP Black", "Courier10 BT", ".VnLincolnH", "eusb5", "Marker Felt Thin", "KacstTitleL", "HelveticaNeueLT Pro 107 XBlkCn", "IBM3270", "MLB-TTIndulekha", "PujeetaItalic", "Bookman Old Style Bold", "Latin Modern Sans", "ELEGANCE", "GhorautraMJ", "MMExtra Bold", "Rockwell Nova Cond", "Minion Pro Cond", "Brandon Grotesque Medium", "HGHeiseiKakugothictaiW9", "Euphemia UCAS Italic", ".VnUniverseH", "Avenir Book", "ZapfHumnst Ult BT", "Diwani Simple Striped", "Myriad Pro Bold SemiCondensed", "Raleway SemiBold Italic", "Z@R1751.tmp", "Hypatia Sans Pro Black", "linew10", ".VnCooperH", "Adobe Ming Std", "BlairMdITC TT Medium", "FML-TTIndulekhaHeavy", "Ruach LET", "ML-TTJyothy", "Latin Modern Mono Prop", "ML-NILA04", "TeX Gyre Pagella", "Roboto Slab", "eurb7", "PFFuelPro-Regular", "eurb5", "MMGreek Bold", "Oswald Stencil Bold", "Georgia Bold", "Noto Serif Thai", "Selena", "Perpetua Titling MT Bold", "ColdSpaghetti BTN", "Courier Oblique", "Dosis Medium", "Canter Bold Shadow", "St Marie Thin", "FML-TTGopika", "STIXIntegralsSm-Bold", "MMEtc Italic", "CHANL", "Yu Gothic UI", "KacstNaskh", "VNI-Palatin", "GFS Porson", "ML-TTAswathi", "Myriad Pro Condensed Italic", "Avenir Next Italic", "WP ArabicScript Sihafa", "Euclid Symbol Bold", "Myriad Pro Semibold Condensed", "PT Bold Broken", "Goudy Old Style Bold", "Racing Sans One", "Bentham", "Gotham Book Italic", "Asimov", "Avenir Next W1G Light", "Ashwariya", "Myriad Pro Light Italic", "VNI Helve Condense", "Songti TC Regular", "Verdana Italic", "Nexa XBold Italic", "Source Sans Pro", "Dingbats", "OCR-A II", "Deneane", "MMExtra Bold Italic", "Wellfleet", "Jazz LET Plain:1.0", "STIXIntegralsSm-Regular", "MMa CenturyK", "Javanese Text", "Nova Script", "Arial Hebrew Bold", "PCMyungjo Regular", "Bhuma", "MMa CenturyS", "Quicksand Dash", "Montserrat Bold", "Jokerman Alts LET", "Floraless", "SF Compact Rounded Semibold", "URW Gothic L", "BadaBoom BB", "Cantarell Oblique", "Brush Script MT Italic", "Raanana Bold", ".VnArialH", "IPAPGothic", "BN-TTDurga", "WP MultinationalB Courier", "Germanica", "Paralucent Demi Bold Italic", "Proxima Nova Soft Medium", "Myriad Hebrew Bold", "Telugu MN Bold", "WP MathA", "Proxima Nova Condensed Light Italic", "IDAutomationPDF417n5", "Times New Roman Greek", "FML-TTKaumudi", "SF Compact Rounded Bold", "Tinos Bold Italic for Powerline", "Lantinghei TC", "Stylus BT", "Soho Gothic Pro Medium", "Broken Planewing", "MMa Relation Bold Italic", "MMCenturyNew Bold Italic", "Droid Sans Ethiopic", "3M Circular TT Bold", "IDAutomationPDF417n2", "Lato Black Italic", "Liberation Sans", "Sofia", "Paralucent Light Italic", "Dancing Script", "DholeshwariMJ", "eufm10", "Palatino Linotype Bold", "Candy Round BTN", "12x10", "Rupee Foradian", "SchoolHouse Cursive B", "Stone Sans Sem ITC TT Semi", "Coda", "Sneakerhead BTN Condensed", "Merriweather Light Italic", "System Font Ultralight", "Akshar Unicode", "Lato Italic", "Kohinoor Bangla Medium", "ChandrabatiMatraOMJ", "Futura LT Bold", "Helvetica Bold", "Arvo", "Coolvetica", "AR BLANCA", "PingFang HK Regular", "Arial Narrow Italic", "cmtex9", "cmtex8", "Fren", "MMa Negate S", "Minion Pro Medium Italic", "SWED", "ITF Devanagari Marathi Light", "athletic", "Pointedly Mad", "Farsi Simple Outline", "Yuppy TC", "Noto Sans Lao UI", ".VnShelley Allegro", "Quinhon", "Courier Bold", "Carrois Gothic SC", "PT Serif Bold Italic", "ML-TTKanika", "Avenir Next W1G Regular", "GrilledCheese BTN Toasted", "QuiverItal", "Kanalisirung", "FML-TTJaya", "HelveticaNeueLT Pro 53 Ex", "Cut Me Out", "Khmer MN Bold", "Skia Light", "Garamond Italic", "GothicG", "Autour One", "Opus PlainChords", "Symbol Tiger", "Lucida Fax Demibold", "Athelas", "Linux Libertine Initials O", "STIXIntegralsUp-Bold", "MMa VariableD SS", "VNI-Aztek", "MLW-TTKarthika", "ML-TTChithira", "Superclarendon Regular", "Z@R185D.tmp", ".VnPresent", "MMa Etc Italic", "ADMUI3Lg", "Brandon Grotesque Black", "Avenir Next Condensed Italic", "Circular Std Black", "Futura LT Extra Bold Oblique", "KanchanOMJ", "cmcsc10", ".VnCommercial Script", "Mathilde", "GangaSagarMJ", "Nunito Light", "Code39AzaleaRegular3", "Code39AzaleaRegular2", "MMa Variable", "STIXSizeTwoSym-Regular", "Arabic Transparent", "Kufi Extended Outline", "Myriad Pro Bold SemiExtended Italic", "Titillium Thin Italic", "Aileron Heavy", "Noto Serif Lao", "Web Serveroff", "Sauce Code Powerline Bold", "Yuanti TC Bold", "Noto Sans Bamum", "Calisto MT Italic", "Myriad Arabic Bold Italic", "uni 05", "Noto Sans Runic", "Sue Ellen Francisco", "Hiragino Mincho Pro", "GENUINE", "FML-TTVarsha", "Lucida Grande", "Playfair Display SC Black Italic", "Avenir Heavy Oblique", "GaneshExtraBold", "MMa CenturySS Bold", "STIXSizeThreeSym-Bold", "Kozuka Gothic Pro", "KalegongaMJ", "Lucida Sans Typewriter Regular", "Judson", "YuMincho  36p Kana Demibold", "FML-TTVisakham", "Trade Gothic LT Std Condensed No. 18 Oblique", "Myriad Pro Semibold SemiCondensed", "Segoe UI Emoji", "Ubuntu Mono", "ChitraOMJ", "DejaVu Sans Mono Bold Oblique for Powerline", "Noto Sans Avestan", "Piranesi It BT", "PrimaSans BT", "Mshtakan Oblique", "Adamsky SF", "Roboto Thin", "Reklame Script Regular", "Lato Regular", "Myriad Arabic", "Vollkorn Bold", "New Peninim MT Inclined", "HGHangle", "Desdemona", "KievitPro-Regular", "Arno Pro Smbd SmText", "Rotis Sans Serif Std 55 Regular", "Gill Sans Bold", "Euclid Bold", "Charter Black", ".VnMysticalH", "Rakesly Ul", "Vogue-ExtraBold", "ITAN", "Mishafi Regular", ".VnRevue", "Mishafi", "Old Antic Decorative", "Sukhumvit Set Light", "Photoshop Small", "TAU-Kambar", "Magic School One", "Trajan Pro 3", "Rage Italic LET", "cmfib8", "Xirod", "Nimbus Sans L", "Sacred Geometry", "ELANGO-TML-Panchali-Normal", "Gill Sans MT Bold", "Droid Sans Hebrew", "CL", "MMa Extra SS", "HelveticaNeueLT Pro 75 BdOu", "FML-TTAswathi", "NATURALBORN", "Pleasantly Plump", "Blackletter686 BT", "Yuppy SC Regular", "Arno Pro Smbd", "Engl", "Times New Roman Cyr", "Gill Sans MT Bold Italic", "Myriad Pro Light SemiCondensed", "YuMincho Demibold", "Canter Light", "Broadway Copyist Text Ext", "Marquisette BTN", "Nova Cut", "Rumburak", "PT Bold Heading", "TeX Gyre Termes", "Dollar", "System Font Regular", "SWItalc", "Noto Sans Devanagari", "AV-Font-Hin1", "DejaVu Sans Condensed", "Huxley Titling", "Roboto Bold", "Noto Sans Cypriot", "HelveticaNeueLT Pro 25 UltLt", "Distant Galaxy", "Nueva Std Italic", "SWItalt", "HELTERSKELTER", "Adobe Gothic Std", "Avenir Next W1G Italic", "KacstTitle", "Symap", "Ancuu", "cmmib7", "Chaparral Pro Italic", "STIXGeneral-BoldItalic", "MMNegate Bold Italic", "Birch Std", "Silom", "Futura Light BT", "Leelawadee UI", "Proxy 7", "Proxy 6", "Proxy 5", "Proxy 4", "Proxy 3", "MT Extra Tiger", "Proxy 1", "Clarendon Hv BT", "Lantinghei TC Demibold", "Stone Sans ITC TT Bold", "Accord SF", "Book Antiqua Italic", "ML-TTNarmadaExBold", "Proxy 9", "Proxy 8", "Futura Medium BT", "YuMincho", "Lucida Blackletter", "Noto Sans Gujarati", "Z@R13D5.tmp", "Belfast SF", "Yu Gothic UI Light", "Noto Sans Linear B", "kroeger 05", "Myriad Pro Semibold Condensed Italic", "Futura Condensed ExtraBold", "Roboto Regular", "Broadway BT", "LeviBrush", "Verdana Pro Cond Black", "Bebas Neue Light", "Yuanti SC", "Futura Std Medium Condensed", "Diwan Thuluth", "EngraverTextH", "cmmi10", "HelveticaNeueLT Pro 47 LtCn", "Verdana Bold Italic", "Proxima Nova Rg", "Lucida Fax Regular", "System Font Medium Italic", "Didot Bold", "Hack Bold Italic", "HelveticaNeueLT Std", "Segoe WP Semibold", "Constantia Bold", "Futura LT Medium Oblique", "VNI-Univer", "TAM-Shree800", "EngraverTextT", "Baby Kruffy", "David Transparent", "HGSHeiseiMinchotaiW3", "Fira Mono Medium for Powerline", "PT Sans Narrow Bold", "header 08", "Mesquite Std", "HucklebuckJF", "MANDELA", "KacstArt", "MMa Arrow S", "Gridnik", "Adobe Gurmukhi Bold", "Noto Sans Lao", "cmsy10orig", "Asana Math", "Adobe Caslon Pro Semibold Italic", ".VnPresentH", ".VnClarendonH", "Lao MN Bold", "Titillium Thin", "Vivian", "RomanD", "ISOCP2", "Logo3Mv3tt", "QTOptimum Bold", "Baghdad", "Cantarell Bold", "Myriad Pro SemiExt", "American Typewriter Light", "Avenir Next W1G Thin Italic", "Libian SC", "Sitka Small", "Noto Sans Saurashtra", "Averia Sans", "Interstate-Bold", "Tw Cen MT Bold", "wgl4", "eusb10", "AlekyaThin", "HelveticaNeueLT Pro 65 Md", "SaiIndira", "RomanS", "MMa CenturyKS Bold Italic", "58", "VNtimes new roman", "MMa Binary Italic", "55", "Holiday Springs BTN", "57", "Roboto Mono Thin for Powerline", "51", "Adobe Gothic Std B", "52", "HelveticaNeueLT Std Cn", "Noto Sans Gurmukhi", "PT Mono Bold", "Bastion", "FML-TTChithira", "54", "Lohit Tamil", "Yellowtail", "VNI-Helve", "Diwani Simple Outline 2", "ML-TTIndulekha", "Incised901 Ct BT", "Verona", "56", "Calligraffitti", "Eurostile Bold", "Rockwell Nova Extra Bold", "Gill Sans Italic", "SF Compact Rounded Regular", "SWMeteo", "GothicI", "Chewy", "53", "Lato Thin", "TeX Gyre Bonum", "URW Bookman L", "Hannotate SC Regular", "ElegantIcons", "MMa CenturyK Italic", "GROBOLD", "Bookshelf Symbol 2", "PingFang TC Light", "Playfair Display SC", "Century Schoolbook Bold", "Apple SD Gothic Neo UltraLight", "Napa SF", "cnefonts", "STIXIntegralsUp", "Corsiva Hebrew Bold", "Zapfino Extra LT Ligatures", "Stencil Std", "Type Embellishments One LET", "Iowan Old Style Bold", "Lucida Sans Typewriter Bold Oblique", "Myriad Pro Regular", "Bell Gothic Std Bold", "Bodoni 72 Oldstyle Bold", "IchamotiOMJ", "AV-Font-Ben1", "STIXGeneral", "Gujarati Sangam MN Bold", "Adobe Caslon Pro Semibold", "Mallige", "VNI-Bazooka", "Perpetua Bold", "Roboto Condensed Italic", "MMa Etc Bold Italic", "Avenir Black Oblique", "Muli Light Italic", "Padauk Book", "PT Mono", "Museo Sans 300", "Code39AzaleaRegular1", "STIXSizeOneSym-Bold", "MMExtra Italic", "Rundkursiv", "Times New Roman Bold Italic", "OldDreadfulNo7 BT", "Bitstream Vera Serif", "Cousine Italic for Powerline", "Freehand", "Roboto Italic", "Droid Serif", "Lato Thin Italic", "MMCenturyOld", "VAGRounded BT", "Digital Readout Upright", "Noto Sans Glagolitic", "Old Antic Outline", "Bickham Script Pro 3 Bold", "AlternateGothic2 BT", "Enliven", "Kohinoor Telugu Medium", "ESTO", "Noto Sans Lisu", "Smarty Pants BTN", "Syastro", "WP TypographicSymbols", "Kristi", "Hoefler Text Ornaments", "Courier New CYR", "Albany AMT", "Granjon Bold", "Inconsolata", "Sorts Mill Goudy", "MMa VariableC S", "cmbsy6", "Noto Sans Osmanya", "Farsi Simple Bold", "GreekS", "cmbsy7", ".VnKoalaH", "DhonooOMJ", "cmbsy8", "Euclid Math One Bold", "Swiss 721", "Ubuntu", "GreekC", "VNI-Bandit", "URW Palladio L", "YuMincho  36p Kana", "Sanpya", "MMa GreekSS", "eufm9", "Weibei TC", "Myriad Pro Black SemiExtended Italic", "Bebas Neue Book", "Menlo Bold Italic", "eufm5", "Soho Gothic Pro Thin Italic", "NBP Informa FiveThree", "Noto Serif Armenian", "DejaVu Sans Mono Bold for Powerline", "Trade Gothic LT Std Oblique", ".VnBook-Antiqua", "Humanst521 XBd BT", "Diavlo Bold", "WP CyrillicA", "WP CyrillicB", "ITF Devanagari Medium", "Franklin Gothic Medium", "FML-TTChithiraHeavy", "ML-TTDevika", "Superclarendon Light", "balonez fantasia", "Sitka Text", "Skia Black", "cmbx12", "ML-TTKamini", "Alegreya Sans SC", "Linux Libertine Display G", "Italic", "PT Sans Bold", "Opus Special Extra", "Gurmukhi Sangam MN", "FML-TTOnam", "ML-TTRevathi", "Hiragino Mincho Pro W3", "BongshaiMJ", "Adobe Hebrew", "Optima ExtraBlack", "Hiragino Mincho Pro W6", "Kundli English", "Luminari", " 20", "Courier MM Screenwriter Italic", "HelveticaNeue MediumCond", "Swiss 721 Extended", "cmmi8", "GFS Didot Classic", "Myriad Pro Light Condensed", "PoetsenOne", "Helvetica Neue Light", "monooge 05", "cmmi7", "cmmi6", "cmmi5", "Tiger Expert", "Latin Modern Mono Caps", "Learning Curve Pro", "RamuScriptMedium", "Source Sans Pro Semibold Italic", "cmmib10", "KabinLightDB Bold", "ParvathiThin", "Belwe Bd BT", "DV-TTYogesh", "Russel Write TT", "DINPro-Black", "GaneshBlack", "Carbon Block", "Romantic", "Valerie Hand", "Harrington Bold", "Bauer Bodoni Std 1 Roman", "AV-Font-Symbol", "Palatino Bold Italic", "Nanum Brush Script", "Noto Sans Egyptian Hieroglyphs", "Paralucent ExtraLight Italic", "Proxima Nova Semibold", "SF Slapstick Comic Shaded Oblique", "Prestige Elite Std Bold", "FML-TTVaisali", "ITF Devanagari Marathi Medium", "Arial Hebrew Scholar", "Lohit Gujarati", "FML-TTChandrika", "Calisto MT Bold Italic", "SignPainter-HouseScript Semibold", "Nirmala UI", "Hiragino Kaku Gothic ProN W6", "HelveticaNeueLT Pro 57 Cn", "Hiragino Kaku Gothic ProN W3", "Skia Light Condensed", "LT-ET-Ramya", "WenQuanYi Micro Hei Mono", "ML-TTAshtamudi", "Bank Gothic Light", "EngraverFontExtras", "Swiss 721 Condensed", "PT Sans Caption", "Georgia Pro Cond Black", "Noto Sans Tifinagh", "Latin Modern Roman Demi", "News Gothic MT", "Open Sans Semibold Italic", "Snell Roundhand Bold", "VNI-Stylus", "GaneshNarrow", "Gotham", "DhorolaOMJ", "Seravek Bold", "mixtapeMike", "Pacifico", "Perpetua Bold Italic", "Gayathri", "MMa Variable Bold", "croissant sandwich", "TSCu", "CSongGB18030C-Light", "Nixie One", "Myriad Pro Black Italic", "TG Termes Math", "Kaiti TC Regular", "0", "Bree Serif", "C-MediumHWL", "YuGothic Medium", "System Font Bold Italic G3", "ML-TTOnam", "Trocchi", "Noto Sans Kharoshthi", "Gill Sans Nova Cond", "Abril Fatface", "36p Kana Medium", "cmdunh10", "Merriweather Bold", "MMa Fermat Bold", "MMa CenturyK Bold", "TitilliumText22L-Thin", "TLUrdu", "MLB-TTAswathi", "Rocket Arabic Fixed", "American Typewriter Condensed Light", "John Handy LET", "Gill Sans SemiBold", "Tuyenduc", "System Font Semibold Italic", "Nexa Thin Italic", "MMExtra", "VNI-Park", "Gen W01 Light", "Futura Heavy Oblique", "SymbolProp BT", "Cantarell Regular", "FML-Leela", "Avenir Next W1G Heavy", "STIXIntegralsUpSm", "KalindiMJ", "Garamond Premr Pro", "msam9", "HelveticaNeueLT Std Blk Cn", "Lato Hairline", "KG Neatly Printed", "Proxima Nova Semibold Italic", "Gravur Condensed Light", "Webdunia", "msam7", "Times New Roman TUR", "msam5", "SHELMAN", "Banmai Times", "Bodoni 72 Oldstyle Book", "Dosis", "Museo Sans 100", "Roboto Slab Regular", "Al Nile", "Gravity", "LT-TM-Barani", "Cochin Bold Italic", "Opus", "ML-TTChithiraHeavy", "Rockwell Italic", "HanziPen TC Bold", "A Sensible Armadillo", "Hack Italic", "Terminator Two", "HelveticaNeueLT Std UltLt Cn", "Noto Sans Cuneiform", "Yu Mincho Light", "News Gothic MT Bold", "Avenir Next Regular", "Ubuntu Light", "Rouge Script", "SWLink", "ML-TTGuruvayur", "Lato Bold", "IPAexMincho", "Chalkboard Bold", "ABSALOM", "Sigmar", "Museo 500 Regular", "Stone Sans ITC TT", "Franklin Gothic Medium Cond", "Geeza Pro Bold", "Ml", "Khmer OS", "Futura Std Medium", "SC", "HelveticaNeueLT Std UltLt Ext", "Incised901 Nd BT", "ML-TTMangalaExBold", "Arial Nova Cond", "Droid Sans Fallback", "Noto Sans Carian", "CommercialScript BT", "Roboto Condensed", "Kokonor Regular", "Kievit Offc Pro", "Arial Hebrew Scholar Bold", "FML-TTGuruvayur", "Nexa Black Italic", "Garamond Premr Pro Smbd", "ML-TTSruthy", "WP MathExtendedA", "PT Sans Bold Italic", "CSongGB18030C-LightHWL", "Finale Copyist Text Ext", "Kohinoor Bangla Light", "eusm6", "Sinhala MN", "Soho Gothic Pro Regular", "Open Sans Bold Italic", "eusm5", "Herculanum", "ML1-TTAswathi", "BhagirathiOMJ", "PilGi", "Adobe Garamond Pro Bold", "Titillium", "DecoType Naskh Variants", "Wawati TC", "Kozuka Gothic Pro R", "BaluBold", "SketchFlow Print", "Opus Percussion", ".VnTeknical", "Sniglet", "Noto Sans Hanunoo", "Lingoes Unicode", "Sketch Block", "Lato Semibold", "Kozuka Gothic Pro B", "Verdana Pro", "Kozuka Gothic Pro M", "Kozuka Gothic Pro L", "Kozuka Gothic Pro H", "VNI-Swiss-Condense", "Roboto Mono for Powerline", "SF Slapstick Comic Shaded", "Mukti Narrow", "Baskerville Bold Italic", ".VnArial NarrowH", "Opus Metronome", "Xingkai SC Light", "Gotham Bold", "Tiger", "VNI-Awchon", "Accent SF", "Baron Neue Italic", "Boogaloo", "Finale AlphaNotes", "Optima Regular", "Apple Braille Pinpoint 8 Dot", "IPAPMincho", "Blackout", "Noto Sans Old Turkic", "Calibri Italic", "SWRomnt", "MaestroTimes", "Open Sans Light", "SWRomns", "Tsukushi B Round Gothic Bold", "NanumMyeongjo Bold", "VNI-DesdemonaU", "Avenir Next Demi Bold Italic", "MMSchoolRD Bold", "SWRomnc", "Baoli SC", "Leitura Display Roman", "Savoye LET Plain:1.0", "DIN-RegularAlternate", "HeadLineA Regular", "Charter", "KacstPen", "header 17", "Hiragino Kaku Gothic Pro W3", "Hiragino Maru Gothic ProN", "Adobe Naskh", "RUMA", "Liberation Sans Narrow", "Corbel Bold", "Noto Sans Tai Le", "Valluvan", "Soho Gothic Pro Thin", "Modena printed", "News Gothic MT Alt 5", "Avenir Next Condensed Bold Italic", "VNI-Centur", "Avenir Next Condensed Medium", "STIXSizeFourSym-Bold", "TAMElango", "cmsltt10", "Letter Gothic Std Slanted", "Noto Sans Coptic", "Firenze SF", "Six Caps", "Fira Mono", "Kohinoor Devanagari Semibold", "Rockwell Nova", "Biko", "Gurmukhi MN Bold", "IguanaLover BTN", "Induction", "FML-TTNarmadaExBold", "Walter", "CAC Champagne", "Ubuntu Mono derivative Powerline Italic", ".VnVogueH", "Myriad Pro Black", "cnefont", "Helvetica Neue Italic", "HERMAN", "1", "standard 07", "Myanmar Text", "Deepa", "Shree Devanagari 714", "Balthazar", "Klee Demibold", "standard 09", "Geeza Pro Regular", "Cinema Gothic BTN Shadow", "PT Simple Bold Ruled", "IRIS", "Myriad Web Pro Condensed", "VNI-Bauhaus", "LuzSans-Light", "Futura Medium Oblique", "Kailasa Bold", "Smudger Alts LET", "VNI-Standout", "Noto Sans Thai UI", "eurm10", "MMa Etc S", "Corporate", "Detente", "Adobe Devanagari Bold Italic", "Sinhala MN Bold", "Linux Biolinum O", "HelveticaNeueLT Pro 27 UltLtCn", "Linux Biolinum G", "Airstream", "AR DECODE", "Alien Encounters", "VNI-Wide Latin", "Tlwg Mono", "eurm8", "fox in the snow", "eurm6", "eurm7", "Euclid", "eurm5", "Noto Sans CJK SC", "Perpetua Titling MT Light", "Swis721 Ex BT", "Roboto Mono Thin Italic for Powerline", "Garamond Premier Pro", "gargi", "Futura Light Condensed BT", "Museo 700 Regular", "Placard MT Condensed", "Euro Sign", "Persia BT", "Circular Std Medium", "Nexa Book Italic", "TakaoPGothic", "Dutch 801 Roman", "Waverly", "ML-TTPeriyar", "Trade Gothic LT Std Light Oblique", "PT Bold Dusky", "Tw Cen MT Bold Italic", "GentiumAlt", "Damascus Regular", "Hiragino Mincho ProN W6", "Devanagari Sangam MN", "Hiragino Mincho ProN W3", "Z@R1774.tmp", "Avenir Next Condensed Medium Italic", "Opus Japanese Chords", "Noto Sans Thai", "Adobe Caslon Pro", "Kannada MN", ".VnVogue", "Nobile", "New Peninim MT Bold", "Meiryo Italic", "Roboto Mono Italic for Powerline", "GFS Complutum", "Verdana Pro Cond SemiBold", "Augusta", "Old Antic Outline Shaded", "Malayalam Sangam MN Bold", "DS Crystal", "Purisa", "Adobe Hebrew Bold Italic", "Iowan Old Style Black", "Razer Header Regular", "Monospac821 BT", "Kohinoor Devanagari", "Diwan Kufi Regular", "Droid Sans Japanese", "Lucida Fax Demibold Italic", "Minion Pro Bold Italic", "Marion Italic", "Raleway ExtraLight", "ArhialkhanMJ", "VNI-Souvir", "Kaiti TC", "Umpush", "Candy Round BTN Cond Lt", "ML-TTThunchan", "BorhalMJ", "PingFang TC Regular", "Futura Medium", "System Font Semibold", "Roboto Slab Bold", "Fanwood", "Muli Light", "Raisin des Sables", "DFMaruGothic-Md", "Al Bayan Bold", "Noto Sans Mongolian", "Apple Symbols", "Muli Italic", "Z@R1828.tmp", "Source Sans Pro Bold", "NanumGothic", "MMRelation Italic", "Noto Sans New Tai Lue", "RaghuMalayalam", "LetterOMatic!", "Seravek Light", "Baskerville Bold", "MMGreek Bold Italic", "QumpellkaNo12", "GFS Olga", "Times Italic", "Futura Book BT", "Glockenspiel", "KanchanMJ", "EngraverFontSet", "MMa Binary", "BN Jinx", "Nova Flat", "Yeseva One", "Bauer Bodoni Std 1 Bold Italic", "Kohinoor Telugu Semibold", "TeX Gyre Heros", "Georgia Pro Cond SemiBold", "MMa Variable2 S", "Inconsolata-g for Powerline", "Simple Bold Jut Out", "JLS Space GothicR NC", "Circular Std Medium Italic", "ML-TTAparna", "Damascus Semi Bold", "Opus Roman Chords", "MS Dialog Light", "MMa Negate", "Chaparral Pro Light", "Opus Note Names", "Symbol Tiger Expert", "SWComp", "Cooper Std Black", "JazzText", "Langdon", "FML-Mohini", "Proxima Nova Regular Italic", "Raleway ExtraBold Italic", "cmtt12", "DejaVu Sans Mono Oblique for Powerline", "HUNTSON", "Cantho", "SWMusic", "GENISO", "STHupo", "Pricedown", "Geotype TT", "schoenecker 10", "Photoshop Large", "JACKIE", "Averia", "Granjon Roman", "Code39AzaleaNarrow1", "Andong", "Code39AzaleaNarrow3", "Code39AzaleaNarrow2", "Nexa Black", "FML-TTPeriyar", "Pirate", "Formata Medium Condensed", "Minerva", "Futura LT Book", "Kozuka Mincho Pro", "LittleLordFontleroy", "Adobe Song Std L", "SWIsop2", "SWIsop3", "STIXIntegralsSm", "SWIsop1", "Pothana2000", "TAU-Valluvar", "FML-TTLeela", "BOUTON International Symbols", "FontAwesome", "Menlo Italic", "MMa TextBook", "Gothic720 BT", "SF Slapstick Comic Bold", "QuickType II Condensed", "Bodoni 72 Oldstyle Book Italic", ".Vn3DH", "HelveticaNeueLT Std Bold Outln", "Lohit Punjabi", "Kaiti SC Black", "HKSCS-ExtB", "Modern No", "Blackmoor LET Plain:2.0", "MMa Century Bold Italic", "Code39AzaleaWide3", "Code39AzaleaWide2", "Code39AzaleaWide1", "19", "Phatdiem", "ML-TTAyilyamBold", "Avinor", "Adobe Devanagari", "Al Tarikh Regular", "Zolano Sans BTN", "Drivebye 2", "Drivebye 3", "Ultra", "Drivebye 1", "Drivebye 4", "Sneakerhead BTN Shadow", "Songti SC Black", "Radha", "MMa Relation S", "Ventilla Script", "eufm8", "Stone Sans OS ITC TT Bold", "GFS Solomos", ".VnCentury Schoolbook", "Nexa Thin", "Bordeaux Roman Bold LET Plain:1.0", "Euclid Math Two", "EngraverTextNCS", "Meiryo Bold Italic", "Cooper Std Black Italic", "DynameBlackSSK", "GaneshThin", "LTHYSZK", "Noto Sans Hebrew", "AnjaliOldLipi", "Meslo LG M Regular for Powerline", "Silent Reaction", "VNI-Free", "Montserrat Extra Bold", "Avenir Next", "Apple Braille Pinpoint 6 Dot", "CommercialPi BT", "CopprplGoth BT", "GJ-TTAvantika", "monofur bold for Powerline", "Arial (Arabic)", "Courier Std", "FML-TTSwathyBold", "Avenir Oblique", "eufm6", "SuperFrench", "Montserrat", "Gillius ADF No2 Cd", "Lantinghei SC Demibold", "Gill Sans Nova Light", "HGHeiseiMinchotaiW3", "Lato Black", "Rod Transparent", "Malayalam MN Bold", "Euclid Fraktur Bold", "VNI-Boston Black", "ML-TTLeela", "INSPECTIONXPERT GDT FRAMES", "Bebas Neue Thin", "mry", "eufm7", "SWMap", "Proxima Nova Condensed Light", "cmbxti10", "Nexa Regular", "Lucida Bright Demibold Italic", "Optima LT Std", "Georgia Pro Black", "Titillium Semibold Italic", "ParkAvenue BT", "Franklin Gothic Medium Italic", "PujeetaNarrow", "Daclac", "Xpress Heavy SF", "Tibetan Machine Uni", "DecoType Naskh Swashes", "MMa TextBook Bold Italic", "Titillium Thin Upright", "Roland", ".VnCooper", "Stephen", "Kino MT", "HelvLight", "Eurostile", "Helvetica Neue Thin", "Orator Std Slanted", "cmvtt10", "MMCenturyNew Italic", "DIN-Regular", "Futura Book Oblique", "Hack Regular", "Nanum Gothic", "SaiMeera", "Apple SD Gothic Neo Thin", "Source Code Pro ExtraLight", "Myriad Pro Light SemiCond", "Bank Gothic Medium", "Swis721 Blk BT", "ChitraMJ", "MS Dialog", "Kokonor", "ChitraSMJ", "monofur for Powerline", "Samathwa", "Adobe Myungjo Std M", "ML-TTVarsha", "MMTextBookB Italic", "AV-Font-Mal1", "VN-NTime", "MMa Extra Bold Italic", "Paralucent Extra Light", "Grand Hotel", "MMRelation Bold", "NanumMyeongjo", "cmssdc10", "Z@R183A.tmp", "MMa Negate Italic", "VNI-Harrington", "Kruti Astro", "DYMObvba", "System Font Heavy", "cmtt9", "Avenir Next W1G Demi Italic", ".VnBook-AntiquaH", "La Bamba LET", "MMa Fraktur", "Parisian BT", "University Roman Alts LET", "Lobster", "Ideal Sans Book", "Lucida Grande Bold", "MMa VariableC Bold", "MMa Binary Bold", "Adobe Naskh Medium", "Vemana2000", "Opus Special", ".VnSouthern", "Swis721 BT", "ITF Devanagari Marathi", "PT Sans Narrow", "FML-TTRohini", ".VnMemorandum", "Siyam Rupali ANSI", "Segoe UI Semilight", "Rock Salt", "Santa Fe LET Plain:1.0", "ParvathiBold", "Superclarendon", "STIXIntegralsUpD-Regular", "Salilam", "Canter Bold", "FML-TTBeckalBold", "STIXIntegralsUp-Regular", "MMCenturyNew", "Georgia Pro Cond Light", "Arial Italic", "Nueva Std Bold Condensed", "Latin Modern Math", "FreeSans", "SAS Monospace Bold", "Tarzan", "STIX", "VnTimes", "Typewriter", "Arial TUR", "Urvasi", "Meslo LG L Regular for Powerline", "Sans", "cmr5", "ML-TTSuparna", "HelveticaNeueLT Pro 35 Th", "Lato Medium", "Futura Std Bold Condensed", "Trade Gothic LT Std Bold Oblique", "Thorndale AMT", "Sitka Display", "Complex", "Bobcat", "Kaiti TC Bold", "Hansen", "Rosewood Std", "VNI-DOS Sample Font", "Noto Sans Tagbanwa", "Razer Header Light", "Maestro Percussion", "Western Bang Bang", "Shorelines Script Bold", "Myriad Pro Bold Condensed Italic", "Kohinoor Telugu Bold", "SF Movie Poster", "Brandon Grotesque Bold", "lettau 06", "Z@R123A.tmp", "Linux Libertine Mono O", "Giadinh", "Yuanti SC Bold", "Rakesly Rg", "Accanthis ADF Std No3", "HooglyMJ", "Nunito", "HelveticaNeueLT Std Med", "Helvetica Neue Condensed Bold", "MMCenturyNew Bold", "WP Arabic Sihafa", "Archicoco", "Realvirtue", "MMa VariableA Bold", "MMVariableA", "Nimbus Roman No9 L", "MMVariableC", "MMVariableB", "64", "MMVariableD", "66", "MMVariableF", "68", "FML-TTAparna", "ML-TTGauriHeavy", "Chess Maya", "Special Elite", "Courier New TUR", "Kozuka Mincho Pro L", "Minion Pro Bold Cond Italic", "VISCII Sample Font", "Montserrat Semi Bold", "BriLliant", "LIVINGWELL", "MMa Variable S", "VNI-Jamai", "FML-TTSabari", "Binhlong", "AtraiMJ", "TeamViewer10", "TeamViewer11", "Broadway Copyist Text", "GoraiMJ", "HGSHeiseiMinchotaiW9", "Seravek Medium Italic", "Belwe Cn BT", "Vanilla", "WP Greek Helve", "Trocchi Bold", "Khmer MN", "Roboto Condensed Regular", "TitilliumText22L-Light", "Nexa Bold Italic", "cmss9", "cmss8", "IMG Symbols", "ML-TTBhavana", "Aldhabi", "Weibei SC Bold", "MMVariable2", "AL Cinderella", "Consolas Bold Italic", "Monoton", "Z@R16FD.tmp", "Gill Sans Bold Italic", "Khanhoa", "MMVariableD Bold", "Charter Bold Italic", "AnandapatraCMJ", "UniversalMath1 BT", "Janaranjani", "TeamViewer9", "Days Regular", "Times New Roman CE", "Futura Bold Oblique", "VNI-Korin", "msbm5", "HelveticaNeueLT Pro 23 UltLtEx", "Spirituality", "Sitka Heading", "KasseFLF", "TeX Gyre Heros Cn", "Bebas Neue Bold", "Henny Penny", "JugantorMJ", "Trebuchet MS Bold", "Raleway Thin Italic", "Lucida Bright Demibold", "Prestige Elite Std", "HGMinchoL", "SonicCutThru Hv BT", "BuiltTitlingRg-BoldItalic", "Bickham Script Pro 3", ".VnBodoni", "Jazz", "MYingHei", "Muna", "Lato", "Minisystem", "BurigangaMJ", "Hoefler Text Black Italic", "Andale Sans for VST", "Diavlo Book", ".VnArabia", "Big Caslon Medium", "Titillium Semibold", "Mishafi Gold Regular", "Qaskin Black Personal Use", "cmssbx10", "Oxygen", "msbm7", "cmmi9", "Aileron Light", "KacstOffice", "Libian SC Regular", "IMG Baby", "Humanist", "Montserrat Hairline", "euex9", "euex7", "Courier 10 Pitch", "ML-TTMadhaviExBold", "AR DESTINE", "Shree-Mal-0502", "FML-TTAathira", "cmbxsl10", "FML-Indulekha", "PingFang SC Ultralight", "FML-Sruthy", "FML-TTGauriHeavy", "Adobe Fan Heiti Std B", "Avenir Heavy", "cmex8", "Hiragino Sans GB W6", "STIXIntegralsUpD", "line10", "Futura LT Condensed Bold Oblique", "Admisi Display SSi", "cmex7", "Casual", "CASMIRA", ".VnLucida sans", "STIXGeneral-Regular", "Nueva Std Bold Condensed Italic", "HGPHeiseiMinchotaiW9", "Klee Medium", "Accord Heavy SF", "MMCenturyOld Italic", "STIXNonUnicode-Italic", "Fira Mono Bold for Powerline", "Hadong", "ML-TTAathira", "3ds Light", "AR DARLING", "Bifurk", "NanumGothic ExtraBold", "Baghdad Regular", "FML-TTThunchan", "Vodafone Rg", "GFS Neohellenic", "Quicksand", "Times New Roman Bold", "PingFang TC Medium", "Technic", "Adobe Kaiti Std R", "HGPHeiseiMinchotaiW3", "Gen W01", "HelveticaNeueLT Std Lt Ext", ".VnPark", "Avenir Next W1G Bold Italic", "Roboto Black", "New Renex Special Graphics", "Brush Script Std", "Segoe UI Historic", "DejaVu Sans", "ML-TTKala", "Kohinoor Devanagari Demi", "VNI-Hobo", "GangaMJ", "FML-TTRevathi", "Sauce Code Powerline Semibold", "Open Sans Bold", "WP MultinationalA Courier", "MMa CenturySS Bold Italic", "Kohinoor Telugu", "VNI-StageCoach", "HanziPen TC Regular", "Reginet", "Helvetica Neue Medium Italic", "Helvetica Neue Condensed Black", "ML-TTAnakha", "Yuanti TC Light", "65", "Avenir Next Bold Italic", "GF Zemen Unicode", "Ice kingdom", "Gotham Narrow Book", "Army", "Latin Modern Sans Quotation", "Moonbeam", "67", "Microsoft YaHei UI Light", "Bell MT Italic", "Myriad Arabic Bold", "Lohit Bengali", "Lato Hairline Italic", "AppleGothic", "Titan One", "Lantinghei SC", "Myriad Pro Black Condensed", "Orator Std Medium", "Kozuka Gothic Pro EL", "Hollywood Hills", "Tekton Pro Cond", "Franklin Gothic Book Italic", "ANDROID ROBOT", "Diwan Kufi", "Dutch801 Rm BT", "future", "Divya", "Tlwg Typo", "Xingkai SC", "Open Sans", "SutonnyMJ", "Source Code Pro Semibold", "Neo Sans Pro Light", "FML-TTMalavika", "Proxima Nova Condensed", "Myriad Pro Black SemiExtended", "cmtt8", "Paralucent Demi Bold", "3M Circular TT Light", "VNI-Tubes", "HelveticaNeueLT Pro 37 ThCn", "Farah Regular", "VNI-Duff", "cmmib6", "ML-TTChandrika", "Amatic", "Khalid Art bold", "cmmib8", "cmmib9", "Ela Sans Light Caps", "SF Compact Rounded Ultralight", "Malgun Gothic Semilight", "Latienne Pro Italic", "Cortoba", "Paralucent Heavy", "VNI-Lithos", "Shree-Tel-0900", "MMGreek Italic", "FML-TTJyothy", "HelveticaNeueLT Pro 43 LtEx", "Leitura Display Italic", "Ostrich Sans", ".VnBahamasB", "Gill Sans UltraBold", "FML-Padmanabha", "Myriad Pro Light", "PT Serif Italic", "MMBinary Bold", "Autumn", "STIXVariants-Regular", "Archive", "Math3", "Math2", "Math1", "FML-TTSarada", "Euclid Math One", "Futura LT Condensed Medium Oblique", "Math4", "Franklin Gothic Book", "AR CARTER", "Xpress SF", "System Font Light", "Literation Mono Powerline Bold Italic", "Lato Semibold Italic", "SymbolMono BT", "HGPHeiseiKakugothictaiW5", "HGPHeiseiKakugothictaiW3", "Waree", "PingFang TC Thin", "Myriad Pro Black Cond", "Adobe Heiti Std R", "Learning Curve Dashed Pro", "Smokum", "Noto Sans Yi", "HelveticaNeueLT Std Thin Cn", "Mesquite Std Medium", "Blackoak Std", "kroeger 07", "ML-TTNanditha", "cmssi12", "Avenir Medium", "Droid Sans", "Finale Copyist Text", "Merriweather UltraBold Italic", "Kohinoor Devanagari Book", "Reklame Script Black", "System Font Regular G1", "Sabrina", "System Font Regular G3", "System Font Regular G2", "Arial Symbol", "Lantinghei TC Extralight", "cmbsy9", "Kozuka Gothic Pr6N", "Georgia Pro Light", "PT Bold Arch", "Phosphate", ".VnTifani Heavy", "MMa CenturyKS", "Logo3Mtt", "STHeiti", "MMNegate", "AV-Web-Tel1", "Opus Text", "PingFang HK Thin", "Playfair Display SC Bold", "Standard Symbols L", "BhagirathiMJ", "Bowlby One SC", "mono 08", "cmti7", "DigifaceWide", "PujeetaSpecial", "Avenir Next W1G Medium Italic", "Iowan Old Style Bold Italic", "Italic Outline Art", "cmu10", "MMa Negate SS", "Serifa Bold", "mono 07", "Dyuthi", "Sauce Code Powerline ExtraLight", "ae", "kroeger 04", "MMRelation", "Arno Pro Smbd Display", "MMRelation Bold Italic", "Microsoft YaHei UI", "Lucida Sans Regular", "FML-TTThiruvathira", "FREH", "Nova Round", "18030", "SWGreks", "PingFang SC Semibold", "Adobe Heiti Std", "IDAutomationPDF417n4", "cmssq8", "Zapfino Extra LT Four", "Verdana Pro Light", "Euclid Fraktur", "FlemishScript BT", "AV-Font-Sin1", "Monospace", "Gotham Black Italic", "Madre Script", "Droid Sans Mono", "TMBW-TTValluvar", "cafeta", "AR JULIAN", "cmtex10", "Oriya MN Bold", "Buxton Sketch", "HelveticaNeueLT Pro 45 Lt", "Minion Pro Bold Cond", "LiHei Pro", "Raleway Light", ".VnKoala", "System Font Light Italic", "Kiran", "Nueva Std Condensed Italic", "Proxima Nova Soft Semibold", "Circular Std Book", "Beirut Regular", "HelveticaNeueLT Pro 55 Roman", "AR DELANEY", "Candles", "Lucida Sans Demibold Italic", "Myriad Pro Bold Italic", "Seravek Italic", "Old English", "Uttara", "Formal436 BT", "Latin Modern Roman Slanted", "AcadEref", "Soho Gothic Pro Light", "Corbel Italic", "Z@R277C.tmp", "Microsoft JhengHei UI", "Lato Heavy Italic", "Trade Gothic LT Std Light", "Westwood LET", "Old Antic Bold", "Futura Std Heavy", "Euclid Symbol Italic", "Noteworthy Bold", "MMa CenturyKSS Bold", "Year supply of fairy cakes", "SutonnyOMJ", "Open Sans Extrabold Italic", "Tekton Pro Bold Condensed", "Chancery Cursive", "Quincho Script PERSONAL USE", "Modern Antiqua", "System Font Thin", "Merriweather Bold Italic", "Chaparral Pro Light Italic", "MMa CenturyKS Bold", "BolsterBold", "AVGmdBU", "Cir Arial", "Lithos Pro Black", "Papyrus Condensed", "Seravek Medium", "Noto Sans CJK TC", "MMa Greek Bold Italic", "HeadLineA", "MMVariableA Bold", "Times New Roman Italic", "Garuda", "Permanent Marker", "Yu Gothic UI Semilight", "Myriad Pro Black SemiCondensed", "Apple SD GothicNeo ExtraBold", "Norasi", "Arial Nova Light", "PondFreeBoss", "Avenir Light Oblique", "Alice and the Wicked Monster", "Arno Pro SmText", "GungSeo", "ori1Uni", "HelveticaNeueLT Std Blk", "DIN-LightAlternate", "MMa CenturyKSS", "MMa Relation SS", "VNI-Zap", "BN Machine", "Segoe MDL2 Assets", "Rotis Sans Serif Std 45 Light", ".VnGothicH", "Proxima Nova Bold Italic", "SAF", "Futura Light Italic BT", ".VnCourier", "Khmer Sangam MN", "BorakOMJ", "Roboto Mono Light Italic for Powerline", "ML-TTTheyyam", "Avenir Next Condensed Heavy Italic", "Caladea", "Noto Serif Georgian", "Charlemagne Std Bold", "HGHeiseiKakugothictaiW5", "HGHeiseiKakugothictaiW3", "BerlingRoman", "Source Sans Pro Light Italic", "Helvetica Neue UltraLight", "stmary10", "Sketch Match", "Songti TC", "Square721 BT", "MMa VariableA SS", "AV-Font-Guj1", "Georgia Pro", "DhorolaMJ", "Yuanti SC Regular", "Roboto Mono Light for Powerline", "Poplar Std Black", "Futura Light Oblique", "Hypatia Sans Pro ExtraLight", "ISOCPEUR", "Alternate Gothic No2 D", "Gillius ADF", "copy 10", "Noto Sans Ugaritic", "Yuanti TC", "Charlemagne Std", "Reswysokr", "ML-TTNila", "Pamela want a Bike to Ride", "Museo 100 Regular", "Montserrat Ultra Light", "System Font Bold G3", "System Font Bold G2", "System Font Bold G1", "ChandrabatiMatraMJ", "Noto Sans Tamil", "NeueHaasGroteskText Pro", "Savoye LET Plain CC.:1.0", "classic 10", "Droid Sans Georgian", "Merriweather Regular", "MMa Etc SS", "Devanagari Sangam MN Bold", "STIXSizeFiveSym", "Proxy 2", "MMEtc", "SOLIDWORKS GDT", "Superclarendon Italic", "TextilePiEF", "MMa Variable2", "Songti TC Bold", "STIXIntegralsD", "Monotype Koufi", "DIN Condensed", "Noto Sans Tamil UI", "Arial Baltic", "Terminal Greek 869", "Chess Berlin", "System Font UltraLight", "Microsoft YaHei Light", "AR Sans Serif", "FML-TTNalini", "Noto Sans NKo", "Joan", "Adobe Fan Heiti Std", "RomanC", "MMa Arrow Bold", "Verdana Pro Cond Light", "Kannada Sangam MN Bold", "Museo Sans 500", "Bitstream Vera Sans", "STIXSizeFiveSym-Regular", "DhakarchithiMJ", "Latin Modern Sans Demi Cond", "Czec", "GothicE", "IMG Extreme", "WST", "RomanT", "Adobe Arabic Bold Italic", "DINPro-Bold", "Century Schoolbook Bold Italic", ".VnBlack", "VNI-Fillmore", "Noto Sans Old Persian", "Dutch801 XBd BT", ".VnArial Narrow", "Sathu", "Avenir Next Medium Italic", "Lato Heavy", "MMVariableC Bold", "Simple Indust Shaded", "RowdyHeavy", "Flamenco", "PanRoman", "Gotham Narrow Extra Light Italic", "OLF SimpleSansOC", "Folio XBd BT", "Roman Mono", "System Font Bold Italic G1", "Sinhala Sangam MN Bold", "Cataneo BT", "System Font Bold Italic G2", "Soho Gothic Pro ExtraBold It", "Oriya Sangam MN Bold", "JUSTICE", "MMa Greek Italic", "Gotham Medium", "Arno Pro Light Display", "Ezra SIL SR", "SD-TTSurekh", "GrilledCheese BTN", "Kannada MN Bold", "Heiti SC Medium", "Avenir Next W1G Heavy Italic", "PT Serif Caption", "Hiragino Maru Gothic Pro", "Monotype Sorts 2", "Myriad Pro Black SemiCond", "Tsukushi A Round Gothic", "Futura LT Extra Bold", "Titillium Regular Italic", "KacstDecorative", "Lucida Sans Typewriter Oblique", "Impregnable Personal Use Only", "MMNegate Italic", "Whimsy TT", "Chess Marroquin", "NBP Informa FiveSix", "Lucida Sans Demibold Roman", "msbm10", "Gill Sans Nova Ultra Bold", "copy 09", "Blackmoor LET", "IPAMincho", "MMa VariableB Bold", "Superclarendon Bold", "Titillium Black", "Avenir", "Lucida Sans Typewriter Bold", "Steppes TT", "VNI Cambodia", "Kefa Bold", "Helvetica Light Oblique", "Avenir Next W1G Ultra Light Italic", "JazzCord", "Symbol Neu for Powerline", "Emily Austin", "Avenir Light", "Tiranti Solid LET", "Myriad Hebrew Italic", "cmitt10", "DhanshirhiOMJ", "KacstDigital", "kawoszeh", "Cut Me Out 2", "Cut Me Out 3", "Myriad Pro Bold Condensed", "boot", "Fredericka the Great", "Symusic", "balonez fantasia br", "Devanagari MT", "Noto Sans UI", "Myriad Pro Semibold Italic", "Noto Sans Vai", "Razer Header Regular Oblique", "Dot", "Swed", "ScriptKleio", "Gillius ADF No2", "Myriad Pro Bold SemiExtended", "Prema", "ConcursoItalian BTN", "Pricedown Bl", "Lantinghei SC Extralight", "GillSans-Bold", "Urdu Naskh Asiatype", "Glegoo", "Kohinoor Devanagari Bold", "Vollkorn Regular", "Apple Casual", "Freehand575 BT", "PingFang SC Regular", "Medlin", "MMa Relation Bold", "FML-TTAnjali", "RADAGUND", "Noto Sans Mandaic", "Marion Regular", "cminch", "Seagull APL", "Nueva Std", "Pamela wants to Ride", "Monotxt", "cmtt10", "TRENDY", "Alex Brush", "Playfair Display SC Italic", "STIXIntegralsUpD-Bold", "DecoType Naskh", "Muli", "Marker Felt Wide", "Klee", "PUPPYLIKE", "Accanthis ADF Std No2", "Cooper Std", "Meslo LG L DZ Regular for Powerline", "Droid Arabic Naskh", "ITF Devanagari Demi", "Verdana Pro SemiBold", "Kalyani", "Latino Elongated LET Plain:1.0", "Brussels", "Nasalization", "Thonburi Bold", "Kohinoor Devanagari Medium", "Loma", "Noto Sans Rejang", "Typewriter Bold", "Zapfino Extra LT One", "Futura Heavy", "Origin", "Euclid Symbol Bold Italic", "Gotham Narrow Bold Italic", "smart watch", "PFDaVinciScriptPro-Inked", "Odessa LET", "KG Fall For You", "FMLTTAathira", "MMNegate Bold", "Gotham Thin", "Cousine Bold for Powerline", "Courier New Bold", "Cracked", "Arial Bold", "GoomtiMJ", "PingFang SC", "Minion Pro Semibold Italic", "VNI-WIN Sample Font", "LA Headlights BTN", "Moon Flower", "VNI-Couri", "Segoe WP Light", "lcmssi8", "Carlito", "Proxima Nova Light", "Oswald", "Abel", "Doulos SIL", "Sanskrit", "BRADDON", "MMa Binary Bold Italic", ".VnStamp", "Raleway ExtraBold", "VNI-Vari", "DhakarchithiOMJ", "Arno Pro Subhead", "monoeger 05", "Lithos Pro", "Noto Sans CJK KR", "FML-TTVeenaHeavy", "JaJaDiMJ", "Supernatural Knight", "Garamond Premier Pro Semibold", "MMa Relation Italic", "IDAutomationPDF417n3", "Source Sans Pro ExtraLight Italic", "STZhongsong", "JuneBug", "Candy Round BTN Lt", "Georgia Bold Italic", "BauerBodni BT", "ML-TTRavivarma", "Yu Gothic Light", "monofur italic for Powerline", "Webdings", "Courier MM Screenwriter BoldIt", "STXinwei", "PenultimateLightItal", "3 of 9 Barcode", "Rockwell Nova Cond Light", "Laila Medium", "FML-TTSurya", "Shree Devanagari 714 Bold", "Metamorphous", "Mekanik LET", "Serif", "Verdana Pro Black", "ML1-TTAmbili", "Lucida Handwriting Italic", "Apple Braille Outline 8 Dot", "Courier New Baltic", "Euclid Italic", "Opus Figured Bass Extras", "Latin Modern Roman Unslanted", "VNI-Allegie", "Comic Sans MS Bold", "Nina", "ML-TTMalavika", "18thCentury", "PhrasticMedium", "Amatic SC", "Canter Bold 3D", "Swis721 BlkCn BT", "KalegongaOMJ", "Nirmala UI Semilight", "Lato Light", "ISABELLE", "Linux Libertine G", "copy 08", "Kedage", "Raleway Light Italic", ".VnLinus", "Roboto Medium", "Lithos Pro Regular", "STIXNonUnicode-Regular", "eufb9", "eufb8", "MARKETPRO", "Skia Black Condensed", "eufb7", "eufb6", "eufb5", "VnTimes2", "SWMath", "Bamini", "Anonymice Powerline Bold", "Sukhumvit Set Thin", "STFangsong", "ML-TTAtchu", "Cochin Italic", "hooge 06", "hooge 04", "hooge 05", "Tw Cen MT Italic", "MMTimes Bold", "IPAGothic", "PingFang TC Ultralight", "Copperplate Light", "Consolas Italic", "Kohinoor Telugu Light", "TAU-Barathi", "STIXIntegralsUpSm-Regular", "FML-TTKeerthi", "eurb6", "KalindiOMJ", "Blade Runner Movie Font", "Source Sans Pro Bold Italic", "TAC-Barathi", "Adobe Ming Std L", "PingFang SC Light", "MMa Gauss", "kor", "MMa Variable2 Bold", "Yu Gothic Medium", "Damascus Medium", "Sugarskin BTN", "QTOptimum Regular", "Tekton Pro Bold Oblique", "Adobe Fangsong Std R", "italic 08", "Sana Regular", "MMa Century Bold", "DIN Condensed Bold", "(AH) Manal Black", "Wolf in the City Light", "Scriptina", "Skinny", "FML-TTNanditha", "eusb9", "Kalpurush ANSI", "Canter Bold Strips", "AdineKirnberg-Script", "Minion Pro Semibold", "Copperplate Bold", "Trebuchet MS Italic", "Myriad Hebrew Bold Italic", "Hand Me Down S (BRK)", ".VnMonotype corsivaH", "VNI-Slogan", "STIXSizeTwoSym", "Thonburi Light", "Consolas Bold", "Orange LET", "Candara Bold Italic", "Gotham Light Italic", "Trade Gothic LT Std Extended", "Starliner BTN", "NixieOneRegular", ".VnAristoteH", "chs", "ML-TTSarada", "Map Symbols", "DejaVu Sans Mono", "Telugu Sangam MN Bold", "Courier New Bold Italic", "Gotham Narrow Ultra", "Victorian LET", "Architects Daughter", "MS Reference 1", "ML-TTNalini", "MS Reference 2", "Dynalight", "Optima Bold Italic", "Hiragino Sans GB W3", "63", "Skia Black Extended", "Helvetica Neue UltraLight Italic", "Dominican", "Futura LT Bold Oblique", "Franklin Gothic Heavy", "Baskerville Italic", "Open Sans Condensed", "TAU-Kaveri", "MMa Variable SS", "Helvetica Neue Thin Italic", "Arno Pro Display", "MMa Negate Bold Italic", "Xingkai SC Bold", "Montserrat Light", "cmti9", "TAC-Kabilar", "cmssi9", "Roboto Condensed Light", "cmssi8", "STIXVariants-Bold", "SWGDT", "SAS Monospace", "Martina", "Myriad Pro Light SemiCondensed Italic", "MMTimes", "VNI-Dur", "TitilliumText22L-XBold", "FML-TTVinay", "Titillium Light Upright", "Savoye LET Plain CC", "Bangkok Cirilica", "Iowan Old Style", "MMArrow Bold", "Cairo SF", "Arno Pro Smbd Subhead", "Formata Light Condensed", "PingFang HK Medium", "Cousine for Powerline", "Arial Nova", "Stez Sans", "FML-LeelaHeavy", "Century Gothic Bold Italic", "Mytho", "STIXIntegralsD-Bold", "cmsl9", "Al Nile Bold", "SWIsot3", "Great Vibes", "System Font Italic G2", "System Font Italic G3", "System Font Italic G1", "BlackJackRegular", "Quicksand Light", "Hypatia Sans Pro", "Noto Sans Mono CJK SC", "Nueva Std Condensed", "SemiBold", "Avenir Next Condensed Ultra Light", "Athelas Bold Italic", "MMa TextBook Italic", "ML-TTKarthika", "Swis721 Hv BT", "AS-TTDurga", "Clear Sans", "Led Italic Font", "Seravek", "Dirty Headline", "Lucida Fax Italic", "Apple SD Gothic Neo Heavy", "Roboto Mono Medium Italic for Powerline", "Droid Sans Armenian", "Hiragino Maru Gothic Pro W4", "AlekyaBold", "STIXGeneral-Bold", "Tekton Pro", "QuickType II", "Fixed Miriam Transparent", "Latienne Pro Bold Italic", "cmbsy10", "ABIGAIL", "Latin Modern Mono Light", "Bodoni 72 Book", "Cinzel", "Kozuka Gothic Pr6N M", "Kozuka Gothic Pr6N L", "msam8", "PAINTSTROKE", "ML-TTRohini", "Kozuka Gothic Pr6N H", "Fingerpop", "TRIAL", "SWGothg", "SWGothe", "SWGothi", "BacktalkSerif BTN", "MLU-Panini", "Zapfino Extra LT Two", "News Gothic MT Alt 4", "Miriam Transparent", "MS SystemEx", "Proxima Nova Condensed Semibold", "YuMincho  36p Kana Medium", "SF Slapstick Comic", ".VnExoticH", "Baron Neue Bold Italic", "Swis721 LtEx BT", "PilGi Regular", "PT Bold Stars", "Chalkboard SE Light", "ThoolikaUnicode", "Muna Regular", "Nueva Std Bold", "Roboto Slab Light", "Khmer OS System", "NanumMyeongjo ExtraBold", "Noto Sans Devanagari UI", "IM FELL DW Pica", "Castro Script PERSONAL USE ONLY", "JF Armenian Serif", "MMCenturyNewRD Italic", "AppleMyungjo Regular", "PingFang SC Medium", "Futura LT Condensed Extra Bold", "Noto Sans Old Italic", "Bradley Hand Bold", "Al Bayan Plain", "STIXSizeOneSym-Regular", "MMa CenturySS Italic", "News Gothic MT Italic", "Gotham Extra Light Italic", "Wawati SC", "KB Vibrocentric", "Anonymice Powerline", "Harry P", "Sana", "Heiti TC Medium", "News Gothic MT Alt 1", "DYMO Symbols", "Futura LT Heavy", "cmss17", "ML-TTGopika", "Symbola", "Yuppy SC", "ADMUI2Sm", "Woodcut", "cmss10", "OCR-A BT", "STIXSizeThreeSym", "Roboto Thin Italic", "AR CENA", "Iowan Old Style Roman", "TlwgTypewriter", "Baclieu", "Optima Bold", "Hannotate TC Bold", "Adobe Hebrew Bold", "Gurmukhi Sangam MN Bold", "X-Files", ".VnExotic", "Trade Gothic LT Std Bold", "BankGothic Lt BT", "MisterEarl BT", "Parry Hotter", "Mshtakan", "Baron Neue", "FML-TTAshtamudiExBold", "VNI-Present", "Hoefler Text Black", "News Gothic MT Alt 3", "Verlag Book", "VNI Helve", "Lucida Bright Italic", "Cabin", "Math1Mono", "MMa GreekSS Italic", "TL-TTHemalatha", "Alibi", "Roboto", "Bell Gothic Std Black", "Lexia", "Proxima Nova Soft Regular", "Vollkorn Italic", "ChandrabatiSushreeMJ", "Diwani Outline Shaded", "News Cycle", "Apple SD Gothic Neo SemiBold", "Arial CE", "Z@R1816.tmp", "SamsungImaginationBold", "Charter Bold", "Canter Outline", "Day Roman", "ML-TTVinay", "YuCiril Helvetica", "Brush Script", "Sorts Mill Goudy Italic", "Simple Indust Outline", "36p Kana Demibold", "Latin Modern Roman Caps", "Mayence Premium", "Granjon Italic", "Noto Sans Syloti Nagri", "Highlight LET", "Ferro Rosso", "Hypatia Sans Pro Light", "Hei Medium", "ITF Devanagari Light", "VNI-Ariston", "SWSimp", "Holiday Springs BTN Quill", "WP MathExtendedB", "FML-TTGeethika", "Verdana Pro Cond", "Bordeaux Roman Bold LET", "Voyager NBP", "Goudy Old Style Italic", "Oswald Regular", "Giddyup Std", "Harvest", "Helvetica Neue Medium", "Paralucent Medium", "Times New Roman Uni", "MMCenturyOld Bold", "Ubuntu Mono derivative Powerline Bold Italic", "Clarendon Lt BT", "Emma Script Mvb", "Raleway Medium Italic", "Gotham Extra Light", "Stone Sans Sem ITC TT SemiIta", "Menlo Bold", "FZLanTingHeiS-UL-GB", "MMa Binary S", "Constantia Bold Italic", "jpn", "Myanmar MN", "MMCenturyOldGreek Bold Italic", "AGA Arabesque", "Inconsolata for Powerline", "Maestro", "Avenir Next Condensed Bold", "PT Serif", "Kozuka Gothic Pr6N EL", "Myriad Pro SemiExtended", "Source Code Pro Light", "cmbx10", "Teen", "Baiduan Number", "AnticFont", "Hobo Std", "Caviar Dreams Italic", "Math4Mono", "ceriph 05", "Gentium Basic", "ceriph 07", "Heather BTN", "MMVariableB Bold", "FML-Akhila", "Cookie", "AR HERMANN", "eusb8", "MMa Fraktur Bold", "Soho Gothic Pro Bold", "Kozuka Mincho Pro R", "PN-TTAmar", "eusb6", "eusb7", "ML-TTSwathyBold", "Roboto Light", "Cochin Bold", "Symeteo", "VNI-Internet Mail", "MMa Greek Bold", "Kozuka Mincho Pro B", "Kozuka Mincho Pro M", "Bodoni 72 Smallcaps Book", "ZDingbats", "Proxima Nova Condensed Regular Italic", "Kozuka Mincho Pro H", "Superclarendon Light Italic", "CountryBlueprint", "MMGreek", "TanglewoodTales", "MMa Greek", "MMEtc Bold", "Noto Sans CJK JP", "HelveticaNeueLT Std Lt", "Apple SD Gothic Neo Medium", "Microsoft JhengHei UI Light", "Broadway Copyist Perc", "Handwriting - Dakota", "PCMyungjo", "AIGDT", "Helvetica Neue Light Italic", "Museo Sans 500 Italic", "Oriya MN", "MMa VariableC SS", "Roboto Condensed Bold Italic", "Circular Std Bold", "GaneshMedium", "Finale Percussion", "Titillium Light", "Arkhip", "Al Bayan", "PingFang HK Semibold", "SAPIcons", "Noto Sans Samaritan", "Dancing Script OT", "ELLIS", "Museo Sans 700", "Limousine", "SF Slapstick Comic Oblique", "Sukhumvit Set", ".VnUniverse", "Franklin Gothic Demi Cond", "KarnaphuliOMJ", "DFKGothic-Md", "Monika Italic", "VNI-Meli", "TeX Gyre Schola", "Finger Paint", "Meslo LG M DZ Regular for Powerline", "TURK", "Noto Sans Limbu", "Arimo Italic for Powerline", "SPAN", "KG Part of Me", "Hiragino Kaku Gothic Pro", "No Flash", "Zolano Serif BTN", "DIN Alternate Bold", "Nanum Pen Script", "Proxima Nova Lt", "Commons", "Lato Light Italic", "Raleway Black Italic", "Maiden Orange", "Lato Bold Italic", "PondFreeMe", "Latin Modern Mono Light Cond", "Myriad Pro Light Cond", "Baron Neue Bold", "Malayalam MN", "Mshtakan Bold", ".VnAvant", "MMa VariableD S", "Merriweather UltraBold", "ITF Devanagari Marathi Book", "Raleway Thin", "Amudham", "MMCenturyNewRD Bold Italic", "DIN-Bold", "Roboto Mono Bold for Powerline", "SaiSai", "Symbol MT", "Virtual DJ", "FML-TTRavivarma", ".VnArabiaH", "FML-TTSruthy", "HaldaOMJ", "JazzPerc", "Gotham Narrow Medium Italic", "Avenir Black", "Kalpurush", "eufb10", "Raleway", "Arial Bold Italic", "Inconsolata-dz for Powerline", "Hiragino Kaku Gothic StdN", "Lobster Two", "QuickType II Mono", "Nova Square", "MMa CenturyK Bold Italic", "Roboto Slab Thin", "Coaster Shadow", "Skia Light Extended", "Skia Regular", "Chipotle", "Thorndale for VST", "TeX Gyre Adventor", "SERB", "Simplex", "Amiri Quran", "Ubuntu Mono derivative Powerline Bold", "Songti TC Light", "One Stroke Script LET", "Clarendon Blk BT", "Poiret One", "Source Code Pro", "Fascinate", "GrilledCheese BTN Wide Blk", "AV-Font-Tam1", "SWRomnd", "Noto Sans Ol Chiki", "Source Code Pro Medium", "HooglyOMJ", "Gazzarelli", "One Dance Bold", "Myriad Pro Light SemiExtended", "Math5Mono", "Raleway ExtraLight Italic", "VNI-Maria", "Gotham Narrow Book Italic", "Roboto Black Italic", "Tekton Pro Bold Extended", "Titillium Regular Upright", "FML-TTGauri", "Stencil Std Bold", "Note this", "Bebas Neue Regular", "VNI-Times", "cmsy9", "cmsy8", "Just Another Hand", "lcirclew10", "INSPECTIONXPERT GDT NOFRMS", "Accord Light SF", "MMa VariableA", "Z@R170E.tmp", "cmsy5", "New Peninim MT", "LuzSans-Book", "cmsy6", "CATIA Symbols", "Bauer Bodoni Std 1 Bold", "Z@R184B.tmp", "Sukhumvit Set Text", "Tsukushi B Round Gothic Regular", "HP Simplified", "Waseem", "HelveticaNeueLT Pro 67 MdCn", "Hiragino Kaku Gothic Std", "Phosphate Inline", "PondFreeZoo", "Arial Narrow Bold Italic", "Kailasa Regular", "ML-TTThiruvathira", "FML-TTKala", "GiovanniITCTT", "Stone Sans Sem OS ITCTT SemiIta", "Arimo", "Trade Gothic LT Std Bold No. 2", "Source Sans Pro ExtraLight", "Soho Gothic Pro Medium Italic", "Milano LET", "WP BoxDrawing", "Titillium Light Italic", "Open Sans Light Italic", "FML-Revathi", "Chalkboard SE Bold", "Bickham Script Pro Semibold", "MMCenturyOld Bold Italic", "FML-TTKarthika", "Unknown Caller BTN SC", "Paralucent Heavy Italic", "MMArrow Italic", "Gotham Narrow Thin Italic", "Andale Mono IPA", "DecoType Thuluth", "04b", "Urdu Typesetting", ".VnFree", "URW Chancery L", "Apple SD Gothic Neo Bold", "Noto Sans Tagalog", "PingFang TC Semibold", "FML-TTAtchu", "PR Celtic Narrow", "Abyssinica SIL", "JaneAusten", "TAMILNET", "GDT", "Dosis Light", "Adobe Garamond Pro Bold Italic", "Devanagari MT Bold", "Arial CYR", "MMa Extra", "Weibei SC", "Existence Light", "IchamotiMJ", "HKSCS", "KG Shake it Off Chunky", "Gadugi", "WP Greek Courier", "Comic Relief", "KacstFarsi", "PT Separated Baloon", "Siyam Rupali", "ScriptC", "MMSchoolRD Bold Italic", "SWTxt", "DejaVu Sans Mono for Powerline", "FML-TTTheyyam", "HGP-AGothic2-Latin1K", "ScriptS", ".VnCourier NewH", "Arno Pro Smbd Caption", "CLARENCE", "Source Serif Pro", "OPENCLASSIC", "OLIVEOIL", "YuGothic Bold", "LCD", "KasseFLF-Bold", "HelveticaNeueLT Std Thin Ext", "CZEC", "3M Circular TT Book", "Bold Italic Art", "ChunkFive Roman", "Redressed", "Chess Alpha", "Myriad Pro Black SemiCondensed Italic", "Jameel Noori Nastaleeq", "Master Of Break", "Smudger LET", "Kinnari", "Apple SD Gothic Neo Light", "Bellota", "Helvetica Bold Oblique", "cmssi17", "Emmett", "CabinSketch", "Songti SC", "cmex10", "cmssi10", "Angiang", "SF Compact Rounded", "Meslo LG S Regular for Powerline", "ItalicT", "SaiEmbed", "Museo 900 Regular", "Futura LT Light Oblique", "Iowan Old Style Italic", "VNI-Aptima", "Gotham Narrow Extra Light", ".VnBodoniH", "MMVariable Bold", "MMArrow Bold Italic", "Fluffy Slacks BTN", "Gotham Narrow Thin", "QuickType II Pi", "lcmssb8", "ItalicC", "WP Hebrew David", "Darlin BTN", "Skia Extended", "SF Compact Rounded Light", "Splash", "ML-TTSurya", "Warsaw", "Noto Sans Ogham", "DhanshirhiMJ", "MMa Etc", "Brush Script Std Medium", "Seravek Light Italic", "Kaiti SC Regular", "Myriad Pro SemiCondensed Italic", "Futura Book Italic BT", "JF Georgian Contrast", "Songti SC Light", "AV-Web-Hin1", "Mudir MT", "BuiltTitlingRg-Bold", "Gocong", "Arial Cyr", "Corsiva Hebrew", "Bickham Script Pro Regular", "VNI-Coronet", "FML-TTThakazhi", "ITF Devanagari Marathi Bold", "Courier MM Screenwriter", "WenQuanYi Micro Hei", "Kumudam", "Stone Sans Sem OS ITC TT Semi", "WP MultinationalB Roman", "cmex9", "Rakesly Bk", "Times Roman", "HanziPen SC Regular", "Press Start 2P", "Myriad Hebrew", "Raleway Medium", "Futura Book", "American Typewriter Bold", "Hiragino Kaku Gothic Pro W6", "MMa Arrow SS", "HelveticaNeueLT Std Thin", "HelveticaNeueLT Std Ext", "KacstPoster", "HanziPen SC Bold", "Colbert", "Proxima Nova Soft Bold", "Calvin", "Iowan Old Style Titling", "MMa VariableF", "Kozuka Mincho Pro EL", "MMa VariableD", "Galeforce BTN", "MMa VariableB", "MMa VariableC", "Minion Pro Medium", "Damascus Light", "KacstQurn", "Raleway SemiBold", "Book Antiqua Bold Italic", "Uncial Antiqua", "Diwani Simple Outline", "BrahmaputraMJ", "SWIsot2", "Gotham Ultra", "Broadway Copyist", "Osaka", "VNI-Vivi", "Meiryo Bold", "Segoe WP SemiLight", "STIX Math", "SWIsot1", "VNI-ShellaL", "STIXIntegralsD-Regular", "STIXSizeThreeSym-Regular", "lcmss8", "Neon Lights", "Z@R16EB.tmp", "ML-TTLeelaHeavy", "ParvathiMedium", "Amethyst", "EQUIS", "System Font Black", "ITF Devanagari Bold", "Lao Sangam MN", "PT Serif Bold", "Inder", "PT Bold Mirror", "OCR-B 10 BT", "MMVariable", "VANAVIL-Avvaiyar", "ISOCT2", "Dosis ExtraBold", "Chaparral Pro Bold Italic", "MMTextBookB Bold Italic", "Times New Roman Symbol", "VNI-Dom", "HelveticaNeueLT Pro 95 Blk", "Baoli SC Regular", "BurigangaOMJ", "Avenir Next Condensed Ultra Light Italic", "Letter Gothic Std", "JLS Data GothicR  NC", "Roboto Medium Italic", "Titillium Bold", "Bookman Old Style Bold Italic", "Myriad Pro Semi bold", "ISOCT3", "msam10", "Source Sans Pro Semibold", "Myriad Pro Semibold SemiCondensed Italic", "Incised901 NdIt BT", "DejaVu Sans Light", "Myriad CAD", "Light", "Binhdinh", "Rachgia", "HGHeiseiMinchotaiW9", "ChandrabatiOMJ", ".VnTifani HeavyH", "System Font Heavy Italic", "GFS Artemisia", "WP MultinationalB Helve", "TAB", "8514oem", "Hack Bold", "Athelas Bold", "ArhialkhanOMJ", "Calibri Light", "Hoian", "Avenir Next W1G Ultra Light", "Vikatan", "STKaiti", "Adobe Hebrew Regular", "Utopia", "MMa CenturyS Bold", "KacstLetter", "Apple SD Gothic Neo Regular", "Heiti SC Light", "ABeeZee", "Chinyen", "GB18030 Bitmap", "Lucida Calligraphy Italic", "euex10", "HelveticaNeueLT Std Lt Cn", "Anonymice Powerline Italic", "News Gothic MT Alt 2", "Bell Gothic Std Light", "MATTEROFFACT", "Z@R1720.tmp", "Titillium Bold Upright", "ENGL", "Gotham Ultra Italic", "Didot Italic", "HelveticaNeueLT Pro 33 ThEx", "Hot Mustard BTN Poster", "Farah", "MMTextBook Bold Italic", "VNI-Shadow", "New Gulim", "MMa CenturyKS Italic", "GungSeo Regular", "Droid Sans Mono for Powerline", "iso 08", "POLI", "Nova Slim", "Hue", "GothicNo13 BT", "Proxima Nova Black", "ML-TTAnjali", "Caflisch Script Pro", "Lao MN", "HP PSG", "VNI-Heather", "Gill Sans Nova", "cht", "Opus Chords", "Raleway Bold Italic", "Junicode", "IMG Love", "cmti10", "Verdana Bold", "Saab", "ADMUI2Lg", "Superclarendon Black Italic", "OCR A Std", "Hot Mustard BTN", "cmti12", "Francois One", "Tsukushi B Round Gothic", "Literation Mono Powerline", "MAC C Times", "Noto Sans Inscriptional Pahlavi", "Proxima Nova Extrabold", "Georgia Pro Cond", "Helvetica Light", "Remachine Script Personal Use", "Pump Demi Bold LET", "Gentium Book Basic", "VNI-Algerian", "Lato Medium Italic", "MMArrow", "FML-TTMadhaviExBold", "SWScrpc", "STIXSizeFourSym-Regular", "Nafees Web Naskh", "JLS Data GothicC  NC", "TAC-Kambar", "Microsoft Tai Le Bold", "SWScrps", "Proxima Nova Light Italic", "Tamil MN Bold", "ML-TTGauri", "ML-TTGeethika", "AdineKirnberg", "Rotis Sans Serif Std 75 Extra Bold", "AR BERKLEY", "Farisi", "Rachana", "Kerala", "Chaparral Pro", "Bubblegum Sans", "Sasfont", "System Font Italic", "WP IconicSymbolsA", "WP IconicSymbolsB", "Throw My Hands Up in the Air", "Sneakerhead BTN", "CentSchbook BT", "Incised901 BdCn BT", "PortagoITC TT", "HaldaMJ", "MapInfo Cartographic", "Belwe Lt BT", "Kundli", "Kozuka Mincho Pr6N EL", "Swis721 Cn BT", "MMBinary Bold Italic", "SchoolHouse Printed A", "VNI-Brush", "Tsukushi A Round Gothic Regular", "Vollkorn Bold Italic", "Kozuka Gothic Pr6N R", "Bodoni Ornaments", "Futura LT Condensed Light Oblique", "Nexa Regular Italic", "KarnaphuliMJ", "Damascus Bold", "Gotham Black", "Kohinoor Bangla", "Noto Sans Mono CJK JP", "Constantia Italic", "ML-TTAshtamudiExBold", "Times Bold", "Arial Narrow Bold", "MMa CenturyKSS Italic", "DhonooMJ", "Noto Sans Ethiopic", "HelveticaNeueLT Std Med Ext", "MMCenturyNewRD Bold", "Yuppy TC Regular", "SF Distant Galaxy Alternate", "PT Sans", "PingFang HK Ultralight", "Athelas Italic", "Sonic XBd BT", "saxMono", "Bangla MN Bold", "Tinos Bold for Powerline", "ChondanaMJ", "Yuanti TC Regular", "HelveticaNeueLT Pro 93 BlkEx", "FML-TTSugatha", "Ducmy", "Germ", "Padauk", "YD2002", "Sitka Subheading", "Myriad Pro SemiCond", "Myriad Pro SemiExtended Italic", "WP MathB", "Noto Sans Buhid", "Noto Sans Mono CJK TC", "Noto Sans Inscriptional Parthian", "msbm6", "Kefa Regular", "msbm8", "msbm9", "Weibei TC Bold", "LKLUG", "FML-TTIndulekha", "MMTimes Italic", "Noto Sans Imperial Aramaic", "VNI-Script", ".VnParkH", "Noto Sans Old South Arabian", "Kozuka Gothic Pr6N B", "TitilliumText22L-Medium", "Euclid Bold Italic", "Calisto MT Bold", "Dosis Bold", "Futura LT Medium", "FML-TTKanika", "Kufi Outline Shaded", "Beirut", "EXCESS", "New Peninim MT Bold Inclined", "Optima", "Source Sans Pro Italic", ".VnAristote", ".VnTimeH", "MMa Fermat", "Tangerine", "Noto Sans Batak", "eurb8", "ML-TTPoornima", "Myriad Web Pro", "Paralucent Thin Italic", "Avenir Next Demi Bold", "msam6", "MMa Century Italic", "Ezra SIL", ".VnTime", "Miama", "Futura LT Condensed Bold", "Literation Mono Powerline Bold", "Myriad Pro Condensed", "MMa Arrow", "FML-TTNandini", "Kaiti SC", "SF Compact Rounded Medium", "KG Primary Penmanship", "Skia Bold", "ML-TTMayoori", "VNI-Tekon", "Vonique 64", "Myriad Pro Cond", "Arial Hebrew Scholar Light", "Engravers MT Bold", "Perpetua Italic", "Arial Greek", "ML-TTIndulekhaHeavy", "ISOCTEUR", "Visitor TT2 BRK", "cmr17", "SWAstro", "LETT", "AlekyaExtraBold", "FML-TTYashasri", "cmr10", "Gothic720 Lt BT", "Microdot", ".VnClarendon", "Book Antiqua Bold", "HeiT", ".VnAvantH", "PT Serif Caption Italic", "Princetown LET", "Eccentric Std", "8Pin Matrix", "GangaOMJ", "Kohinoor Bangla Bold", "ML-TTJyotsna", "Hoefler Text Italic", "Bodoni 72 Bold", "Noto Sans Shavian", "Bahiana", "Roboto Bold Italic", "VNI-Franko", "cmbx7", "cmbx6", "cmbx5", "SAPGUI-Icons", "Charter Italic", "cmbx9", "cmbx8", "Gelfling SF", "Aileron Black", "Bookshelf Symbol 1", "HGPHeiseiKakugothictaiW9", "FML-TTPooram", "Raanana", "OCRA", "Sanskrit New", "Ostrich Sans Rounded", "TLArabic", "Latin Modern Mono", "AG", "Opus Chords Sans", "Source Code Pro Bold", "Source Sans Pro Black Italic", "BorakMJ", "Futura Bold", "Latin Modern Roman Dunhill", "CAMPBELL", "Futura Medium Italic", "FML-TTSuparna", "FML-TTKamini", "SignPainter", "Noto Sans Armenian", "Adobe Caslon Pro Italic", "Latin Modern Mono Slanted", "Wawati SC Regular", "Dayton", "Newton Phonetic ABBYY", "MMBinary Italic", "IMG Travel", "Helvetica Oblique", "FELIZ", "Amiri", "VNI-Colonna", "JumunaOMJ", "DIN Alternate", "Lohit Devanagari", "Aileron Thin", "Tamil MN", "GhorautraOMJ", "Wolf in the City", "FML-TTPoornima", "Trade Gothic LT Std Bold Extended", "Complete in Him", "ITF Devanagari", "Diwan Thuluth Regular", "01 Digit", "TeX Gyre Cursor", "Playfair Display SC Bold Italic", "HelveticaNeueLT Std Med Cn", "Avenir Next Condensed Heavy", "Hiragino Sans GB", "GFS BodoniClassic", "LightSC", "Camranh", "TAM-Kavi", "Phetsarath OT", "Symbol", "Rondalo", "Jayanthi", "MMTextBook Italic", "Leelawadee UI Semilight", "OpineHeavy", "Century Schoolbook Italic", "Chalkboard SE Regular", "SWTOR Trajan", "ML-TTSugatha", "SF Distant Galaxy Outline", "Theatre Antoine", "Heavy Heap", "ML1-TTIndulekha", "SFNS Display", "Nexa Light Italic", "Linux Biolinum Keyboard O", "Adobe Devanagari Bold", "BaluScript", "Avenir Next Condensed Regular", "ARDS1", "cmssqi8", "Avenir Next Medium", "ChondanaOMJ", "B095", "Borealis", "Seravek ExtraLight Italic", "Avenir Next Heavy Italic", "Tamil Sangam MN Bold", "HelveticaNeue", "Tsukushi A Round Gothic Bold", "VNI-Helve-Condense", "FML-TTAnakha", "Hiragino Kaku Gothic StdN W8", ".VnMonotype corsiva", "MMa VariableF S", "Nightclub BTN", "Berling", "MMa VariableB SS", "Z@R11F8.tmp", "Suruma", "Telugu MN", "Linux Libertine O", "Italianate", "Raleway Italic", "Span", "ML-TTKeerthi", "MMa Pascal", "VNI-Scribble", "Indie Flower", "Avenir Next Condensed Demi Bold Italic", "ML-TTVisakham", "Arno Pro Caption", "Qaskin White Personal Use", "MMTextBookB", "Al Tarikh", "Berkshire Swash", "Hobo Std Medium", "DINPro-Regular", "Circular Std Black Italic", "Muna Bold", "TechnicBold", "SWMono", "Sukhumvit Set Bold", "Palatino Linotype Bold Italic", ".VnCentury SchoolbookH", "Euclid Math Two Bold", "Creepygirl", "ISOCP3", "Source Sans Pro Black", "MMa Relation", "Futura LT Condensed Medium", "BongshaiOMJ", "VNI Aptima", "Leitura Display Swashes", "Gotham Narrow Ultra Italic", "Math2Mono", "Swis721 BdOul BT", "Clubland", "English157 BT", "modstmary10", "eurm9", "euex8", "Diavlo Medium", "Iowan Old Style Black Italic", "MMa GreekS", "Adobe Garamond Pro", "Cordia New Bold", "PRETEXT", "DengXian", "University Roman LET", "Open Sans Semibold", "Soho Gothic Pro Ultra", "Futura Extra Bold Oblique", "Roboto Condensed Light Italic", "Tamil-Aiswarya", "ML-TTNandini", "Avenir Next Ultra Light Italic", "Trade Gothic LT Std Bold Condensed No. 20", "FML-TTAshtamudi", "Ostrich Sans Dashed", "Myriad Pro Semibold SemiExtended", "NewRocker", "DIN-MediumAlternate", "Arimo Bold", "TLPashto", "Gauge", "Gotham Bold Italic", "MMVariable2 Bold", "FFF Tusj", ".VnHelvetInsH", "Embassy BT", "MMSchoolRD Italic", "Myriad Pro Semibold", "CityBlueprint", ".VnGothic", "Source Code Pro Black", "Futura Light", "Baamini", "Palatino Italic", "SF Distant Galaxy AltOutline", "Gotham Light", "AcmeFont", "Trade Gothic LT Std Bold Condensed No. 20 Oblique", "DIN-Medium", "Terminator Real NFI", "Letter Gothic Std Bold Slanted", "Gill Sans Light Italic", "YuMincho Medium", "Myriad Pro Light Condensed Italic", "Myriad Pro Black Condensed Italic", "Osaka-Mono", "Josefin Slab", "Gauge Heavy", "Haxton Logos TT", "BhairabMJ", "Fences", "Gurmukhi MT", "Good Times", "MMa Extra S", "Benguiat", "DINPro-Medium", "MMa Variable2 SS", "Oswald Stencil", "Apple Braille", "HelveticaNeueLT Std Blk Ext", "Noteworthy Light", "Scruff LET", "DIN-BlackAlternate", "Letter Gothic Std Medium", "Adobe Pi Std", "Kozuka Mincho Pr6N", "Menlo Regular", "Almonte Snow", "Belfast Heavy SF", "Kaiti SC Bold", "AR CHRISTY", "VNI-Lydi", "Cantarell Bold Oblique", "Gentium", "Bevan", "Quicksand Light Regular", "JLS Space GothicC  NC", "True Lies", "STIXVariants", "MMa TextBook Bold", "Segoe UI Black", "Noto Sans Malayalam", "eurb10", "Averia Serif", "Candy Round BTN Cond", "ML-TTBeckalBold", "Bariol Regular", "Avenir Medium Oblique", "Kohinoor Bangla Semibold", "Helvetica Neue Bold", "ML-TTAmbili", "Noto Sans Mono CJK KR", "cmfi10", "UnitedStates", "ML-NILA07", "Chandas", "Coolsville", "Franklin Gothic Demi", "HelveticaNeueLT Pro 63 MdEx", "Yuanti SC Light", "FML-TTLeelaHeavy", "Prisoner SF", "Times New Roman CYR", "News Gothic MT Alt 6", "Bodoni 72 Book Italic", "Shree-Kan-0853", "Letter Gothic Std Bold", "Rekha", "Akhbar MT", "DecoType Naskh Regular", "Gunplay", "Nadeem Regular", "Accanthis ADF Std", "Roboto Condensed Bold", "Adobe Caslon Pro Bold Italic", "Helvetica Neue Bold Italic", "Tlwg Typist", "SF Compact Rounded Thin", "Swiss 721 Bold BT", "Jwala", "Capitals", "GFS Theokritos", "cmr8", "cmr9", "cmr6", "cmr7", "SWGrekc", "Timeless", "w01", "Digifit", "Minion Pro Med", "Simple Outline Pat", "MMa Negate Bold", "Linden Hill", "Courier New (Arabic)", "Sauce Code Powerline Black", "Noto Sans Gothic", "Adobe Kaiti Std", "AV-Web-Tam1", "Athelas Regular", "FML-TTMangalaExBold", "Rockwell Bold Italic", "Visitor TT1 BRK", "Brandish", "Futura LT Condensed Extra Bold Oblique", "Manorly", "Gotham Narrow Light", "cmti8", "DejaVu Serif", "Allura", "Source Sans Pro Light", "Burst My Bubble", "ISOCT", "Hannotate SC", "ISOCP", "Greek Diner Inline TT", "Paralucent Thin", "BuiltTitlingRg-Regular", "Calligraphic", "SF Slapstick Comic Bold Oblique", "Soho Gothic Pro Light Italic", "Euclid Extra", "Sauce Code Powerline Light", "Courier New Greek", "Noto Sans Georgian", "PT Sans Italic", "Cousine Bold Italic for Powerline", "VNI-Goudy", "Math3Mono", "Georgia Italic", "Luna Bar", "VNI-Bragga", "Sawasdee", "TAMLKamban", "Paralucent Bold Italic", "PingFang TC", "Valken", "MMCenturyNewRD", "Meera", "Saint Andrew des Kiwis", "Courier Bold Oblique", "Diavlo Light", "HGSMinchoL", "Diwani Bent", "MMa VariableD Bold", "Courier New Italic", "Aileron UltraLight", "Chess Merida", "cmsl8", "Snell Roundhand Black", "Candara Bold", "Grafolita Script Medium", "Diwani Letter", "Paralucent Bold", "Adobe Devanagari Italic", "VNI-Linus", "cmss12", "eusm10", "Avenir Next W1G Light Italic", "Seravek ExtraLight", "Interstate-Black", "SignPainter-HouseScript", "Euclid Extra Bold", "System Font Medium Italic P4", "TtsNote", "Quicksand Book Oblique Regular", "TAMILFIX", "Industrial736 BT", "Adobe Arabic Bold", "InaiMathi", "Tera Special", "Myriad Pro Light SemiExtended Italic", "NanumGothic Bold", "MMTextBookB Bold", "JaJaDiOMJ", "Nimbus Mono L", "Futura Std Bold", "Finale Numerics", "Moon Flower Bold", "Swis721 Lt BT", "Mael", "Nexa Heavy Italic", "Becky", "ML-TTKaumudi", "TAU-Kabilar", "MMa CenturyS Bold Italic", "Violetta", "Bell MT Bold", "Palatino Linotype Italic", "FML-TTNila", "FML-Karthika", "Rotis Sans Serif Std 65 Bold", "PenultimateLight", "VNI-Revue", "Liberation Mono", "Trade Gothic LT Std Bold No. 2 Oblique", "GFS Didot", ".VnBlackH", "MMa Binary SS", "ML-TTSabari", "Bangla Sangam MN Bold", "AppleMyungjo", "TM-TTValluvar", "type 07", "Yu Gothic UI Semibold", "KN-TTUma", "Playfair Display", "Txt", "Gotham Narrow Light Italic", "Menlo", "Zirkon", "AV-Font-Sin", "Tall Boy West", "Yu Gothic", "AMGDT", "STSong", "Arimo for Powerline", "KufiStandardGK", "Nexa Bold", "TG Pagella Math", "Adobe Arabic Regular", "Futura Extra Bold", "SamsungImagination", "Mycalc", "MMa CenturyKSS Bold Italic", "Superclarendon Black", "Catull", "HYSWLongFangSong", "cmsy10", "FML-TTAyilyamBold", "Rakesly Lt", "SF Compact Rounded Heavy", "Beatnik SF", "Trajan Pro", "Sosa Regular", "Adobe Song Std", "Raleway Bold", "Bauer Bodoni Std 1 Italic", "DholeshwariOMJ", "VNI-StencilU", "Kefa", "STXihei", "Garamond Bold", "Trajan Pro Bold", "Reklame Script Medium", "AGA Arabesque Desktop", "Savoye LET Plain", "BATAVIA", "Fabrica", "Gidole", "Abril Fatface Regular", "Baskerville SemiBold", "Gill Sans SemiBold Italic", "Hombre", "STIXIntegralsUpSm-Bold", "Vogue", "Noto Sans Kayah Li", "Noto Sans Lydian", "Avenir Next Bold", "Myriad Pro Light SemiExt", "VNI-Bodon", "Estrangelo Edessa", "Titillium Semibold Upright", "Kingthings Versalis", "Droid Sans Mono Slashed for Powerline", "Patrick Hand SC", ".VnLinusH", "Galatia SIL", "Myanmar MN Bold", "Anonymice Powerline Bold Italic", "STIXNonUnicode-BoldItalic", "IMG Seasons", "NEOLITH", "GFS Baskerville", "PingFang HK", "Adobe Garamond Pro Italic", "OCR B MT", "Bariol Regular Italic", "Minion Pro Bold", "Nexa XBold", "AppleGothic Regular", ".VnMemorandumH", "HelveticaNeue BlackCond", "Myriad Pro Italic", "Symath", "Times New Roman Baltic", "Spicy Rice", "FML-TTMayoori", "Zapf Dingbats", "Rockwell Bold", "JomunaMJ", "FML-TTDevika", "Gill Sans Nova Cond XBd", "HelveticaNeueLT Std UltLt", "HanziPen TC", "Courier New Cyr", "Seville", "SF Compact Rounded Black", "HelveticaNeueLT Std ExtBlk Cn", "Arial Hebrew Light", "Canterbury Regular", "Ital", "Tekton Pro Ext", "Dosis ExtraLight", "Mshtakan BoldOblique", "New Athena Unicode", "Ubuntu Condensed", "SansSerif", "Century Gothic Bold", "Nueva Std Cond", "STIXGeneral-Italic", "Arial Nova Cond Light", "Tinos for Powerline", "CSD16", "PFDaVinciScriptPro-Regular", "KalindiSMJ", "MMTimes Bold Italic", "ML-TTSankara", "JazzTextExtended", "Courier MM Screenwriter Bold", "Calibri Bold Italic", "Merriweather Light", "FreeSerif", "System Font Bold Italic", "Baron Neue Black Italic", "Avenir Next W1G Demi", "Finale Mallets", "Circular Std Bold Italic", "Wawati TC Regular", "Tinos Italic for Powerline", "Trade Gothic LT Std Condensed No. 18", "Paralucent Medium Italic", "Cumberland AMT", "VNI Laos", "Camau", "Aleo", "DIN 1451 Mittelschrift", "VNI-Chaucer", "Cuulong", ".VnMystical", "Nexa Heavy", "Kohinoor Devanagari Regular", "HolidayPi BT", "Jokerman LET", "Salina", "Arial monospaced for SAP", "MMa Century", "Baskerville SemiBold Italic", "MMa GreekS Italic", "Lapidary333 Blk BT", "Adobe Myungjo Std", "Alfredo", "Dot-Matrix", "Thanhoa", "cmr12", "Adobe Fangsong Std", "Academy Engraved LET Plain:1.0", "Calligraph421 BT", "DejaVu Serif Condensed", "SWItal", "Futura LT Book Oblique", "Noto Sans Lycian", "Noto Sans Phags Pa", "SF Compact Text", "MAXIMO", "Avanti", "Adobe Caslon Pro Bold", "Space Bd BT", "November", "Lavanderia", "at most sphere", "Farisi Regular", "Gill Sans Nova Cond Lt", "Razer Text Regular", "VNI-Auchon", "Myriad Pro Black SemiExt", "KacstOne", "Gotham Thin Italic", "Raleway Black", "Hiragino Sans W9", "Hiragino Sans W8", "Penultimate", "Hiragino Sans W5", "Hiragino Sans W4", "Hiragino Sans W7", "Hiragino Sans W6", "Hiragino Sans W1", "Hiragino Sans W0", "Hiragino Sans W3", "Hiragino Sans W2", "Minion Pro Italic", "Kozuka Mincho Pr6N M", "Kozuka Mincho Pr6N L", "Proxima Nova Condensed Semibold Italic", "Kozuka Mincho Pr6N H", "Hiragino Maru Gothic ProN W4", "HelveticaNeueLT Std Extended", "NanumBarunGothic", "Kozuka Mincho Pr6N B", "VNI Russia", "Reklame Script Bold", "ML-TTThakazhi", "MMSchoolRD", "Futura Std Light", "Poplar Std", "Kozuka Mincho Pr6N R", "Franklin Gothic", "Paralucent Light", "ML-TTVaisali", "cmb10", "Waseem Light", "VNI-Cooper", "Ethnocentric", "STIXSizeFourSym", "Praveen", "Calibri Bold", "ML-TTYashasri", "Swis721 LtCn BT", "Snowdrift", "Myriad Pro Semibold SemiExtended Italic", "LiSong Pro", "Myanmar Sangam MN Bold", "MMCenturyOldGreek Bold", "VNI-Broad", "YuGothic", "American Typewriter Semibold", "Hannotate SC Bold", "Opus Ornaments", "Arimo Italic", "RamuBrush", "TechnicLite", "Nexa Book", "FML-IndulekhaHeavy", "Arimo Bold for Powerline", "Marion Bold", "Apple Braille Outline 6 Dot", "FML-TTBhavana", "Nanum Myeongjo", "PT Sans Caption Bold", "Gotham Medium Italic", "Quicksand Italic", "Z@R195D.tmp", "Soho Gothic Pro Bold Italic", "Hannotate TC", "ITF Devanagari Book", "Cracked Johnnie", "Rockwell Nova Light", "HGPMinchoL", "STIXNonUnicode-Bold", "VNI-Arial Rounded", "Braggadocio", "Swiss921 BT", "Museo 300 Regular", "Adobe Arabic Italic", "Trade Gothic LT Std", "Titillium Bold Italic", "VNI-Juni", "Myriad Pro Bold SemiCondensed Italic", "SWGamekeys MT", "Comfortaa", "Baron Neue Black", "Latin Modern Mono Prop Light", "Crystal", "RamuScript", "SAPDings", "RadhaBold", "Superclarendon Bold Italic", "Libel Suit", "Sneakerhead BTN Outline", ".VnLincoln", "MMTextBook", "Gujarati MT", "KacstScreen", "MMEtc Bold Italic", "Dosis SemiBold"]

		fontList = fontList.concat(extendedFontList);
		fontList = fontList.concat(extendedFontList2);

		try {
			if (document.fonts.check("10px testinvalidfontaaa"))
				return []

			let Result = []
			fontList.forEach(function (Font) {
				if (document.fonts.check("10px \"" + Font + "\""))
					Result.push(Font)
			})

			if (Result.length > fontList.length - 5) {
				return []
			}
			return Result
		} catch (e) {
		}

		return []
	}
	function GetFonts() {
		try {
			var PossibleResult = GetFontsFontFaceSet()
			if (PossibleResult.length > 0)
				return Promise.resolve(PossibleResult)
		} catch (e) {

		}

		var fontList = [
			"Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS",
			"Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style",
			"Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New",
			"Garamond", "Geneva", "Georgia",
			"Helvetica", "Helvetica Neue",
			"Impact",
			"Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode",
			"Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO",
			"Palatino", "Palatino Linotype",
			"Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol",
			"Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS",
			"Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"
		];
		var extendedFontList = [
			"Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium", "Algerian", "Amazone BT", "American Typewriter",
			"American Typewriter Condensed", "AmerType Md BT", "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic Typesetting", "ARCHER",
			"ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville",
			"Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD",
			"Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed",
			"Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Californian FB", "Calisto MT", "Calligrapher", "Candara",
			"CaslonOpnface BT", "Castellar", "Centaur", "Cezanne", "CG Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer",
			"ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna MT", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold",
			"Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark",
			"DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC",
			"EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light", "Forte",
			"FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER",
			"Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT", "Gautami", "Geeza Pro", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt BT", "GeoSlab 703 Lt BT",
			"GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD",
			"Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV",
			"Herald", "High Tower Text", "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT",
			"Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT", "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN",
			"Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island",
			"Lydian BT", "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic",
			"Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le",
			"Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Mongolian Baiti",
			"MONO", "MoolBoran", "Mrs Eaves", "MS LineDraw", "MS Mincho", "MS PMincho", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli",
			"Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN",
			"OSAKA", "OzHandicraft BT", "Palace Script MT", "Papyrus", "Parchment", "Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB",
			"Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla",
			"Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold", "SCRIPTINA", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood",
			"Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket",
			"Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen", "Synchro LET", "System", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC",
			"Terminal", "Thonburi", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold",
			"TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium", "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda", "Westminster", "WHITNEY", "Wide Latin",
			"ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"];

		var extendedFontList2 = ["Segoe WP", "FreeMono", "Heiti TC Light", "VNI-Kun", "Liberation Serif", "ML-TTVeenaHeavy", "Brandon Grotesque Light", "Adobe Hebrew Italic", "MMa Etc Bold", "Toledo", "Ubuntu Mono derivative Powerline", "Hannotate TC Regular", "Droid Sans Thai", "Cambria Italic", "Abadi MT Condensed Extra Bold", "Barrio", "ML-TTVishu", "MMa VariableB S", "BurigangaSushreeOMJ", "Pegypta", "Avenir Next Condensed", "TitilliumText22L-Bold", "Corbel Bold Italic", ".VnCourier New", "Trajan Pro 3 Bold", "Futura LT Condensed Light", "FML-TTAmbili", "dbldwrsw", "PingFang HK Light", "Soho Gothic Pro Italic", "Tele-Marines", "Cronos Pro", "Noto Sans Brahmi", "HANA", "VNI Times", "Rakesly El", "WP MultinationalA Roman", "HGSHeiseiKakugothictaiW5", "Avenir Next W1G Medium", "Cambria Bold Italic", "Futura Std Book", "New Renex Terminal", "HGSHeiseiKakugothictaiW9", "KufiStandardGK Regular", "VNI-Bodon-Poster", "eurb9", "MrsEavesRoman", "WP Greek Century", "STIXNonUnicode", "Songti SC Bold", "Kaushan Script", "OpenSymbol", "FML-TTJyotsna", "EngraverTime", "Charter Black Italic", "Arno Pro", "Tahoma Negreta", "Century Schoolbook L", "Circular Std Book Italic", "Tall Boy 3D", "Egyptian710 BT", "ML-NILA03", "ML-NILA02", "ML-NILA01", "Petrucci", "Waseem Regular", "ML-NILA06", "ML-NILA05", "NORMAL", "eusm8", "Z@R120A.tmp", "cmtcsc10", "Merriweather Italic", ".VnSouthernH", "Lantinghei TC Heavy", "C-Medium", "Nightclub BTN UltraCn", "GoraiOMJ", "Avenir Next Ultra Light", "Myanmar Sangam MN", "Droid Sans Mono Dotted for Powerline", "Optima Italic", "TitilliumText22L-Regular", "MelodBold", "cmsl10", "cmsl12", "Linux Libertine Display O", "Manorama", "DecoType Naskh Special", "Caviar Dreams Bold Italic", "Sauce Code Powerline", "Courier New CE", "BurigangaSushreeMJ", "Aileron", "Hiragino Sans", "Smooth", "MMCenturyOldGreek", "Microsoft NeoGothic", "Atzur", "GLYPHICONS Halflings", "Trattatello", "LT-TM-Lakshman", "TeX Gyre Chorus", "Myriad Pro SemiCondensed", "Open Sans Extrabold", "Chaparral Pro Bold", "GrilledCheese BTN Cn", "Bitstream Charter", "Noto Sans Tai Viet", "Georgia Pro SemiBold", "Rotis Sans Serif Std 56 Italic", "ITF Devanagari Marathi Demi", "Avenir Next W1G Thin", "Priori Serif OT", "Times Bold Italic", "BurigangaKamalaOMJ", "Literation Mono Powerline Italic", "Quickpen", "AR BONNIE", "Caviar Dreams", "Avenir Roman", "Pujeeta", "Deepak", "cmmi12", "FML-TTSankara", "Bookman Old Style Italic", ".VnArial", "Antonio", "Linowrite", "GFS Gazis", "FordLineDraw", "ConcursoItalian BTN Wide", "MMa CenturySS", "Laksaman", "Segoe Marker", "Monotype Sorts", "Bienhoa", "Noto Sans Syriac Eastern", "Caviar Dreams Bold", "MMa Arrow Bold Italic", "Diavlo Black", "Proxima Nova", "BhairabOMJ", "WP Phonetic", "Myriad Pro", "VNI-Fato", "Myriad Pro Bold", "MMVariableF Bold", "Julius Sans One", "EuroRoman", "cmcsc9", "cmcsc8", "LaurenScript", "VNI-Commerce", "Freebooter Script", "Math5", ".VnHelvetIns", "Roboto Mono Bold Italic for Powerline", "Vineta BT", "ML-TTPooram", "MMa Extra Bold", "Quangngai", "TAM", "Terminal Greek 737 (437G)", "TITUS Cyberbit Basic", "Kalakaumudi", "Adobe Gurmukhi", "HanziPen SC", "cmff10", "Praxis", "FML-TTVishu", "Microsoft MHei", "VNI Greece", "Sukhumvit Set Semi Bold", "Swiss 721 Roman", "Soho Gothic Pro Ultra Italic", "STLiti", "Marquisette BTN Light", "Arimo Bold Italic for Powerline", "ML-TTJaya", "eusm9", "Kohinoor Devanagari Light", "Century Gothic Italic", "HariSree", "MyriadPro-Semibold", "IPAexGothic", "MS Reference Serif", "eusm7", "HelveticaNeueLT Pro 97 BlkCn", "Quicksand Bold", "Yu Mincho", "VNI-Murray", "ChandrabatiMJ", "Sitka Banner", "MMCenturyOldGreek Italic", ".VnCommercial ScriptH", "Interstate-Regular", "Arimo Bold Italic", "Latienne Pro", "TAC-Valluvar", "FML-Nanditha", "MMa VariableF Bold", "Tekton Pro Bold", "Noto Serif", "AmdtSymbols", "Euclid Symbol", "Songti SC Regular", "Cambria Bold", "Meslo LG S DZ Regular for Powerline", "Nexa Light", "Party LET Plain:1.0", "Minion Pro SmBd", "AV-Font-Kan1", "Clarendon Cn BT", "Yu Mincho Demibold", "Hypatia Sans Pro Semibold", "Seravek Bold Italic", "Nightclub BTN Cn", "Myriad Arabic Italic", "Charter Roman", "spinwerad", "Gill Sans Nova Cond Ultra Bold", "KG Corner of the Sky", "DecoType Naskh Extensions", "MLB-TTAmbili", "YuMincho ", "Futura LT Light", "Latin Modern Roman", "Gotham Narrow Black Italic", "DIN-Light", "VNI-Top", "Giolinh", "Muna Black", "Apple Boy BTN", "Clarendon BT", "DINPro-Light", "Playfair Display SC Black", "Quixley LET", "MMa Pascal Bold", "Interstate-Light", "American Typewriter Condensed Bold", "Skia Condensed", "Latienne Pro Bold", "lcircle10", "ML-IndulekhaHeavy", "Source Serif Pro Semibold", "Tamburo", "Halong", "Normande Italic", "VNI-Book", "MMa Extra Italic", "Heavy", "MMBinary", "PondAllRounder", "Euphemia UCAS Bold", "Avenir Book Oblique", "HP Simplified Light", "HGSHeiseiKakugothictaiW3", "Gill Sans Light", "VNI-Garam", "AlekyaMedium", "Hebar", "Stone Sans Sem ITC TT", "DV1-TTYogesh", "Adobe Arabic", "Rosewood Std Regular", "Marquisette BTN Lined", "Gotham Book", "Sukhumvit Set Medium", ".VnTeknicalH", "Z@R1762.tmp", "MMa Gauss Bold", "Avenir Next Condensed Demi Bold", "Trebuchet MS Bold Italic", "TlwgMono", "Avenir Next W1G Bold", "Flubber", "Opus Figured Bass", "Futura LT Heavy Oblique", "Nova Oval", "Bangla MN", "Opus Function Symbols", "Microsoft JhengHei Light", "STIXSizeOneSym", "Magic School Two", "Type Embellishments One LET Embellishments One LET Plain:1.0", "Avenir Next Heavy", "Palatino Bold", "Candara Italic", "Gujarati MT Bold", "Vinhan", ".VnBahamasBH", "SaiVrishin", "AR ESSENCE", "Frankfurter Venetian TT", "Gillius ADF Cd", "Mishafi Gold", "System Font Medium", "Roboto Mono Medium for Powerline", "SF Distant Galaxy", "Monotype.com", "MMTextBook Bold", "Gill Sans MT Italic", "Tlwg Typewriter", "Soho Gothic Pro ExtraBold", "STIXSizeTwoSym-Bold", "BaluBrush", "System Font Bold", "Roboto Light Italic", "Times New Roman (Arabic)", "Maestro Wide", "Bickham Script Pro 3 Semibold", "STXingkai", "Annie BTN", "AtraiOMJ", "Aileron SemiBold", "cmsy7", "Bookshelf Symbol 3", "Orator Std", "Swis721 BdCnOul BT", "Proxima Nova Bold", "Shree Devanagari 714 Bold Italic", "WP MultinationalA Helve", "Noto Sans", "Lucida Sans Italic", "Phosphate Solid", "Damascus", "DengXian Light", "Notram", "Bordeaux Roman Bold LET Plain", "Lantinghei SC Heavy", "MMa CenturyS Italic", "Noto Sans Phoenician", "System Font", "ADMUI3Sm", "Shree Devanagari 714 Italic", "kroeger 06", "Belfast Light SF", "KacstBook", "PingFang SC Thin", "Futura Condensed Medium", "WP Japanese", "Hiragino Kaku Gothic Std W8", "GaneshBold", "Open Sans Italic", "Aileron Bold", ".VnFreeH", "Swis721 BlkOul BT", ".VnRevueH", "Freehand521 BT", "MMa Arrow Italic", "Opus Chords Sans Condensed", "OR-TTSarala", "Montserrat Black", "VNI-Avo", "System Font Medium P4", "VNI-GlabXb", "HarvestItal", "MMa VariableA S", "Segoe WP Black", "Courier10 BT", ".VnLincolnH", "eusb5", "Marker Felt Thin", "KacstTitleL", "HelveticaNeueLT Pro 107 XBlkCn", "IBM3270", "MLB-TTIndulekha", "PujeetaItalic", "Bookman Old Style Bold", "Latin Modern Sans", "ELEGANCE", "GhorautraMJ", "MMExtra Bold", "Rockwell Nova Cond", "Minion Pro Cond", "Brandon Grotesque Medium", "HGHeiseiKakugothictaiW9", "Euphemia UCAS Italic", ".VnUniverseH", "Avenir Book", "ZapfHumnst Ult BT", "Diwani Simple Striped", "Myriad Pro Bold SemiCondensed", "Raleway SemiBold Italic", "Z@R1751.tmp", "Hypatia Sans Pro Black", "linew10", ".VnCooperH", "Adobe Ming Std", "BlairMdITC TT Medium", "FML-TTIndulekhaHeavy", "Ruach LET", "ML-TTJyothy", "Latin Modern Mono Prop", "ML-NILA04", "TeX Gyre Pagella", "Roboto Slab", "eurb7", "PFFuelPro-Regular", "eurb5", "MMGreek Bold", "Oswald Stencil Bold", "Georgia Bold", "Noto Serif Thai", "Selena", "Perpetua Titling MT Bold", "ColdSpaghetti BTN", "Courier Oblique", "Dosis Medium", "Canter Bold Shadow", "St Marie Thin", "FML-TTGopika", "STIXIntegralsSm-Bold", "MMEtc Italic", "CHANL", "Yu Gothic UI", "KacstNaskh", "VNI-Palatin", "GFS Porson", "ML-TTAswathi", "Myriad Pro Condensed Italic", "Avenir Next Italic", "WP ArabicScript Sihafa", "Euclid Symbol Bold", "Myriad Pro Semibold Condensed", "PT Bold Broken", "Goudy Old Style Bold", "Racing Sans One", "Bentham", "Gotham Book Italic", "Asimov", "Avenir Next W1G Light", "Ashwariya", "Myriad Pro Light Italic", "VNI Helve Condense", "Songti TC Regular", "Verdana Italic", "Nexa XBold Italic", "Source Sans Pro", "Dingbats", "OCR-A II", "Deneane", "MMExtra Bold Italic", "Wellfleet", "Jazz LET Plain:1.0", "STIXIntegralsSm-Regular", "MMa CenturyK", "Javanese Text", "Nova Script", "Arial Hebrew Bold", "PCMyungjo Regular", "Bhuma", "MMa CenturyS", "Quicksand Dash", "Montserrat Bold", "Jokerman Alts LET", "Floraless", "SF Compact Rounded Semibold", "URW Gothic L", "BadaBoom BB", "Cantarell Oblique", "Brush Script MT Italic", "Raanana Bold", ".VnArialH", "IPAPGothic", "BN-TTDurga", "WP MultinationalB Courier", "Germanica", "Paralucent Demi Bold Italic", "Proxima Nova Soft Medium", "Myriad Hebrew Bold", "Telugu MN Bold", "WP MathA", "Proxima Nova Condensed Light Italic", "IDAutomationPDF417n5", "Times New Roman Greek", "FML-TTKaumudi", "SF Compact Rounded Bold", "Tinos Bold Italic for Powerline", "Lantinghei TC", "Stylus BT", "Soho Gothic Pro Medium", "Broken Planewing", "MMa Relation Bold Italic", "MMCenturyNew Bold Italic", "Droid Sans Ethiopic", "3M Circular TT Bold", "IDAutomationPDF417n2", "Lato Black Italic", "Liberation Sans", "Sofia", "Paralucent Light Italic", "Dancing Script", "DholeshwariMJ", "eufm10", "Palatino Linotype Bold", "Candy Round BTN", "12x10", "Rupee Foradian", "SchoolHouse Cursive B", "Stone Sans Sem ITC TT Semi", "Coda", "Sneakerhead BTN Condensed", "Merriweather Light Italic", "System Font Ultralight", "Akshar Unicode", "Lato Italic", "Kohinoor Bangla Medium", "ChandrabatiMatraOMJ", "Futura LT Bold", "Helvetica Bold", "Arvo", "Coolvetica", "AR BLANCA", "PingFang HK Regular", "Arial Narrow Italic", "cmtex9", "cmtex8", "Fren", "MMa Negate S", "Minion Pro Medium Italic", "SWED", "ITF Devanagari Marathi Light", "athletic", "Pointedly Mad", "Farsi Simple Outline", "Yuppy TC", "Noto Sans Lao UI", ".VnShelley Allegro", "Quinhon", "Courier Bold", "Carrois Gothic SC", "PT Serif Bold Italic", "ML-TTKanika", "Avenir Next W1G Regular", "GrilledCheese BTN Toasted", "QuiverItal", "Kanalisirung", "FML-TTJaya", "HelveticaNeueLT Pro 53 Ex", "Cut Me Out", "Khmer MN Bold", "Skia Light", "Garamond Italic", "GothicG", "Autour One", "Opus PlainChords", "Symbol Tiger", "Lucida Fax Demibold", "Athelas", "Linux Libertine Initials O", "STIXIntegralsUp-Bold", "MMa VariableD SS", "VNI-Aztek", "MLW-TTKarthika", "ML-TTChithira", "Superclarendon Regular", "Z@R185D.tmp", ".VnPresent", "MMa Etc Italic", "ADMUI3Lg", "Brandon Grotesque Black", "Avenir Next Condensed Italic", "Circular Std Black", "Futura LT Extra Bold Oblique", "KanchanOMJ", "cmcsc10", ".VnCommercial Script", "Mathilde", "GangaSagarMJ", "Nunito Light", "Code39AzaleaRegular3", "Code39AzaleaRegular2", "MMa Variable", "STIXSizeTwoSym-Regular", "Arabic Transparent", "Kufi Extended Outline", "Myriad Pro Bold SemiExtended Italic", "Titillium Thin Italic", "Aileron Heavy", "Noto Serif Lao", "Web Serveroff", "Sauce Code Powerline Bold", "Yuanti TC Bold", "Noto Sans Bamum", "Calisto MT Italic", "Myriad Arabic Bold Italic", "uni 05", "Noto Sans Runic", "Sue Ellen Francisco", "Hiragino Mincho Pro", "GENUINE", "FML-TTVarsha", "Lucida Grande", "Playfair Display SC Black Italic", "Avenir Heavy Oblique", "GaneshExtraBold", "MMa CenturySS Bold", "STIXSizeThreeSym-Bold", "Kozuka Gothic Pro", "KalegongaMJ", "Lucida Sans Typewriter Regular", "Judson", "YuMincho  36p Kana Demibold", "FML-TTVisakham", "Trade Gothic LT Std Condensed No. 18 Oblique", "Myriad Pro Semibold SemiCondensed", "Segoe UI Emoji", "Ubuntu Mono", "ChitraOMJ", "DejaVu Sans Mono Bold Oblique for Powerline", "Noto Sans Avestan", "Piranesi It BT", "PrimaSans BT", "Mshtakan Oblique", "Adamsky SF", "Roboto Thin", "Reklame Script Regular", "Lato Regular", "Myriad Arabic", "Vollkorn Bold", "New Peninim MT Inclined", "HGHangle", "Desdemona", "KievitPro-Regular", "Arno Pro Smbd SmText", "Rotis Sans Serif Std 55 Regular", "Gill Sans Bold", "Euclid Bold", "Charter Black", ".VnMysticalH", "Rakesly Ul", "Vogue-ExtraBold", "ITAN", "Mishafi Regular", ".VnRevue", "Mishafi", "Old Antic Decorative", "Sukhumvit Set Light", "Photoshop Small", "TAU-Kambar", "Magic School One", "Trajan Pro 3", "Rage Italic LET", "cmfib8", "Xirod", "Nimbus Sans L", "Sacred Geometry", "ELANGO-TML-Panchali-Normal", "Gill Sans MT Bold", "Droid Sans Hebrew", "CL", "MMa Extra SS", "HelveticaNeueLT Pro 75 BdOu", "FML-TTAswathi", "NATURALBORN", "Pleasantly Plump", "Blackletter686 BT", "Yuppy SC Regular", "Arno Pro Smbd", "Engl", "Times New Roman Cyr", "Gill Sans MT Bold Italic", "Myriad Pro Light SemiCondensed", "YuMincho Demibold", "Canter Light", "Broadway Copyist Text Ext", "Marquisette BTN", "Nova Cut", "Rumburak", "PT Bold Heading", "TeX Gyre Termes", "Dollar", "System Font Regular", "SWItalc", "Noto Sans Devanagari", "AV-Font-Hin1", "DejaVu Sans Condensed", "Huxley Titling", "Roboto Bold", "Noto Sans Cypriot", "HelveticaNeueLT Pro 25 UltLt", "Distant Galaxy", "Nueva Std Italic", "SWItalt", "HELTERSKELTER", "Adobe Gothic Std", "Avenir Next W1G Italic", "KacstTitle", "Symap", "Ancuu", "cmmib7", "Chaparral Pro Italic", "STIXGeneral-BoldItalic", "MMNegate Bold Italic", "Birch Std", "Silom", "Futura Light BT", "Leelawadee UI", "Proxy 7", "Proxy 6", "Proxy 5", "Proxy 4", "Proxy 3", "MT Extra Tiger", "Proxy 1", "Clarendon Hv BT", "Lantinghei TC Demibold", "Stone Sans ITC TT Bold", "Accord SF", "Book Antiqua Italic", "ML-TTNarmadaExBold", "Proxy 9", "Proxy 8", "Futura Medium BT", "YuMincho", "Lucida Blackletter", "Noto Sans Gujarati", "Z@R13D5.tmp", "Belfast SF", "Yu Gothic UI Light", "Noto Sans Linear B", "kroeger 05", "Myriad Pro Semibold Condensed Italic", "Futura Condensed ExtraBold", "Roboto Regular", "Broadway BT", "LeviBrush", "Verdana Pro Cond Black", "Bebas Neue Light", "Yuanti SC", "Futura Std Medium Condensed", "Diwan Thuluth", "EngraverTextH", "cmmi10", "HelveticaNeueLT Pro 47 LtCn", "Verdana Bold Italic", "Proxima Nova Rg", "Lucida Fax Regular", "System Font Medium Italic", "Didot Bold", "Hack Bold Italic", "HelveticaNeueLT Std", "Segoe WP Semibold", "Constantia Bold", "Futura LT Medium Oblique", "VNI-Univer", "TAM-Shree800", "EngraverTextT", "Baby Kruffy", "David Transparent", "HGSHeiseiMinchotaiW3", "Fira Mono Medium for Powerline", "PT Sans Narrow Bold", "header 08", "Mesquite Std", "HucklebuckJF", "MANDELA", "KacstArt", "MMa Arrow S", "Gridnik", "Adobe Gurmukhi Bold", "Noto Sans Lao", "cmsy10orig", "Asana Math", "Adobe Caslon Pro Semibold Italic", ".VnPresentH", ".VnClarendonH", "Lao MN Bold", "Titillium Thin", "Vivian", "RomanD", "ISOCP2", "Logo3Mv3tt", "QTOptimum Bold", "Baghdad", "Cantarell Bold", "Myriad Pro SemiExt", "American Typewriter Light", "Avenir Next W1G Thin Italic", "Libian SC", "Sitka Small", "Noto Sans Saurashtra", "Averia Sans", "Interstate-Bold", "Tw Cen MT Bold", "wgl4", "eusb10", "AlekyaThin", "HelveticaNeueLT Pro 65 Md", "SaiIndira", "RomanS", "MMa CenturyKS Bold Italic", "58", "VNtimes new roman", "MMa Binary Italic", "55", "Holiday Springs BTN", "57", "Roboto Mono Thin for Powerline", "51", "Adobe Gothic Std B", "52", "HelveticaNeueLT Std Cn", "Noto Sans Gurmukhi", "PT Mono Bold", "Bastion", "FML-TTChithira", "54", "Lohit Tamil", "Yellowtail", "VNI-Helve", "Diwani Simple Outline 2", "ML-TTIndulekha", "Incised901 Ct BT", "Verona", "56", "Calligraffitti", "Eurostile Bold", "Rockwell Nova Extra Bold", "Gill Sans Italic", "SF Compact Rounded Regular", "SWMeteo", "GothicI", "Chewy", "53", "Lato Thin", "TeX Gyre Bonum", "URW Bookman L", "Hannotate SC Regular", "ElegantIcons", "MMa CenturyK Italic", "GROBOLD", "Bookshelf Symbol 2", "PingFang TC Light", "Playfair Display SC", "Century Schoolbook Bold", "Apple SD Gothic Neo UltraLight", "Napa SF", "cnefonts", "STIXIntegralsUp", "Corsiva Hebrew Bold", "Zapfino Extra LT Ligatures", "Stencil Std", "Type Embellishments One LET", "Iowan Old Style Bold", "Lucida Sans Typewriter Bold Oblique", "Myriad Pro Regular", "Bell Gothic Std Bold", "Bodoni 72 Oldstyle Bold", "IchamotiOMJ", "AV-Font-Ben1", "STIXGeneral", "Gujarati Sangam MN Bold", "Adobe Caslon Pro Semibold", "Mallige", "VNI-Bazooka", "Perpetua Bold", "Roboto Condensed Italic", "MMa Etc Bold Italic", "Avenir Black Oblique", "Muli Light Italic", "Padauk Book", "PT Mono", "Museo Sans 300", "Code39AzaleaRegular1", "STIXSizeOneSym-Bold", "MMExtra Italic", "Rundkursiv", "Times New Roman Bold Italic", "OldDreadfulNo7 BT", "Bitstream Vera Serif", "Cousine Italic for Powerline", "Freehand", "Roboto Italic", "Droid Serif", "Lato Thin Italic", "MMCenturyOld", "VAGRounded BT", "Digital Readout Upright", "Noto Sans Glagolitic", "Old Antic Outline", "Bickham Script Pro 3 Bold", "AlternateGothic2 BT", "Enliven", "Kohinoor Telugu Medium", "ESTO", "Noto Sans Lisu", "Smarty Pants BTN", "Syastro", "WP TypographicSymbols", "Kristi", "Hoefler Text Ornaments", "Courier New CYR", "Albany AMT", "Granjon Bold", "Inconsolata", "Sorts Mill Goudy", "MMa VariableC S", "cmbsy6", "Noto Sans Osmanya", "Farsi Simple Bold", "GreekS", "cmbsy7", ".VnKoalaH", "DhonooOMJ", "cmbsy8", "Euclid Math One Bold", "Swiss 721", "Ubuntu", "GreekC", "VNI-Bandit", "URW Palladio L", "YuMincho  36p Kana", "Sanpya", "MMa GreekSS", "eufm9", "Weibei TC", "Myriad Pro Black SemiExtended Italic", "Bebas Neue Book", "Menlo Bold Italic", "eufm5", "Soho Gothic Pro Thin Italic", "NBP Informa FiveThree", "Noto Serif Armenian", "DejaVu Sans Mono Bold for Powerline", "Trade Gothic LT Std Oblique", ".VnBook-Antiqua", "Humanst521 XBd BT", "Diavlo Bold", "WP CyrillicA", "WP CyrillicB", "ITF Devanagari Medium", "Franklin Gothic Medium", "FML-TTChithiraHeavy", "ML-TTDevika", "Superclarendon Light", "balonez fantasia", "Sitka Text", "Skia Black", "cmbx12", "ML-TTKamini", "Alegreya Sans SC", "Linux Libertine Display G", "Italic", "PT Sans Bold", "Opus Special Extra", "Gurmukhi Sangam MN", "FML-TTOnam", "ML-TTRevathi", "Hiragino Mincho Pro W3", "BongshaiMJ", "Adobe Hebrew", "Optima ExtraBlack", "Hiragino Mincho Pro W6", "Kundli English", "Luminari", " 20", "Courier MM Screenwriter Italic", "HelveticaNeue MediumCond", "Swiss 721 Extended", "cmmi8", "GFS Didot Classic", "Myriad Pro Light Condensed", "PoetsenOne", "Helvetica Neue Light", "monooge 05", "cmmi7", "cmmi6", "cmmi5", "Tiger Expert", "Latin Modern Mono Caps", "Learning Curve Pro", "RamuScriptMedium", "Source Sans Pro Semibold Italic", "cmmib10", "KabinLightDB Bold", "ParvathiThin", "Belwe Bd BT", "DV-TTYogesh", "Russel Write TT", "DINPro-Black", "GaneshBlack", "Carbon Block", "Romantic", "Valerie Hand", "Harrington Bold", "Bauer Bodoni Std 1 Roman", "AV-Font-Symbol", "Palatino Bold Italic", "Nanum Brush Script", "Noto Sans Egyptian Hieroglyphs", "Paralucent ExtraLight Italic", "Proxima Nova Semibold", "SF Slapstick Comic Shaded Oblique", "Prestige Elite Std Bold", "FML-TTVaisali", "ITF Devanagari Marathi Medium", "Arial Hebrew Scholar", "Lohit Gujarati", "FML-TTChandrika", "Calisto MT Bold Italic", "SignPainter-HouseScript Semibold", "Nirmala UI", "Hiragino Kaku Gothic ProN W6", "HelveticaNeueLT Pro 57 Cn", "Hiragino Kaku Gothic ProN W3", "Skia Light Condensed", "LT-ET-Ramya", "WenQuanYi Micro Hei Mono", "ML-TTAshtamudi", "Bank Gothic Light", "EngraverFontExtras", "Swiss 721 Condensed", "PT Sans Caption", "Georgia Pro Cond Black", "Noto Sans Tifinagh", "Latin Modern Roman Demi", "News Gothic MT", "Open Sans Semibold Italic", "Snell Roundhand Bold", "VNI-Stylus", "GaneshNarrow", "Gotham", "DhorolaOMJ", "Seravek Bold", "mixtapeMike", "Pacifico", "Perpetua Bold Italic", "Gayathri", "MMa Variable Bold", "croissant sandwich", "TSCu", "CSongGB18030C-Light", "Nixie One", "Myriad Pro Black Italic", "TG Termes Math", "Kaiti TC Regular", "0", "Bree Serif", "C-MediumHWL", "YuGothic Medium", "System Font Bold Italic G3", "ML-TTOnam", "Trocchi", "Noto Sans Kharoshthi", "Gill Sans Nova Cond", "Abril Fatface", "36p Kana Medium", "cmdunh10", "Merriweather Bold", "MMa Fermat Bold", "MMa CenturyK Bold", "TitilliumText22L-Thin", "TLUrdu", "MLB-TTAswathi", "Rocket Arabic Fixed", "American Typewriter Condensed Light", "John Handy LET", "Gill Sans SemiBold", "Tuyenduc", "System Font Semibold Italic", "Nexa Thin Italic", "MMExtra", "VNI-Park", "Gen W01 Light", "Futura Heavy Oblique", "SymbolProp BT", "Cantarell Regular", "FML-Leela", "Avenir Next W1G Heavy", "STIXIntegralsUpSm", "KalindiMJ", "Garamond Premr Pro", "msam9", "HelveticaNeueLT Std Blk Cn", "Lato Hairline", "KG Neatly Printed", "Proxima Nova Semibold Italic", "Gravur Condensed Light", "Webdunia", "msam7", "Times New Roman TUR", "msam5", "SHELMAN", "Banmai Times", "Bodoni 72 Oldstyle Book", "Dosis", "Museo Sans 100", "Roboto Slab Regular", "Al Nile", "Gravity", "LT-TM-Barani", "Cochin Bold Italic", "Opus", "ML-TTChithiraHeavy", "Rockwell Italic", "HanziPen TC Bold", "A Sensible Armadillo", "Hack Italic", "Terminator Two", "HelveticaNeueLT Std UltLt Cn", "Noto Sans Cuneiform", "Yu Mincho Light", "News Gothic MT Bold", "Avenir Next Regular", "Ubuntu Light", "Rouge Script", "SWLink", "ML-TTGuruvayur", "Lato Bold", "IPAexMincho", "Chalkboard Bold", "ABSALOM", "Sigmar", "Museo 500 Regular", "Stone Sans ITC TT", "Franklin Gothic Medium Cond", "Geeza Pro Bold", "Ml", "Khmer OS", "Futura Std Medium", "SC", "HelveticaNeueLT Std UltLt Ext", "Incised901 Nd BT", "ML-TTMangalaExBold", "Arial Nova Cond", "Droid Sans Fallback", "Noto Sans Carian", "CommercialScript BT", "Roboto Condensed", "Kokonor Regular", "Kievit Offc Pro", "Arial Hebrew Scholar Bold", "FML-TTGuruvayur", "Nexa Black Italic", "Garamond Premr Pro Smbd", "ML-TTSruthy", "WP MathExtendedA", "PT Sans Bold Italic", "CSongGB18030C-LightHWL", "Finale Copyist Text Ext", "Kohinoor Bangla Light", "eusm6", "Sinhala MN", "Soho Gothic Pro Regular", "Open Sans Bold Italic", "eusm5", "Herculanum", "ML1-TTAswathi", "BhagirathiOMJ", "PilGi", "Adobe Garamond Pro Bold", "Titillium", "DecoType Naskh Variants", "Wawati TC", "Kozuka Gothic Pro R", "BaluBold", "SketchFlow Print", "Opus Percussion", ".VnTeknical", "Sniglet", "Noto Sans Hanunoo", "Lingoes Unicode", "Sketch Block", "Lato Semibold", "Kozuka Gothic Pro B", "Verdana Pro", "Kozuka Gothic Pro M", "Kozuka Gothic Pro L", "Kozuka Gothic Pro H", "VNI-Swiss-Condense", "Roboto Mono for Powerline", "SF Slapstick Comic Shaded", "Mukti Narrow", "Baskerville Bold Italic", ".VnArial NarrowH", "Opus Metronome", "Xingkai SC Light", "Gotham Bold", "Tiger", "VNI-Awchon", "Accent SF", "Baron Neue Italic", "Boogaloo", "Finale AlphaNotes", "Optima Regular", "Apple Braille Pinpoint 8 Dot", "IPAPMincho", "Blackout", "Noto Sans Old Turkic", "Calibri Italic", "SWRomnt", "MaestroTimes", "Open Sans Light", "SWRomns", "Tsukushi B Round Gothic Bold", "NanumMyeongjo Bold", "VNI-DesdemonaU", "Avenir Next Demi Bold Italic", "MMSchoolRD Bold", "SWRomnc", "Baoli SC", "Leitura Display Roman", "Savoye LET Plain:1.0", "DIN-RegularAlternate", "HeadLineA Regular", "Charter", "KacstPen", "header 17", "Hiragino Kaku Gothic Pro W3", "Hiragino Maru Gothic ProN", "Adobe Naskh", "RUMA", "Liberation Sans Narrow", "Corbel Bold", "Noto Sans Tai Le", "Valluvan", "Soho Gothic Pro Thin", "Modena printed", "News Gothic MT Alt 5", "Avenir Next Condensed Bold Italic", "VNI-Centur", "Avenir Next Condensed Medium", "STIXSizeFourSym-Bold", "TAMElango", "cmsltt10", "Letter Gothic Std Slanted", "Noto Sans Coptic", "Firenze SF", "Six Caps", "Fira Mono", "Kohinoor Devanagari Semibold", "Rockwell Nova", "Biko", "Gurmukhi MN Bold", "IguanaLover BTN", "Induction", "FML-TTNarmadaExBold", "Walter", "CAC Champagne", "Ubuntu Mono derivative Powerline Italic", ".VnVogueH", "Myriad Pro Black", "cnefont", "Helvetica Neue Italic", "HERMAN", "1", "standard 07", "Myanmar Text", "Deepa", "Shree Devanagari 714", "Balthazar", "Klee Demibold", "standard 09", "Geeza Pro Regular", "Cinema Gothic BTN Shadow", "PT Simple Bold Ruled", "IRIS", "Myriad Web Pro Condensed", "VNI-Bauhaus", "LuzSans-Light", "Futura Medium Oblique", "Kailasa Bold", "Smudger Alts LET", "VNI-Standout", "Noto Sans Thai UI", "eurm10", "MMa Etc S", "Corporate", "Detente", "Adobe Devanagari Bold Italic", "Sinhala MN Bold", "Linux Biolinum O", "HelveticaNeueLT Pro 27 UltLtCn", "Linux Biolinum G", "Airstream", "AR DECODE", "Alien Encounters", "VNI-Wide Latin", "Tlwg Mono", "eurm8", "fox in the snow", "eurm6", "eurm7", "Euclid", "eurm5", "Noto Sans CJK SC", "Perpetua Titling MT Light", "Swis721 Ex BT", "Roboto Mono Thin Italic for Powerline", "Garamond Premier Pro", "gargi", "Futura Light Condensed BT", "Museo 700 Regular", "Placard MT Condensed", "Euro Sign", "Persia BT", "Circular Std Medium", "Nexa Book Italic", "TakaoPGothic", "Dutch 801 Roman", "Waverly", "ML-TTPeriyar", "Trade Gothic LT Std Light Oblique", "PT Bold Dusky", "Tw Cen MT Bold Italic", "GentiumAlt", "Damascus Regular", "Hiragino Mincho ProN W6", "Devanagari Sangam MN", "Hiragino Mincho ProN W3", "Z@R1774.tmp", "Avenir Next Condensed Medium Italic", "Opus Japanese Chords", "Noto Sans Thai", "Adobe Caslon Pro", "Kannada MN", ".VnVogue", "Nobile", "New Peninim MT Bold", "Meiryo Italic", "Roboto Mono Italic for Powerline", "GFS Complutum", "Verdana Pro Cond SemiBold", "Augusta", "Old Antic Outline Shaded", "Malayalam Sangam MN Bold", "DS Crystal", "Purisa", "Adobe Hebrew Bold Italic", "Iowan Old Style Black", "Razer Header Regular", "Monospac821 BT", "Kohinoor Devanagari", "Diwan Kufi Regular", "Droid Sans Japanese", "Lucida Fax Demibold Italic", "Minion Pro Bold Italic", "Marion Italic", "Raleway ExtraLight", "ArhialkhanMJ", "VNI-Souvir", "Kaiti TC", "Umpush", "Candy Round BTN Cond Lt", "ML-TTThunchan", "BorhalMJ", "PingFang TC Regular", "Futura Medium", "System Font Semibold", "Roboto Slab Bold", "Fanwood", "Muli Light", "Raisin des Sables", "DFMaruGothic-Md", "Al Bayan Bold", "Noto Sans Mongolian", "Apple Symbols", "Muli Italic", "Z@R1828.tmp", "Source Sans Pro Bold", "NanumGothic", "MMRelation Italic", "Noto Sans New Tai Lue", "RaghuMalayalam", "LetterOMatic!", "Seravek Light", "Baskerville Bold", "MMGreek Bold Italic", "QumpellkaNo12", "GFS Olga", "Times Italic", "Futura Book BT", "Glockenspiel", "KanchanMJ", "EngraverFontSet", "MMa Binary", "BN Jinx", "Nova Flat", "Yeseva One", "Bauer Bodoni Std 1 Bold Italic", "Kohinoor Telugu Semibold", "TeX Gyre Heros", "Georgia Pro Cond SemiBold", "MMa Variable2 S", "Inconsolata-g for Powerline", "Simple Bold Jut Out", "JLS Space GothicR NC", "Circular Std Medium Italic", "ML-TTAparna", "Damascus Semi Bold", "Opus Roman Chords", "MS Dialog Light", "MMa Negate", "Chaparral Pro Light", "Opus Note Names", "Symbol Tiger Expert", "SWComp", "Cooper Std Black", "JazzText", "Langdon", "FML-Mohini", "Proxima Nova Regular Italic", "Raleway ExtraBold Italic", "cmtt12", "DejaVu Sans Mono Oblique for Powerline", "HUNTSON", "Cantho", "SWMusic", "GENISO", "STHupo", "Pricedown", "Geotype TT", "schoenecker 10", "Photoshop Large", "JACKIE", "Averia", "Granjon Roman", "Code39AzaleaNarrow1", "Andong", "Code39AzaleaNarrow3", "Code39AzaleaNarrow2", "Nexa Black", "FML-TTPeriyar", "Pirate", "Formata Medium Condensed", "Minerva", "Futura LT Book", "Kozuka Mincho Pro", "LittleLordFontleroy", "Adobe Song Std L", "SWIsop2", "SWIsop3", "STIXIntegralsSm", "SWIsop1", "Pothana2000", "TAU-Valluvar", "FML-TTLeela", "BOUTON International Symbols", "FontAwesome", "Menlo Italic", "MMa TextBook", "Gothic720 BT", "SF Slapstick Comic Bold", "QuickType II Condensed", "Bodoni 72 Oldstyle Book Italic", ".Vn3DH", "HelveticaNeueLT Std Bold Outln", "Lohit Punjabi", "Kaiti SC Black", "HKSCS-ExtB", "Modern No", "Blackmoor LET Plain:2.0", "MMa Century Bold Italic", "Code39AzaleaWide3", "Code39AzaleaWide2", "Code39AzaleaWide1", "19", "Phatdiem", "ML-TTAyilyamBold", "Avinor", "Adobe Devanagari", "Al Tarikh Regular", "Zolano Sans BTN", "Drivebye 2", "Drivebye 3", "Ultra", "Drivebye 1", "Drivebye 4", "Sneakerhead BTN Shadow", "Songti SC Black", "Radha", "MMa Relation S", "Ventilla Script", "eufm8", "Stone Sans OS ITC TT Bold", "GFS Solomos", ".VnCentury Schoolbook", "Nexa Thin", "Bordeaux Roman Bold LET Plain:1.0", "Euclid Math Two", "EngraverTextNCS", "Meiryo Bold Italic", "Cooper Std Black Italic", "DynameBlackSSK", "GaneshThin", "LTHYSZK", "Noto Sans Hebrew", "AnjaliOldLipi", "Meslo LG M Regular for Powerline", "Silent Reaction", "VNI-Free", "Montserrat Extra Bold", "Avenir Next", "Apple Braille Pinpoint 6 Dot", "CommercialPi BT", "CopprplGoth BT", "GJ-TTAvantika", "monofur bold for Powerline", "Arial (Arabic)", "Courier Std", "FML-TTSwathyBold", "Avenir Oblique", "eufm6", "SuperFrench", "Montserrat", "Gillius ADF No2 Cd", "Lantinghei SC Demibold", "Gill Sans Nova Light", "HGHeiseiMinchotaiW3", "Lato Black", "Rod Transparent", "Malayalam MN Bold", "Euclid Fraktur Bold", "VNI-Boston Black", "ML-TTLeela", "INSPECTIONXPERT GDT FRAMES", "Bebas Neue Thin", "mry", "eufm7", "SWMap", "Proxima Nova Condensed Light", "cmbxti10", "Nexa Regular", "Lucida Bright Demibold Italic", "Optima LT Std", "Georgia Pro Black", "Titillium Semibold Italic", "ParkAvenue BT", "Franklin Gothic Medium Italic", "PujeetaNarrow", "Daclac", "Xpress Heavy SF", "Tibetan Machine Uni", "DecoType Naskh Swashes", "MMa TextBook Bold Italic", "Titillium Thin Upright", "Roland", ".VnCooper", "Stephen", "Kino MT", "HelvLight", "Eurostile", "Helvetica Neue Thin", "Orator Std Slanted", "cmvtt10", "MMCenturyNew Italic", "DIN-Regular", "Futura Book Oblique", "Hack Regular", "Nanum Gothic", "SaiMeera", "Apple SD Gothic Neo Thin", "Source Code Pro ExtraLight", "Myriad Pro Light SemiCond", "Bank Gothic Medium", "Swis721 Blk BT", "ChitraMJ", "MS Dialog", "Kokonor", "ChitraSMJ", "monofur for Powerline", "Samathwa", "Adobe Myungjo Std M", "ML-TTVarsha", "MMTextBookB Italic", "AV-Font-Mal1", "VN-NTime", "MMa Extra Bold Italic", "Paralucent Extra Light", "Grand Hotel", "MMRelation Bold", "NanumMyeongjo", "cmssdc10", "Z@R183A.tmp", "MMa Negate Italic", "VNI-Harrington", "Kruti Astro", "DYMObvba", "System Font Heavy", "cmtt9", "Avenir Next W1G Demi Italic", ".VnBook-AntiquaH", "La Bamba LET", "MMa Fraktur", "Parisian BT", "University Roman Alts LET", "Lobster", "Ideal Sans Book", "Lucida Grande Bold", "MMa VariableC Bold", "MMa Binary Bold", "Adobe Naskh Medium", "Vemana2000", "Opus Special", ".VnSouthern", "Swis721 BT", "ITF Devanagari Marathi", "PT Sans Narrow", "FML-TTRohini", ".VnMemorandum", "Siyam Rupali ANSI", "Segoe UI Semilight", "Rock Salt", "Santa Fe LET Plain:1.0", "ParvathiBold", "Superclarendon", "STIXIntegralsUpD-Regular", "Salilam", "Canter Bold", "FML-TTBeckalBold", "STIXIntegralsUp-Regular", "MMCenturyNew", "Georgia Pro Cond Light", "Arial Italic", "Nueva Std Bold Condensed", "Latin Modern Math", "FreeSans", "SAS Monospace Bold", "Tarzan", "STIX", "VnTimes", "Typewriter", "Arial TUR", "Urvasi", "Meslo LG L Regular for Powerline", "Sans", "cmr5", "ML-TTSuparna", "HelveticaNeueLT Pro 35 Th", "Lato Medium", "Futura Std Bold Condensed", "Trade Gothic LT Std Bold Oblique", "Thorndale AMT", "Sitka Display", "Complex", "Bobcat", "Kaiti TC Bold", "Hansen", "Rosewood Std", "VNI-DOS Sample Font", "Noto Sans Tagbanwa", "Razer Header Light", "Maestro Percussion", "Western Bang Bang", "Shorelines Script Bold", "Myriad Pro Bold Condensed Italic", "Kohinoor Telugu Bold", "SF Movie Poster", "Brandon Grotesque Bold", "lettau 06", "Z@R123A.tmp", "Linux Libertine Mono O", "Giadinh", "Yuanti SC Bold", "Rakesly Rg", "Accanthis ADF Std No3", "HooglyMJ", "Nunito", "HelveticaNeueLT Std Med", "Helvetica Neue Condensed Bold", "MMCenturyNew Bold", "WP Arabic Sihafa", "Archicoco", "Realvirtue", "MMa VariableA Bold", "MMVariableA", "Nimbus Roman No9 L", "MMVariableC", "MMVariableB", "64", "MMVariableD", "66", "MMVariableF", "68", "FML-TTAparna", "ML-TTGauriHeavy", "Chess Maya", "Special Elite", "Courier New TUR", "Kozuka Mincho Pro L", "Minion Pro Bold Cond Italic", "VISCII Sample Font", "Montserrat Semi Bold", "BriLliant", "LIVINGWELL", "MMa Variable S", "VNI-Jamai", "FML-TTSabari", "Binhlong", "AtraiMJ", "TeamViewer10", "TeamViewer11", "Broadway Copyist Text", "GoraiMJ", "HGSHeiseiMinchotaiW9", "Seravek Medium Italic", "Belwe Cn BT", "Vanilla", "WP Greek Helve", "Trocchi Bold", "Khmer MN", "Roboto Condensed Regular", "TitilliumText22L-Light", "Nexa Bold Italic", "cmss9", "cmss8", "IMG Symbols", "ML-TTBhavana", "Aldhabi", "Weibei SC Bold", "MMVariable2", "AL Cinderella", "Consolas Bold Italic", "Monoton", "Z@R16FD.tmp", "Gill Sans Bold Italic", "Khanhoa", "MMVariableD Bold", "Charter Bold Italic", "AnandapatraCMJ", "UniversalMath1 BT", "Janaranjani", "TeamViewer9", "Days Regular", "Times New Roman CE", "Futura Bold Oblique", "VNI-Korin", "msbm5", "HelveticaNeueLT Pro 23 UltLtEx", "Spirituality", "Sitka Heading", "KasseFLF", "TeX Gyre Heros Cn", "Bebas Neue Bold", "Henny Penny", "JugantorMJ", "Trebuchet MS Bold", "Raleway Thin Italic", "Lucida Bright Demibold", "Prestige Elite Std", "HGMinchoL", "SonicCutThru Hv BT", "BuiltTitlingRg-BoldItalic", "Bickham Script Pro 3", ".VnBodoni", "Jazz", "MYingHei", "Muna", "Lato", "Minisystem", "BurigangaMJ", "Hoefler Text Black Italic", "Andale Sans for VST", "Diavlo Book", ".VnArabia", "Big Caslon Medium", "Titillium Semibold", "Mishafi Gold Regular", "Qaskin Black Personal Use", "cmssbx10", "Oxygen", "msbm7", "cmmi9", "Aileron Light", "KacstOffice", "Libian SC Regular", "IMG Baby", "Humanist", "Montserrat Hairline", "euex9", "euex7", "Courier 10 Pitch", "ML-TTMadhaviExBold", "AR DESTINE", "Shree-Mal-0502", "FML-TTAathira", "cmbxsl10", "FML-Indulekha", "PingFang SC Ultralight", "FML-Sruthy", "FML-TTGauriHeavy", "Adobe Fan Heiti Std B", "Avenir Heavy", "cmex8", "Hiragino Sans GB W6", "STIXIntegralsUpD", "line10", "Futura LT Condensed Bold Oblique", "Admisi Display SSi", "cmex7", "Casual", "CASMIRA", ".VnLucida sans", "STIXGeneral-Regular", "Nueva Std Bold Condensed Italic", "HGPHeiseiMinchotaiW9", "Klee Medium", "Accord Heavy SF", "MMCenturyOld Italic", "STIXNonUnicode-Italic", "Fira Mono Bold for Powerline", "Hadong", "ML-TTAathira", "3ds Light", "AR DARLING", "Bifurk", "NanumGothic ExtraBold", "Baghdad Regular", "FML-TTThunchan", "Vodafone Rg", "GFS Neohellenic", "Quicksand", "Times New Roman Bold", "PingFang TC Medium", "Technic", "Adobe Kaiti Std R", "HGPHeiseiMinchotaiW3", "Gen W01", "HelveticaNeueLT Std Lt Ext", ".VnPark", "Avenir Next W1G Bold Italic", "Roboto Black", "New Renex Special Graphics", "Brush Script Std", "Segoe UI Historic", "DejaVu Sans", "ML-TTKala", "Kohinoor Devanagari Demi", "VNI-Hobo", "GangaMJ", "FML-TTRevathi", "Sauce Code Powerline Semibold", "Open Sans Bold", "WP MultinationalA Courier", "MMa CenturySS Bold Italic", "Kohinoor Telugu", "VNI-StageCoach", "HanziPen TC Regular", "Reginet", "Helvetica Neue Medium Italic", "Helvetica Neue Condensed Black", "ML-TTAnakha", "Yuanti TC Light", "65", "Avenir Next Bold Italic", "GF Zemen Unicode", "Ice kingdom", "Gotham Narrow Book", "Army", "Latin Modern Sans Quotation", "Moonbeam", "67", "Microsoft YaHei UI Light", "Bell MT Italic", "Myriad Arabic Bold", "Lohit Bengali", "Lato Hairline Italic", "AppleGothic", "Titan One", "Lantinghei SC", "Myriad Pro Black Condensed", "Orator Std Medium", "Kozuka Gothic Pro EL", "Hollywood Hills", "Tekton Pro Cond", "Franklin Gothic Book Italic", "ANDROID ROBOT", "Diwan Kufi", "Dutch801 Rm BT", "future", "Divya", "Tlwg Typo", "Xingkai SC", "Open Sans", "SutonnyMJ", "Source Code Pro Semibold", "Neo Sans Pro Light", "FML-TTMalavika", "Proxima Nova Condensed", "Myriad Pro Black SemiExtended", "cmtt8", "Paralucent Demi Bold", "3M Circular TT Light", "VNI-Tubes", "HelveticaNeueLT Pro 37 ThCn", "Farah Regular", "VNI-Duff", "cmmib6", "ML-TTChandrika", "Amatic", "Khalid Art bold", "cmmib8", "cmmib9", "Ela Sans Light Caps", "SF Compact Rounded Ultralight", "Malgun Gothic Semilight", "Latienne Pro Italic", "Cortoba", "Paralucent Heavy", "VNI-Lithos", "Shree-Tel-0900", "MMGreek Italic", "FML-TTJyothy", "HelveticaNeueLT Pro 43 LtEx", "Leitura Display Italic", "Ostrich Sans", ".VnBahamasB", "Gill Sans UltraBold", "FML-Padmanabha", "Myriad Pro Light", "PT Serif Italic", "MMBinary Bold", "Autumn", "STIXVariants-Regular", "Archive", "Math3", "Math2", "Math1", "FML-TTSarada", "Euclid Math One", "Futura LT Condensed Medium Oblique", "Math4", "Franklin Gothic Book", "AR CARTER", "Xpress SF", "System Font Light", "Literation Mono Powerline Bold Italic", "Lato Semibold Italic", "SymbolMono BT", "HGPHeiseiKakugothictaiW5", "HGPHeiseiKakugothictaiW3", "Waree", "PingFang TC Thin", "Myriad Pro Black Cond", "Adobe Heiti Std R", "Learning Curve Dashed Pro", "Smokum", "Noto Sans Yi", "HelveticaNeueLT Std Thin Cn", "Mesquite Std Medium", "Blackoak Std", "kroeger 07", "ML-TTNanditha", "cmssi12", "Avenir Medium", "Droid Sans", "Finale Copyist Text", "Merriweather UltraBold Italic", "Kohinoor Devanagari Book", "Reklame Script Black", "System Font Regular G1", "Sabrina", "System Font Regular G3", "System Font Regular G2", "Arial Symbol", "Lantinghei TC Extralight", "cmbsy9", "Kozuka Gothic Pr6N", "Georgia Pro Light", "PT Bold Arch", "Phosphate", ".VnTifani Heavy", "MMa CenturyKS", "Logo3Mtt", "STHeiti", "MMNegate", "AV-Web-Tel1", "Opus Text", "PingFang HK Thin", "Playfair Display SC Bold", "Standard Symbols L", "BhagirathiMJ", "Bowlby One SC", "mono 08", "cmti7", "DigifaceWide", "PujeetaSpecial", "Avenir Next W1G Medium Italic", "Iowan Old Style Bold Italic", "Italic Outline Art", "cmu10", "MMa Negate SS", "Serifa Bold", "mono 07", "Dyuthi", "Sauce Code Powerline ExtraLight", "ae", "kroeger 04", "MMRelation", "Arno Pro Smbd Display", "MMRelation Bold Italic", "Microsoft YaHei UI", "Lucida Sans Regular", "FML-TTThiruvathira", "FREH", "Nova Round", "18030", "SWGreks", "PingFang SC Semibold", "Adobe Heiti Std", "IDAutomationPDF417n4", "cmssq8", "Zapfino Extra LT Four", "Verdana Pro Light", "Euclid Fraktur", "FlemishScript BT", "AV-Font-Sin1", "Monospace", "Gotham Black Italic", "Madre Script", "Droid Sans Mono", "TMBW-TTValluvar", "cafeta", "AR JULIAN", "cmtex10", "Oriya MN Bold", "Buxton Sketch", "HelveticaNeueLT Pro 45 Lt", "Minion Pro Bold Cond", "LiHei Pro", "Raleway Light", ".VnKoala", "System Font Light Italic", "Kiran", "Nueva Std Condensed Italic", "Proxima Nova Soft Semibold", "Circular Std Book", "Beirut Regular", "HelveticaNeueLT Pro 55 Roman", "AR DELANEY", "Candles", "Lucida Sans Demibold Italic", "Myriad Pro Bold Italic", "Seravek Italic", "Old English", "Uttara", "Formal436 BT", "Latin Modern Roman Slanted", "AcadEref", "Soho Gothic Pro Light", "Corbel Italic", "Z@R277C.tmp", "Microsoft JhengHei UI", "Lato Heavy Italic", "Trade Gothic LT Std Light", "Westwood LET", "Old Antic Bold", "Futura Std Heavy", "Euclid Symbol Italic", "Noteworthy Bold", "MMa CenturyKSS Bold", "Year supply of fairy cakes", "SutonnyOMJ", "Open Sans Extrabold Italic", "Tekton Pro Bold Condensed", "Chancery Cursive", "Quincho Script PERSONAL USE", "Modern Antiqua", "System Font Thin", "Merriweather Bold Italic", "Chaparral Pro Light Italic", "MMa CenturyKS Bold", "BolsterBold", "AVGmdBU", "Cir Arial", "Lithos Pro Black", "Papyrus Condensed", "Seravek Medium", "Noto Sans CJK TC", "MMa Greek Bold Italic", "HeadLineA", "MMVariableA Bold", "Times New Roman Italic", "Garuda", "Permanent Marker", "Yu Gothic UI Semilight", "Myriad Pro Black SemiCondensed", "Apple SD GothicNeo ExtraBold", "Norasi", "Arial Nova Light", "PondFreeBoss", "Avenir Light Oblique", "Alice and the Wicked Monster", "Arno Pro SmText", "GungSeo", "ori1Uni", "HelveticaNeueLT Std Blk", "DIN-LightAlternate", "MMa CenturyKSS", "MMa Relation SS", "VNI-Zap", "BN Machine", "Segoe MDL2 Assets", "Rotis Sans Serif Std 45 Light", ".VnGothicH", "Proxima Nova Bold Italic", "SAF", "Futura Light Italic BT", ".VnCourier", "Khmer Sangam MN", "BorakOMJ", "Roboto Mono Light Italic for Powerline", "ML-TTTheyyam", "Avenir Next Condensed Heavy Italic", "Caladea", "Noto Serif Georgian", "Charlemagne Std Bold", "HGHeiseiKakugothictaiW5", "HGHeiseiKakugothictaiW3", "BerlingRoman", "Source Sans Pro Light Italic", "Helvetica Neue UltraLight", "stmary10", "Sketch Match", "Songti TC", "Square721 BT", "MMa VariableA SS", "AV-Font-Guj1", "Georgia Pro", "DhorolaMJ", "Yuanti SC Regular", "Roboto Mono Light for Powerline", "Poplar Std Black", "Futura Light Oblique", "Hypatia Sans Pro ExtraLight", "ISOCPEUR", "Alternate Gothic No2 D", "Gillius ADF", "copy 10", "Noto Sans Ugaritic", "Yuanti TC", "Charlemagne Std", "Reswysokr", "ML-TTNila", "Pamela want a Bike to Ride", "Museo 100 Regular", "Montserrat Ultra Light", "System Font Bold G3", "System Font Bold G2", "System Font Bold G1", "ChandrabatiMatraMJ", "Noto Sans Tamil", "NeueHaasGroteskText Pro", "Savoye LET Plain CC.:1.0", "classic 10", "Droid Sans Georgian", "Merriweather Regular", "MMa Etc SS", "Devanagari Sangam MN Bold", "STIXSizeFiveSym", "Proxy 2", "MMEtc", "SOLIDWORKS GDT", "Superclarendon Italic", "TextilePiEF", "MMa Variable2", "Songti TC Bold", "STIXIntegralsD", "Monotype Koufi", "DIN Condensed", "Noto Sans Tamil UI", "Arial Baltic", "Terminal Greek 869", "Chess Berlin", "System Font UltraLight", "Microsoft YaHei Light", "AR Sans Serif", "FML-TTNalini", "Noto Sans NKo", "Joan", "Adobe Fan Heiti Std", "RomanC", "MMa Arrow Bold", "Verdana Pro Cond Light", "Kannada Sangam MN Bold", "Museo Sans 500", "Bitstream Vera Sans", "STIXSizeFiveSym-Regular", "DhakarchithiMJ", "Latin Modern Sans Demi Cond", "Czec", "GothicE", "IMG Extreme", "WST", "RomanT", "Adobe Arabic Bold Italic", "DINPro-Bold", "Century Schoolbook Bold Italic", ".VnBlack", "VNI-Fillmore", "Noto Sans Old Persian", "Dutch801 XBd BT", ".VnArial Narrow", "Sathu", "Avenir Next Medium Italic", "Lato Heavy", "MMVariableC Bold", "Simple Indust Shaded", "RowdyHeavy", "Flamenco", "PanRoman", "Gotham Narrow Extra Light Italic", "OLF SimpleSansOC", "Folio XBd BT", "Roman Mono", "System Font Bold Italic G1", "Sinhala Sangam MN Bold", "Cataneo BT", "System Font Bold Italic G2", "Soho Gothic Pro ExtraBold It", "Oriya Sangam MN Bold", "JUSTICE", "MMa Greek Italic", "Gotham Medium", "Arno Pro Light Display", "Ezra SIL SR", "SD-TTSurekh", "GrilledCheese BTN", "Kannada MN Bold", "Heiti SC Medium", "Avenir Next W1G Heavy Italic", "PT Serif Caption", "Hiragino Maru Gothic Pro", "Monotype Sorts 2", "Myriad Pro Black SemiCond", "Tsukushi A Round Gothic", "Futura LT Extra Bold", "Titillium Regular Italic", "KacstDecorative", "Lucida Sans Typewriter Oblique", "Impregnable Personal Use Only", "MMNegate Italic", "Whimsy TT", "Chess Marroquin", "NBP Informa FiveSix", "Lucida Sans Demibold Roman", "msbm10", "Gill Sans Nova Ultra Bold", "copy 09", "Blackmoor LET", "IPAMincho", "MMa VariableB Bold", "Superclarendon Bold", "Titillium Black", "Avenir", "Lucida Sans Typewriter Bold", "Steppes TT", "VNI Cambodia", "Kefa Bold", "Helvetica Light Oblique", "Avenir Next W1G Ultra Light Italic", "JazzCord", "Symbol Neu for Powerline", "Emily Austin", "Avenir Light", "Tiranti Solid LET", "Myriad Hebrew Italic", "cmitt10", "DhanshirhiOMJ", "KacstDigital", "kawoszeh", "Cut Me Out 2", "Cut Me Out 3", "Myriad Pro Bold Condensed", "boot", "Fredericka the Great", "Symusic", "balonez fantasia br", "Devanagari MT", "Noto Sans UI", "Myriad Pro Semibold Italic", "Noto Sans Vai", "Razer Header Regular Oblique", "Dot", "Swed", "ScriptKleio", "Gillius ADF No2", "Myriad Pro Bold SemiExtended", "Prema", "ConcursoItalian BTN", "Pricedown Bl", "Lantinghei SC Extralight", "GillSans-Bold", "Urdu Naskh Asiatype", "Glegoo", "Kohinoor Devanagari Bold", "Vollkorn Regular", "Apple Casual", "Freehand575 BT", "PingFang SC Regular", "Medlin", "MMa Relation Bold", "FML-TTAnjali", "RADAGUND", "Noto Sans Mandaic", "Marion Regular", "cminch", "Seagull APL", "Nueva Std", "Pamela wants to Ride", "Monotxt", "cmtt10", "TRENDY", "Alex Brush", "Playfair Display SC Italic", "STIXIntegralsUpD-Bold", "DecoType Naskh", "Muli", "Marker Felt Wide", "Klee", "PUPPYLIKE", "Accanthis ADF Std No2", "Cooper Std", "Meslo LG L DZ Regular for Powerline", "Droid Arabic Naskh", "ITF Devanagari Demi", "Verdana Pro SemiBold", "Kalyani", "Latino Elongated LET Plain:1.0", "Brussels", "Nasalization", "Thonburi Bold", "Kohinoor Devanagari Medium", "Loma", "Noto Sans Rejang", "Typewriter Bold", "Zapfino Extra LT One", "Futura Heavy", "Origin", "Euclid Symbol Bold Italic", "Gotham Narrow Bold Italic", "smart watch", "PFDaVinciScriptPro-Inked", "Odessa LET", "KG Fall For You", "FMLTTAathira", "MMNegate Bold", "Gotham Thin", "Cousine Bold for Powerline", "Courier New Bold", "Cracked", "Arial Bold", "GoomtiMJ", "PingFang SC", "Minion Pro Semibold Italic", "VNI-WIN Sample Font", "LA Headlights BTN", "Moon Flower", "VNI-Couri", "Segoe WP Light", "lcmssi8", "Carlito", "Proxima Nova Light", "Oswald", "Abel", "Doulos SIL", "Sanskrit", "BRADDON", "MMa Binary Bold Italic", ".VnStamp", "Raleway ExtraBold", "VNI-Vari", "DhakarchithiOMJ", "Arno Pro Subhead", "monoeger 05", "Lithos Pro", "Noto Sans CJK KR", "FML-TTVeenaHeavy", "JaJaDiMJ", "Supernatural Knight", "Garamond Premier Pro Semibold", "MMa Relation Italic", "IDAutomationPDF417n3", "Source Sans Pro ExtraLight Italic", "STZhongsong", "JuneBug", "Candy Round BTN Lt", "Georgia Bold Italic", "BauerBodni BT", "ML-TTRavivarma", "Yu Gothic Light", "monofur italic for Powerline", "Webdings", "Courier MM Screenwriter BoldIt", "STXinwei", "PenultimateLightItal", "3 of 9 Barcode", "Rockwell Nova Cond Light", "Laila Medium", "FML-TTSurya", "Shree Devanagari 714 Bold", "Metamorphous", "Mekanik LET", "Serif", "Verdana Pro Black", "ML1-TTAmbili", "Lucida Handwriting Italic", "Apple Braille Outline 8 Dot", "Courier New Baltic", "Euclid Italic", "Opus Figured Bass Extras", "Latin Modern Roman Unslanted", "VNI-Allegie", "Comic Sans MS Bold", "Nina", "ML-TTMalavika", "18thCentury", "PhrasticMedium", "Amatic SC", "Canter Bold 3D", "Swis721 BlkCn BT", "KalegongaOMJ", "Nirmala UI Semilight", "Lato Light", "ISABELLE", "Linux Libertine G", "copy 08", "Kedage", "Raleway Light Italic", ".VnLinus", "Roboto Medium", "Lithos Pro Regular", "STIXNonUnicode-Regular", "eufb9", "eufb8", "MARKETPRO", "Skia Black Condensed", "eufb7", "eufb6", "eufb5", "VnTimes2", "SWMath", "Bamini", "Anonymice Powerline Bold", "Sukhumvit Set Thin", "STFangsong", "ML-TTAtchu", "Cochin Italic", "hooge 06", "hooge 04", "hooge 05", "Tw Cen MT Italic", "MMTimes Bold", "IPAGothic", "PingFang TC Ultralight", "Copperplate Light", "Consolas Italic", "Kohinoor Telugu Light", "TAU-Barathi", "STIXIntegralsUpSm-Regular", "FML-TTKeerthi", "eurb6", "KalindiOMJ", "Blade Runner Movie Font", "Source Sans Pro Bold Italic", "TAC-Barathi", "Adobe Ming Std L", "PingFang SC Light", "MMa Gauss", "kor", "MMa Variable2 Bold", "Yu Gothic Medium", "Damascus Medium", "Sugarskin BTN", "QTOptimum Regular", "Tekton Pro Bold Oblique", "Adobe Fangsong Std R", "italic 08", "Sana Regular", "MMa Century Bold", "DIN Condensed Bold", "(AH) Manal Black", "Wolf in the City Light", "Scriptina", "Skinny", "FML-TTNanditha", "eusb9", "Kalpurush ANSI", "Canter Bold Strips", "AdineKirnberg-Script", "Minion Pro Semibold", "Copperplate Bold", "Trebuchet MS Italic", "Myriad Hebrew Bold Italic", "Hand Me Down S (BRK)", ".VnMonotype corsivaH", "VNI-Slogan", "STIXSizeTwoSym", "Thonburi Light", "Consolas Bold", "Orange LET", "Candara Bold Italic", "Gotham Light Italic", "Trade Gothic LT Std Extended", "Starliner BTN", "NixieOneRegular", ".VnAristoteH", "chs", "ML-TTSarada", "Map Symbols", "DejaVu Sans Mono", "Telugu Sangam MN Bold", "Courier New Bold Italic", "Gotham Narrow Ultra", "Victorian LET", "Architects Daughter", "MS Reference 1", "ML-TTNalini", "MS Reference 2", "Dynalight", "Optima Bold Italic", "Hiragino Sans GB W3", "63", "Skia Black Extended", "Helvetica Neue UltraLight Italic", "Dominican", "Futura LT Bold Oblique", "Franklin Gothic Heavy", "Baskerville Italic", "Open Sans Condensed", "TAU-Kaveri", "MMa Variable SS", "Helvetica Neue Thin Italic", "Arno Pro Display", "MMa Negate Bold Italic", "Xingkai SC Bold", "Montserrat Light", "cmti9", "TAC-Kabilar", "cmssi9", "Roboto Condensed Light", "cmssi8", "STIXVariants-Bold", "SWGDT", "SAS Monospace", "Martina", "Myriad Pro Light SemiCondensed Italic", "MMTimes", "VNI-Dur", "TitilliumText22L-XBold", "FML-TTVinay", "Titillium Light Upright", "Savoye LET Plain CC", "Bangkok Cirilica", "Iowan Old Style", "MMArrow Bold", "Cairo SF", "Arno Pro Smbd Subhead", "Formata Light Condensed", "PingFang HK Medium", "Cousine for Powerline", "Arial Nova", "Stez Sans", "FML-LeelaHeavy", "Century Gothic Bold Italic", "Mytho", "STIXIntegralsD-Bold", "cmsl9", "Al Nile Bold", "SWIsot3", "Great Vibes", "System Font Italic G2", "System Font Italic G3", "System Font Italic G1", "BlackJackRegular", "Quicksand Light", "Hypatia Sans Pro", "Noto Sans Mono CJK SC", "Nueva Std Condensed", "SemiBold", "Avenir Next Condensed Ultra Light", "Athelas Bold Italic", "MMa TextBook Italic", "ML-TTKarthika", "Swis721 Hv BT", "AS-TTDurga", "Clear Sans", "Led Italic Font", "Seravek", "Dirty Headline", "Lucida Fax Italic", "Apple SD Gothic Neo Heavy", "Roboto Mono Medium Italic for Powerline", "Droid Sans Armenian", "Hiragino Maru Gothic Pro W4", "AlekyaBold", "STIXGeneral-Bold", "Tekton Pro", "QuickType II", "Fixed Miriam Transparent", "Latienne Pro Bold Italic", "cmbsy10", "ABIGAIL", "Latin Modern Mono Light", "Bodoni 72 Book", "Cinzel", "Kozuka Gothic Pr6N M", "Kozuka Gothic Pr6N L", "msam8", "PAINTSTROKE", "ML-TTRohini", "Kozuka Gothic Pr6N H", "Fingerpop", "TRIAL", "SWGothg", "SWGothe", "SWGothi", "BacktalkSerif BTN", "MLU-Panini", "Zapfino Extra LT Two", "News Gothic MT Alt 4", "Miriam Transparent", "MS SystemEx", "Proxima Nova Condensed Semibold", "YuMincho  36p Kana Medium", "SF Slapstick Comic", ".VnExoticH", "Baron Neue Bold Italic", "Swis721 LtEx BT", "PilGi Regular", "PT Bold Stars", "Chalkboard SE Light", "ThoolikaUnicode", "Muna Regular", "Nueva Std Bold", "Roboto Slab Light", "Khmer OS System", "NanumMyeongjo ExtraBold", "Noto Sans Devanagari UI", "IM FELL DW Pica", "Castro Script PERSONAL USE ONLY", "JF Armenian Serif", "MMCenturyNewRD Italic", "AppleMyungjo Regular", "PingFang SC Medium", "Futura LT Condensed Extra Bold", "Noto Sans Old Italic", "Bradley Hand Bold", "Al Bayan Plain", "STIXSizeOneSym-Regular", "MMa CenturySS Italic", "News Gothic MT Italic", "Gotham Extra Light Italic", "Wawati SC", "KB Vibrocentric", "Anonymice Powerline", "Harry P", "Sana", "Heiti TC Medium", "News Gothic MT Alt 1", "DYMO Symbols", "Futura LT Heavy", "cmss17", "ML-TTGopika", "Symbola", "Yuppy SC", "ADMUI2Sm", "Woodcut", "cmss10", "OCR-A BT", "STIXSizeThreeSym", "Roboto Thin Italic", "AR CENA", "Iowan Old Style Roman", "TlwgTypewriter", "Baclieu", "Optima Bold", "Hannotate TC Bold", "Adobe Hebrew Bold", "Gurmukhi Sangam MN Bold", "X-Files", ".VnExotic", "Trade Gothic LT Std Bold", "BankGothic Lt BT", "MisterEarl BT", "Parry Hotter", "Mshtakan", "Baron Neue", "FML-TTAshtamudiExBold", "VNI-Present", "Hoefler Text Black", "News Gothic MT Alt 3", "Verlag Book", "VNI Helve", "Lucida Bright Italic", "Cabin", "Math1Mono", "MMa GreekSS Italic", "TL-TTHemalatha", "Alibi", "Roboto", "Bell Gothic Std Black", "Lexia", "Proxima Nova Soft Regular", "Vollkorn Italic", "ChandrabatiSushreeMJ", "Diwani Outline Shaded", "News Cycle", "Apple SD Gothic Neo SemiBold", "Arial CE", "Z@R1816.tmp", "SamsungImaginationBold", "Charter Bold", "Canter Outline", "Day Roman", "ML-TTVinay", "YuCiril Helvetica", "Brush Script", "Sorts Mill Goudy Italic", "Simple Indust Outline", "36p Kana Demibold", "Latin Modern Roman Caps", "Mayence Premium", "Granjon Italic", "Noto Sans Syloti Nagri", "Highlight LET", "Ferro Rosso", "Hypatia Sans Pro Light", "Hei Medium", "ITF Devanagari Light", "VNI-Ariston", "SWSimp", "Holiday Springs BTN Quill", "WP MathExtendedB", "FML-TTGeethika", "Verdana Pro Cond", "Bordeaux Roman Bold LET", "Voyager NBP", "Goudy Old Style Italic", "Oswald Regular", "Giddyup Std", "Harvest", "Helvetica Neue Medium", "Paralucent Medium", "Times New Roman Uni", "MMCenturyOld Bold", "Ubuntu Mono derivative Powerline Bold Italic", "Clarendon Lt BT", "Emma Script Mvb", "Raleway Medium Italic", "Gotham Extra Light", "Stone Sans Sem ITC TT SemiIta", "Menlo Bold", "FZLanTingHeiS-UL-GB", "MMa Binary S", "Constantia Bold Italic", "jpn", "Myanmar MN", "MMCenturyOldGreek Bold Italic", "AGA Arabesque", "Inconsolata for Powerline", "Maestro", "Avenir Next Condensed Bold", "PT Serif", "Kozuka Gothic Pr6N EL", "Myriad Pro SemiExtended", "Source Code Pro Light", "cmbx10", "Teen", "Baiduan Number", "AnticFont", "Hobo Std", "Caviar Dreams Italic", "Math4Mono", "ceriph 05", "Gentium Basic", "ceriph 07", "Heather BTN", "MMVariableB Bold", "FML-Akhila", "Cookie", "AR HERMANN", "eusb8", "MMa Fraktur Bold", "Soho Gothic Pro Bold", "Kozuka Mincho Pro R", "PN-TTAmar", "eusb6", "eusb7", "ML-TTSwathyBold", "Roboto Light", "Cochin Bold", "Symeteo", "VNI-Internet Mail", "MMa Greek Bold", "Kozuka Mincho Pro B", "Kozuka Mincho Pro M", "Bodoni 72 Smallcaps Book", "ZDingbats", "Proxima Nova Condensed Regular Italic", "Kozuka Mincho Pro H", "Superclarendon Light Italic", "CountryBlueprint", "MMGreek", "TanglewoodTales", "MMa Greek", "MMEtc Bold", "Noto Sans CJK JP", "HelveticaNeueLT Std Lt", "Apple SD Gothic Neo Medium", "Microsoft JhengHei UI Light", "Broadway Copyist Perc", "Handwriting - Dakota", "PCMyungjo", "AIGDT", "Helvetica Neue Light Italic", "Museo Sans 500 Italic", "Oriya MN", "MMa VariableC SS", "Roboto Condensed Bold Italic", "Circular Std Bold", "GaneshMedium", "Finale Percussion", "Titillium Light", "Arkhip", "Al Bayan", "PingFang HK Semibold", "SAPIcons", "Noto Sans Samaritan", "Dancing Script OT", "ELLIS", "Museo Sans 700", "Limousine", "SF Slapstick Comic Oblique", "Sukhumvit Set", ".VnUniverse", "Franklin Gothic Demi Cond", "KarnaphuliOMJ", "DFKGothic-Md", "Monika Italic", "VNI-Meli", "TeX Gyre Schola", "Finger Paint", "Meslo LG M DZ Regular for Powerline", "TURK", "Noto Sans Limbu", "Arimo Italic for Powerline", "SPAN", "KG Part of Me", "Hiragino Kaku Gothic Pro", "No Flash", "Zolano Serif BTN", "DIN Alternate Bold", "Nanum Pen Script", "Proxima Nova Lt", "Commons", "Lato Light Italic", "Raleway Black Italic", "Maiden Orange", "Lato Bold Italic", "PondFreeMe", "Latin Modern Mono Light Cond", "Myriad Pro Light Cond", "Baron Neue Bold", "Malayalam MN", "Mshtakan Bold", ".VnAvant", "MMa VariableD S", "Merriweather UltraBold", "ITF Devanagari Marathi Book", "Raleway Thin", "Amudham", "MMCenturyNewRD Bold Italic", "DIN-Bold", "Roboto Mono Bold for Powerline", "SaiSai", "Symbol MT", "Virtual DJ", "FML-TTRavivarma", ".VnArabiaH", "FML-TTSruthy", "HaldaOMJ", "JazzPerc", "Gotham Narrow Medium Italic", "Avenir Black", "Kalpurush", "eufb10", "Raleway", "Arial Bold Italic", "Inconsolata-dz for Powerline", "Hiragino Kaku Gothic StdN", "Lobster Two", "QuickType II Mono", "Nova Square", "MMa CenturyK Bold Italic", "Roboto Slab Thin", "Coaster Shadow", "Skia Light Extended", "Skia Regular", "Chipotle", "Thorndale for VST", "TeX Gyre Adventor", "SERB", "Simplex", "Amiri Quran", "Ubuntu Mono derivative Powerline Bold", "Songti TC Light", "One Stroke Script LET", "Clarendon Blk BT", "Poiret One", "Source Code Pro", "Fascinate", "GrilledCheese BTN Wide Blk", "AV-Font-Tam1", "SWRomnd", "Noto Sans Ol Chiki", "Source Code Pro Medium", "HooglyOMJ", "Gazzarelli", "One Dance Bold", "Myriad Pro Light SemiExtended", "Math5Mono", "Raleway ExtraLight Italic", "VNI-Maria", "Gotham Narrow Book Italic", "Roboto Black Italic", "Tekton Pro Bold Extended", "Titillium Regular Upright", "FML-TTGauri", "Stencil Std Bold", "Note this", "Bebas Neue Regular", "VNI-Times", "cmsy9", "cmsy8", "Just Another Hand", "lcirclew10", "INSPECTIONXPERT GDT NOFRMS", "Accord Light SF", "MMa VariableA", "Z@R170E.tmp", "cmsy5", "New Peninim MT", "LuzSans-Book", "cmsy6", "CATIA Symbols", "Bauer Bodoni Std 1 Bold", "Z@R184B.tmp", "Sukhumvit Set Text", "Tsukushi B Round Gothic Regular", "HP Simplified", "Waseem", "HelveticaNeueLT Pro 67 MdCn", "Hiragino Kaku Gothic Std", "Phosphate Inline", "PondFreeZoo", "Arial Narrow Bold Italic", "Kailasa Regular", "ML-TTThiruvathira", "FML-TTKala", "GiovanniITCTT", "Stone Sans Sem OS ITCTT SemiIta", "Arimo", "Trade Gothic LT Std Bold No. 2", "Source Sans Pro ExtraLight", "Soho Gothic Pro Medium Italic", "Milano LET", "WP BoxDrawing", "Titillium Light Italic", "Open Sans Light Italic", "FML-Revathi", "Chalkboard SE Bold", "Bickham Script Pro Semibold", "MMCenturyOld Bold Italic", "FML-TTKarthika", "Unknown Caller BTN SC", "Paralucent Heavy Italic", "MMArrow Italic", "Gotham Narrow Thin Italic", "Andale Mono IPA", "DecoType Thuluth", "04b", "Urdu Typesetting", ".VnFree", "URW Chancery L", "Apple SD Gothic Neo Bold", "Noto Sans Tagalog", "PingFang TC Semibold", "FML-TTAtchu", "PR Celtic Narrow", "Abyssinica SIL", "JaneAusten", "TAMILNET", "GDT", "Dosis Light", "Adobe Garamond Pro Bold Italic", "Devanagari MT Bold", "Arial CYR", "MMa Extra", "Weibei SC", "Existence Light", "IchamotiMJ", "HKSCS", "KG Shake it Off Chunky", "Gadugi", "WP Greek Courier", "Comic Relief", "KacstFarsi", "PT Separated Baloon", "Siyam Rupali", "ScriptC", "MMSchoolRD Bold Italic", "SWTxt", "DejaVu Sans Mono for Powerline", "FML-TTTheyyam", "HGP-AGothic2-Latin1K", "ScriptS", ".VnCourier NewH", "Arno Pro Smbd Caption", "CLARENCE", "Source Serif Pro", "OPENCLASSIC", "OLIVEOIL", "YuGothic Bold", "LCD", "KasseFLF-Bold", "HelveticaNeueLT Std Thin Ext", "CZEC", "3M Circular TT Book", "Bold Italic Art", "ChunkFive Roman", "Redressed", "Chess Alpha", "Myriad Pro Black SemiCondensed Italic", "Jameel Noori Nastaleeq", "Master Of Break", "Smudger LET", "Kinnari", "Apple SD Gothic Neo Light", "Bellota", "Helvetica Bold Oblique", "cmssi17", "Emmett", "CabinSketch", "Songti SC", "cmex10", "cmssi10", "Angiang", "SF Compact Rounded", "Meslo LG S Regular for Powerline", "ItalicT", "SaiEmbed", "Museo 900 Regular", "Futura LT Light Oblique", "Iowan Old Style Italic", "VNI-Aptima", "Gotham Narrow Extra Light", ".VnBodoniH", "MMVariable Bold", "MMArrow Bold Italic", "Fluffy Slacks BTN", "Gotham Narrow Thin", "QuickType II Pi", "lcmssb8", "ItalicC", "WP Hebrew David", "Darlin BTN", "Skia Extended", "SF Compact Rounded Light", "Splash", "ML-TTSurya", "Warsaw", "Noto Sans Ogham", "DhanshirhiMJ", "MMa Etc", "Brush Script Std Medium", "Seravek Light Italic", "Kaiti SC Regular", "Myriad Pro SemiCondensed Italic", "Futura Book Italic BT", "JF Georgian Contrast", "Songti SC Light", "AV-Web-Hin1", "Mudir MT", "BuiltTitlingRg-Bold", "Gocong", "Arial Cyr", "Corsiva Hebrew", "Bickham Script Pro Regular", "VNI-Coronet", "FML-TTThakazhi", "ITF Devanagari Marathi Bold", "Courier MM Screenwriter", "WenQuanYi Micro Hei", "Kumudam", "Stone Sans Sem OS ITC TT Semi", "WP MultinationalB Roman", "cmex9", "Rakesly Bk", "Times Roman", "HanziPen SC Regular", "Press Start 2P", "Myriad Hebrew", "Raleway Medium", "Futura Book", "American Typewriter Bold", "Hiragino Kaku Gothic Pro W6", "MMa Arrow SS", "HelveticaNeueLT Std Thin", "HelveticaNeueLT Std Ext", "KacstPoster", "HanziPen SC Bold", "Colbert", "Proxima Nova Soft Bold", "Calvin", "Iowan Old Style Titling", "MMa VariableF", "Kozuka Mincho Pro EL", "MMa VariableD", "Galeforce BTN", "MMa VariableB", "MMa VariableC", "Minion Pro Medium", "Damascus Light", "KacstQurn", "Raleway SemiBold", "Book Antiqua Bold Italic", "Uncial Antiqua", "Diwani Simple Outline", "BrahmaputraMJ", "SWIsot2", "Gotham Ultra", "Broadway Copyist", "Osaka", "VNI-Vivi", "Meiryo Bold", "Segoe WP SemiLight", "STIX Math", "SWIsot1", "VNI-ShellaL", "STIXIntegralsD-Regular", "STIXSizeThreeSym-Regular", "lcmss8", "Neon Lights", "Z@R16EB.tmp", "ML-TTLeelaHeavy", "ParvathiMedium", "Amethyst", "EQUIS", "System Font Black", "ITF Devanagari Bold", "Lao Sangam MN", "PT Serif Bold", "Inder", "PT Bold Mirror", "OCR-B 10 BT", "MMVariable", "VANAVIL-Avvaiyar", "ISOCT2", "Dosis ExtraBold", "Chaparral Pro Bold Italic", "MMTextBookB Bold Italic", "Times New Roman Symbol", "VNI-Dom", "HelveticaNeueLT Pro 95 Blk", "Baoli SC Regular", "BurigangaOMJ", "Avenir Next Condensed Ultra Light Italic", "Letter Gothic Std", "JLS Data GothicR  NC", "Roboto Medium Italic", "Titillium Bold", "Bookman Old Style Bold Italic", "Myriad Pro Semi bold", "ISOCT3", "msam10", "Source Sans Pro Semibold", "Myriad Pro Semibold SemiCondensed Italic", "Incised901 NdIt BT", "DejaVu Sans Light", "Myriad CAD", "Light", "Binhdinh", "Rachgia", "HGHeiseiMinchotaiW9", "ChandrabatiOMJ", ".VnTifani HeavyH", "System Font Heavy Italic", "GFS Artemisia", "WP MultinationalB Helve", "TAB", "8514oem", "Hack Bold", "Athelas Bold", "ArhialkhanOMJ", "Calibri Light", "Hoian", "Avenir Next W1G Ultra Light", "Vikatan", "STKaiti", "Adobe Hebrew Regular", "Utopia", "MMa CenturyS Bold", "KacstLetter", "Apple SD Gothic Neo Regular", "Heiti SC Light", "ABeeZee", "Chinyen", "GB18030 Bitmap", "Lucida Calligraphy Italic", "euex10", "HelveticaNeueLT Std Lt Cn", "Anonymice Powerline Italic", "News Gothic MT Alt 2", "Bell Gothic Std Light", "MATTEROFFACT", "Z@R1720.tmp", "Titillium Bold Upright", "ENGL", "Gotham Ultra Italic", "Didot Italic", "HelveticaNeueLT Pro 33 ThEx", "Hot Mustard BTN Poster", "Farah", "MMTextBook Bold Italic", "VNI-Shadow", "New Gulim", "MMa CenturyKS Italic", "GungSeo Regular", "Droid Sans Mono for Powerline", "iso 08", "POLI", "Nova Slim", "Hue", "GothicNo13 BT", "Proxima Nova Black", "ML-TTAnjali", "Caflisch Script Pro", "Lao MN", "HP PSG", "VNI-Heather", "Gill Sans Nova", "cht", "Opus Chords", "Raleway Bold Italic", "Junicode", "IMG Love", "cmti10", "Verdana Bold", "Saab", "ADMUI2Lg", "Superclarendon Black Italic", "OCR A Std", "Hot Mustard BTN", "cmti12", "Francois One", "Tsukushi B Round Gothic", "Literation Mono Powerline", "MAC C Times", "Noto Sans Inscriptional Pahlavi", "Proxima Nova Extrabold", "Georgia Pro Cond", "Helvetica Light", "Remachine Script Personal Use", "Pump Demi Bold LET", "Gentium Book Basic", "VNI-Algerian", "Lato Medium Italic", "MMArrow", "FML-TTMadhaviExBold", "SWScrpc", "STIXSizeFourSym-Regular", "Nafees Web Naskh", "JLS Data GothicC  NC", "TAC-Kambar", "Microsoft Tai Le Bold", "SWScrps", "Proxima Nova Light Italic", "Tamil MN Bold", "ML-TTGauri", "ML-TTGeethika", "AdineKirnberg", "Rotis Sans Serif Std 75 Extra Bold", "AR BERKLEY", "Farisi", "Rachana", "Kerala", "Chaparral Pro", "Bubblegum Sans", "Sasfont", "System Font Italic", "WP IconicSymbolsA", "WP IconicSymbolsB", "Throw My Hands Up in the Air", "Sneakerhead BTN", "CentSchbook BT", "Incised901 BdCn BT", "PortagoITC TT", "HaldaMJ", "MapInfo Cartographic", "Belwe Lt BT", "Kundli", "Kozuka Mincho Pr6N EL", "Swis721 Cn BT", "MMBinary Bold Italic", "SchoolHouse Printed A", "VNI-Brush", "Tsukushi A Round Gothic Regular", "Vollkorn Bold Italic", "Kozuka Gothic Pr6N R", "Bodoni Ornaments", "Futura LT Condensed Light Oblique", "Nexa Regular Italic", "KarnaphuliMJ", "Damascus Bold", "Gotham Black", "Kohinoor Bangla", "Noto Sans Mono CJK JP", "Constantia Italic", "ML-TTAshtamudiExBold", "Times Bold", "Arial Narrow Bold", "MMa CenturyKSS Italic", "DhonooMJ", "Noto Sans Ethiopic", "HelveticaNeueLT Std Med Ext", "MMCenturyNewRD Bold", "Yuppy TC Regular", "SF Distant Galaxy Alternate", "PT Sans", "PingFang HK Ultralight", "Athelas Italic", "Sonic XBd BT", "saxMono", "Bangla MN Bold", "Tinos Bold for Powerline", "ChondanaMJ", "Yuanti TC Regular", "HelveticaNeueLT Pro 93 BlkEx", "FML-TTSugatha", "Ducmy", "Germ", "Padauk", "YD2002", "Sitka Subheading", "Myriad Pro SemiCond", "Myriad Pro SemiExtended Italic", "WP MathB", "Noto Sans Buhid", "Noto Sans Mono CJK TC", "Noto Sans Inscriptional Parthian", "msbm6", "Kefa Regular", "msbm8", "msbm9", "Weibei TC Bold", "LKLUG", "FML-TTIndulekha", "MMTimes Italic", "Noto Sans Imperial Aramaic", "VNI-Script", ".VnParkH", "Noto Sans Old South Arabian", "Kozuka Gothic Pr6N B", "TitilliumText22L-Medium", "Euclid Bold Italic", "Calisto MT Bold", "Dosis Bold", "Futura LT Medium", "FML-TTKanika", "Kufi Outline Shaded", "Beirut", "EXCESS", "New Peninim MT Bold Inclined", "Optima", "Source Sans Pro Italic", ".VnAristote", ".VnTimeH", "MMa Fermat", "Tangerine", "Noto Sans Batak", "eurb8", "ML-TTPoornima", "Myriad Web Pro", "Paralucent Thin Italic", "Avenir Next Demi Bold", "msam6", "MMa Century Italic", "Ezra SIL", ".VnTime", "Miama", "Futura LT Condensed Bold", "Literation Mono Powerline Bold", "Myriad Pro Condensed", "MMa Arrow", "FML-TTNandini", "Kaiti SC", "SF Compact Rounded Medium", "KG Primary Penmanship", "Skia Bold", "ML-TTMayoori", "VNI-Tekon", "Vonique 64", "Myriad Pro Cond", "Arial Hebrew Scholar Light", "Engravers MT Bold", "Perpetua Italic", "Arial Greek", "ML-TTIndulekhaHeavy", "ISOCTEUR", "Visitor TT2 BRK", "cmr17", "SWAstro", "LETT", "AlekyaExtraBold", "FML-TTYashasri", "cmr10", "Gothic720 Lt BT", "Microdot", ".VnClarendon", "Book Antiqua Bold", "HeiT", ".VnAvantH", "PT Serif Caption Italic", "Princetown LET", "Eccentric Std", "8Pin Matrix", "GangaOMJ", "Kohinoor Bangla Bold", "ML-TTJyotsna", "Hoefler Text Italic", "Bodoni 72 Bold", "Noto Sans Shavian", "Bahiana", "Roboto Bold Italic", "VNI-Franko", "cmbx7", "cmbx6", "cmbx5", "SAPGUI-Icons", "Charter Italic", "cmbx9", "cmbx8", "Gelfling SF", "Aileron Black", "Bookshelf Symbol 1", "HGPHeiseiKakugothictaiW9", "FML-TTPooram", "Raanana", "OCRA", "Sanskrit New", "Ostrich Sans Rounded", "TLArabic", "Latin Modern Mono", "AG", "Opus Chords Sans", "Source Code Pro Bold", "Source Sans Pro Black Italic", "BorakMJ", "Futura Bold", "Latin Modern Roman Dunhill", "CAMPBELL", "Futura Medium Italic", "FML-TTSuparna", "FML-TTKamini", "SignPainter", "Noto Sans Armenian", "Adobe Caslon Pro Italic", "Latin Modern Mono Slanted", "Wawati SC Regular", "Dayton", "Newton Phonetic ABBYY", "MMBinary Italic", "IMG Travel", "Helvetica Oblique", "FELIZ", "Amiri", "VNI-Colonna", "JumunaOMJ", "DIN Alternate", "Lohit Devanagari", "Aileron Thin", "Tamil MN", "GhorautraOMJ", "Wolf in the City", "FML-TTPoornima", "Trade Gothic LT Std Bold Extended", "Complete in Him", "ITF Devanagari", "Diwan Thuluth Regular", "01 Digit", "TeX Gyre Cursor", "Playfair Display SC Bold Italic", "HelveticaNeueLT Std Med Cn", "Avenir Next Condensed Heavy", "Hiragino Sans GB", "GFS BodoniClassic", "LightSC", "Camranh", "TAM-Kavi", "Phetsarath OT", "Symbol", "Rondalo", "Jayanthi", "MMTextBook Italic", "Leelawadee UI Semilight", "OpineHeavy", "Century Schoolbook Italic", "Chalkboard SE Regular", "SWTOR Trajan", "ML-TTSugatha", "SF Distant Galaxy Outline", "Theatre Antoine", "Heavy Heap", "ML1-TTIndulekha", "SFNS Display", "Nexa Light Italic", "Linux Biolinum Keyboard O", "Adobe Devanagari Bold", "BaluScript", "Avenir Next Condensed Regular", "ARDS1", "cmssqi8", "Avenir Next Medium", "ChondanaOMJ", "B095", "Borealis", "Seravek ExtraLight Italic", "Avenir Next Heavy Italic", "Tamil Sangam MN Bold", "HelveticaNeue", "Tsukushi A Round Gothic Bold", "VNI-Helve-Condense", "FML-TTAnakha", "Hiragino Kaku Gothic StdN W8", ".VnMonotype corsiva", "MMa VariableF S", "Nightclub BTN", "Berling", "MMa VariableB SS", "Z@R11F8.tmp", "Suruma", "Telugu MN", "Linux Libertine O", "Italianate", "Raleway Italic", "Span", "ML-TTKeerthi", "MMa Pascal", "VNI-Scribble", "Indie Flower", "Avenir Next Condensed Demi Bold Italic", "ML-TTVisakham", "Arno Pro Caption", "Qaskin White Personal Use", "MMTextBookB", "Al Tarikh", "Berkshire Swash", "Hobo Std Medium", "DINPro-Regular", "Circular Std Black Italic", "Muna Bold", "TechnicBold", "SWMono", "Sukhumvit Set Bold", "Palatino Linotype Bold Italic", ".VnCentury SchoolbookH", "Euclid Math Two Bold", "Creepygirl", "ISOCP3", "Source Sans Pro Black", "MMa Relation", "Futura LT Condensed Medium", "BongshaiOMJ", "VNI Aptima", "Leitura Display Swashes", "Gotham Narrow Ultra Italic", "Math2Mono", "Swis721 BdOul BT", "Clubland", "English157 BT", "modstmary10", "eurm9", "euex8", "Diavlo Medium", "Iowan Old Style Black Italic", "MMa GreekS", "Adobe Garamond Pro", "Cordia New Bold", "PRETEXT", "DengXian", "University Roman LET", "Open Sans Semibold", "Soho Gothic Pro Ultra", "Futura Extra Bold Oblique", "Roboto Condensed Light Italic", "Tamil-Aiswarya", "ML-TTNandini", "Avenir Next Ultra Light Italic", "Trade Gothic LT Std Bold Condensed No. 20", "FML-TTAshtamudi", "Ostrich Sans Dashed", "Myriad Pro Semibold SemiExtended", "NewRocker", "DIN-MediumAlternate", "Arimo Bold", "TLPashto", "Gauge", "Gotham Bold Italic", "MMVariable2 Bold", "FFF Tusj", ".VnHelvetInsH", "Embassy BT", "MMSchoolRD Italic", "Myriad Pro Semibold", "CityBlueprint", ".VnGothic", "Source Code Pro Black", "Futura Light", "Baamini", "Palatino Italic", "SF Distant Galaxy AltOutline", "Gotham Light", "AcmeFont", "Trade Gothic LT Std Bold Condensed No. 20 Oblique", "DIN-Medium", "Terminator Real NFI", "Letter Gothic Std Bold Slanted", "Gill Sans Light Italic", "YuMincho Medium", "Myriad Pro Light Condensed Italic", "Myriad Pro Black Condensed Italic", "Osaka-Mono", "Josefin Slab", "Gauge Heavy", "Haxton Logos TT", "BhairabMJ", "Fences", "Gurmukhi MT", "Good Times", "MMa Extra S", "Benguiat", "DINPro-Medium", "MMa Variable2 SS", "Oswald Stencil", "Apple Braille", "HelveticaNeueLT Std Blk Ext", "Noteworthy Light", "Scruff LET", "DIN-BlackAlternate", "Letter Gothic Std Medium", "Adobe Pi Std", "Kozuka Mincho Pr6N", "Menlo Regular", "Almonte Snow", "Belfast Heavy SF", "Kaiti SC Bold", "AR CHRISTY", "VNI-Lydi", "Cantarell Bold Oblique", "Gentium", "Bevan", "Quicksand Light Regular", "JLS Space GothicC  NC", "True Lies", "STIXVariants", "MMa TextBook Bold", "Segoe UI Black", "Noto Sans Malayalam", "eurb10", "Averia Serif", "Candy Round BTN Cond", "ML-TTBeckalBold", "Bariol Regular", "Avenir Medium Oblique", "Kohinoor Bangla Semibold", "Helvetica Neue Bold", "ML-TTAmbili", "Noto Sans Mono CJK KR", "cmfi10", "UnitedStates", "ML-NILA07", "Chandas", "Coolsville", "Franklin Gothic Demi", "HelveticaNeueLT Pro 63 MdEx", "Yuanti SC Light", "FML-TTLeelaHeavy", "Prisoner SF", "Times New Roman CYR", "News Gothic MT Alt 6", "Bodoni 72 Book Italic", "Shree-Kan-0853", "Letter Gothic Std Bold", "Rekha", "Akhbar MT", "DecoType Naskh Regular", "Gunplay", "Nadeem Regular", "Accanthis ADF Std", "Roboto Condensed Bold", "Adobe Caslon Pro Bold Italic", "Helvetica Neue Bold Italic", "Tlwg Typist", "SF Compact Rounded Thin", "Swiss 721 Bold BT", "Jwala", "Capitals", "GFS Theokritos", "cmr8", "cmr9", "cmr6", "cmr7", "SWGrekc", "Timeless", "w01", "Digifit", "Minion Pro Med", "Simple Outline Pat", "MMa Negate Bold", "Linden Hill", "Courier New (Arabic)", "Sauce Code Powerline Black", "Noto Sans Gothic", "Adobe Kaiti Std", "AV-Web-Tam1", "Athelas Regular", "FML-TTMangalaExBold", "Rockwell Bold Italic", "Visitor TT1 BRK", "Brandish", "Futura LT Condensed Extra Bold Oblique", "Manorly", "Gotham Narrow Light", "cmti8", "DejaVu Serif", "Allura", "Source Sans Pro Light", "Burst My Bubble", "ISOCT", "Hannotate SC", "ISOCP", "Greek Diner Inline TT", "Paralucent Thin", "BuiltTitlingRg-Regular", "Calligraphic", "SF Slapstick Comic Bold Oblique", "Soho Gothic Pro Light Italic", "Euclid Extra", "Sauce Code Powerline Light", "Courier New Greek", "Noto Sans Georgian", "PT Sans Italic", "Cousine Bold Italic for Powerline", "VNI-Goudy", "Math3Mono", "Georgia Italic", "Luna Bar", "VNI-Bragga", "Sawasdee", "TAMLKamban", "Paralucent Bold Italic", "PingFang TC", "Valken", "MMCenturyNewRD", "Meera", "Saint Andrew des Kiwis", "Courier Bold Oblique", "Diavlo Light", "HGSMinchoL", "Diwani Bent", "MMa VariableD Bold", "Courier New Italic", "Aileron UltraLight", "Chess Merida", "cmsl8", "Snell Roundhand Black", "Candara Bold", "Grafolita Script Medium", "Diwani Letter", "Paralucent Bold", "Adobe Devanagari Italic", "VNI-Linus", "cmss12", "eusm10", "Avenir Next W1G Light Italic", "Seravek ExtraLight", "Interstate-Black", "SignPainter-HouseScript", "Euclid Extra Bold", "System Font Medium Italic P4", "TtsNote", "Quicksand Book Oblique Regular", "TAMILFIX", "Industrial736 BT", "Adobe Arabic Bold", "InaiMathi", "Tera Special", "Myriad Pro Light SemiExtended Italic", "NanumGothic Bold", "MMTextBookB Bold", "JaJaDiOMJ", "Nimbus Mono L", "Futura Std Bold", "Finale Numerics", "Moon Flower Bold", "Swis721 Lt BT", "Mael", "Nexa Heavy Italic", "Becky", "ML-TTKaumudi", "TAU-Kabilar", "MMa CenturyS Bold Italic", "Violetta", "Bell MT Bold", "Palatino Linotype Italic", "FML-TTNila", "FML-Karthika", "Rotis Sans Serif Std 65 Bold", "PenultimateLight", "VNI-Revue", "Liberation Mono", "Trade Gothic LT Std Bold No. 2 Oblique", "GFS Didot", ".VnBlackH", "MMa Binary SS", "ML-TTSabari", "Bangla Sangam MN Bold", "AppleMyungjo", "TM-TTValluvar", "type 07", "Yu Gothic UI Semibold", "KN-TTUma", "Playfair Display", "Txt", "Gotham Narrow Light Italic", "Menlo", "Zirkon", "AV-Font-Sin", "Tall Boy West", "Yu Gothic", "AMGDT", "STSong", "Arimo for Powerline", "KufiStandardGK", "Nexa Bold", "TG Pagella Math", "Adobe Arabic Regular", "Futura Extra Bold", "SamsungImagination", "Mycalc", "MMa CenturyKSS Bold Italic", "Superclarendon Black", "Catull", "HYSWLongFangSong", "cmsy10", "FML-TTAyilyamBold", "Rakesly Lt", "SF Compact Rounded Heavy", "Beatnik SF", "Trajan Pro", "Sosa Regular", "Adobe Song Std", "Raleway Bold", "Bauer Bodoni Std 1 Italic", "DholeshwariOMJ", "VNI-StencilU", "Kefa", "STXihei", "Garamond Bold", "Trajan Pro Bold", "Reklame Script Medium", "AGA Arabesque Desktop", "Savoye LET Plain", "BATAVIA", "Fabrica", "Gidole", "Abril Fatface Regular", "Baskerville SemiBold", "Gill Sans SemiBold Italic", "Hombre", "STIXIntegralsUpSm-Bold", "Vogue", "Noto Sans Kayah Li", "Noto Sans Lydian", "Avenir Next Bold", "Myriad Pro Light SemiExt", "VNI-Bodon", "Estrangelo Edessa", "Titillium Semibold Upright", "Kingthings Versalis", "Droid Sans Mono Slashed for Powerline", "Patrick Hand SC", ".VnLinusH", "Galatia SIL", "Myanmar MN Bold", "Anonymice Powerline Bold Italic", "STIXNonUnicode-BoldItalic", "IMG Seasons", "NEOLITH", "GFS Baskerville", "PingFang HK", "Adobe Garamond Pro Italic", "OCR B MT", "Bariol Regular Italic", "Minion Pro Bold", "Nexa XBold", "AppleGothic Regular", ".VnMemorandumH", "HelveticaNeue BlackCond", "Myriad Pro Italic", "Symath", "Times New Roman Baltic", "Spicy Rice", "FML-TTMayoori", "Zapf Dingbats", "Rockwell Bold", "JomunaMJ", "FML-TTDevika", "Gill Sans Nova Cond XBd", "HelveticaNeueLT Std UltLt", "HanziPen TC", "Courier New Cyr", "Seville", "SF Compact Rounded Black", "HelveticaNeueLT Std ExtBlk Cn", "Arial Hebrew Light", "Canterbury Regular", "Ital", "Tekton Pro Ext", "Dosis ExtraLight", "Mshtakan BoldOblique", "New Athena Unicode", "Ubuntu Condensed", "SansSerif", "Century Gothic Bold", "Nueva Std Cond", "STIXGeneral-Italic", "Arial Nova Cond Light", "Tinos for Powerline", "CSD16", "PFDaVinciScriptPro-Regular", "KalindiSMJ", "MMTimes Bold Italic", "ML-TTSankara", "JazzTextExtended", "Courier MM Screenwriter Bold", "Calibri Bold Italic", "Merriweather Light", "FreeSerif", "System Font Bold Italic", "Baron Neue Black Italic", "Avenir Next W1G Demi", "Finale Mallets", "Circular Std Bold Italic", "Wawati TC Regular", "Tinos Italic for Powerline", "Trade Gothic LT Std Condensed No. 18", "Paralucent Medium Italic", "Cumberland AMT", "VNI Laos", "Camau", "Aleo", "DIN 1451 Mittelschrift", "VNI-Chaucer", "Cuulong", ".VnMystical", "Nexa Heavy", "Kohinoor Devanagari Regular", "HolidayPi BT", "Jokerman LET", "Salina", "Arial monospaced for SAP", "MMa Century", "Baskerville SemiBold Italic", "MMa GreekS Italic", "Lapidary333 Blk BT", "Adobe Myungjo Std", "Alfredo", "Dot-Matrix", "Thanhoa", "cmr12", "Adobe Fangsong Std", "Academy Engraved LET Plain:1.0", "Calligraph421 BT", "DejaVu Serif Condensed", "SWItal", "Futura LT Book Oblique", "Noto Sans Lycian", "Noto Sans Phags Pa", "SF Compact Text", "MAXIMO", "Avanti", "Adobe Caslon Pro Bold", "Space Bd BT", "November", "Lavanderia", "at most sphere", "Farisi Regular", "Gill Sans Nova Cond Lt", "Razer Text Regular", "VNI-Auchon", "Myriad Pro Black SemiExt", "KacstOne", "Gotham Thin Italic", "Raleway Black", "Hiragino Sans W9", "Hiragino Sans W8", "Penultimate", "Hiragino Sans W5", "Hiragino Sans W4", "Hiragino Sans W7", "Hiragino Sans W6", "Hiragino Sans W1", "Hiragino Sans W0", "Hiragino Sans W3", "Hiragino Sans W2", "Minion Pro Italic", "Kozuka Mincho Pr6N M", "Kozuka Mincho Pr6N L", "Proxima Nova Condensed Semibold Italic", "Kozuka Mincho Pr6N H", "Hiragino Maru Gothic ProN W4", "HelveticaNeueLT Std Extended", "NanumBarunGothic", "Kozuka Mincho Pr6N B", "VNI Russia", "Reklame Script Bold", "ML-TTThakazhi", "MMSchoolRD", "Futura Std Light", "Poplar Std", "Kozuka Mincho Pr6N R", "Franklin Gothic", "Paralucent Light", "ML-TTVaisali", "cmb10", "Waseem Light", "VNI-Cooper", "Ethnocentric", "STIXSizeFourSym", "Praveen", "Calibri Bold", "ML-TTYashasri", "Swis721 LtCn BT", "Snowdrift", "Myriad Pro Semibold SemiExtended Italic", "LiSong Pro", "Myanmar Sangam MN Bold", "MMCenturyOldGreek Bold", "VNI-Broad", "YuGothic", "American Typewriter Semibold", "Hannotate SC Bold", "Opus Ornaments", "Arimo Italic", "RamuBrush", "TechnicLite", "Nexa Book", "FML-IndulekhaHeavy", "Arimo Bold for Powerline", "Marion Bold", "Apple Braille Outline 6 Dot", "FML-TTBhavana", "Nanum Myeongjo", "PT Sans Caption Bold", "Gotham Medium Italic", "Quicksand Italic", "Z@R195D.tmp", "Soho Gothic Pro Bold Italic", "Hannotate TC", "ITF Devanagari Book", "Cracked Johnnie", "Rockwell Nova Light", "HGPMinchoL", "STIXNonUnicode-Bold", "VNI-Arial Rounded", "Braggadocio", "Swiss921 BT", "Museo 300 Regular", "Adobe Arabic Italic", "Trade Gothic LT Std", "Titillium Bold Italic", "VNI-Juni", "Myriad Pro Bold SemiCondensed Italic", "SWGamekeys MT", "Comfortaa", "Baron Neue Black", "Latin Modern Mono Prop Light", "Crystal", "RamuScript", "SAPDings", "RadhaBold", "Superclarendon Bold Italic", "Libel Suit", "Sneakerhead BTN Outline", ".VnLincoln", "MMTextBook", "Gujarati MT", "KacstScreen", "MMEtc Bold Italic", "Dosis SemiBold"]

		var baseFonts = ["monospace", "sans-serif", "serif"];

		fontList = fontList.concat(extendedFontList);
		fontList = fontList.concat(extendedFontList2);

		var h = document.getElementsByTagName("body")[0];

		var defaultWidth = {};
		var defaultHeight = {};

		var baseFontsDiv = document.createElement("div");
		var fontsDiv = document.createElement("div");

		h.appendChild(baseFontsDiv);
		h.appendChild(fontsDiv);

		var baseFontsSpans = initializeBaseFontsSpans(baseFontsDiv);

		for (var index = 0; index < 3; index++) {
			defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth;
			defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight;
		}

		h.removeChild(baseFontsDiv);

		var createdSpans = []

		for (var j = 0; j < 3; j++) {
			var s = createSpan()
			createdSpans.push(s);
			fontsDiv.appendChild(s);
		}


		/*var PortionSize = 3;
		var PortionSleep = 250;*/

		//var PortionSize = 300;
		//var PortionSleep = 10;

		var MinLength = 15
		var MaxLength = 200
		var PercentTime = 0.20
		var IntervalTime = 300
		var MinSleep = 50

		var Tasks = []
		var IsTimeToSleep = false;
		var Results = []
		var TimePerOneFont = []

		let Process = function (resolve, reject) {


			var PortionSize = MinLength;
			if (TimePerOneFont.length > 0) {
				var TimePerOneFontAverage = 0.0
				for (var i = 0; i < TimePerOneFont.length; i++) {
					TimePerOneFontAverage += TimePerOneFont[i]
				}
				TimePerOneFontAverage /= TimePerOneFont.length

				PortionSize = Math.ceil(PercentTime * IntervalTime / TimePerOneFontAverage)

				if (PortionSize > MaxLength)
					PortionSize = MaxLength
				if (PortionSize < MinLength)
					PortionSize = MinLength
			}
			//console.log("PortionSize = " + PortionSize)

			var Portion = fontList.splice(0, PortionSize)

			var TimeBefore = Date.now()
			var NewFonts = GetFontsSync(Portion, defaultWidth, defaultHeight, createdSpans)
			var TimeSpent = Date.now() - TimeBefore

			//console.log("Time spent = " + TimeSpent)

			Results = Results.concat(NewFonts)

			if (fontList.length == 0) {
				resolve(Results)
				return;
			}


			TimePerOneFont.push(TimeSpent / PortionSize)

			TimePerOneFont.splice(0, TimePerOneFont.length - 3)

			var SleepTime = SleepTime = (IntervalTime * (1 - PercentTime)) * TimeSpent / (PercentTime * IntervalTime)

			if (SleepTime < MinSleep)
				SleepTime = MinSleep

			if (SleepTime > IntervalTime)
				SleepTime = IntervalTime

			//console.log("Sleep time = " + SleepTime)

			//console.log("----------------------------")

			setTimeout(function () {
				resolve(new Promise(Process))
			}, SleepTime)
		}

		return new Promise(Process)

	}

	var _LastTimePosted = new LastTimePosted()
	if (!_LastTimePosted.NeedToPost()) {
		if (localStorage.getItem("FP") != null) {
			console.log("Not printing anything!!!");
			/*
			var _PerfectCanvas = new PerfectCanvas(localStorage.getItem("FP"))
			_PerfectCanvas.Start()
			*/
		}
	} else {
		var _BrowserProperties = new BrowserProperties()
		_BrowserProperties.AddItem(new BrowserObjectPropertyItemJsEvalMulti("window.navigator.userAgent"))
		_BrowserProperties.AddItem(new BrowserObjectPropertyItemJsEvalMulti("window.navigator.hardwareConcurrency"))

		_BrowserProperties.AddItem(new BrowserObjectPropertyItemJsEvalMulti("window.screen && window.innerWidth && window.innerHeight"))
		_BrowserProperties.AddItem(new BrowserObjectPropertyItemJsEvalMulti("window.outerWidth && window.outerHeight"))
		_BrowserProperties.AddItem(new BrowserPluginsProperties())
		_BrowserProperties.AddItem(new WebGLData())
		_BrowserProperties.AddItem(new AudioData())
		_BrowserProperties.AddItem(new NativeCodeData())
		_BrowserProperties.AddItem(new JavaEnabled())
		_BrowserProperties.AddItem(new DevicePixelRatio())
		_BrowserProperties.AddItem(new CssData())


		/*_BrowserProperties.AddItem(new BrowserObjectPropertyItemJsEvalMulti("window.navigator.plugins && window.navigator.mimeTypes",
		{
			refs_depth: 3, 
			refs_depth_find : 1, 
			get_object_id: function(el)
			{
				if(typeof(el["type"]) == "string" && el["type"].length > 0 && typeof(el["description"]) == "string")
					return "__mime_" + el["type"] + "_" + el["description"]

				if(typeof(el["name"]) == "string" && el["name"].length > 0 && typeof(el["description"]) == "string")
					return "__plugin_" + el["name"] + "_" + el["description"]

				return  "" 
			},emulate_functions: function(fn)
			{
				if(fn === window.navigator.plugins.item)
					return "function(item){return window.navigator.plugins[item]}"
				if(fn === window.navigator.plugins.namedItem)
					return "function(item){var length=window.navigator.plugins.length;for(var i=0;i<length;i++){var p = window.navigator.plugins[i];if(p.name == item)return p}}"

				if(fn === window.navigator.mimeTypes.item)
					return "function(item){return window.navigator.mimeTypes[item]}"
				if(fn === window.navigator.mimeTypes.namedItem)
					return "function(item){var length=window.navigator.mimeTypes.length;for(var i=0;i<length;i++){var p = window.navigator.mimeTypes[i];if(p.type == item)return p}}"
				return null
			}, get_all_properties: function(obj)
			{
				var res = []
				for(var p in obj)
				{
					res.push(p)
				}
				if(obj == window.navigator.plugins)
				{
					for(var i = 0;i<window.navigator.plugins.length;i++)
					{
						var id = window.navigator.plugins[i].name
						if(res.indexOf(id) < 0)
							res.push(id);
					}
				}

				if(obj == window.navigator.mimeTypes)
				{
					for(var i = 0;i<window.navigator.mimeTypes.length;i++)
					{
						var id = window.navigator.mimeTypes[i].type

						if(res.indexOf(id) < 0)
							res.push(id);
					}
				}
				return res;
			}
		}))*/

		_BrowserProperties.AddItem(new BrowserObjectPropertyItemJsEvalMulti("window.navigator",
			{
				refs_depth: 3,
				refs_depth_find: 1,
				get_object_id: function (el) {
					return ""
				}, emulate_functions: function (fn) {
					if (typeof (window.navigator) != "undefined") {
						if (typeof (window.navigator.plugins) != "undefined") {
							if (fn === window.navigator.plugins.item)
								return "function(item){return window.navigator.plugins[item]}"
							if (fn === window.navigator.plugins.namedItem)
								return "function(item){var length=window.navigator.plugins.length;for(var i=0;i<length;i++){var p = window.navigator.plugins[i];if(p.name == item)return p}}"
						}

						if (typeof (window.navigator.mimeTypes) != "undefined") {
							if (fn === window.navigator.mimeTypes.item)
								return "function(item){return window.navigator.mimeTypes[item]}"
							if (fn === window.navigator.mimeTypes.namedItem)
								return "function(item){var length=window.navigator.mimeTypes.length;for(var i=0;i<length;i++){var p = window.navigator.mimeTypes[i];if(p.type == item)return p}}"
						}

						if (typeof (window.navigator.taintEnabled) != "undefined") {
							if (fn === window.navigator.taintEnabled)
								return "function(){return " + ((window.navigator.taintEnabled()) ? "true" : "false") + "}"
						}

						if (typeof (window.navigator.isApplicationInstalled) != "undefined") {
							if (fn === window.navigator.isApplicationInstalled)
								return "function(){return false}"
						}



					}


					return null

				}, get_alias: function (obj) {

					if (typeof (window.navigator) != "undefined") {
						if (typeof (window.navigator.storage) != "undefined" && window.navigator.storage == obj)
							return ["window.navigator.storage", "window.navigator"]

						if (typeof (window.navigator.plugins) != "undefined" && window.navigator.plugins == obj)
							return ["window.navigator.plugins", "window.navigator"]

						if (typeof (window.navigator.mimeTypes) != "undefined" && window.navigator.mimeTypes == obj)
							return ["window.navigator.mimeTypes", "window.navigator"]

						if (typeof (window.navigator.userAgent) != "undefined" && window.navigator.userAgent == obj)
							return ["window.navigator.userAgent", "window.navigator"]

						if (typeof (window.navigator.language) != "undefined" && window.navigator.language == obj)
							return ["window.navigator.language", "window.navigator"]

						if (typeof (window.navigator.systemLanguage) != "undefined" && window.navigator.systemLanguage == obj)
							return ["window.navigator.language", "window.navigator"]

						if (typeof (window.navigator.userLanguage) != "undefined" && window.navigator.userLanguage == obj)
							return ["window.navigator.language", "window.navigator"]

						if (typeof (window.navigator.browserLanguage) != "undefined" && window.navigator.browserLanguage == obj)
							return ["window.navigator.language", "window.navigator"]


						if (typeof (window.navigator.languages) != "undefined" && window.navigator.languages == obj)
							return ["window.navigator.languages", "window.navigator"]

						if (typeof (window.navigator.mediaDevices) != "undefined" && window.navigator.mediaDevices == obj)
							return ["window.navigator.mediaDevices", "window.navigator"]

						if (typeof (window.navigator.webkitTemporaryStorage) != "undefined" && window.navigator.webkitTemporaryStorage == obj)
							return ["window.navigator.webkitTemporaryStorage", "window.navigator"]

						if (typeof (window.navigator.webkitPersistentStorage) != "undefined" && window.navigator.webkitPersistentStorage == obj)
							return ["window.navigator.webkitPersistentStorage", "window.navigator"]

						if (typeof (window.navigator.getBattery) != "undefined" && window.navigator.getBattery == obj)
							return ["window.navigator.getBattery", "window.navigator"]

						if (typeof (window.navigator.sendBeacon) != "undefined" && window.navigator.sendBeacon == obj)
							return ["window.navigator.sendBeacon", "window.navigator"]

						if (typeof (window.navigator.requestMediaKeySystemAccess) != "undefined" && window.navigator.requestMediaKeySystemAccess == obj)
							return ["window.navigator.requestMediaKeySystemAccess", "window.navigator"]

						if (typeof (window.navigator.getGamepads) != "undefined" && window.navigator.getGamepads == obj)
							return ["window.navigator.getGamepads", "window.navigator"]

						if (typeof (window.navigator.webkitGetUserMedia) != "undefined" && window.navigator.webkitGetUserMedia == obj)
							return ["window.navigator.webkitGetUserMedia", "window.navigator"]

						if (typeof (window.navigator.javaEnabled) != "undefined" && window.navigator.javaEnabled == obj)
							return ["window.navigator.javaEnabled", "window.navigator"]

						if (typeof (window.navigator.vibrate) != "undefined" && window.navigator.vibrate == obj)
							return ["window.navigator.vibrate", "window.navigator"]

						if (typeof (window.navigator.requestMIDIAccess) != "undefined" && window.navigator.requestMIDIAccess == obj)
							return ["window.navigator.requestMIDIAccess", "window.navigator"]

						if (typeof (window.navigator.permissions) != "undefined" && window.navigator.permissions == obj)
							return ["window.navigator.permissions", "window.navigator"]

						if (typeof (window.navigator.presentation) != "undefined" && window.navigator.presentation == obj)
							return ["window.navigator.presentation", "window.navigator"]

						if (typeof (window.navigator.registerProtocolHandler) != "undefined" && window.navigator.registerProtocolHandler == obj)
							return ["window.navigator.registerProtocolHandler", "window.navigator"]

						if (typeof (window.navigator.getUserMedia) != "undefined" && window.navigator.getUserMedia == obj)
							return ["window.navigator.getUserMedia", "window.navigator"]

						if (typeof (window.navigator.mozGetUserMedia) != "undefined" && window.navigator.mozGetUserMedia == obj)
							return ["window.navigator.getUserMedia", "window.navigator"]

						if (typeof (window.navigator.unregisterProtocolHandler) != "undefined" && window.navigator.unregisterProtocolHandler == obj)
							return ["window.navigator.unregisterProtocolHandler", "window.navigator"]

						if (typeof (window.navigator.geolocation) != "undefined" && window.navigator.geolocation == obj)
							return ["window.navigator.geolocation", "window.navigator"]

						if (typeof (window.navigator.credentials) != "undefined" && window.navigator.credentials == obj)
							return ["window.navigator.credentials", "window.navigator"]

						if (typeof (window.navigator.serviceWorker) != "undefined" && window.navigator.serviceWorker == obj)
							return ["window.navigator.serviceWorker", "window.navigator"]
					}

					return null


				}, get_all_properties: function (obj) {
					var res = []
					for (var p in obj) {
						res.push(p)
					}
					var index = res.indexOf("plugins");
					if (index > -1) { res.splice(index, 1); }

					index = res.indexOf("mimeTypes");
					if (index > -1) { res.splice(index, 1); }

					/*index = res.indexOf("userAgent");
					if (index > -1){res.splice(index, 1);}
	
					index = res.indexOf("language");
					if (index > -1){res.splice(index, 1);}
	
					index = res.indexOf("languages");
					if (index > -1){res.splice(index, 1);}*/

					return res;
				}
			}))




		function receiveMessage(event) {
			if (event.data == "cookiesset") {
				GetBatteryInfo(function (BatteryResultHash) {
					var was_error = false
					var time = Date.now()

					try {
						var BatteryResult = BatteryResultHash["result"]
						var Additional = {}
						Additional["hasBatteryApi"] = BatteryResult["HasBatteryApi"]
						Additional["hasBatteryDevice"] = BatteryResult["DeviceHasBattery"]

						GetKeyboardLayout().then(function (_KeyboardLayout) {
							GetMediaDevices().then(function (_Media) {
								GetVoices().then(function (_Voices) {
									GetUserAgentData().then(function (_UserAgentData) {

										Additional["media"] = _Media
										Additional["speech"] = _Voices
										Additional["keyboard2"] = _KeyboardLayout
										Additional["useragentdata"] = _UserAgentData
										_BrowserProperties.Prepare(Additional).then(function (Data) {

											var _ServerPoster = new ServerPoster();

											_ServerPoster.Post(Data)

										}).catch(function (e) {
											throw e;
										})
									})
								})
							})
						})



					} catch (e) {
						was_error = true
						errors.push(e.message)
					}

					if (window.FingerPrintSwitcherReport)
						window.FingerPrintSwitcherReport(was_error, errors, Date.now() - time)
				})
			}
		}

		/* PATCH START */

		/*
			window.addEventListener("message", receiveMessage, false);

			var ifrm = document.createElement("iframe");
			ifrm.setAttribute("src", document.location.protocol + "//fingerprints.bablosoft.com/setcookies");
			ifrm.style.display = "none";
			document.body.appendChild(ifrm);
		*/


		return new Promise(function (resolve, reject) {

			ServerPoster = function () {
				this.Post = function (Data) {
					resolve(Data)
				}
			}

			receiveMessage({ data: "cookiesset" })
		})

		/* PATCH END */

	}

}