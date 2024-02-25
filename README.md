# [Try it out here](https://byte-smith.vercel.app/)
## Inspiration
When our team was working with the bitwise CSO homework taught here at UVA, we noticed a significant lack of bitwise calculators that were flexible and easy to follow. So, we made this site for fellow students to show how bitwise expressions are evaluated step by step. 
## What it does
The user can input any form of valid bitwise operations (i.e. (~3 + 4 << 2) & (1 ^ 5)) and the site will evaluate each expression in the correct order, and show the user each step in binary, hexadecimal, and decimal.
## How we built it
We used SvelteKit and Vercel to host it, with Node.js to test stuff out before we had a front-end site.
## Challenges we ran into
Javascript in general was a difficult language to code in due to the lack of restrictions specifically with types. For example, one error we had was because the loop reference variable was a string as opposed to an integer. Another challenge we had was that we had to represent all numbers as 32-bit binary numbers which made conversions difficult.
## Accomplishments that we're proud of
We made a functional site that accomplishes what we set out to do from the start. We think the struggles we experienced in CSO could be alleviated by this site, and we hope future students can use this to help them in their future classes.
## What we learned
For most of us, we had never used Javascript or any front-end frameworks before. Working with everyone to make a functional site, and finding out efficient ways to split up tasks (i.e. people working on the front end vs. working on the logic of parsing an expression and running through it step by step). 
## What's next for ByteSmith
We want to add local storage to the site, and ways to change the maximum # of bits in each operation.  

