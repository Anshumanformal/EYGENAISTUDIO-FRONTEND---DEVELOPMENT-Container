const DOMPurify = require('dompurify');
const window = require('window');
if (window && window.trustedTypes && window.trustedTypes.createPolicy) { // Feature testing
    window.trustedTypes.createPolicy('default', {
        createHTML: (string) => DOMPurify.sanitize(string, {RETURN_TRUSTED_TYPE: true}),
        createScriptURL: string => string, // warning: this is unsafe!
        createScript: string => string, // warning: this is unsafe!
    });
}