var goals = document.querySelector('entry');

/**
 * removed 'event' from function due to linter comapiling that it isn't used
 * can add it back in when you use it
 */
goals.addEventListener('keyup', function () {
    console.log(goals.innerHTML);
});
