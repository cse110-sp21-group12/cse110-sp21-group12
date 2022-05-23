// import {
//     createDay,
//     createMonthlyGoals,
//     createYearlyGoals,
//     deleteDay,
//     deleteMonthlyGoals,
//     deleteYearlyGoals,
//     getDay,
//     getMonthlyGoals,
//     getYearlyGoals,
//     addPhoto,
// } from '../../Backend/BackendInit.js';
// import mockJson from '../../Backend/updatedMockData.js';

// window.onload = () => {
//     const b1 = document.getElementById('b1');
//     const b2 = document.getElementById('b2');
//     const b3 = document.getElementById('b3');
//     const b4 = document.getElementById('b4');
//     const b5 = document.getElementById('b5');
//     const b6 = document.getElementById('b6');
//     const b7 = document.getElementById('b7');
//     const b8 = document.getElementById('b8');
//     const b9 = document.getElementById('b9');
//     const b10 = document.getElementById('b10');
//     const myFile = document.getElementById('myFile');

//     // b1.addEventListener('click', () =>
//     //     createYearlyGoals(mockJson['yearlyGoals Object store'])
//     // );
//     // b2.addEventListener('click', () =>
//     //     createMonthlyGoals(mockJson['monthlyGoals Object store'])
//     // );
//     b3.addEventListener('click', () =>
//         createDay(mockJson['days object store'])
//     );

//     // b4.addEventListener('click', () => deleteYearlyGoals('2021'));
//     // b5.addEventListener('click', () => deleteMonthlyGoals('12/2021'));
//     b6.addEventListener('click', () => deleteDay('05/20/2021'));

//     // b7.addEventListener('click', async () => {
//     //     const res = await getYearlyGoals('2021');
//     //     console.log(res);
//     // });
//     // b8.addEventListener('click', async () => {
//     //     const res = await getMonthlyGoals('12/2021');
//     //     console.log(res);
//     // });
//     b9.addEventListener('click', async () => {
//         const res = await getDay('05/21/2021');
//         console.log(res);
//     });

//     b10.addEventListener('click', () => {
//         addPhoto('05/21/2021', myFile.files[0]);
//     });
// };
