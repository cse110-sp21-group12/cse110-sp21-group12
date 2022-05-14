import {
    getUserID,
    // getUserEmail,
    // getCurrentDate,
} from '../../General/GlobalUtility.js';

window.onload = () => {
    // Check if user is logged in. If not, redirect to Login.html
    if (getUserID() === null) {
        window.location.replace('../Login/Login.html');
    }
};
