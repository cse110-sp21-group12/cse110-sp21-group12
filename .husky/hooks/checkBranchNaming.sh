#!/usr/bin/env bash
localBranchName="$(git rev-parse --abbrev-ref HEAD)"

#echo $localBranchName

# regular exp that checks for "NL-" followed by some numbers and text, and then names of team members
validBranchRegex="NL-[0-9]+\_.+-(Alice|Sophia|Dustin|Shawn|Rickesh|Justin|Nicholas|Christopher)(_Alice|_Sophia|_Dustin|_Shawn|_Rickesh|_Justin|_Nicholas|_Christopher)*$"

message="There is something wrong with your branch name. Branch names in this project must adhere to this contract: $validBranchRegex. Your commit will be rejected. You should rename your branch to a valid name and try again."

#([[ $localBranchName =~ $validBranchRegex ]]) && echo "matched" || echo "no match"

if [[ ! "$localBranchName" =~ $validBranchRegex ]]
then
    echo "$message"
    exit 1
fi

exit 0
