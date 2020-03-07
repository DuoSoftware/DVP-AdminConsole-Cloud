/**
 * Created by Rajinda on 6/13/2016.
 */

mainApp.controller('FormBuilderCtrl',function FormBuilderCtrl($scope,ticketService,$anchorScroll, $filter, loginService, caseApiAccess)
{
    $anchorScroll();
	$scope.addNew = false;$scope.isProgress = false;$scope.isLoading = false;

	$scope.createForm = function () {
		$scope.addNew = !$scope.addNew;
	};

	$scope.showAlert = function (tittle, content) {

		new PNotify({
			title: tittle,
			text: content,
			type: 'success',
			styling: 'bootstrap3'
		});
	};

	$scope.showError = function (tittle,content) {

		new PNotify({
			title: tittle,
			text: content,
			type: 'error',
			styling: 'bootstrap3'
		});
	};

	$scope.newAddTags = [];
	$scope.postTags = [];
	$scope.isolatedTags = [];
	$scope.currentTagForm = {
		form: null
	};

	var isFormSaved = null;

	$scope.currentTicketForm = {
		currentTicketForm: null
	};

	$scope.currentProfileForm = {
		currentProfileForm: null
	};

	$scope.loadTags = function () {
		caseApiAccess.getAllTags().then(function (response) {
			$scope.tagList = response;
		}, function (err) {
			loginService.isCheckResponse(err);
			$scope.showAlert("Load Tags", "error", "Fail To Get Tag List.")
		});
	};
	$scope.loadTags();

	$scope.clearTagList = function(tag)
	{
		setToDefault();
		$scope.currentTagForm = {
			form: null
		};
	};

	$scope.addIsolatedTag = function()
	{
		ticketService.updateFormByTag($scope.currentTagForm.form, $scope.postTags[0].name).then(function (response)
		{
			if(response.IsSuccess)
			{
				$scope.showAlert("Dynamic Form", "Form added to isolated tag");
				$scope.postTags = [];
				$scope.currentTagForm = {
					form: null
				};
				loadCurrentIsolatedTagForms();
			}
			else
			{
				$scope.currentTagForm = {
					form: null
				};
				$scope.showError("Dynamic Form", "Error loading form for isolated tag");
			}
		}, function (err)
		{
			$scope.currentTagForm = {
				form: null
			};
			$scope.showError("Dynamic Form", "Error loading form for isolated tag");
		});
	};

	$scope.loadTagCategories = function () {
		caseApiAccess.getTagCategories().then(function (response) {
			$scope.tagCategoryList = response;
			$scope.availableTags = $scope.tagCategoryList;
		}, function (err) {
			loginService.isCheckResponse(err);
			$scope.showAlert("Load Tags", "error", "Fail To Get Tag List.")
		});
	};
	$scope.loadTagCategories();

	function createTagFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);
		return function filterFn(group) {
			return (group.name.toLowerCase().indexOf(lowercaseQuery) != -1);
		};
	}

	var setToDefault = function () {
		var ticTag = undefined;
		angular.forEach($scope.newAddTags, function (item) {
			if (ticTag) {
				ticTag = ticTag + "." + item.name;
			} else {
				ticTag = item.name;
			}

		});
		if (ticTag) {
			$scope.postTags.push({name: ticTag});
			$scope.postTags = removeDuplicate($scope.postTags);

		}

		$scope.newAddTags = [];
		$scope.availableTags = $scope.tagCategoryList;
		$scope.tagSelectRoot = 'root';
	};

	$scope.onChipDeleteTag = function (chip) {
		setToDefault();

	};

	$scope.loadPostTags = function (query) {
		return $scope.postTags;
	};

	var loadCurrentIsolatedTagForms = function()
	{
		$scope.isolatedTags = [];
		ticketService.getAllIsolatedTagForms().then(function(isolatedTags)
		{
			if(isolatedTags.Result)
			{
				$scope.isolatedTags = isolatedTags.Result;
			}
			else
			{
				$scope.isolatedTags = [];
			}


		}).catch(function(err)
		{
			$scope.isolatedTags = [];
		})
	};

	$scope.deleteIsolatedTag = function(isolatedTag)
	{

		new PNotify({
			title: 'Confirm Deletion',
			text: 'Are You Sure You Want To Delete Isolated Tag ?',
			hide: false,
			confirm: {
				confirm: true
			},
			buttons: {
				closer: false,
				sticker: false
			},
			history: {
				history: false
			}
		}).get().on('pnotify.confirm', function () {
				ticketService.removeIsolatedTagForm(isolatedTag).then(function (response)
				{
					if(response.IsSuccess)
					{
						$scope.showAlert("Dynamic Form", "Isolated tag removed successfully");

						loadCurrentIsolatedTagForms();
					}
					else
					{
						$scope.showError("Dynamic Form", "Isolated tag remove failed");
					}
				}, function (err)
				{
					$scope.showError("Dynamic Form", "Isolated tag remove failed");
				});
			}).on('pnotify.cancel', function () {

			});

	};

	$scope.selectValueChanged = function(formId, isolatedTag)
	{
		ticketService.updateFormByTag(formId, isolatedTag).then(function (response)
		{
			if(response.IsSuccess)
			{
				$scope.showAlert("Dynamic Form", "Isolated tag updated successfully");
			}
			else
			{
				$scope.showError("Dynamic Form", "Isolated tag update failed");
			}
		}, function (err)
		{
			$scope.showError("Dynamic Form", "Isolated tag update failed");
		});
	}

	loadCurrentIsolatedTagForms();

	var removeDuplicate = function (arr) {
		var newArr = [];
		angular.forEach(arr, function (value, key) {
			var exists = false;
			angular.forEach(newArr, function (val2, key) {
				if (angular.equals(value.name, val2.name)) {
					exists = true
				};
			});
			if (exists == false && value.name != "") {
				newArr.push(value);
			}
		});
		return newArr;
	};

	$scope.onChipAddTag = function (chip) {
		if (!chip.tags || (chip.tags.length === 0)) {
			setToDefault();
			return;
		}

		if (chip.tags) {
			if (chip.tags.length > 0) {

				var tempTags = [];
				angular.forEach(chip.tags, function (item) {

					if (!angular.isObject(item)) {

						var tags = $filter('filter')($scope.tagList, {_id: item}, true);
						tempTags = tempTags.concat(tags);

					} else {
						tempTags = tempTags.concat(item);
					}
				});
				$scope.availableTags = tempTags;

				return;
			}
		}


	};

	$scope.queryTagSearch = function (query) {
		if (query === "*" || query === "") {
			if ($scope.availableTags) {
				return $scope.availableTags;
			}
			else {
				return [];
			}

		}
		else {
			var results = query ? $scope.availableTags.filter(createTagFilterFor(query)) : [];
			return results;
		}

	};

	$scope.saveForm = function(formName,data){
		$scope.isProgress =true;
		var postData = {
			"name": formName,
			"fields":[]
		};

		angular.forEach(data,function(item){
			item.title = item.field;
			postData.fields.push(item);
		});

		ticketService.SaveForm(postData).then(function (response) {
			if(response){
				$scope.showAlert("Save Form", "Save Successfully");
				$scope.fields = [];
				$scope.formName="";
				$scope.LoadFormList();
			}
			else{
				$scope.showError("Save Form", "Fail To Save Form Data.");
			}
			$scope.isProgress=false;
		}, function (error) {
			$scope.showError("Save Form", "Fail To Save Form Data.");
		});
	};

	$scope.LoadFormList = function(){
		$scope.isLoading=true;
		ticketService.LoadFormList().then(function (response) {
			if(response){
				$scope.formList=response;
			}
			else{
				$scope.showError("Load Form", "Fail To Load Form List.");
			}
			$scope.isLoading=false;
		}, function (error) {
			$scope.showError("Load Form", "Fail To Load Form List.");
		});

	};

	$scope.saveProfileForm = function()
	{
		var obj = {
			ticket_form : $scope.currentTicketForm.currentTicketForm,
			profile_form : $scope.currentProfileForm.currentProfileForm
		};

		if(isFormSaved)
		{
			//Update
			ticketService.updateFormProfile(obj).then(function(resp)
			{
				if(resp && resp.IsSuccess)
				{
					$scope.showAlert("Operation Successful", "Form Profile Saved Successfully");

				}
				else
				{
					$scope.showError("Error updating profile", "Fail To Update Profile");
				}

			}).catch(function(err)
			{
				$scope.showError("Error updating profile", "Fail To Update Profile");

			})
		}
		else
		{
			//Save

			ticketService.saveFormProfile(obj).then(function(resp)
			{
				if(resp && resp.IsSuccess)
				{
                    isFormSaved = true;
					$scope.showAlert("Operation Successful", "Form Profile Saved Successfully");

				}
				else
				{
					$scope.showError("Error saving profile", "Fail To Save Profile");
				}

			}).catch(function(err)
			{
				$scope.showError("Error saving profile", "Fail To Save Profile");

			})
		}
	};

	var getFormProfileData = function()
	{
		ticketService.getFormProfile().then(function(resp)
		{
			if(resp && resp.Result)
			{
				if(resp.Result.profile_form)
				{
					$scope.currentProfileForm.currentProfileForm = resp.Result.profile_form._id;
				}

				if(resp.Result.ticket_form)
				{
					$scope.currentTicketForm.currentTicketForm = resp.Result.ticket_form._id;
				}

                if(resp.Result.profile_form || resp.Result.ticket_form)
				{
                    isFormSaved = true;
				}
				else
				{
                    isFormSaved = false;
				}

			}
			else
			{
                isFormSaved = false;
			}

		}).catch(function(err)
		{
			$scope.showError("Error loading profile", "Fail To Load Profile");

		})
	};
	$scope.LoadFormList();
	getFormProfileData();

	$scope.newField = {};
	/*$scope.fields = [ {
		type : 'text',
		field : 'Name',
		description : 'Please enter your name',
		id : 1
	} ];*/
	$scope.fields = [];
	$scope.editing = false;
	$scope.tokenize = function(slug1, slug2) {
		var result = slug1;
		result = result.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
		result = result.replace(/-/gi, "_");
		result = result.replace(/\s/gi, "-");
		if (slug2) {
			result += '-' + $scope.token(slug2);
		}
		return result;
	};
	$scope.saveField = function() {
		console.log("entered save");
		if (!$scope.newField.field){
			$scope.showError("Design Form", "Please Enter Field Name.");
			return;
		}
		if (!$scope.newField.id){
			$scope.showError("Design Form", "Please Select ID.");
			return;
		}
		if (!$scope.newField.type){
			$scope.showError("Design Form", "Please Select Field Type.");
			return;
		}


		if ($scope.newField.type == 'checkboxes') {
			$scope.newField.value = {};
		}
		if ($scope.editing !== false) {
			$scope.fields[$scope.editing] = $scope.newField;
			$scope.editing = false;
		} else {
			$scope.fields.push($scope.newField);
		}
		$scope.newField = {
			id : 0
		};
	};
	$scope.editField = function(field) {
		$scope.editing = $scope.fields.indexOf(field);
		$scope.newField = field;
	};
	$scope.splice = function(field, fields) {
		fields.splice(fields.indexOf(field), 1);
	};
	$scope.addOption = function() {
		if ($scope.newField.values === undefined) {
			$scope.newField.values = [];
		}
		$scope.newField.values.push({
			id : 0
		});
	};
	$scope.typeSwitch = function(type) {
		/*if (angular.Array.indexOf(['checkboxes','select','radio'], type) === -1)
			return type;*/
		if (type == 'checkboxes')
			return 'multiple';
		if (type == 'select')
			return 'multiple';
		if (type == 'radio')
			return 'multiple';

		return type;
	}
});

app.directive('ngDynamicForm', function () { 
    return { 
        // We limit this directive to attributes only.
         restrict : 'A',

        // We will not replace the original element code
        replace : false,
        
        // We must supply at least one element in the code 
        templateUrl : 'dynamicForm/view/template/dynamicForms.html',
    } 
});
