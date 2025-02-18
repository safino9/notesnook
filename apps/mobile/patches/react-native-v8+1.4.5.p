diff --git a/node_modules/react-native-v8/android/CMakeLists.txt b/node_modules/react-native-v8/android/CMakeLists.txt
index 66dae03..e9c233f 100644
--- a/node_modules/react-native-v8/android/CMakeLists.txt
+++ b/node_modules/react-native-v8/android/CMakeLists.txt
@@ -20,9 +20,9 @@ set(CMAKE_CXX_FLAGS "-DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_HA
 #   set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} -g")
 # endif()
 
-if(${ANDROID_ABI} STREQUAL "arm64-v8a" OR ${ANDROID_ABI} STREQUAL "x86_64")
-  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -DV8_COMPRESS_POINTERS")
-endif()
+if (${ANDROID_ABI} STREQUAL "arm64-v8a" OR ${ANDROID_ABI} STREQUAL "x86_64")
+    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -DV8_COMPRESS_POINTERS")
+endif ()
 
 set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
 set(CMAKE_EXPORT_COMPILE_COMMANDS ON CACHE INTERNAL "")
@@ -34,14 +34,14 @@ set(RN_SO_DIR "${RN_DIR}/ReactAndroid/src/main/jni/first-party/react/jni")
 set(FBJNI_HEADERS_DIR "${RN_SO_DIR}/../../fbjni/headers")
 
 set(V8RUNTIME_COMMON_DIR "${CMAKE_SOURCE_DIR}/../src/v8runtime")
-file(GLOB SOURCES_V8RUNTIME  "${V8RUNTIME_COMMON_DIR}/*.cpp")
+file(GLOB SOURCES_V8RUNTIME "${V8RUNTIME_COMMON_DIR}/*.cpp")
 
 add_library(
-  ${PACKAGE_NAME}
-  SHARED
-  ${SOURCES_V8RUNTIME}
-  "${SRC_DIR}/V8ExecutorFactory.cpp"
-  "${SRC_DIR}/OnLoad.cpp"
+        ${PACKAGE_NAME}
+        SHARED
+        ${SOURCES_V8RUNTIME}
+        "${SRC_DIR}/V8ExecutorFactory.cpp"
+        "${SRC_DIR}/OnLoad.cpp"
 )
 
 # includes
@@ -49,19 +49,19 @@ add_library(
 file(GLOB LIBFBJNI_INCLUDE_DIR ${FBJNI_HEADERS_DIR})
 
 target_include_directories(
-  ${PACKAGE_NAME}
-  PRIVATE
-  "${V8RUNTIME_COMMON_DIR}"
-  "${LIBFBJNI_INCLUDE_DIR}"
-  "${BUILD_DIR}/third-party-ndk/boost/boost_${BOOST_VERSION}"
-  "${BUILD_DIR}/third-party-ndk/double-conversion"
-  "${BUILD_DIR}/third-party-ndk/folly"
-  "${BUILD_DIR}/third-party-ndk/glog/exported"
-  "${RN_DIR}/ReactAndroid/src/main/jni"
-  "${RN_DIR}/ReactCommon"
-  "${RN_DIR}/ReactCommon/jsi"
-  "${RN_DIR}/ReactCommon/jsiexecutor"
-  "${V8_ANDROID_DIR}/dist/include"
+        ${PACKAGE_NAME}
+        PRIVATE
+        "${V8RUNTIME_COMMON_DIR}"
+        "${LIBFBJNI_INCLUDE_DIR}"
+        "${BUILD_DIR}/third-party-ndk/boost/boost_${BOOST_VERSION}"
+        "${BUILD_DIR}/third-party-ndk/double-conversion"
+        "${BUILD_DIR}/third-party-ndk/folly"
+        "${BUILD_DIR}/third-party-ndk/glog/exported"
+        "${RN_DIR}/ReactAndroid/src/main/jni"
+        "${RN_DIR}/ReactCommon"
+        "${RN_DIR}/ReactCommon/jsi"
+        "${RN_DIR}/ReactCommon/jsiexecutor"
+        "${V8_ANDROID_DIR}/dist/include"
 )
 
 # find libraries
@@ -70,81 +70,93 @@ file(GLOB LIBRN_DIR "${RN_SO_DIR}/${ANDROID_ABI}")
 file(GLOB LIBV8_DIR "${RN_SO_DIR}/../../v8/jni/${ANDROID_ABI}")
 
 find_library(
-  LOG_LIB
-  log
-)
-find_library(
-  FOLLY_JSON_LIB
-  folly_json
-  PATHS ${LIBRN_DIR}
-  NO_CMAKE_FIND_ROOT_PATH
+        LOG_LIB
+        log
 )
+
 find_library(
-  REACT_NATIVE_JNI_LIB
-  reactnativejni
-  PATHS ${LIBRN_DIR}
-  NO_CMAKE_FIND_ROOT_PATH
+        REACT_NATIVE_JNI_LIB
+        reactnativejni
+        PATHS ${LIBRN_DIR}
+        NO_CMAKE_FIND_ROOT_PATH
 )
 find_library(
-  GLOG_LIB
-  glog
-  PATHS ${LIBRN_DIR}
-  NO_CMAKE_FIND_ROOT_PATH
+        GLOG_LIB
+        glog
+        PATHS ${LIBRN_DIR}
+        NO_CMAKE_FIND_ROOT_PATH
 )
 find_library(
-  FBJNI_LIB
-  fbjni
-  PATHS ${LIBRN_DIR}
-  NO_CMAKE_FIND_ROOT_PATH
+        FBJNI_LIB
+        fbjni
+        PATHS ${LIBRN_DIR}
+        NO_CMAKE_FIND_ROOT_PATH
 )
 find_library(
-  JSI_LIB
-  jsi
-  PATHS ${LIBRN_DIR}
-  NO_CMAKE_FIND_ROOT_PATH
+        JSI_LIB
+        jsi
+        PATHS ${LIBRN_DIR}
+        NO_CMAKE_FIND_ROOT_PATH
 )
 find_library(
-  JSINSPECTOR_LIB
-  jsinspector
-  PATHS ${LIBRN_DIR}
-  NO_CMAKE_FIND_ROOT_PATH
+        JSINSPECTOR_LIB
+        jsinspector
+        PATHS ${LIBRN_DIR}
+        NO_CMAKE_FIND_ROOT_PATH
 )
 find_library(
-  V8_ANDROID_LIB
-  v8android
-  PATHS ${LIBV8_DIR}
-  NO_CMAKE_FIND_ROOT_PATH
+        V8_ANDROID_LIB
+        v8android
+        PATHS ${LIBV8_DIR}
+        NO_CMAKE_FIND_ROOT_PATH
 )
 
 # reactnative_internal_static
-file(GLOB INCLUDE_RN_JSIREACT_CPP  "${RN_DIR}/ReactCommon/jsiexecutor/jsireact/*.cpp")
-file(GLOB INCLUDE_RN_REACTPERFLOGGER_CPP  "${RN_DIR}/ReactCommon/reactperflogger/reactperflogger/*.cpp")
+file(GLOB INCLUDE_RN_JSIREACT_CPP "${RN_DIR}/ReactCommon/jsiexecutor/jsireact/*.cpp")
+file(GLOB INCLUDE_RN_REACTPERFLOGGER_CPP "${RN_DIR}/ReactCommon/reactperflogger/reactperflogger/*.cpp")
 
 add_library(
-  reactnative_internal_static
-  STATIC
-  "${INCLUDE_RN_JSIREACT_CPP}"
-  "${INCLUDE_RN_REACTPERFLOGGER_CPP}"
-  "${RN_DIR}/ReactCommon/cxxreact/JSExecutor.cpp"
+        reactnative_internal_static
+        STATIC
+        "${INCLUDE_RN_JSIREACT_CPP}"
+        "${INCLUDE_RN_REACTPERFLOGGER_CPP}"
+        "${RN_DIR}/ReactCommon/cxxreact/JSExecutor.cpp"
 )
 
 target_include_directories(
-  reactnative_internal_static
-  PRIVATE
-  "${BUILD_DIR}/third-party-ndk/boost/boost_${BOOST_VERSION}"
-  "${BUILD_DIR}/third-party-ndk/double-conversion"
-  "${BUILD_DIR}/third-party-ndk/folly"
-  "${BUILD_DIR}/third-party-ndk/glog/exported"
-  "${RN_DIR}/ReactCommon"
-  "${RN_DIR}/ReactCommon/jsi"
-  "${RN_DIR}/ReactCommon/jsiexecutor"
-  "${RN_DIR}/ReactCommon/jsinspector"
-  "${RN_DIR}/ReactCommon/reactperflogger"
+        reactnative_internal_static
+        PRIVATE
+        "${BUILD_DIR}/third-party-ndk/boost/boost_${BOOST_VERSION}"
+        "${BUILD_DIR}/third-party-ndk/double-conversion"
+        "${BUILD_DIR}/third-party-ndk/folly"
+        "${BUILD_DIR}/third-party-ndk/glog/exported"
+        "${RN_DIR}/ReactCommon"
+        "${RN_DIR}/ReactCommon/jsi"
+        "${RN_DIR}/ReactCommon/jsiexecutor"
+        "${RN_DIR}/ReactCommon/jsinspector"
+        "${RN_DIR}/ReactCommon/reactperflogger"
 )
 
+
+if (${REACT_NATIVE_TARGET_VERSION} LESS 69)
+    find_library(
+            FOLLY_LIB
+            folly_json
+            PATHS ${LIBRN_DIR}
+            NO_CMAKE_FIND_ROOT_PATH
+    )
+else ()
+    find_library(
+            FOLLY_LIB
+            folly_runtime
+            PATHS ${LIBRN_DIR}
+            NO_CMAKE_FIND_ROOT_PATH
+    )
+endif ()
+
 target_link_libraries(
-  reactnative_internal_static
-  ${FOLLY_JSON_LIB}
+        reactnative_internal_static
+        ${FOLLY_LIB}
 )
 
 # link to shared libraries
@@ -152,15 +164,15 @@ target_link_libraries(
 set_target_properties(${PACKAGE_NAME} PROPERTIES LINKER_LANGUAGE CXX)
 
 target_link_libraries(
-  ${PACKAGE_NAME}
-  ${LOG_LIB}
-  ${JSI_LIB}
-  ${JSINSPECTOR_LIB}
-  ${GLOG_LIB}
-  ${FBJNI_LIB}
-  ${FOLLY_JSON_LIB}
-  ${REACT_NATIVE_JNI_LIB}
-  ${V8_ANDROID_LIB}
-  reactnative_internal_static
-  android
+        ${PACKAGE_NAME}
+        ${LOG_LIB}
+        ${JSI_LIB}
+        ${JSINSPECTOR_LIB}
+        ${GLOG_LIB}
+        ${FBJNI_LIB}
+        ${FOLLY_LIB}
+        ${REACT_NATIVE_JNI_LIB}
+        ${V8_ANDROID_LIB}
+        reactnative_internal_static
+        android
 )
diff --git a/node_modules/react-native-v8/android/build.gradle b/node_modules/react-native-v8/android/build.gradle
index 4d78df9..3d6e414 100644
--- a/node_modules/react-native-v8/android/build.gradle
+++ b/node_modules/react-native-v8/android/build.gradle
@@ -12,18 +12,18 @@ import org.apache.tools.ant.filters.ReplaceTokens
 
 
 File findNodePackageDir(String packageName, boolean absolute = true) {
-  def nodeCommand = ["node", "--print", "require.resolve('${packageName}/package.json')"]
-  def proc = nodeCommand.execute(null, rootDir)
-  def error = proc.err.text
-  if (error) {
-    throw new GradleException("findNodePackageDir() execution failed - nodeCommand[${nodeCommand.join(' ')}]\n" + error)
-  }
-  def dir = new File(proc.text.trim()).getParentFile()
-  return absolute ? dir.getAbsoluteFile() : dir
+    def nodeCommand = ["node", "--print", "require.resolve('${packageName}/package.json')"]
+    def proc = nodeCommand.execute(null, rootDir)
+    def error = proc.err.text
+    if (error) {
+        throw new GradleException("findNodePackageDir() execution failed - nodeCommand[${nodeCommand.join(' ')}]\n" + error)
+    }
+    def dir = new File(proc.text.trim()).getParentFile()
+    return absolute ? dir.getAbsoluteFile() : dir
 }
 
 def safeExtGet(prop, fallback) {
-  return rootProject.ext.has(prop) ? rootProject.ext.get(prop) : fallback
+    return rootProject.ext.has(prop) ? rootProject.ext.get(prop) : fallback
 }
 
 def reactNativeDir = findNodePackageDir("react-native")
@@ -34,23 +34,23 @@ def (major, minor, patch) = reactNativeVersion.tokenize('.')
 def rnMinorVersion = Integer.parseInt(minor)
 
 def findV8AndroidDir() {
-  def v8Packages = [
-    "v8-android-jit",
-    "v8-android",
-    "v8-android-jit-nointl",
-    "v8-android-nointl",
-  ]
-  for (pkg in v8Packages) {
-    try {
-      return findNodePackageDir(pkg)
-    } catch (Exception e) {
+    def v8Packages = [
+            "v8-android-jit",
+            "v8-android",
+            "v8-android-jit-nointl",
+            "v8-android-nointl",
+    ]
+    for (pkg in v8Packages) {
+        try {
+            return findNodePackageDir(pkg)
+        } catch (Exception e) {
+        }
     }
-  }
-  throw new GradleException("Unable to find v8 package. Please install a package from the following v8 variants:\n" +
-  "  - v8-android-jit\n" +
-  "  - v8-android-jit-nointl\n" +
-  "  - v8-android\n" +
-  "  - v8-android-nointl\n")
+    throw new GradleException("Unable to find v8 package. Please install a package from the following v8 variants:\n" +
+            "  - v8-android-jit\n" +
+            "  - v8-android-jit-nointl\n" +
+            "  - v8-android\n" +
+            "  - v8-android-nointl\n")
 }
 
 def v8AndroidDir = findProperty("v8.android.dir") ?: findV8AndroidDir()
@@ -65,26 +65,28 @@ ext.CODECACHE_MODE_NONE = 0
 ext.CODECACHE_MODE_NORMAL = 1
 ext.CODECACHE_MODE_PREBUILT = 2
 ext.CODECACHE_MODE_NORMAL_WITH_STUB_BUNDLE = 3
+
 def parseCacheMode(cacheMode) {
-  switch (cacheMode) {
-    case null:
-      return ext.CODECACHE_MODE_NONE
-    case "normal":
-      return ext.CODECACHE_MODE_NORMAL
-    case "prebuilt":
-      return ext.CODECACHE_MODE_PREBUILT
-    case "normalWithStubBundle":
-      return ext.CODECACHE_MODE_NORMAL_WITH_STUB_BUNDLE
-    default:
-      throw new GradleException("Unsupported cache mode - ${cacheMode}")
-  }
+    switch (cacheMode) {
+        case null:
+            return ext.CODECACHE_MODE_NONE
+        case "normal":
+            return ext.CODECACHE_MODE_NORMAL
+        case "prebuilt":
+            return ext.CODECACHE_MODE_PREBUILT
+        case "normalWithStubBundle":
+            return ext.CODECACHE_MODE_NORMAL_WITH_STUB_BUNDLE
+        default:
+            throw new GradleException("Unsupported cache mode - ${cacheMode}")
+    }
 }
+
 def v8CacheMode = parseCacheMode(findProperty("v8.cacheMode"))
 
 def localProps = new Properties()
 def localPropertiesFile = file("local.properties")
 if (localPropertiesFile.exists()) {
-  localProps.load(new InputStreamReader(new FileInputStream(localPropertiesFile), "UTF-8"))
+    localProps.load(new InputStreamReader(new FileInputStream(localPropertiesFile), "UTF-8"))
 }
 
 def debugNativeLibraries = localProps.getProperty('NATIVE_DEBUG_ON', 'FALSE').toBoolean()
@@ -110,8 +112,8 @@ def reactNativeThirdPartyDir = new File("${reactNativeDir}/ReactAndroid/src/main
 def _stackProtectorFlag = true
 
 def reactNativeArchitectures() {
-  def value = project.getProperties().get("reactNativeArchitectures")
-  return value ? value.split(",") : ["armeabi-v7a", "x86", "x86_64", "arm64-v8a"]
+    def value = project.getProperties().get("reactNativeArchitectures")
+    return value ? value.split(",") : ["armeabi-v7a", "x86", "x86_64", "arm64-v8a"]
 }
 
 // You need to have following folders in this directory:
@@ -125,266 +127,294 @@ def dependenciesPath = System.getenv("REACT_NATIVE_DEPENDENCIES")
 // If Boost is already present on your system, define the REACT_NATIVE_BOOST_PATH env variable
 // and the build will use that.
 def boostPath = dependenciesPath ?: System.getenv("REACT_NATIVE_BOOST_PATH")
-
+print(dependenciesPath);
 buildscript {
-  repositories {
-    google()
-    mavenCentral()
-  }
-  dependencies {
-    classpath "com.android.tools.build:gradle:4.2.2"
-    classpath "de.undercouch:gradle-download-task:4.1.2"
-  }
+    repositories {
+        google()
+        mavenCentral()
+    }
+    dependencies {
+        classpath "com.android.tools.build:gradle:4.2.2"
+        classpath "de.undercouch:gradle-download-task:4.1.2"
+    }
 }
 
 apply plugin: "com.android.library"
 apply plugin: "de.undercouch.download"
 if (v8CacheMode == CODECACHE_MODE_PREBUILT) {
-  apply from: "./mkcodecache.gradle"
+    apply from: "./mkcodecache.gradle"
 }
 
 android {
-  compileSdkVersion safeExtGet("compileSdkVersion", 30)
-  defaultConfig {
-    minSdkVersion safeExtGet("minSdkVersion", 16)
-    targetSdkVersion safeExtGet("targetSdkVersion", 30)
-    versionCode 1
-    versionName "1.0"
+    compileSdkVersion safeExtGet("compileSdkVersion", 30)
+    defaultConfig {
+        minSdkVersion safeExtGet("minSdkVersion", 16)
+        targetSdkVersion safeExtGet("targetSdkVersion", 30)
+        versionCode 1
+        versionName "1.0"
+        externalNativeBuild {
+            cmake {
+                arguments "-DANDROID_STL=c++_shared",
+                        "-DREACT_NATIVE_TARGET_VERSION=${rnMinorVersion}",
+                        "-DBOOST_VERSION=${BOOST_VERSION}",
+                        "-DBUILD_DIR=${buildDir}",
+                        "-DRN_DIR=${reactNativeDir}",
+                        "-DV8_ANDROID_DIR=${v8AndroidDir}"
+                abiFilters(*reactNativeArchitectures())
+                _stackProtectorFlag ? (cppFlags("-fstack-protector-all")) : null
+            }
+        }
+
+        buildConfigField("boolean", "V8_USE_SNAPSHOT", v8UseSnapshot.toString())
+        buildConfigField("int", "V8_CACHE_MODE", v8CacheMode.toString())
+    }
     externalNativeBuild {
-      cmake {
-        arguments "-DANDROID_STL=c++_shared",
-                  "-DBOOST_VERSION=${BOOST_VERSION}",
-                  "-DBUILD_DIR=${buildDir}",
-                  "-DRN_DIR=${reactNativeDir}",
-                  "-DV8_ANDROID_DIR=${v8AndroidDir}"
-        abiFilters (*reactNativeArchitectures())
-        _stackProtectorFlag ? (cppFlags("-fstack-protector-all")) : null
-      }
+        cmake {
+            path "CMakeLists.txt"
+        }
     }
-
-    buildConfigField("boolean", "V8_USE_SNAPSHOT", v8UseSnapshot.toString())
-    buildConfigField("int", "V8_CACHE_MODE", v8CacheMode.toString())
-  }
-  externalNativeBuild {
-    cmake {
-      path "CMakeLists.txt"
+    lintOptions {
+        abortOnError false
     }
-  }
-  lintOptions {
-    abortOnError false
-  }
-  packagingOptions {
-    // println "Native libs debug enabled: ${debugNativeLibraries}"
-    doNotStrip debugNativeLibraries ? "**/**/*.so" : ''
-    excludes += [
-      "**/libc++_shared.so",
-      "**/libfbjni.so",
-      "**/libjsi.so",
-      "**/libfolly_json.so",
-      "**/libglog.so",
-      "**/libreactnativejni.so",
-      "**/libjsinspector.so",
-    ]
-    pickFirst "**/libv8android.so"
-  }
-  configurations {
-    extractHeaders
-    extractSO
-  }
-  compileOptions {
-    sourceCompatibility JavaVersion.VERSION_1_8
-    targetCompatibility JavaVersion.VERSION_1_8
-  }
-  sourceSets {
-    main {
-      jniLibs.srcDirs = ["${reactNativeDir}/ReactAndroid/src/main/jni/first-party/v8/jni"]
-
-      if (v8UseSnapshot) {
-        assets.srcDirs += [ "${v8AndroidDir}/dist/snapshot_blob" ]
-      }
-
-      if (v8CacheMode == CODECACHE_MODE_NORMAL_WITH_STUB_BUNDLE) {
-        assets.srcDirs += [ "src/stub_bundle" ]
-      }
+    packagingOptions {
+        // println "Native libs debug enabled: ${debugNativeLibraries}"
+        doNotStrip debugNativeLibraries ? "**/**/*.so" : ''
+        excludes += [
+                "**/libc++_shared.so",
+                "**/libfbjni.so",
+                "**/libjsi.so",
+                "**/libfolly_json.so",
+                "**/libfolly_runtime.so",
+                "**/libglog.so",
+                "**/libreactnativejni.so",
+                "**/libjsinspector.so",
+        ]
+        pickFirst "**/libv8android.so"
+    }
+    configurations {
+        extractHeaders
+        extractSO
+    }
+    compileOptions {
+        sourceCompatibility JavaVersion.VERSION_1_8
+        targetCompatibility JavaVersion.VERSION_1_8
+    }
+    sourceSets {
+        main {
+            jniLibs.srcDirs = ["${reactNativeDir}/ReactAndroid/src/main/jni/first-party/v8/jni"]
+
+            if (v8UseSnapshot) {
+                assets.srcDirs += ["${v8AndroidDir}/dist/snapshot_blob"]
+            }
+
+            if (v8CacheMode == CODECACHE_MODE_NORMAL_WITH_STUB_BUNDLE) {
+                assets.srcDirs += ["src/stub_bundle"]
+            }
+        }
     }
-  }
 }
 
 task cleanCmakeCache() {
-  tasks.getByName("clean").dependsOn(cleanCmakeCache)
-  doFirst {
-    delete "${projectDir}/.cxx"
-  }
+    tasks.getByName("clean").dependsOn(cleanCmakeCache)
+    doFirst {
+        delete "${projectDir}/.cxx"
+    }
 }
 
 task createNativeDepsDirectories() {
-  downloadsDir.mkdirs()
-  thirdPartyNdkDir.mkdirs()
+    downloadsDir.mkdirs()
+    thirdPartyNdkDir.mkdirs()
 }
 
 task downloadBoost(dependsOn: createNativeDepsDirectories, type: Download) {
-  src("https://github.com/react-native-community/boost-for-react-native/releases/download/v${BOOST_VERSION.replace("_", ".")}-0/boost_${BOOST_VERSION}.tar.gz")
-  onlyIfNewer(true)
-  overwrite(false)
-  dest(new File(downloadsDir, "boost_${BOOST_VERSION}.tar.gz"))
+    def transformedVersion = BOOST_VERSION.replace("_", ".")
+    def srcUrl = "https://boostorg.jfrog.io/artifactory/main/release/${transformedVersion}/source/boost_${BOOST_VERSION}.tar.gz"
+    if (rnMinorVersion < 69) {
+        srcUrl = "https://github.com/react-native-community/boost-for-react-native/releases/download/v${transformedVersion}-0/boost_${BOOST_VERSION}.tar.gz"
+    }
+    src(srcUrl)
+    onlyIfNewer(true)
+    overwrite(false)
+    dest(new File(downloadsDir, "boost_${BOOST_VERSION}.tar.gz"))
 }
 
 task prepareBoost(dependsOn: boostPath ? [] : [downloadBoost], type: Copy) {
-  from(boostPath ?: tarTree(resources.gzip(downloadBoost.dest)))
-  from("${reactNativeThirdPartyDir}/boost/Android.mk")
-  include("Android.mk", "boost_${BOOST_VERSION}/boost/**/*.hpp", "boost/boost/**/*.hpp")
-  includeEmptyDirs = false
-  into("${thirdPartyNdkDir}/boost")
-  doLast {
-    file("${thirdPartyNdkDir}/boost/boost").renameTo("${thirdPartyNdkDir}/boost/boost_${BOOST_VERSION}")
-  }
+    from(boostPath ?: tarTree(resources.gzip(downloadBoost.dest)))
+    from("${reactNativeThirdPartyDir}/boost/Android.mk")
+    include("Android.mk", "boost_${BOOST_VERSION}/boost/**/*.hpp", "boost/boost/**/*.hpp")
+    includeEmptyDirs = false
+    into("${thirdPartyNdkDir}/boost")
+    doLast {
+        file("${thirdPartyNdkDir}/boost/boost").renameTo("${thirdPartyNdkDir}/boost/boost_${BOOST_VERSION}")
+    }
 }
 
 task downloadDoubleConversion(dependsOn: createNativeDepsDirectories, type: Download) {
-  src("https://github.com/google/double-conversion/archive/v${DOUBLE_CONVERSION_VERSION}.tar.gz")
-  onlyIfNewer(true)
-  overwrite(false)
-  dest(new File(downloadsDir, "double-conversion-${DOUBLE_CONVERSION_VERSION}.tar.gz"))
+    src("https://github.com/google/double-conversion/archive/v${DOUBLE_CONVERSION_VERSION}.tar.gz")
+    onlyIfNewer(true)
+    overwrite(false)
+    dest(new File(downloadsDir, "double-conversion-${DOUBLE_CONVERSION_VERSION}.tar.gz"))
 }
 
 task prepareDoubleConversion(dependsOn: dependenciesPath ? [] : [downloadDoubleConversion], type: Copy) {
-  from(dependenciesPath ?: tarTree(downloadDoubleConversion.dest))
-  from("${reactNativeThirdPartyDir}/double-conversion/Android.mk")
-  include("double-conversion-${DOUBLE_CONVERSION_VERSION}/src/**/*", "Android.mk")
-  filesMatching("*/src/**/*", { fname -> fname.path = "double-conversion/${fname.name}" })
-  includeEmptyDirs = false
-  into("${thirdPartyNdkDir}/double-conversion")
+    from(dependenciesPath ?: tarTree(downloadDoubleConversion.dest))
+    from("${reactNativeThirdPartyDir}/double-conversion/Android.mk")
+    include("double-conversion-${DOUBLE_CONVERSION_VERSION}/src/**/*", "Android.mk")
+    filesMatching("*/src/**/*", { fname -> fname.path = "double-conversion/${fname.name}" })
+    includeEmptyDirs = false
+    into("${thirdPartyNdkDir}/double-conversion")
 }
 
 task downloadFolly(dependsOn: createNativeDepsDirectories, type: Download) {
-  src("https://github.com/facebook/folly/archive/v${FOLLY_VERSION}.tar.gz")
-  onlyIfNewer(true)
-  overwrite(false)
-  dest(new File(downloadsDir, "folly-${FOLLY_VERSION}.tar.gz"))
+    src("https://github.com/facebook/folly/archive/v${FOLLY_VERSION}.tar.gz")
+    onlyIfNewer(true)
+    overwrite(false)
+    dest(new File(downloadsDir, "folly-${FOLLY_VERSION}.tar.gz"))
 }
 
 task prepareFolly(dependsOn: dependenciesPath ? [] : [downloadFolly], type: Copy) {
-  from(dependenciesPath ?: tarTree(downloadFolly.dest))
-  from("${reactNativeThirdPartyDir}/folly/Android.mk")
-  include("folly-${FOLLY_VERSION}/folly/**/*", "Android.mk")
-  eachFile { fname -> fname.path = (fname.path - "folly-${FOLLY_VERSION}/") }
-  includeEmptyDirs = false
-  into("${thirdPartyNdkDir}/folly")
+    from(dependenciesPath ?: tarTree(downloadFolly.dest))
+    from("${reactNativeThirdPartyDir}/folly/Android.mk")
+    include("folly-${FOLLY_VERSION}/folly/**/*", "Android.mk")
+    eachFile { fname -> fname.path = (fname.path - "folly-${FOLLY_VERSION}/") }
+    includeEmptyDirs = false
+    into("${thirdPartyNdkDir}/folly")
 }
 
 task downloadGlog(dependsOn: createNativeDepsDirectories, type: Download) {
-  src("https://github.com/google/glog/archive/v${GLOG_VERSION}.tar.gz")
-  onlyIfNewer(true)
-  overwrite(false)
-  dest(new File(downloadsDir, "glog-${GLOG_VERSION}.tar.gz"))
+    src("https://github.com/google/glog/archive/v${GLOG_VERSION}.tar.gz")
+    onlyIfNewer(true)
+    overwrite(false)
+    dest(new File(downloadsDir, "glog-${GLOG_VERSION}.tar.gz"))
 }
 
 // Prepare glog sources to be compiled, this task will perform steps that normally should've been
 // executed by automake. This way we can avoid dependencies on make/automake
 task prepareGlog(dependsOn: dependenciesPath ? [] : [downloadGlog], type: Copy) {
-  duplicatesStrategy = "include"
-  from(dependenciesPath ?: tarTree(downloadGlog.dest))
-  from("${reactNativeThirdPartyDir}/glog/")
-  include("glog-${GLOG_VERSION}/src/**/*", "Android.mk", "config.h")
-  includeEmptyDirs = false
-  filesMatching("**/*.h.in") {
-    filter(ReplaceTokens, tokens: [
-      ac_cv_have_unistd_h           : "1",
-      ac_cv_have_stdint_h           : "1",
-      ac_cv_have_systypes_h         : "1",
-      ac_cv_have_inttypes_h         : "1",
-      ac_cv_have_libgflags          : "0",
-      ac_google_start_namespace     : "namespace google {",
-      ac_cv_have_uint16_t           : "1",
-      ac_cv_have_u_int16_t          : "1",
-      ac_cv_have___uint16           : "0",
-      ac_google_end_namespace       : "}",
-      ac_cv_have___builtin_expect   : "1",
-      ac_google_namespace           : "google",
-      ac_cv___attribute___noinline  : "__attribute__ ((noinline))",
-      ac_cv___attribute___noreturn  : "__attribute__ ((noreturn))",
-      ac_cv___attribute___printf_4_5: "__attribute__((__format__ (__printf__, 4, 5)))"
-    ])
-    it.path = (it.name - ".in")
-  }
-  into("${thirdPartyNdkDir}/glog")
-
-  doLast {
-    copy {
-      from(fileTree(dir: "${thirdPartyNdkDir}/glog", includes: ["stl_logging.h", "logging.h", "raw_logging.h", "vlog_is_on.h", "**/src/glog/log_severity.h"]).files)
-      includeEmptyDirs = false
-      into("${thirdPartyNdkDir}/glog/exported/glog")
+    duplicatesStrategy = "include"
+    from(dependenciesPath ?: tarTree(downloadGlog.dest))
+    from("${reactNativeThirdPartyDir}/glog/")
+    include("glog-${GLOG_VERSION}/src/**/*", "Android.mk", "config.h")
+    includeEmptyDirs = false
+    filesMatching("**/*.h.in") {
+        filter(ReplaceTokens, tokens: [
+                ac_cv_have_unistd_h           : "1",
+                ac_cv_have_stdint_h           : "1",
+                ac_cv_have_systypes_h         : "1",
+                ac_cv_have_inttypes_h         : "1",
+                ac_cv_have_libgflags          : "0",
+                ac_google_start_namespace     : "namespace google {",
+                ac_cv_have_uint16_t           : "1",
+                ac_cv_have_u_int16_t          : "1",
+                ac_cv_have___uint16           : "0",
+                ac_google_end_namespace       : "}",
+                ac_cv_have___builtin_expect   : "1",
+                ac_google_namespace           : "google",
+                ac_cv___attribute___noinline  : "__attribute__ ((noinline))",
+                ac_cv___attribute___noreturn  : "__attribute__ ((noreturn))",
+                ac_cv___attribute___printf_4_5: "__attribute__((__format__ (__printf__, 4, 5)))"
+        ])
+        it.path = (it.name - ".in")
+    }
+    into("${thirdPartyNdkDir}/glog")
+
+    doLast {
+        copy {
+            from(fileTree(dir: "${thirdPartyNdkDir}/glog", includes: ["stl_logging.h", "logging.h", "raw_logging.h", "vlog_is_on.h", "**/src/glog/log_severity.h"]).files)
+            includeEmptyDirs = false
+            into("${thirdPartyNdkDir}/glog/exported/glog")
+        }
     }
-  }
 }
 
 task extractAARHeaders {
-  doLast {
-    configurations.extractHeaders.files.each {
-      def file = it.absoluteFile
-      def packageName = file.name.tokenize('-')[0]
-      copy {
-        from zipTree(file)
-        into "${reactNativeDir}/ReactAndroid/src/main/jni/first-party/${packageName}/headers"
-        include "**/*.h"
-      }
+    doLast {
+        configurations.extractHeaders.files.each {
+            def file = it.absoluteFile
+            def packageName = file.name.tokenize('-')[0]
+            copy {
+                from zipTree(file)
+                into "${reactNativeDir}/ReactAndroid/src/main/jni/first-party/${packageName}/headers"
+                include "**/*.h"
+            }
+        }
     }
-  }
 }
 
 task extractSOFiles {
-  doLast {
-    configurations.extractSO.files.each {
-      def file = it.absoluteFile
-      def packageName = file.name.tokenize('-')[0]
-      copy {
-        from zipTree(file)
-        into "${reactNativeDir}/ReactAndroid/src/main/jni/first-party/${packageName}/"
-        include "jni/**/*.so"
-      }
+    doLast {
+        configurations.extractSO.files.each {
+            def file = it.absoluteFile
+            def packageName = file.name.tokenize('-')[0]
+            copy {
+                from zipTree(file)
+                into "${reactNativeDir}/ReactAndroid/src/main/jni/first-party/${packageName}/"
+                include "jni/**/*.so"
+            }
+        }
     }
-  }
 }
 
 dependencies {
-  // noinspection GradleDynamicVersion
-  implementation "com.facebook.yoga:proguard-annotations:1.19.0"
-  implementation "com.facebook.fbjni:fbjni-java-only:" + FBJNI_VERSION
-  implementation "com.facebook.react:react-native:+" // From node_modules
+    // noinspection GradleDynamicVersion
+    implementation "com.facebook.yoga:proguard-annotations:1.19.0"
+    implementation "com.facebook.fbjni:fbjni-java-only:" + FBJNI_VERSION
+    implementation "com.facebook.react:react-native:+" // From node_modules
 
-  extractHeaders("com.facebook.fbjni:fbjni:" + FBJNI_VERSION + ":headers")
-  extractSO("com.facebook.fbjni:fbjni:" + FBJNI_VERSION)
+    extractHeaders("com.facebook.fbjni:fbjni:" + FBJNI_VERSION + ":headers")
+    extractSO("com.facebook.fbjni:fbjni:" + FBJNI_VERSION)
 
-  def rnAAR = fileTree("${reactNativeDir}/android").matching({ it.include "**/**/*.aar" }).singleFile
-  extractSO(files(rnAAR))
+    def v8AAR = fileTree("${v8AndroidDir}/dist").matching({ it.include "**/**/*.aar" }).singleFile
+    extractSO(files(v8AAR))
+}
 
-  def v8AAR = fileTree("${v8AndroidDir}/dist").matching({ it.include "**/**/*.aar" }).singleFile
-  extractSO(files(v8AAR))
+task unpackReactNativeAAR {
+    def buildType = "debug"
+    tasks.all({ task ->
+        if (task.name == "buildCMakeRelease") {
+            buildType = "release"
+        }
+    })
+    def rnAarMatcher = "**/react-native/**/*${buildType}.aar"
+    if (rnMinorVersion < 69) {
+        rnAarMatcher = "**/**/*.aar"
+    }
+    def rnAAR = fileTree("$reactNativeDir/android").matching({ it.include rnAarMatcher }).singleFile
+    def file = rnAAR.absoluteFile
+    def packageName = file.name.tokenize('-')[0]
+    copy {
+        from zipTree(file)
+        into "$reactNativeDir/ReactAndroid/src/main/jni/first-party/$packageName/"
+        include "jni/**/*.so"
+    }
 }
 
 task downloadNdkBuildDependencies {
-  if (!boostPath) {
-    dependsOn(downloadBoost)
-  }
-  dependsOn(downloadDoubleConversion)
-  dependsOn(downloadFolly)
-  dependsOn(downloadGlog)
+    if (!boostPath) {
+        dependsOn(downloadBoost)
+    }
+    if (!dependenciesPath) {
+        dependsOn(downloadDoubleConversion)
+        dependsOn(downloadFolly)
+        dependsOn(downloadGlog)
+    }
+    
 }
 
-task prepareThirdPartyNdkHeaders(dependsOn:[downloadNdkBuildDependencies, prepareBoost, prepareDoubleConversion, prepareFolly, prepareGlog]) {
+task prepareThirdPartyNdkHeaders(dependsOn: [downloadNdkBuildDependencies, prepareBoost, prepareDoubleConversion, prepareFolly, prepareGlog, unpackReactNativeAAR]) {
 }
 
 tasks.whenTaskAdded { task ->
-  if (
-      !task.name.contains("Clean") && (
-        task.name.startsWith("externalNativeBuild")
-        || task.name.startsWith("buildCMake")
-        || task.name.startsWith("configureCMake"))
-  ) {
-    task.dependsOn(prepareThirdPartyNdkHeaders)
-    extractAARHeaders.dependsOn(prepareThirdPartyNdkHeaders)
-    extractSOFiles.dependsOn(prepareThirdPartyNdkHeaders)
-    task.dependsOn(extractAARHeaders)
-    task.dependsOn(extractSOFiles)
-  }
+    if (
+    !task.name.contains("Clean") && (
+            task.name.startsWith("externalNativeBuild")
+                    || task.name.startsWith("buildCMake")
+                    || task.name.startsWith("configureCMake"))
+    ) {
+        task.dependsOn(prepareThirdPartyNdkHeaders)
+        extractAARHeaders.dependsOn(prepareThirdPartyNdkHeaders)
+        extractSOFiles.dependsOn(prepareThirdPartyNdkHeaders)
+        task.dependsOn(extractAARHeaders)
+        task.dependsOn(extractSOFiles)
+    }
 }
diff --git a/node_modules/react-native-v8/src/v8runtime/V8Runtime.cpp b/node_modules/react-native-v8/src/v8runtime/V8Runtime.cpp
index 42af9c6..b406886 100644
--- a/node_modules/react-native-v8/src/v8runtime/V8Runtime.cpp
+++ b/node_modules/react-native-v8/src/v8runtime/V8Runtime.cpp
@@ -29,7 +29,9 @@ const char kHostFunctionProxyProp[] = "__hostFunctionProxy";
 // static
 std::unique_ptr<v8::Platform> V8Runtime::s_platform = nullptr;
 std::mutex s_platform_mutex; // protects s_platform
-
+bool isMainBundleLoaded = false;
+bool isMainBundleCached = false;
+bool isDevMode = false;
 V8Runtime::V8Runtime(std::unique_ptr<V8RuntimeConfig> config, 
 std::shared_ptr<facebook::react::MessageQueueThread> jsQueue)
     : config_(std::move(config)) {
@@ -43,7 +45,7 @@ std::shared_ptr<facebook::react::MessageQueueThread> jsQueue)
       v8::V8::Initialize();
     }
   }
-
+  isMainBundleLoaded = false;
   arrayBufferAllocator_.reset(
       v8::ArrayBuffer::Allocator::NewDefaultAllocator());
   v8::Isolate::CreateParams createParams;
@@ -68,7 +70,9 @@ std::shared_ptr<facebook::react::MessageQueueThread> jsQueue)
   context_.Reset(isolate_, CreateGlobalContext(isolate_));
   v8::Context::Scope scopedContext(context_.Get(isolate_));
   jsQueue_ = jsQueue;
+  isDevMode = false;
   if (config_->enableInspector) {
+    isDevMode = true;
     inspectorClient_ = std::make_shared<InspectorClient>(
         jsQueue_, context_.Get(isolate_), config_->appName, config_->deviceName);
     inspectorClient_->ConnectToReactFrontend();
@@ -241,9 +245,14 @@ void V8Runtime::OnIdle() {
 
 void V8Runtime::ReportException(v8::Isolate *isolate, v8::TryCatch *tryCatch)
     const {
-  v8::HandleScope scopedHandle(isolate);
-  std::string exception =
-      JSIV8ValueConverter::ToSTLString(isolate, tryCatch->Exception());
+    v8::HandleScope scopedHandle(isolate);
+    v8::Local<v8::Context> context(isolate->GetCurrentContext());
+    v8::MaybeLocal<v8::String> exceptionString = tryCatch->Exception()->ToString(context);
+    std::string exception = "";
+    if (!exceptionString.IsEmpty()) {
+        exception = JSIV8ValueConverter::ToSTLString(isolate, exceptionString.ToLocalChecked());
+    }
+
   v8::Local<v8::Message> message = tryCatch->Message();
   if (message.IsEmpty()) {
     // V8 didn't provide any extra information about this error; just
@@ -252,7 +261,6 @@ void V8Runtime::ReportException(v8::Isolate *isolate, v8::TryCatch *tryCatch)
     return;
   } else {
     std::ostringstream ss;
-    v8::Local<v8::Context> context(isolate->GetCurrentContext());
 
     // Print (filename):(line number): (message).
     ss << JSIV8ValueConverter::ToSTLString(
@@ -261,6 +269,7 @@ void V8Runtime::ReportException(v8::Isolate *isolate, v8::TryCatch *tryCatch)
        << std::endl;
 
     // Print line of source code.
+
     ss << JSIV8ValueConverter::ToSTLString(
               isolate, message->GetSourceLine(context).ToLocalChecked())
        << std::endl;
@@ -300,6 +309,12 @@ V8Runtime::LoadCodeCacheIfNeeded(const std::string &codecachePath) {
     return nullptr;
   }
 
+  if (isDevMode) {
+    LOG(ERROR) << "Code Caching is Disabled in DEV Mode: ";
+  }
+
+  if (isMainBundleLoaded ) return nullptr;
+  isMainBundleLoaded = true;
   if (config_->codecacheMode == V8RuntimeConfig::CodecacheMode::kPrebuilt) {
     assert(config_->prebuiltCodecacheBlob);
     return std::make_unique<v8::ScriptCompiler::CachedData>(
@@ -314,6 +329,7 @@ V8Runtime::LoadCodeCacheIfNeeded(const std::string &codecachePath) {
     LOG(INFO) << "Cannot load codecache file: " << codecachePath;
     return nullptr;
   }
+  isMainBundleCached = true;
   fseek(file, 0, SEEK_END);
   size_t size = ftell(file);
   uint8_t *buffer = new uint8_t[size];
@@ -346,6 +362,12 @@ bool V8Runtime::SaveCodeCacheIfNeeded(
     return false;
   }
 
+  if (isDevMode) {
+    LOG(ERROR) << "Code Caching is Disabled in DEV Mode: ";
+  }
+
+  if (isMainBundleCached ) return false;
+
   v8::HandleScope scopedHandle(isolate_);
 
   v8::Local<v8::UnboundScript> unboundScript = script->GetUnboundScript();
@@ -360,6 +382,7 @@ bool V8Runtime::SaveCodeCacheIfNeeded(
     LOG(ERROR) << "Cannot save codecache file: " << codecachePath;
     return false;
   }
+  isMainBundleCached = true;
   fwrite(newCachedData->data, 1, newCachedData->length, file);
   fclose(file);
   return true;
@@ -572,6 +595,19 @@ jsi::PropNameID V8Runtime::createPropNameIDFromString(const jsi::String &str) {
       reinterpret_cast<const uint8_t *>(*utf8), utf8.length());
 }
 
+jsi::PropNameID V8Runtime::createPropNameIDFromSymbol(const jsi::Symbol &sym) {
+  v8::Locker locker(isolate_);
+  v8::Isolate::Scope scopedIsolate(isolate_);
+  v8::HandleScope scopedHandle(isolate_);
+  v8::Context::Scope scopedContext(context_.Get(isolate_));
+
+  std::string str = symbolToString(sym);
+  const uint8_t* utf8 = reinterpret_cast<const uint8_t*>(str.c_str());
+  V8PointerValue *value =
+      V8PointerValue::createFromUtf8(isolate_,utf8, str.length());
+  return make<jsi::PropNameID>(value);
+}
+
 std::string V8Runtime::utf8(const jsi::PropNameID &sym) {
   v8::Locker locker(isolate_);
   v8::Isolate::Scope scopedIsolate(isolate_);
diff --git a/node_modules/react-native-v8/src/v8runtime/V8Runtime.h b/node_modules/react-native-v8/src/v8runtime/V8Runtime.h
index d8a0480..2fed354 100644
--- a/node_modules/react-native-v8/src/v8runtime/V8Runtime.h
+++ b/node_modules/react-native-v8/src/v8runtime/V8Runtime.h
@@ -85,6 +85,9 @@ class V8Runtime : public facebook::jsi::Runtime {
       size_t length) override;
   facebook::jsi::PropNameID createPropNameIDFromString(
       const facebook::jsi::String &str) override;
+  facebook::jsi::PropNameID createPropNameIDFromSymbol(
+      const facebook::jsi::Symbol &sym) override;
+
   std::string utf8(const facebook::jsi::PropNameID &) override;
   bool compare(
       const facebook::jsi::PropNameID &,
