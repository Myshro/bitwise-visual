<script>
    import { page } from '$app/stores';
    import '../../src/app.css' // import global styles
    import OperationBlock from '../../src/components/OperationBlock.svelte'
    import Chart from '$lib/assets/operator_chart.png';
    

    let equation = "";
    let blocks = [];
    let decimalBlocks = [];

    let postfix;
    let currentStep = 0;
    let decimalOutcomes;
    let binaryOutcomes; 
    let isOver;

    let errorMessage = null;

    let isLoaded = false;
    
function infixToPostfix(str)
{
    let p = /[\b[0][bB][01]+\b|\b[0][xX][0-9a-fA-F]+\b|[\-0-9]+|~|!|\+|&|\||\^|<<|>>|\(|\)/g;
    let arr = str.match(p);
    
        let test = str.replace(p, '').replaceAll(' ','');
    if(test.length > 0)
    {
        throwError("Unexpected Token Detected");
        return;
    }

    for(let t in arr)
    {
        t = parseInt(t);
        if(isOperator(arr[t]))
        {
            if(/~|\!/.test(arr[t]))
            {
                if(t + 1 >= arr.length || isOperator(arr[t + 1]) || (t - 1 >= 0 && !isOperator(arr[t - 1]) && arr[t - 1] != '('))
                {
                    throwError("Invalid Operator Order Detected");
                    return;
                }
            }
            else{
                if(t - 1 < 0 || isOperator(arr[t-1])|| t+1 >= arr.length || (isOperator(arr[t+1]) && /~|\!/.test(arr[t - 1])))
                {
                    throwError("Invalid Operator Order Detected");
                    return;
                }
            }
        }
        else if(!/\(|\)/.test(arr[t])){
            if(t - 1> 0 && (!isOperator(arr[t - 1]) && arr[t - 1] != '(') || t + 1 < arr.length && (!isOperator(arr[t + 1]) && arr[t + 1] != ')'))
            {
                throwError("Invalid Operand Order Detected");
                return;
            }
        }
    }

    let stk = []
    let out = [];
    //convert binary and hexadecimal inputs into decimal
    for(let t in arr)
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
    for(let t of arr)
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
    errorMessage = null;
    return out;
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
    errorMessage = "Error: " + str;
}


const evaluatePostfix = (postfixExpression) => {
    const stack = [];
    const outcomes = [];

    for (let token of postfixExpression) {
        if (!isNaN(parseFloat(token))) { // if token is a number
            stack.push(parseFloat(token));
        } else {
            let operand2 = stack.pop();
            let operand1 = null;
            if (token !== '~' && token !== '!') {
                operand1 = stack.pop();
            }
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
                    operand1 = null; // unary operation
                    break;
                case '!':
                    result = operand2 === 0 ? 1 : 0;
                    operand1 = null; // unary operation
                    break;
                case '|':
                    result = operand1 | operand2;
                    break;
                default:
                    throw new Error('Invalid token habibi: ' + token);
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

// // Example usage:
// const postfixExpression = ['1', '01', '&', '122', '01', '&', '|'];
// const result = evaluatePostfix(postfixExpression);
// console.log(result);
// console.log(convertToBinary(result));

const clearEverything = () => {
    blocks=[]; 
    decimalBlocks = [];
    currentStep = 0; 
    isOver = false;
    postfix = [];
    decimalOutcomes = [];
    binaryOutcomes = [];
    errorMessage = null;
    isLoaded = false;
}
</script>

<div id="container">
    <header>
        <h1>ByteSmith</h1>
        <dialog id="show-manual">
            <form method="dialog">
                <h1>Welcome to ByteSmith!</h1>
                <p>This website provides an efficient way to visualize a sequence of bitwise operations. Decimal, binary, and hexadecimal inputs are supported. 
                    Binary and hexadecimal inputs can be accessed with the 0x and 0b prefix respectively. Decimal inputs require no prefix. 
                    Supported operators and their precedence can be viewed in the table below. 
                </p>
                <img id="chart" src={Chart} alt="">
                <p>This website was created as part of the Hack the Map hackathon hosted by UVA. More information can be found by clicking the devpost link in the header.
                    
                </p>
                <button>Close</button>
            </form>
          </dialog>          
        <p id="manual" on:click={() => {
            const manual = document.getElementById('show-manual');
            manual.showModal();
        }}>manual</p>
        <a href="https://github.com/Myshro/bitwise-visual" target="_blank">github</a>
        <a href="https://devpost.com/software/bytesmith" target="_blank">devpost</a>
    </header>  
    <main>  

    </main>
    <div id="input-related">
        <input id="equation" placeholder="(~3 + 4 << 2) & (1 ^ 5)" type="text" bind:value={equation} />
        <!-- <button on:click={() => {
            postfix = infixToPostfix(equation); 
            decimalOutcomes = evaluatePostfix(postfix);
            binaryOutcomes = convertToBinary(decimalOutcomes);
            isOver = false;
            }}
        >Load</button> -->
        <button on:click={() => {
            if (!isLoaded) {
                postfix = infixToPostfix(equation); 
                decimalOutcomes = evaluatePostfix(postfix);
                binaryOutcomes = convertToBinary(decimalOutcomes);
                isOver = false;
                console.log(blocks)
            }
            isLoaded = true;
            if (currentStep < binaryOutcomes.length) {
                decimalBlocks.push(decimalOutcomes[currentStep]); 
                blocks.push(binaryOutcomes[currentStep++]);
                blocks = blocks.slice();
                decimalBlocks = decimalBlocks.slice();
            } else {
                isOver = true;
            }
        }}>{isLoaded ? "Step" : "Load"}</button>
        <button on:click={() => {clearEverything()}}>Restart</button>
        <button on:click={() => {equation = ""; clearEverything()}}>Clear</button>
    </div>  

    {#if errorMessage !== null}
        <span id="done" class="error">{errorMessage}</span> 
    {/if}  

    {#each blocks as block, index}
        <OperationBlock a={block.operand1} b={block.operand2} 
        decimalA={decimalBlocks[index].operand1} decimalB={decimalBlocks[index].operand2} decimalResult={decimalBlocks[index].result}
        currentStep={index}
        operator={block.operator} result={block.result}/>
    {/each}
    {#if isOver}
        <div class="over-related">
            <span id="done">Done</span> 
            <img src="https://media.tenor.com/ger0WV_a2WMAAAAj/happy-cat.gif" alt="">
        </div>
    {/if}
</div>

<style>
    header {
        display: flex;
        justify-content: left;
        align-items: center;
        gap: 2rem;
        padding: 1rem 0 2rem 0;
    }

    h1 {
        font-size: 2.5rem;
    }

    a {
        text-decoration: none;
        font-size: 1rem;
    }

    a:hover {
        text-decoration: underline;
    }

    #input-related {
        display: flex;
        gap: 1rem;
        padding-bottom: 2rem;
    }

    #equation {
        border-radius: 0;
        border: 2px solid var(--dark);
        text-decoration: none;
        width: 25%;
    }

    button {
        box-shadow: -2px 2px var(--dark);
        border-radius: 0;
        border: 2px solid var(--dark);
        text-decoration: none;
        background-color: white;
        padding: 0 1rem 0 1rem;
    }

    #manual {
        cursor: pointer;
        font-size: 1rem;
    }

    #manual:hover {
        text-decoration: underline;
    }   

    button:hover {
        background-color: var(--dark);
        cursor: pointer;
        color: white;
    }

    button:active {
        box-shadow: inset 0 0 0 4px #043b3f6b;
    }

    :modal {
        background-color: beige;
        width: 100vw;
    }

    form {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .over-related {
        display: flex;
        justify-content: left;
        align-items: center;
        gap: 1rem;
    }

    #done {
        font-size: 1.5rem;
        font-weight: 700;
        display: inline;
    }

    .error {
        color: rgb(255, 0, 0);
    }

    img {
        display: inline;
        width: 50px;
        height: 50px;
    }

    #chart {
        width: 25%;
        height: auto;
        padding: 1rem;
    }

    form p {
        width: 50%;
        text-align: center;
    }
    form button {
        margin-top: 1rem;
    }
</style>