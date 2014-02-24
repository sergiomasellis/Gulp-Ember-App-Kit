// data Pages

/**
 * This js file merges all of the other models in the file models, this way we are only making one http request
 */
import page_model from "appkit/models/page_model";

//array merge util
import arrayMerge from "appkit/utils/array-merge";

var MobileData = [];

MobileData.merge(page_model);

export default MobileData;
