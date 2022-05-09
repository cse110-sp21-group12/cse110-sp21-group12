#!/usr/bin/env bash
local_branch_name="$(git rev-parse --abbrev-ref HEAD)"

valid_branch_regex='^NL-\d+\_\w.*-(Alice|Sophia|Dustin|Shawn|Rickesh|Justin|Nicholas|Christopher)(_Alice|_Sophia|_Dustin|_Shawn|_Rickesh|_Justin|_Nicholas|_Christopher)*$'

message="There is something wrong with your branch name. Branch names in this project must adhere to this contract: $valid_branch_regex. Your commit will be rejected. You should rename your branch to a valid name and try again."

echo "hello world testing, exit w/ code 1"
exit 1

if [[ ! $local_branch_name =~ $valid_branch_regex ]]; then
    echo "$message"
    exit 1
fi

exit 0
