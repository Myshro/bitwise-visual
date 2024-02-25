<script>
    export let a;
    export let b;
    export let decimalA;
    export let decimalB;
    export let decimalResult;
    export let operator;
    export let result;
    export let currentStep;

    // const evaluate = () => {
    //     switch(operator) {
    //         case "+":
    //             return a + b;
    //         case "-":
    //             return a - b;
    //         case "*":
    //             return a * b;
    //         case "/":
    //             return a / b;
    //         case "^":
    //             return a ** b;
    //         default:
    //             return "Invalid operator";
    //     }
    // }

    //  const toPlainString = (num) => {
    //     return (''+ +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
    //     function(a,b,c,d,e) {
    //     return e < 0
    //         ? b + '0.' + Array(1-e-c.length).join(0) + c + d
    //         : b + c + d + Array(e-d.length+1).join(0);
    // });
//   }
</script>

<span id="step">Step {currentStep + 1}) {decimalA ?? ""}{operator}{decimalB}</span>
<div id="container">
    <div id="above">
        <div id="operator">{operator.charAt(0)}</div> 
        <div id="inputs">
            {#if decimalA !== null}
                <div>0b{a} ╎ 0x{parseInt(a, 2).toString(16).padStart(8, "0").toUpperCase()} ╎ {decimalA ?? ""}</div>
            {/if}
            <div>0b{b} ╎ 0x{parseInt(b, 2).toString(16).padStart(8, "0").toUpperCase()} ╎ {decimalB}</div>
        </div>
    </div>
    <div id="output"> <span id="operator">=</span>0b{result} ╎ 0x{parseInt(result, 2).toString(16).padStart(8, "0").toUpperCase()} ╎ {decimalResult}</div>    
</div>


<style>
    #container {
        /* border: 2px solid black ; */
        width: 75%;
        margin-bottom: 1rem;
        animation: fade-in 0.25s;
    }

    #above {
        display: flex;
        flex-direction: row;
        border-bottom: 0.25px solid black;
    }

    #index {
        align-self: end;
        justify-self: end;
        font-size: 0.5rem;
    }
    
    #operator {
        align-self: end;
        font-weight: 700;
    }

    #step {
        font-size: 1.2rem;
        font-weight: 700;
        animation: fade-in 0.25s;
    }

    @keyframes fade-in {
        0% {
            opacity: 0;
            transform: translateX(-20px);
        }
        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }
</style>