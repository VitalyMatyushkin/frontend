/**
 * Created by bridark on 24/09/15.
 */
onmessage=function(e){
    var newFilter = e.data[1];
    var outerFilterKey = Object.keys(newFilter)[0],
        innerFilterKey = typeof newFilter[outerFilterKey] === 'object' ? Object.keys(newFilter[outerFilterKey])[0] : 0;
    if(innerFilterKey !== 'order' && innerFilterKey !== 0 && innerFilterKey !== 'regexp'){
        var filterVal = newFilter[outerFilterKey][innerFilterKey];
        filterVal = filterVal.replace(/^[a-z]/,function(char){return char.toUpperCase()});
        var filteredData = e.data[0].filter(function(dataItem){
            return dataItem[outerFilterKey][innerFilterKey].indexOf(filterVal) >= 0;
        });
        setTimeout(function(){postMessage(filteredData)},800);
    }else if(innerFilterKey === 'order'){
        var primitiveData,orderKey,inOrder,outOrder, mappedData;
        primitiveData = e.data[0];
        orderKey = newFilter[outerFilterKey][innerFilterKey];
        outOrder = orderKey.split(" ")[0];
        inOrder = orderKey.split(" ")[1];
        mappedData = primitiveData.map(function(el){
            return el;
        });
        mappedData.sort(function(a,b){
            if(inOrder === 'DESC'){
                if(b[outerFilterKey][outOrder] !== undefined){
                    return b[outerFilterKey][outOrder].localeCompare(a[outerFilterKey][outOrder]);
                }else{
                    return b[outerFilterKey].localeCompare(a[outerFilterKey]);
                }
            }else{
                if(a[outerFilterKey][outOrder] !== undefined){
                    return a[outerFilterKey][outOrder].localeCompare(b[outerFilterKey][outOrder]);
                }else{
                    return a[outerFilterKey].localeCompare(b[outerFilterKey]);
                }
            }
        });
        setTimeout(function(){postMessage(mappedData)},800);
    }else{
        if(innerFilterKey === 0){
            var filteredVal = '';
            switch (outerFilterKey){
                case 'age':
                    filteredVal = parseInt(newFilter[outerFilterKey]);
                    break;
                case 'name':
                    if(newFilter[outerFilterKey].length > 1){
                        filteredVal = newFilter[outerFilterKey].charAt(0)+newFilter[outerFilterKey].charAt(1).toUpperCase();
                    }
                    break;
                default :
                    filteredVal = newFilter[outerFilterKey];
                    break;
            }
            var tmpData =e.data[0].filter(function(filterSort){
                if(outerFilterKey ==='age'){
                    return filterSort[outerFilterKey] === filteredVal;
                }else{
                    return filterSort[outerFilterKey].indexOf(filteredVal) >= 0;
                }
            });
            setTimeout(function(){postMessage(tmpData)},800);
        }
    }
};