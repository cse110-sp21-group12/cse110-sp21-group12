import {
    createYearlyGoals,
    // createMonthlyGoals,
} from '../../Backend/BackendInit.js';
import mockJson from '../../Backend/updatedMockData.js';

window.onload = () => {
    const b1 = document.getElementById('b1');
    // const b2 = document.getElementById('b2');

    b1.addEventListener('click', () =>
        createYearlyGoals(mockJson['yearlyGoals Object store'])
    );
    // b2.addEventListener('click', () => createMonthlyGoals('05/2022'));
};
