YAHOO.util.Form =
{
	setForm:function(formName)
	{
		var formData='';
		var oForm = document.forms[formName];
		var oElement, oName, oValue;
		// Iterate over the form elements collection to construct the
		// label-value pairs.
		for (var i=0; i<oForm.elements.length; i++){
			oDisabled = oForm.elements[i].disabled;
			oElement = oForm.elements[i];
			oName = oForm.elements[i].name;
			oValue = oForm.elements[i].value;
			if(!oDisabled)
			{
				switch (oElement.type)
				{
					case 'select-one':
					case 'select-multiple':
						for(var j=0; j<oElement.options.length; j++){
							if(oElement.options[j].selected){
								formData += encodeURIComponent(oName) + '=' + encodeURIComponent(oElement.options[j].value || oElement.options[j].text) + '&';
							}
						}
						break;
					case 'radio':
					case 'checkbox':
						if(oElement.checked){
							formData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';
						}
						break;
					case 'file':
						formData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';
					// stub case as XMLHttpRequest will only send the file path as a string.
						break;
					case undefined:
					// stub case for fieldset element which returns undefined.
						break;
					default:
						formData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';
						break;
				}
			}
		}
		return formData.substr(0, formData.length - 1);
	}
}