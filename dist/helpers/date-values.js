"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayDate = void 0;
const getTodayDate = () => {
    var today = new Date();
    return today.setHours(today.getHours() - 5);
};
exports.getTodayDate = getTodayDate;
//# sourceMappingURL=date-values.js.map