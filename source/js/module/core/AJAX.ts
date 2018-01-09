/**
 * Created by wert on 08.12.15.
 */

import * as $ from 'jquery';
import * as BPromise from 'bluebird';

/**
 * Does $.ajax({...}) and return result as Promise
 * Accepts all $.ajax() parameters except `error` and `success` handlers. Error and success are available with.
 *
 * Returned promise is cancel-friendly and can be cancelled with .cancel() synchronous call. Underlying request
 * will be aborted in that case.
 *
 * On success will return object if dataOnly == true: {
 *   data: data,
 *   textStatus: textStatus,
 *   xhr: jqXHR
 * }
 * or just data as is if dataOnly == false or undefined.
 *  Promise semantics.
 * @returns {Promise}
 */
export function AJAX(configDetails, dataOnly: boolean): BPromise<any> {
    return new BPromise((resolve, reject, onCancel) => {
        configDetails.error = (jqXHR, textStatus, errorThrown) => {
            const errorToReturn             = new Error('Http non-2xx status. Considered an error in current AJAX implementation');
            errorToReturn['xhr']            = jqXHR;
            errorToReturn['textStatus']     = textStatus;
            errorToReturn['errorThrown']    = errorThrown;
            reject(errorToReturn);
        };
        configDetails.success = (data, textStatus, jqXHR) => {
           if(dataOnly){       // todo: fix me. dataOnly required for back compatability
                resolve(data);
           } else {
                resolve({
                    data:       data,
                    textStatus: textStatus,
                    xhr:        jqXHR
                });
           }
        };

        const request = $.ajax(configDetails);

        onCancel(() => request.abort());
    });
}