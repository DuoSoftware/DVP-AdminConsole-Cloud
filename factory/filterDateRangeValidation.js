mainApp.factory('filterDateRangeValidation', function () {
	return {
		validateDateRange: function (startDate, endDate) {
			var validRange = 31;
			var msd = moment(new Date(startDate));
			var med = moment(new Date(endDate));
			if (msd && med) {
				var dif = med.diff(msd, 'days');
				if (dif > validRange) {
					return false;
				} else {
					return true;
				}
			}
		}
	}

});