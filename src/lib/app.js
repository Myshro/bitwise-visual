function infixToPostfix(str)
{
    let p = /[\b[0][xXbB][0-9a-fA-F]+\b|[0-9]+|~|!|\+|&|\||\^|<<|>>|\(|\)/g;
    let arr = str.match(p);
    //console.log(arr);

    let stk = []
    let out = [];
    //convert binary and hexadecimal inputs into decimal
    for(t in arr)
    {
        if(arr[t].match(/[0][xX]/))
        {
            arr[t] = parseInt(arr[t],16).toString();
        }
        else if(arr[t].match(/[0][bB]/))
        {
            arr[t] = parseInt(arr[t].replace(/[0][bB]/,''),2);
        }
    }
    //console.log(arr);

    //Convert to postfix
    for(t of  arr)
    {
        //console.log(t);
        
        //if open grouping symbol, add to the stack and never push it to output. It acts as a new floor for the stack
        if(t == '(')
        {
            stk.push(t);
        }
        //if closing grouping symbol, keep popping the stack to the output until a corrosponding opening grouping symbol is found
        else if(t == ')')
        {
            let cur = stk.pop();
            while(cur != '(')
            {
                //console.log(cur)
                out.push(cur);
                cur = stk.pop();
                if(cur == undefined)
                {
                    throwError("Invalid Grouping Symbols. Extra closing grouping symbol detected")
                    return;
                }
            }
        }
        //if a number is detected push it to the output
        else if(!isOperator(t))
        {
            out.push(t);
        }
        //if an operator is dectected check if the top operator of the stack is lower or equal precedence.
        //if it is push it to the output and repeat
        //finally push the current operator to the stack
        else{
            while(stk.length > 0 && getPrecedence(stk[stk.length - 1]) <= getPrecedence(t))
            {
                out.push(stk.pop());
            }
            stk.push(t);
        }
    }
    while(stk.length > 0)
    {
        let op =  stk.pop();
        if(op == "(")
        {
            throwError("Invalid Grouping Symbols. Extra opening grouping symbol detected")
            return;
        }
        out.push(op);
    }
    console.log(out);
}

function isOperator(str){
    let p = /~|!|\+|&|\||\^|<<|>>/
    return p.test(str)
}

function getPrecedence(t)
{
    switch (t)
    {
        case '(':
            return 10;
        case '~':
            return 1;
        case '!':
            return 1;
        case '+':
            return 2
        case '<<':
            return 3;
        case '>>':
            return 3;
        case '&':
            return 4;
        case '^':
            return 5;
        case '|':
            return 6;
    }
}
function throwError(str)
{
    console.log("Error: " + str)
}


const evaluatePostfix = (postfixExpression) => {
    const stack = [];
    const outcomes = [];

    for (let token of postfixExpression) {
        if (!isNaN(parseFloat(token))) { // if token is a number
            stack.push(parseFloat(token));
        } else {
            let operand2 = stack.pop();
            let operand1 = stack.pop();
            let result;

            switch (token) {
                case '+':
                    result = operand1 + operand2;
                    break;
                case '<<':
                    result = operand1 << operand2;
                    break;
                case '>>':
                    result = operand1 >> operand2;
                    break;
                case '&':
                    result = operand1 & operand2;
                    break;
                case '^':
                    result = operand1 ^ operand2;
                    break;
                case '~':
                    result = ~operand2;
                    operand1 = undefined; // unary operation
                    break;
                case '!':
                    result = !operand2;
                    operand1 = undefined; // unary operation
                    break;
                default:
                    throw new Error('Invalid token: ' + token);
            }

            stack.push(result);
            // Constructing and storing the operation result into array of JSON
            const operationResult = {
                operand1: operand1,
                operand2: operand2,
                operator: token,
                result: result
            };
            outcomes.push(operationResult);
        }
    }
    return outcomes;
}

const convertToBinary = (outcomes) => {
    const newOutcomes = [];
    for (let outcome of outcomes) {
        newOutcomes.push({
            operand1: (outcome.operand1 >>> 0).toString(2).padStart(32, "0"),
            operand2: (outcome.operand2 >>> 0).toString(2).padStart(32, "0"),
            operator: outcome.operator,
            result: (outcome.result >>> 0).toString(2).padStart(32, "0"),
        });
    }
    return newOutcomes;
}

// Example usage:
const postfixExpression = ['3', '~', '5', '+', '2', '<<', '1', '5', '^', '&'];
const result = evaluatePostfix(postfixExpression);
console.log(result);
console.log(convertToBinary(result));
