
let users = [];

function changeGithubVisibility() {
    changeVisibility('githubAccountBlock', document.getElementById('hasGithub').checked);
}

function changeVisibility(elementId, condition) {
    changeElementVisibility(document.getElementById(elementId), condition);
}

function changeElementVisibility(htmlElement, condition) {
    if (condition) {
        htmlElement.classList.remove('display-none');
    } else {
        htmlElement.classList.add('display-none');
    }
}

function resetValidation() {
    let messages = Array.from(document.getElementsByClassName('validation-message'));

    messages.forEach(function (message) {
        changeElementVisibility(message, false);
    });
}

function submitForm() {

    event.preventDefault()
    resetValidation();

    let userHasGitHub = document.getElementById('hasGithub').checked;
    let userRegFormFields = Array.from(document.getElementsByClassName('requiredField'));
    if (userHasGitHub) {
        userRegFormFields.push(document.getElementById('githubAccount'));
    }

    let isFormValid = true;
    let userAccount = {};

    userRegFormFields.forEach(function (field) {
        if (!field.value) {
            isFormValid = false;
            showValidationMessage(field);
        }
        userAccount[field.id] = field.value;
    });

    if (!isFormValid) {
        return;
    }

    if (userAccount.githubAccount) {
        getGithubAccount(userAccount);
    } else {
        showAndSaveUser(userAccount);
    }
}

function showAndSaveUser(userAccount) {
    showUserOnGrid(userAccount);
    users.push(userAccount);
    cleanForm();
}

function cleanForm() {
    let elements = document.getElementsByTagName('input')

    for (let i = 0; i < elements.length; i++) {
        let fieldType = elements[i].type.toLowerCase();

        switch (fieldType) {
            case 'text':
            case 'email':
            case 'number':
                elements[i].value = '';
                break;
            case 'checkbox':
                elements[i].checked = false;
                break;
        }
    }
    document.getElementById('sex').value = '';
    changeVisibility('githubAccountBlock', false);
}

function showUserOnGrid(user) {
    changeVisibility('placeholderNoUsers', false);

    let userRow = document.createElement('tr');
    let githubData = user.githubAccount
        ? `<td class='right-side'>
                <a href='https://github.com/${user.githubAccount}'>
                    ${user.githubAccount}
                </a>
                <img src='${user.icon}
          '</td>`
        : '<td></td>';

    userRow.innerHTML = `<td>
                            ${user.name}
                        </td>
                        <td>
                            <i class='fas fa-${user.sex}'></i>
                        </td>
                        ${githubData}
                        <td onclick='deleteUser()'>
                            <i class='fas fa-times-circle'></i>
                        </td>`;
    document.getElementById('usersBody').appendChild(userRow);
}

function deleteUser() {
    let row = event.currentTarget.parentNode;
    let i = row.rowIndex;

    changeVisibility('placeholderNoUsers', row.parentNode.childElementCount === 2);
    document.getElementById('users').deleteRow(i);

    //delete from 
    users.splice(i - 2, 1);
}

function showValidationMessage(element) {

    changeElementVisibility(element.nextElementSibling, true);
}

function getGithubAccount(userAccount) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.github.com/users/${userAccount.githubAccount}`, false);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let githubAccount = JSON.parse(xhr.responseText);
                userAccount['icon'] = githubAccount.avatar_url;
                showAndSaveUser(userAccount);
            } else {
                changeVisibility('invalidGithubMessage', true);
            }
        }
    };
    xhr.send();


}

