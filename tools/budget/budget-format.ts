export function budgetAmount(value:string):number {const n=Number(value);return Math.max(0,Math.min(10000000,Number.isFinite(n)?n:0));}
export function csvCell(value:string):string {const safe=/^[\s]*[=+@\-\t\r]/.test(value)?"'"+value:value;return '"'+safe.replaceAll('"','""')+'"';}
export function budgetTotals(income:number,amounts:readonly number[]){const expensesPence=amounts.reduce((sum,n)=>sum+Math.round(n*100),0);return {expensesPence,remainingPence:Math.round(income*100)-expensesPence};}
