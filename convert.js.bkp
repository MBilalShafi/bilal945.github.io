function ConvertFingerprint(Data) {
    function PreparePlugin(OBJECT, FINGERPRINT_JSON, VERSION) {
        var PluginsResults = []
        var MimesResults = []

        var PluginsObjects = OBJECT["dat"]["window_navigator_plugins && window_navigator_mimeTypes"]["window_navigator_plugins"]["value"]
        var MimesObjects = OBJECT["dat"]["window_navigator_plugins && window_navigator_mimeTypes"]["window_navigator_mimeTypes"]["value"]

        var PluginIndex = 0
        while (true) {
            var PluginsObject = PluginsObjects[PluginIndex.toString()]
            if (typeof (PluginsObject) == "object") {
                try {
                    var PluginResult = { ref: PluginsObject.ref }
                    var PluginRef = OBJECT.refs[PluginsObject.ref].value
                    PluginResult.description = PluginRef.description.value
                    PluginResult.filename = PluginRef.filename.value
                    PluginResult.name = PluginRef.name.value

                    var MimeResultsInsidePlugin = []

                    var MimeIndex = 0
                    while (true) {
                        var MimesObject = PluginRef[MimeIndex.toString()]
                        if (typeof (MimesObject) == "object") {
                            MimeResultsInsidePlugin.push(MimesObject.ref)
                        } else {
                            break;
                        }
                        MimeIndex++;
                    }

                    PluginResult.mimes = MimeResultsInsidePlugin

                    PluginsResults.push(PluginResult)
                } catch (e) {

                }
            } else {
                break;
            }
            PluginIndex++;
        }

        var MimeIndex = 0
        while (true) {
            var MimesObject = MimesObjects[MimeIndex.toString()]
            if (typeof (MimesObject) == "object") {
                try {
                    var MimeResult = { ref: MimesObject.ref }
                    var MimeRef = OBJECT.refs[MimesObject.ref].value
                    MimeResult.description = MimeRef.description.value
                    MimeResult.suffixes = MimeRef.suffixes.value
                    MimeResult.type = MimeRef.type.value

                    MimeResult.plugin = MimeRef.enabledPlugin.ref

                    MimesResults.push(MimeResult)
                } catch (e) {

                }
            } else {
                break;
            }
            MimeIndex++;
        }

        FINGERPRINT_JSON["plugins"] = PluginsResults
        FINGERPRINT_JSON["mimes"] = MimesResults

    }

    function FingerprintFinalize(obj, version) {
        var json = { valid: true }

        if (version >= 3) {
            PreparePlugin(obj, json, version)
        }
        json["ua"] = obj["ua"]
        json["tags"] = obj["tags"]
        json["dnt"] = obj["dnt"]

        json["width"] = obj["dat"]["window_screen && window_innerWidth && window_innerHeight"]["window_innerWidth"]["value"]
        json["height"] = obj["dat"]["window_screen && window_innerWidth && window_innerHeight"]["window_innerHeight"]["value"]

        var HasBatteryApi = null;
        var HasBatteryDevice = null;
        if ("hasBatteryApi" in obj)
            HasBatteryApi = obj["hasBatteryApi"]
        if ("hasBatteryDevice" in obj)
            HasBatteryDevice = obj["hasBatteryDevice"]

        json["has_battery_api"] = HasBatteryApi
        json["has_battery_device"] = HasBatteryDevice

        json["webgl_properties"] = obj["webgl"]

        var AudioProperties = obj["audio"]
        if (AudioProperties)
            json["audio_properties"] = AudioProperties

        json["fonts"] = obj["fonts"]
        json["headers"] = obj["headers"]
        json["lang"] = obj["lang"]

        var NativeCode = obj["nativeCode"]
        if (NativeCode) {
            json["native_code"] = NativeCode
        } else if (obj["windowProperties"] && obj["windowProperties"]["T2JqZWN0"] && obj["windowProperties"]["T2JqZWN0"]["toString"]) {
            json["native_code"] = obj["windowProperties"]["T2JqZWN0"]["toString"]

        }

        var Attributes = {}

        try { Attributes["navigator.vendorSub"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["vendorSub"]["value"] } catch (e) { }
        try { Attributes["navigator.productSub"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["productSub"]["value"] } catch (e) { }
        try { Attributes["navigator.vendor"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["vendor"]["value"] } catch (e) { }
        try { Attributes["navigator.appCodeName"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["appCodeName"]["value"] } catch (e) { }
        try { Attributes["navigator.appName"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["appName"]["value"] } catch (e) { }
        try { Attributes["navigator.appVersion"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["appVersion"]["value"] } catch (e) { }
        try { Attributes["navigator.platform"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["platform"]["value"] } catch (e) { }
        try { Attributes["navigator.product"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["product"]["value"] } catch (e) { }
        try { Attributes["navigator.userAgent"] = obj["dat"]['window_navigator_userAgent']['window_navigator_userAgent']['value'] } catch (e) { }

        try { Attributes["screen.availHeight"] = obj["dat"]["window_screen && window_innerWidth && window_innerHeight"]["window_screen"]["value"]["availHeight"]["value"] } catch (e) { }
        try { Attributes["screen.availWidth"] = obj["dat"]["window_screen && window_innerWidth && window_innerHeight"]["window_screen"]["value"]["availWidth"]["value"] } catch (e) { }
        try { Attributes["screen.width"] = obj["dat"]["window_screen && window_innerWidth && window_innerHeight"]["window_screen"]["value"]["width"]["value"] } catch (e) { }
        try { Attributes["screen.height"] = obj["dat"]["window_screen && window_innerWidth && window_innerHeight"]["window_screen"]["value"]["height"]["value"] } catch (e) { }
        try { Attributes["screen.colorDepth"] = obj["dat"]["window_screen && window_innerWidth && window_innerHeight"]["window_screen"]["value"]["colorDepth"]["value"] } catch (e) { }
        try { Attributes["screen.pixelDepth"] = obj["dat"]["window_screen && window_innerWidth && window_innerHeight"]["window_screen"]["value"]["pixelDepth"]["value"] } catch (e) { }
        try { Attributes["screen.availLeft"] = obj["dat"]["window_screen && window_innerWidth && window_innerHeight"]["window_screen"]["value"]["availLeft"]["value"] } catch (e) { }
        try { Attributes["screen.availTop"] = obj["dat"]["window_screen && window_innerWidth && window_innerHeight"]["window_screen"]["value"]["availTop"]["value"] } catch (e) { }

        //try{Attributes["innerWidth"] = obj["dat"]["window_screen && window_innerWidth && window_innerHeight"]["window_innerWidth"]["value"]}catch(e){}
        //try{Attributes["innerHeight"] = obj["dat"]["window_screen && window_innerWidth && window_innerHeight"]["window_innerHeight"]["value"]}catch(e){}

        try { Attributes["outerHeight"] = obj["dat"]["window_screen && window_innerWidth && window_innerHeight"]["window_screen"]["value"]["availHeight"]["value"] } catch (e) { }
        try { Attributes["outerWidth"] = obj["dat"]["window_screen && window_innerWidth && window_innerHeight"]["window_screen"]["value"]["availWidth"]["value"] } catch (e) { }

        try {
            if (typeof (obj["css"]) == "object")
                json["css"] = obj["css"]
        } catch (e) {

        }

        try {
            if (typeof (obj["media"]) == "object")
                json["media"] = obj["media"]
        } catch (e) {

        }

        try {
            if (typeof (obj["speech"]) == "object")
                json["speech"] = obj["speech"]
        } catch (e) {

        }

        try {
            if (typeof (obj["heap"]) == "string")
                json["heap"] = obj["heap"]
        } catch (e) {

        }

        try {
            if (typeof (obj["keyboard2"]) == "object")
                json["keyboard"] = obj["keyboard2"]
        } catch (e) {

        }

        try {
            if (typeof (obj["useragentdata"]) == "string")
                json["useragentdata"] = obj["useragentdata"]
        } catch (e) {

        }

        try {
            json["connection"] = {}
            try { json["connection"]["type"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["connection"]["value"]["type"]["value"] } catch (e) { }
            try { json["connection"]["downlinkMax"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["connection"]["value"]["downlinkMax"]["value"] } catch (e) { }
            try { json["connection"]["effectiveType"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["connection"]["value"]["effectiveType"]["value"] } catch (e) { }
            try { json["connection"]["rtt"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["connection"]["value"]["rtt"]["value"] } catch (e) { }
            try { json["connection"]["downlink"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["connection"]["value"]["downlink"]["value"] } catch (e) { }
            try { json["connection"]["saveData"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["connection"]["value"]["saveData"]["value"] } catch (e) { }
        } catch (e) {

        }

        json["attr"] = Attributes

        try { json["attr"]["hardwareConcurrency"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["hardwareConcurrency"]["value"] } catch (e) { }
        try { json["attr"]["maxTouchPoints"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["maxTouchPoints"]["value"] } catch (e) { }
        try { json["attr"]["deviceMemory"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["deviceMemory"]["value"] } catch (e) { }
        try { json["attr"]["window.devicePixelRatio"] = obj["pixelRatio"]["value"] } catch (e) { }


        json["orientation"] = {}
        try { json["orientation"]["angle"] = obj["dat"]["window_screen && window_innerWidth && window_innerHeight"]["window_screen"]["value"]["orientation"]["value"]["angle"]["value"] } catch (e) { }
        try { json["orientation"]["type"] = obj["dat"]["window_screen && window_innerWidth && window_innerHeight"]["window_screen"]["value"]["orientation"]["value"]["type"]["value"] } catch (e) { }

        try { json["doNotTrack"] = obj["dat"]["window_navigator"]["window_navigator"]["value"]["doNotTrack"]["value"] } catch (e) { }

        return JSON.stringify(json)
            .replace("Object.defineProperty(window.navigator, \\\"serviceWorker\\\", {configurable: true, enumerable:false, get: function() {return undefined;}});", "")
            .replace("Object.defineProperty(window.navigator, \\\"credentials\\\", {configurable: true, enumerable:false, get: function() {return undefined;}});", "")

    }
    function checkUTF8(text) {
        var utf8Text = text;
        try {
            utf8Text = decodeURIComponent(escape(text));
        } catch (e) {
            return true;
        }
        return false; // returned text is always utf-8
    }

    function FingerprintToINI(obj) {
        var FINGERPRINT_JSON = obj

        var Settings = {}

        /*Settings["RectanglesReplace"] = "false"
        Settings["RectanglesFingerprint"] = ""*/

        Settings["PerfectCanvasCapture"] = "Enable"
        Settings["PerfectCanvasDoReplace"] = "Enable"

        Settings["CanvasType"] = "Enable"
        Settings["CanvasFingerprint"] = ""

        Settings["WebglType"] = "Enable"
        Settings["WebglFingerprint"] = ""


        var Keys = Object.keys(FINGERPRINT_JSON["webgl_properties"])
        for (var i = 0; i < Keys.length; i++) {
            var Key = Keys[i]
            var Value = FINGERPRINT_JSON["webgl_properties"][Key]
            if (typeof (Value) == "number") {
                Value = Value.toString()
            }
            if (!Value)
                Value = ""
            if (typeof (Value) == "object") {
                var ValueKeys = Object.keys(Value)
                for (var j = 0; j < ValueKeys.length; j++) {
                    var Key2 = ValueKeys[j]
                    Settings["Webgl." + Key + "." + Key2] = Value[Key2].toString()
                }
            } else {
                Settings["Webgl." + Key] = Value
            }
        }

        Settings["BatteryEnabled"] = "false"

        Settings["AudioType"] = "Enable"
        Settings["AudioNoise"] = ""
        if (FINGERPRINT_JSON["audio_properties"]) {
            var Keys = Object.keys(FINGERPRINT_JSON["audio_properties"])
            for (var i = 0; i < Keys.length; i++) {
                var Key = Keys[i]
                var Value = FINGERPRINT_JSON["audio_properties"][Key]
                if (Value) {
                    if (Key == "BaseAudioContextSampleRate")
                        Key = "sampleRate"
                    else if (Key == "AudioDestinationNodeMaxChannelCount")
                        Key = "maxChannelCount"
                    else if (Key == "AudioContextBaseLatency")
                        Key = "baseLatency"
                    else
                        Key = ""
                    if (Key.length > 0)
                        Settings["Attribute." + Key] = Value.toString()
                }
            }
        }

        if (FINGERPRINT_JSON["plugins"] && FINGERPRINT_JSON["mimes"]) {
            Settings["Plugins"] = btoa(JSON.stringify(FINGERPRINT_JSON["plugins"]))
            Settings["Mimes"] = btoa(JSON.stringify(FINGERPRINT_JSON["mimes"]))
        }

        if (FINGERPRINT_JSON["attr"]) {
            var Keys = Object.keys(FINGERPRINT_JSON["attr"])
            for (var i = 0; i < Keys.length; i++) {
                var Key = Keys[i]
                var Split = Key.split(".")
                var KeySettings = "Attribute." + Split[Split.length - 1]
                try {
                    Settings[KeySettings] = FINGERPRINT_JSON["attr"][Key].toString()
                } catch (e) {
                    Settings[KeySettings] = ""
                }
            }
        }

        Settings["Setting.forceAndroidOverlayScrollbar"] = "Disable"
        Settings["Setting.passwordEchoEnabled"] = "Disable"
        Settings["Setting.textAreasAreResizable"] = "Enable"
        Settings["Setting.useSolidColorScrollbars"] = "Disable"
        Settings["Setting.availablePointerTypes"] = "4"
        Settings["Setting.availableHoverTypes"] = "2"
        Settings["Setting.primaryPointerType"] = "4"
        Settings["Setting.primaryHoverType"] = "2"
        Settings["BrowserMode"] = "Desktop"
        Settings["Feature.TouchEventFeatureDetection"] = "Disable"

        if (FINGERPRINT_JSON["connection"]) {
            var NetInfoDownlinkMax = false
            var Keys = Object.keys(FINGERPRINT_JSON["connection"])
            var HasConnection = Keys.length > 0

            for (var i = 0; i < Keys.length; i++) {
                var Key = Keys[i]

                if (Key == "downlinkMax") {
                    NetInfoDownlinkMax = true;
                }

                var KeySettings = "Attribute.Connection." + Key
                try {
                    if (typeof (FINGERPRINT_JSON["connection"][Key]) == "boolean") {
                        Settings[KeySettings] = (FINGERPRINT_JSON["connection"][Key]) ? "1" : "0";
                    } else if (typeof (FINGERPRINT_JSON["connection"][Key]) == "object" && FINGERPRINT_JSON["connection"][Key] == null) {
                        Settings[KeySettings] = "0";
                    } else {
                        Settings[KeySettings] = FINGERPRINT_JSON["connection"][Key].toString()
                    }
                } catch (e) {
                    Settings[KeySettings] = ""
                }
            }
            if (!HasConnection) {
                Settings["Feature.FingerprintsConnection"] = "Disable"
            }

            if (NetInfoDownlinkMax) {
                Settings["Feature.NetInfoDownlinkMax"] = "Enable"
            }
        }

        if (FINGERPRINT_JSON["orientation"]) {
            var Keys = Object.keys(FINGERPRINT_JSON["orientation"])

            for (var i = 0; i < Keys.length; i++) {
                var Key = Keys[i]

                var KeySettings = "Attribute.Orientation." + Key
                try {
                    Settings[KeySettings] = FINGERPRINT_JSON["orientation"][Key].toString()
                } catch (e) {
                    Settings[KeySettings] = ""
                }
            }
        }

        if (FINGERPRINT_JSON["css"]) {
            var Keys = Object.keys(FINGERPRINT_JSON["css"])
            for (var i = 0; i < Keys.length; i++) {
                var Key = "css-" + Keys[i]
                Key = Key.split("-").map(function (word) {
                    if (!word)
                        return word;
                    return word.charAt(0).toUpperCase() + word.slice(1)
                }).join("")
                Settings[Key] = FINGERPRINT_JSON["css"][Keys[i]].toString()
            }
        }

        if (typeof (FINGERPRINT_JSON["keyboard"]) == "object" && typeof (FINGERPRINT_JSON["keyboard"].length) == "number") {
            Settings["KeyboardLayout"] = btoa(JSON.stringify(FINGERPRINT_JSON["keyboard"]))
        }

        if (typeof (FINGERPRINT_JSON["media"]) == "object" && typeof (FINGERPRINT_JSON["media"]["devices"]) == "object" && typeof (FINGERPRINT_JSON["media"]["constraints"]) == "object") {
            try {
                var AllDevices = []
                for (var i = 0; i < FINGERPRINT_JSON["media"]["devices"].length; i++) {
                    var Device = FINGERPRINT_JSON["media"]["devices"][i]
                    if (typeof (Device) == "object" && typeof (Device.deviceId) == "string" && typeof (Device.kind) == "string" && typeof (Device.label) == "string" && typeof (Device.groupId) == "string") {
                        AllDevices.push(Device.deviceId)
                        AllDevices.push(Device.kind)
                        AllDevices.push(Device.label)
                        AllDevices.push(Device.groupId)
                    }
                }
                Settings["MediaDevices"] = btoa(JSON.stringify(AllDevices))

            } catch (e) {
            }

            try {
                var AllConstrains = Object.keys(FINGERPRINT_JSON["media"]["constraints"])
                var ActualConstrains = []
                for (var i = 0; i < AllConstrains.length; i++) {
                    var Constrain = AllConstrains[i]
                    if (typeof (FINGERPRINT_JSON["media"]["constraints"][Constrain]) == "boolean" && FINGERPRINT_JSON["media"]["constraints"][Constrain] === true) {
                        ActualConstrains.push(Constrain)
                    }
                }
                Settings["MediaConstrains"] = btoa(JSON.stringify(ActualConstrains))
            } catch (e) {
            }
        }

        Settings["PerfectCanvasCapture"] = "Enable"
        Settings["PerfectCanvasDoReplace"] = "Enable"

        Settings["FontList"] = FINGERPRINT_JSON["fonts"].join(";")

        try {
            Settings["Tags"] = FINGERPRINT_JSON["tags"].join(",")
        } catch (e) {

        }

        try {

            if (FINGERPRINT_JSON["speech"]) {
                var newObj = []

                for (let i = 0; i < FINGERPRINT_JSON["speech"].length; i++) {
                    var keys = Object.keys(Object.getPrototypeOf(FINGERPRINT_JSON["speech"][i]))
                    if (!keys || keys.length == 0   )
                        keys = Object.keys(FINGERPRINT_JSON['speech'][i]);
                    var good = true
                    for (let w = 0; w < keys.length; w++) {
                        if (checkUTF8(FINGERPRINT_JSON['speech'][i][keys[w]] + "")) {
                            good = false
                        }
                    }
                    if (good) {
                        newObj.push(FINGERPRINT_JSON['speech'][i])
                    }
                }
                Settings["Speech"] = btoa(JSON.stringify(newObj))
            }
            else
                Settings["Speech"] = btoa("[]")
        } catch (e) {
            Settings["Speech"] = btoa("[]")
        }

        try {
            if (FINGERPRINT_JSON["heap"]) {
                Settings["Feature.FingerprintsMemory"] = "Enable"
                Settings["Heap"] = FINGERPRINT_JSON["heap"]
            }
            else {
                Settings["Feature.FingerprintsMemory"] = "Disable"
            }

        } catch (e) {
            Settings["Feature.FingerprintsMemory"] = "Disable"
        }

        Settings['HasBatteryAPI'] = false
        Settings['HasBatteryDevice'] = false
        Settings['AdditionalHeaders'] = btoa(JSON.stringify(['User-Agent', navigator.userAgent, 'Accept-Language', navigator.language]))
        Settings['QUIC'] = 'Disable'
        return Settings
    }


    Data = FingerprintFinalize(JSON.parse(Data), 5)


    return FingerprintToINI(JSON.parse(Data))

}


