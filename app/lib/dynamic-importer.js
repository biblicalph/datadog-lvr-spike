'use strict'

/**
 * Loads ESM imports dynamically, saving the cached value in memory
 * @returns {Promise<Object>}
 */
function createDynamicImporter() {
  const loaded_imports = {}

  return async function importLibrary(lib_name) {
    if (!loaded_imports[lib_name]) {
      loaded_imports[lib_name] = await import(lib_name)
    }
    return loaded_imports[lib_name]
  }
}

module.exports = createDynamicImporter()