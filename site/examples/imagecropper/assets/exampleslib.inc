<?php
/* yadl_spaceid - Skip Stamping */
function getRawData($paramName) {
        if ($paramName) {
		return yahoo_get_data(YIV_REQUEST, $paramName, YIV_HTML_MAIL_TAGS);
        } else {
                return null;
        }
}

?>
