/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { interfaces: Ci, utils: Cu } = Components;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/Log.jsm");

// loglevel should be one of "Fatal", "Error", "Warn", "Info", "Config",
// "Debug", "Trace" or "All". If none is specified, "Error" will be used by
// default.
const PREF_LOG_LEVEL = "services.mobileid.loglevel";

XPCOMUtils.defineLazyGetter(this, "log", function() {
  let log = Log.repository.getLogger("MobileId");
  log.addAppender(new Log.DumpAppender());
  log.level = Log.Level.Error;
  try {
    let level =
      Services.prefs.getPrefType(PREF_LOG_LEVEL) == Ci.nsIPrefBranch.PREF_STRING
      && Services.prefs.getCharPref(PREF_LOG_LEVEL);
    log.level = Log.Level[level] || Log.Level.Error;
  } catch (e) {
    log.error(e);
  }

  return log;
});

this.PREF_FORCE_HTTPS = "services.mobileid.forcehttps";

// Permission.
this.MOBILEID_PERM = "mobileid";

// IPC messages.
this.GET_ASSERTION_IPC_MSG = "MobileId:GetAssertion";

// Verification methods.
this.SMS_MT    = "sms/mt";
this.SMS_MO_MT = "sms/momt";

// Server endpoints.
this.DISCOVER         = "/discover";
this.REGISTER         = "/register";
this.SMS_MT_VERIFY    = "/" + this.SMS_MT + "/verify";
this.SMS_MO_MT_VERIFY = "/" + this.SMS_MO_MT + "/verify";
this.SMS_VERIFY_CODE  = "/sms/verify_code";
this.SIGN             = "/certificate/sign";
this.UNREGISTER       = "/unregister";

// Server consts.
this.SERVER_URL = Services.prefs.getCharPref("services.mobileid.server.uri");
this.CREDENTIALS_DERIVATION_INFO = "identity.mozilla.com/picl/v1/sessionToken";
this.CREDENTIALS_DERIVATION_SIZE = 2 * 32;

this.SILENT_SMS_RECEIVED_TOPIC = "silent-sms-received";

this.ASSERTION_LIFETIME   = 1000 * 60 * 5;   // 5 minutes.
this.CERTIFICATE_LIFETIME = 1000 * 3600 * 6; // 6 hours.
this.KEY_LIFETIME         = 1000 * 3600 * 12; // 12 hours.

this.VERIFICATIONCODE_TIMEOUT = 60000;
this.VERIFICATIONCODE_RETRIES = 3;

// Internal Errors.
this.ERROR_INTERNAL_CANNOT_CREATE_VERIFICATION_FLOW = "INTERNAL_CANNOT_CREATE_VERIFICATION_FLOW";
this.ERROR_INTERNAL_CANNOT_GENERATE_ASSERTION       = "INTERNAL_CANNOT_GENERATE_ASSERTION";
this.ERROR_INTERNAL_CANNOT_VERIFY_SELECTION         = "INTERNAL_CANNOT_VERIFY_SELECTION";
this.ERROR_INTERNAL_DB_ERROR                        = "INTERNAL_DB_ERROR";
this.ERROR_INTERNAL_HTTP_NOT_ALLOWED                = "INTERNAL_HTTP_NOT_ALLOWED";
this.ERROR_INTERNAL_INVALID_CERTIFICATE             = "INTERNAL_INVALID_CERTIFICATE";
this.ERROR_INTERNAL_INVALID_PROMPT_RESULT           = "INTERNAL_INVALID_PROMPT_RESULT";
this.ERROR_INTERNAL_INVALID_USER_SELECTION          = "INTERNAL_INVALID_USER_SELECTION";
this.ERROR_INTERNAL_INVALID_VERIFICATION_FLOW       = "INTERNAL_INVALID_VERIFICATION_FLOW";
this.ERROR_INTERNAL_INVALID_VERIFICATION_RESULT     = "INTERNAL_INVALID_VERIFICATION_RESULT";
this.ERROR_INTERNAL_UNEXPECTED                      = "INTERNAL_UNEXPECTED";

// Errors.
this.ERROR_ENDPOINT_NOT_SUPPORTED                 = "ENDPOINT_NOT_SUPPORTED";
this.ERROR_INVALID_ASSERTION                      = "INVALID_ASSERTION";
this.ERROR_INVALID_AUTH_TOKEN                     = "INVALID_AUTH_TOKEN";
this.ERROR_INVALID_BODY_JSON                      = "INVALID_BODY_JSON";
this.ERROR_INVALID_BODY_MISSING_PARAMS            = "INVALID_BODY_MISSING_PARAMS";
this.ERROR_INVALID_BODY_PARAMS                    = "INVALID_BODY_PARAMS";
this.ERROR_INVALID_PHONE_NUMBER                   = "INVALID_PHONE_NUMBER";
this.ERROR_INVALID_PROMPT_RESULT                  = "INVALID_PROMPT_RESULT";
this.ERROR_INVALID_REQUEST_SIGNATURE              = "INVALID_REQUEST_SIGNATURE";
this.ERROR_INVALID_VERIFICATION_CODE              = "INVALID_VERIFICATION_CODE";
this.ERROR_MISSING_CONTENT_LENGTH_HEADER          = "MISSING_CONTENT_LENGTH_HEADER";
this.ERROR_NO_RETRIES_LEFT                        = "NO_RETRIES_LEFT";
this.ERROR_OFFLINE                                = "OFFLINE";
this.ERROR_PERMISSION_DENIED                      = "PERMISSION_DENIED";
this.ERROR_REQUEST_BODY_TOO_LARGE                 = "REQUEST_BODY_TOO_LARGE";
this.ERROR_SERVICE_TEMPORARILY_UNAVAILABLE        = "SERVICE_TEMPORARILY_UNAVAILABLE";
this.ERROR_TOO_MANY_REQUESTS_MSISDN               = "TOO_MANY_REQUESTS_MSISDN";
this.ERROR_TOO_MANY_REQUESTS_UNSPECIFIED          = "TOO_MANY_REQUESTS_UNSPECIFIED";
this.ERROR_TOO_MANY_REQUESTS_VERIFICAITON_CODE    = "TOO_MANY_REQUESTS_VERIFICATION_CODE";
this.ERROR_TOO_MANY_REQUESTS_VERIFICATION_METHOD  = "TOO_MANY_REQUESTS_VERIFICATION_METHOD";
this.ERROR_UNKNOWN                                = "UNKNOWN";
this.ERROR_UNVERIFIED_ACCOUNT                     = "UNVERIFIED_ACCOUNT";
this.ERROR_VERIFICATION_CODE_TIMEOUT              = "VERIFICATION_CODE_TIMEOUT";

