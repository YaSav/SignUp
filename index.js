
	function changeGithubVisibility() {
		changeVisibility("githubAccountBlock", document.getElementById("hasGithub").checked);
	}
	
	function changeVisibility(elementId, condition)
	{
		document.getElementById(elementId).style.display = condition
				? "block"
				: "none";
	}
	
	function resetValidation(elementId, condition)
	{
		let messages = Array.from(document.getElementsByClassName("validationMessage"));
		
		messages.forEach(function(message){
			message.style.display = "none";
		});
	}
	
	function validateForm() {
		resetValidation();
		
		let userAccount = {};
		if (document.getElementById("hasGithub").checked) {
			userAccount = getGithubAccount(document.getElementById("githubAccount").value);
			changeVisibility("validationMessage", !userAccount)
			if (!userAccount)
			{
				return false;
			}	
		}
		
		let userRegFormFields = Array.from(document.getElementsByClassName("requiredField"));
		let isFormValid = true;

		userRegFormFields.forEach(function(field){
			if (!field.value) {
				isFormValid = false;
				showValidationMessage(field);
			}
			userAccount[field.id] = field.value;
		});

		if (!isFormValid) {
			return false;
		}
		
		showUserOnGrid(userAccount);
		cleanForm();
		return false;
	}
	
	function cleanForm() {
		let elements = document.getElementsByTagName("input")
		
		for(let i = 0; i<elements.length; i++) {
			let fieldType = elements[i].type.toLowerCase();
			
			switch(fieldType) {
				case "text":
				case "email": 
					elements[i].value = "";
					break;
				case "checkbox":
					elements[i].checked = false;
					break;
			}
		}
		changeVisibility("githubAccountBlock", false);
	}
	
	function showUserOnGrid(user){
		changeVisibility("placeholderNoUsers", false);		
		
		let userRow = document.createElement("tr");
		let githubData = user.login
			? `<td class="right-side">${user.login} <img src="${user.icon}"</td>`
			: '<td></td>';
			
		userRow.innerHTML = `<td>${user.name}</td><td><span><i class="fas fa-${user.sex}"></i></span></td>${githubData}<td onclick='deleteUser(event)'><span><i class="fas fa-times-circle"></i><span></td>`;		
		document.getElementById("usersBody").appendChild(userRow);
	}
	
	function deleteUser(event) {
		let row = event.currentTarget.parentNode;
		let i = row.rowIndex;
		
		changeVisibility("placeholderNoUsers", row.parentNode.childElementCount === 2);
		document.getElementById("users").deleteRow(i);				
	}
	
	function showValidationMessage(element) {		
		let warning = document.createElement("div");
        warning.className = "validationMessage";
        warning.innerText =  "Заповніть поле, щоб продовжити";
		element.parentElement.appendChild(warning);
	}
	
	function getGithubAccount(account)
	{
		let xhr = new XMLHttpRequest();
		xhr.open('GET', `https://api.github.com/users/${account}`, false);
		xhr.send();
		if (xhr.status != 200) {
			return null;
		}
		
		let githubAccount = JSON.parse(xhr.responseText);
		return {
			login: githubAccount.login,
			icon: githubAccount.avatar_url
		}
	}
	
	