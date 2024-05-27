"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayDateFormat = exports.getTodayDate = void 0;
const getTodayDate = () => {
    var today = new Date();
    return today.setHours(today.getHours() - 5);
};
exports.getTodayDate = getTodayDate;
const getTodayDateFormat = (today) => {
    let now = new Date(today);
    return new Date(now.setHours(now.getHours() + +(process.env.MODIFY_TIMEZONE || "0")));
};
exports.getTodayDateFormat = getTodayDateFormat;
//# sourceMappingURL=date-values.js.map