// Server errno.
// From https://github.com/mozilla-services/msisdn-gateway/blob/master/API.md#response-format
this.ERRNO_UNVERIFIED_ACCOUNT                     = 104;
this.ERRNO_INVALID_VERIFICATION_CODE              = 105;
this.ERRNO_INVALID_BODY_JSON                      = 106;
this.ERRNO_INVALID_BODY_INVALID_PARAMS            = 107;
this.ERRNO_INVALID_BODY_MISSING_PARAMS            = 108;
this.ERRNO_INVALID_REQUEST_SIGNATURE              = 109;
this.ERRNO_INVALID_AUTH_TOKEN                     = 110;
this.ERRNO_ENDPOINT_NOT_SUPPORTED                 = 111;
this.ERRNO_MISSING_CONTENT_LENGTH_HEADER          = 112;
this.ERRNO_REQUEST_BODY_TOO_LARGE                 = 113;
this.ERRNO_TOO_MANY_REQUESTS_VERIFICATION_CODE    = 114;
this.ERRNO_TOO_MANY_REQUESTS_MSISDN               = 115;
this.ERRNO_TOO_MANY_REQUESTS_VERIFICATION_METHOD  = 116;
this.ERRNO_TOO_MANY_REQUESTS_UNSPECIFIED          = 117;
this.ERRNO_SERVICE_TEMPORARILY_UNAVAILABLE        = 201;
this.ERRNO_UNKNOWN_ERROR                          = 999;

// Error matching.
this.SERVER_ERRNO_TO_ERROR = {};
SERVER_ERRNO_TO_ERROR[ERRNO_UNVERIFIED_ACCOUNT] = ERROR_UNVERIFIED_ACCOUNT;
SERVER_ERRNO_TO_ERROR[ERRNO_INVALID_VERIFICATION_CODE] = ERROR_INVALID_VERIFICATION_CODE;
SERVER_ERRNO_TO_ERROR[ERRNO_INVALID_BODY_JSON] = ERROR_INVALID_BODY_JSON;
SERVER_ERRNO_TO_ERROR[ERRNO_INVALID_BODY_INVALID_PARAMS] = ERROR_INVALID_BODY_PARAMS;
SERVER_ERRNO_TO_ERROR[ERRNO_INVALID_BODY_MISSING_PARAMS] = ERROR_INVALID_BODY_MISSING_PARAMS;
SERVER_ERRNO_TO_ERROR[ERRNO_INVALID_REQUEST_SIGNATURE] = ERROR_INVALID_REQUEST_SIGNATURE;
SERVER_ERRNO_TO_ERROR[ERRNO_INVALID_AUTH_TOKEN] = ERROR_INVALID_AUTH_TOKEN;
SERVER_ERRNO_TO_ERROR[ERRNO_ENDPOINT_NOT_SUPPORTED] = ERROR_ENDPOINT_NOT_SUPPORTED;
SERVER_ERRNO_TO_ERROR[ERRNO_MISSING_CONTENT_LENGTH_HEADER] = ERROR_MISSING_CONTENT_LENGTH_HEADER;
SERVER_ERRNO_TO_ERROR[ERRNO_REQUEST_BODY_TOO_LARGE] = ERROR_REQUEST_BODY_TOO_LARGE;
SERVER_ERRNO_TO_ERROR[ERRNO_TOO_MANY_REQUESTS_VERIFICATION_CODE] = ERROR_TOO_MANY_REQUESTS_VERIFICAITON_CODE;
SERVER_ERRNO_TO_ERROR[ERRNO_TOO_MANY_REQUESTS_MSISDN] = ERROR_TOO_MANY_REQUESTS_MSISDN;;
SERVER_ERRNO_TO_ERROR[ERRNO_TOO_MANY_REQUESTS_VERIFICATION_METHOD] = ERROR_TOO_MANY_REQUESTS_VERIFICATION_METHOD;;
SERVER_ERRNO_TO_ERROR[ERRNO_TOO_MANY_REQUESTS_UNSPECIFIED] = ERROR_TOO_MANY_REQUESTS_UNSPECIFIED;;
SERVER_ERRNO_TO_ERROR[ERRNO_SERVICE_TEMPORARILY_UNAVAILABLE] = ERROR_SERVICE_TEMPORARILY_UNAVAILABLE;
SERVER_ERRNO_TO_ERROR[ERRNO_UNKNOWN_ERROR] = ERROR_UNKNOWN;

// Allow this file to be imported via Components.utils.import().
this.EXPORTED_SYMBOLS = Object.keys(this);