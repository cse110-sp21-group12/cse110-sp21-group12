export default {
    README: {
        message: 'this file only exists for documentation/record purposes',
    },
    'days object store': {
        date: '05/27/2022',
        bullets: [
            {
                text: 'O, Wonder!',
                features: 'normal',
                done: true,
                childList: [],
            },
            {
                text: 'How many goodly creatures are there here! ',
                features: 'important',
                done: false,
                childList: [],
            },
            {
                text: 'How beauteous mankind is! ',
                features: 'other',
                done: false,
                childList: [],
                time: null,
            },
            {
                // eslint-disable-next-line
                text: "O brave new world, That has such people in't!",
                features: 'personal',
                done: false,
                childList: [
                    {
                        text: 'child test',
                        features: 'other',
                        done: false,
                        childList: [
                            {
                                text: 'extra child test',
                                features: 'household',
                                done: false,
                                childList: [],
                            },
                        ],
                    },
                    {
                        text: 'child test2',
                        features: 'event',
                        done: false,
                        childList: [],
                    },
                ],
            },
        ],
        photos: [],
        notes:
            'Here is some notes sample test \n this is a note possibly \n here could be another',
    },
    'empty day Object store': {
        date: '05/21/2021',
        bullets: [],
        photos: [],
        notes: 'This is an empty day...only notes',
    },
    'monthlyGoals Object store': {
        month: '05/2022',
        goals: [
            {
                text: 'Train for and run a marathon!',
                done: true,
            },
            {
                text: 'Lose 10 pounds by end of the month',
                done: false,
            },
            {
                text: 'Finish reading a book',
                done: true,
            },
        ],
    },
    'yearlyGoals Object store': {
        year: '2022',
        goals: [
            {
                text: 'Learn how to speak fluent Spanish',
                done: true,
            },
            {
                text: 'Lower phone usage time',
                done: false,
            },
            {
                text: 'Write a novel from scratch',
                done: false,
            },
        ],
    },
};
